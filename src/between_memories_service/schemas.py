from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"


class AiRequest(BaseModel):
    task_type: str = Field(default="build", pattern="^(quick|build|critical)$")
    prompt: str = Field(min_length=1, max_length=15000)


class AiResponse(BaseModel):
    model: str
    output_text: str
    input_tokens: int
    output_tokens: int
