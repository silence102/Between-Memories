class BudgetExceededError(ValueError):
    pass


def enforce_token_budget(input_tokens: int, output_tokens: int, max_in: int, max_out: int) -> None:
    if input_tokens > max_in:
        raise BudgetExceededError(
            f"Input token budget exceeded: {input_tokens} > {max_in}. "
            "Route through summarization/chunking first."
        )
    if output_tokens > max_out:
        raise BudgetExceededError(
            f"Output token budget exceeded: {output_tokens} > {max_out}. "
            "Use lower max tokens or multi-step plan."
        )
