Frontend Authentication Implementation Plan
Goal Description
Implement a complete frontend authentication flow (Login, Register, Profile) using ReactJS and TailwindCSS, consuming the existing NestJS backend. This involves refactoring the existing partial implementation to strictly adhere to the 
frontend.skill.md
 guidelines and adding the missing styling and structure.

User Review Required
IMPORTANT

I will result in renaming Dashboard to ProfilePage to match the scope "Profile page".
src/services will be moved to src/api to match the skill's recommended structure.
Proposed Changes
Configuration
[NEW] Tailwind Setup
Install tailwindcss, postcss, autoprefixer.
Create postcss.config.js and tailwind.config.js.
Update 
src/index.css
 with Tailwind directives.
Structure Refactoring
[DELETE] 
src/services/api.ts
[NEW] src/api/client.ts
Move axios instance creation here.
Ensure interceptors are preserved.
[NEW] src/routes/AppRoutes.tsx
Extract routing logic from 
App.tsx
.
Pages & Components
[MODIFY] 
src/App.tsx
Use AppRoutes instead of inline routes.
[MODIFY] 
src/pages/LoginPage.tsx
styling with TailwindCSS.
Remove 
App.css
 dependencies if any specialized classes were used.
[MODIFY] 
src/pages/RegisterPage.tsx
styling with TailwindCSS.
[DELETE] 
src/pages/Dashboard.tsx
[NEW] src/pages/ProfilePage.tsx
Implement profile view using TailwindCSS.
Fetch user data from GET /auth/me.
Verification Plan
Automated Tests
Run npm run build to ensure TypeScript compilation passes.
Use browser tool to verify:
/login page renders.
/register page renders.
Navigation works.