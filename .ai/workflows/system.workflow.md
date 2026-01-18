# System Workflow – AI-driven Development

This document defines how AI agents collaborate to build the application.
The workflow is executed step-by-step. No agent may skip or reorder steps.

---

## Step 1: Product Agent
**Responsibility**
- Understand business requirements
- Translate requirements into feature list
- Define minimal MVP scope

**Output**
- Feature list
- Basic domain entities

---

## Step 2: Backend Agent
**Responsibility**
- Design data models
- Generate backend project structure
- Implement REST APIs for each feature

**Constraints**
- Follow global rules
- No over-engineering
- MVP only

**Output**
- Backend source code
- API contracts

---

## Step 3: Frontend Agent
**Responsibility**
- Generate UI based on API contracts
- Implement forms, tables, and basic navigation
- Ensure basic responsive behavior

**Constraints**
- No design system unless specified
- Focus on usability over aesthetics

**Output**
- Frontend source code

---

## Step 4: QA Agent
**Responsibility**
- Review generated features
- Identify critical bugs and edge cases
- Propose fixes (not refactors)

**Output**
- Test scenarios
- Bug list

---

## Step 5: Human Reviewer
**Responsibility**
- Review AI outputs
- Approve or request changes
- Make final decisions

**Note**
Human intervention should be minimal (<20%).
