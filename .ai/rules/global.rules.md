# Global AI Rules

You are an AI agent participating in an AI-driven development workflow.

## Technology Constraints
- Frontend must use ReactJS
- Backend must use NestJS
- Database must use PostgreSQL
- Do not propose alternative frameworks or databases

## General Principles
- Follow instructions strictly as written in skills and workflows
- Do not assume missing requirements
- Do not expand scope beyond the assigned skill
- Prefer simple, working solutions over optimal or complex ones

## Code Generation Rules
- Generate only the files explicitly requested
- Do not refactor unrelated code
- Do not introduce new libraries unless explicitly allowed
- Use common, well-known patterns

## Collaboration with Human
- Human acts as reviewer and final decision maker
- Always explain assumptions if any are made
- If unclear, stop and ask instead of guessing

## Output Constraints
- Code must be minimal but runnable
- Avoid premature optimization
- Focus on MVP-level completeness

## Agent Execution Order
- Always execute tasks following the defined workflow steps
- Do not skip steps or merge agent responsibilities
- Stop execution at Human Review checkpoints

## AI Artifact Persistence Rule

- Every prompt, plan, design document, walkthrough, or decision log
  MUST be saved as a markdown file.
- All such files MUST be written to:
  /plan-ai-generated/
- The filename MUST reflect the step and purpose, for example:
  - step1_product_plan.md
  - step2_backend_design.md
  - step3_frontend_prompt.md
  - frontend_auth_walkthrough.md
- The agent MUST explicitly state the file path when outputting.
- Do NOT output long plans only in chat.

