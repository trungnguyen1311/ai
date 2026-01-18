# Scope Definition: Union Officer Profile Management (MVP)

## 1. IN SCOPE (Must Have)
### Features
- **Profile View Page**: Single page displaying all user information categorized by "Personal" and "Work" info.
- **Edit Contact Info**: Form to update Phone, Address, Personal Email. Includes basic validation (regex for phone/email).
- **Read-Only Fields**: Visual distinction between editable fields (contact info) and read-only fields (Position, Dept).
- **Data Persistence**: Saving changes to the PostgreSQL database.

### Technical Scope
- Creation of `OfficerProfile` entity in NestJS.
- API Endpoint: `GET /profile/me` (Retrieve own profile).
- API Endpoint: `PATCH /profile/me` (Update allowed fields).
- React Page: `/profile` (Protected route).

## 2. OUT OF SCOPE (For Future Iterations)
- **Admin Management**: Admins creating, deleting, or editing other officers' profiles.
- **Avatar Upload**: File upload complexity is postponed. Use UI placeholders or initials for MVP.
- **Change History**: No audit log of previous addresses/phones required for MVP.
- **Approval Workflow**: Updates apply immediately; no manager approval required.
- **Complex Validation**: No external API calls to verify National ID or Address.
- **Tenure Management**: Tracking history of positions over time (Nhiệm kỳ). Only *current* position is shown.
- **Resignation/Retirement**: Lifecycle management is out of scope.

## 3. Constraints
- **User Permission**: Users can ONLY edit their own data defined in the "Contact Info" section.
- **No New Anth**: Dependent on the existing JWT implementation `req.user`. as the source of truth for identity.
