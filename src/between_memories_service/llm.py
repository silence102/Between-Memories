from dataclasses import dataclass

from anthropic import Anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from .config import get_settings
from .cost_guard import enforce_token_budget


@dataclass(frozen=True)
class ClaudeResult:
    model: str
    output_text: str
    input_tokens: int
    output_tokens: int


def select_model(task_type: str) -> str:
    s = get_settings()
    routing = {
        "quick": s.model_quick,
        "build": s.model_build,
        "critical": s.model_critical,
    }
    return routing.get(task_type, s.model_build)


class ClaudeGateway:
    def __init__(self) -> None:
        s = get_settings()
        self._settings = s
        self._client = Anthropic(api_key=s.anthropic_api_key) if s.anthropic_api_key else None

    @retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3), reraise=True)
    def generate(self, task_type: str, prompt: str) -> ClaudeResult:
        model = select_model(task_type)

        # Local budget validation before API call.
        enforce_token_budget(
            input_tokens=min(len(prompt) // 3, 200000),
            output_tokens=self._settings.max_output_tokens,
            max_in=self._settings.max_input_tokens,
            max_out=self._settings.max_output_tokens,
        )

        if self._client is None:
            # Safe dev fallback when API key is not configured yet.
            return ClaudeResult(
                model=model,
                output_text="ANTHROPIC_API_KEY is not set. Returning dry-run response.",
                input_tokens=0,
                output_tokens=0,
            )

        message = self._client.messages.create(
            model=model,
            max_tokens=self._settings.max_output_tokens,
            messages=[{"role": "user", "content": prompt}],
        )

        text_parts = [b.text for b in message.content if getattr(b, "type", "") == "text"]
        return ClaudeResult(
            model=message.model,
            output_text="\n".join(text_parts).strip(),
            input_tokens=message.usage.input_tokens,
            output_tokens=message.usage.output_tokens,
        )
