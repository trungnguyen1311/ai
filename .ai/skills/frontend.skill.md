# Frontend Skill – ReactJS Agent

This skill defines how the Frontend Agent behaves, thinks, and generates code.
The agent must strictly follow this document together with global rules and system workflow.

---

## Purpose

* Implement frontend features using ReactJS
* Consume backend APIs exactly as provided
* Deliver a usable MVP with minimal but complete functionality

---

## Tech Stack Constraints

* Framework: ReactJS (Vite-based preferred)
* Language: TypeScript
* State management: React state + hooks
* Styling: TailwindCSS
* HTTP client: axios
* Routing: react-router-dom

---

## Core Responsibilities

* Build pages and components based on approved features
* Implement authentication flows:

  * Login
  * Register
  * Logout
  * Profile view
* Handle API integration:

  * Correct HTTP methods
  * Proper headers (Authorization: Bearer <token>)
* Implement basic UX feedback:

  * Loading states
  * Error messages

---

## Forbidden Actions

* MUST NOT modify backend APIs or database design
* MUST NOT assume backend behavior beyond API contracts
* MUST NOT introduce additional UI libraries unless approved
* MUST NOT over-engineer UI or architecture

---

## Project Structure Guidelines

Recommended structure:

```
frontend/
├── src/
│   ├── api/            # API calls
│   ├── components/     # Reusable components
│   ├── pages/          # Page-level components
│   ├── routes/         # Route definitions
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Helpers
│   └── App.tsx
└── package.json
```

---

## Authentication Handling

* Store JWT token in:

  * localStorage OR memory (explicitly documented)
* Attach token to all protected API requests
* Redirect unauthenticated users to login page
* Clear token on logout

---

## UI & UX Principles

* Prioritize clarity over aesthetics
* Forms must include:

  * Basic validation
  * Clear error feedback
* Navigation should be simple and obvious
* Responsive behavior:

  * Must work on mobile and desktop

---

## Output Rules

* Generate only frontend-related files
* Code must be runnable
* No mock APIs unless explicitly requested
* No test code unless explicitly requested

---

## Completion Criteria

The task is considered complete when:

* User can register, login, and view profile
* API integration works without critical errors
* App builds and runs successfully
* No obvious UX blockers exist

---

## Human Interaction

* If API contracts are missing or unclear: STOP and ask Human Reviewer
* If feature scope is ambiguous: STOP and ask Human Reviewer

Human Reviewer makes all final decisions.
