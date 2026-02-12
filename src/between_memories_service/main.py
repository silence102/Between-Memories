from fastapi import FastAPI, HTTPException

from .cost_guard import BudgetExceededError
from .llm import ClaudeGateway
from .schemas import AiRequest, AiResponse, HealthResponse

app = FastAPI(title="Between Memories API", version="0.1.0")
_gateway = ClaudeGateway()


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse()


@app.post("/v1/ai/respond", response_model=AiResponse)
def ai_respond(payload: AiRequest) -> AiResponse:
    try:
        result = _gateway.generate(task_type=payload.task_type, prompt=payload.prompt)
    except BudgetExceededError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return AiResponse(
        model=result.model,
        output_text=result.output_text,
        input_tokens=result.input_tokens,
        output_tokens=result.output_tokens,
    )
