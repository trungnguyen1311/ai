# System Workflow – AI-driven Development

This document defines how AI agents collaborate to build the application.
The workflow is executed step-by-step. No agent may skip or reorder steps.

---

## Global Technical Constraints

- Frontend: ReactJS
- Backend: NestJS
- Database: PostgreSQL
- Authentication: JWT (stateless)
- Architecture: Monorepo

### Repository Structure
- /backend       → NestJS backend
- /frontend      → ReactJS frontend
- /.ai
  - /rules
  - /skills
  - /workflows

### General Constraints
- Do NOT create separate repositories
- Do NOT scaffold duplicate projects
- Prefer minimal, working MVP over full-featured systems

---

## Agent Boundary Rules

- Product Agent:
  - MUST NOT generate source code
  - Focus only on requirements, scope, and domain modeling

- Backend Agent:
  - MUST NOT create UI or frontend logic
  - MUST NOT assume frontend framework details
  - Only expose APIs and contracts

- Frontend Agent:
  - MUST NOT modify backend APIs or database schema
  - Must strictly follow provided API contracts

- QA Agent:
  - MUST NOT implement fixes
  - Only reports bugs, edge cases, and test scenarios

- Any agent violating its boundary MUST stop and wait for Human Reviewer.

---

## Generated Code Handling

- AI agents may generate code in a temporary workspace (scratch)
- Scratch output is NOT considered final
- Human Reviewer is responsible for:
  - Reviewing generated output
  - Manually merging approved code into the main repository
- AI must NOT assume scratch is the target repository

---

## Step 1: Product Agent

### Responsibility
- Understand business requirements
- Translate requirements into a clear feature list
- Define minimal MVP scope
- Identify core domain entities

### Output
- Feature list
- Basic domain entities
- Explicit MVP boundary (what is IN / what is OUT)

---

## Step 2: Backend Agent

### Responsibility
- Design data models based on approved domain entities
- Generate backend project structure (NestJS)
- Implement REST APIs for each approved feature
- Provide clear API contracts (routes, payloads, responses)

### Constraints
- Follow global rules
- No over-engineering
- MVP only
- Use PostgreSQL-compatible data modeling
- JWT-based authentication

### Output
- Backend source code
- API contracts (documented or implicit via controllers)

---

## Step 3: Frontend Agent

### Responsibility
- Generate frontend code using ReactJS
- Implement UI strictly based on backend API contracts
- Build forms, tables, and basic navigation
- Implement authentication flow (login/register/profile)
- Ensure basic responsive behavior (mobile + desktop)

### Constraints
- No design system unless explicitly specified
- Focus on usability and clarity over visual polish
- No backend assumptions or changes

### Output
- Frontend source code

---

## Step 4: QA Agent

### Responsibility
- Review generated features against requirements
- Identify critical bugs, edge cases, and missing flows
- Propose fixes conceptually (no code refactors)

### Output
- Test scenarios
- Bug list
- Risk notes (security, data integrity, UX blockers)

---

## Step 5: Human Reviewer

### Responsibility
- Review AI outputs at each checkpoint
- Approve or request changes
- Merge approved code into main repository
- Make final technical and product decisions

### Note
Human intervention should be minimal (<20%).
AI should handle execution; human focuses on validation and direction.
