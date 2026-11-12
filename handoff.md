# DELYTE ACADEMY — UI/UX REDESIGN HANDOFF

## 1. Project Overview

Delyte Academy is an existing online learning platform built with Next.js and Supabase.

The objective is to transform the existing application into a premium, modern, production-quality EdTech SaaS platform.

This is a UI/UX redesign and frontend experience improvement project.

**This is NOT a request to rebuild the application from scratch.**

The existing application already has working features, authentication, database relationships, business logic and user workflows. Your responsibility is to improve the visual experience, usability, accessibility, responsiveness and overall product quality while preserving the existing functionality.

## 2. Primary Objective

Transform Delyte Academy into a polished learning platform comparable in design quality and user experience to established SaaS and EdTech products.

The final result should feel:

- Premium and professional.
- Modern and visually distinctive.
- Intuitive and easy to navigate.
- Responsive across desktop, tablet and mobile.
- Consistent throughout all pages.
- Accessible and user-friendly.
- Fast and lightweight.

Avoid generic AI-generated dashboard aesthetics.

Do not simply place everything inside rounded cards. Prioritise visual hierarchy, whitespace, typography, alignment and intentional component design.

## 3. Existing Technology Stack

The existing project uses:

- Next.js
- React
- Supabase
- TypeScript/JavaScript as currently implemented
- Existing authentication and authorization
- Existing database schema and Supabase queries

IMPORTANT:

Inspect the actual repository before making assumptions about the versions, structure or implementation.

Do not introduce unnecessary dependencies.

Reuse existing libraries and components wherever appropriate.

## 4. Existing Application Functionality

The platform already includes student-facing functionality such as:

- Student authentication and account access.
- Student dashboard.
- Course discovery and enrollment.
- Course topics and lessons.
- CBT quizzes and assessments.
- Student progress tracking.
- Notifications.
- Quiz results.
- Course completion tracking.

The administrative side includes:

- Admin dashboard.
- Super admin and admin roles.
- Course creation and management.
- Topic creation and management.
- Quiz creation and management.
- Administrative access restrictions.

The project uses Supabase for its backend.

Inspect the existing source code to establish the exact current functionality before modifying anything.

Some features may have additional functionality not listed here. Preserve those too.

## 5. Non-Negotiable Preservation Rules

These rules are extremely important.

DO NOT:

1. Rebuild the backend.
2. Replace Supabase with another backend.
3. Change the existing database schema unnecessarily.
4. Remove existing features.
5. Break authentication or session handling.
6. Change admin/super_admin role permissions.
7. Weaken or remove Row Level Security policies.
8. Remove existing API integrations.
9. Replace working database operations with dummy data.
10. Hardcode information that should come from Supabase.
11. Introduce fake functionality to make the interface look complete.
12. Break existing routes or navigation.
13. Remove existing validation and error handling.
14. expose environment variables or sensitive credentials.

Preserve existing functionality and data flows.

If a change to existing business logic is genuinely necessary, explain why and request approval before implementing it.

## 6. Design Direction

Use a premium, minimalist, modern EdTech SaaS aesthetic.

Design inspiration:

- Linear: clean interface, navigation and interactions.
- Notion: organised learning content and information hierarchy.
- Vercel: polished typography, spacing and visual consistency.
- Coursera: learning workflows and course discovery.

Do not copy these products. Use them as design references.

### Visual principles

- Strong typographic hierarchy.
- Consistent spacing system.
- Carefully selected colour palette.
- Restrained use of shadows.
- Subtle gradients where appropriate.
- Consistent border radiuses.
- High-quality icons.
- Beautiful empty states.
- Meaningful micro-interactions.
- Consistent buttons and form elements.
- Clear visual feedback for user actions.

Avoid excessive gradients, unnecessary animations, excessive glassmorphism and generic dashboard layouts.

## 7. Student Experience Redesign

Prioritise the student experience.

### Student dashboard

Improve:

- Welcome section.
- Learning overview.
- Enrolled courses.
- Learning progress.
- Continue learning section.
- Upcoming or available assessments.
- Recent activities.
- Notifications.
- Relevant quick actions.

The dashboard should immediately communicate what the student should do next.

### Course discovery

Improve:

- Course catalogue.
- Course cards.
- Search and filtering if already supported.
- Course descriptions.
- Course detail pages.
- Enrollment experience.
- Empty and loading states.

Make course discovery visually engaging and intuitive.

### Learning experience

This is one of the most important areas.

Improve the experience of:

- Opening a course.
- Navigating between topics.
- Accessing lessons.
- Reading lesson content.
- Moving between learning materials.
- Tracking completion.

The learning interface should minimise distractions and make it easy to concentrate.

### CBT and quiz experience

Improve:

- Quiz instructions.
- Starting assessments.
- Question presentation.
- Answer selection.
- Question navigation.
- Progress indicators.
- Submission experience.
- Results presentation.
- Feedback and review states where supported.

Prioritise clarity and usability.

Do not change assessment logic, scoring calculations, answer validation or submission behaviour.

### Progress and results

Make learning progress easier to understand through clear visual indicators, meaningful statistics and well-organised result layouts.

Do not invent statistics or display information that does not exist in the backend.

## 8. Administrative Experience Redesign

The administrative dashboard should feel like a professional SaaS content management workspace.

Improve:

- Dashboard overview.
- Navigation.
- Course management.
- Course creation forms.
- Topic management.
- Quiz creation and management.
- Data tables.
- Search and filtering where supported.
- Confirmation dialogs.
- Form validation feedback.
- Empty states.
- Loading states.
- Success and error messages.

Make administrative workflows efficient.

An administrator should be able to perform common tasks without unnecessary navigation or confusion.

Preserve the distinction between admin and super_admin permissions.

## 9. Responsive Design

The application must work properly on:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile phones.

Pay special attention to:

- Navigation behaviour.
- Sidebar responsiveness.
- Course cards.
- Quiz questions.
- Tables.
- Forms.
- Modals and dialogs.
- Content overflow.
- Touch targets.

Do not simply shrink the desktop interface to fit a phone.

Design intentional mobile experiences.

## 10. Design System

Create or improve a reusable design system.

Establish consistent:

- Colour tokens.
- Typography.
- Spacing.
- Border radiuses.
- Shadows.
- Buttons.
- Inputs.
- Cards.
- Navigation elements.
- Modals.
- Dropdowns.
- Status indicators.
- Loading skeletons.
- Empty states.

Avoid creating different versions of the same component unnecessarily.

Use reusable components and maintain the existing project conventions.

## 11. Animations and Interactions

Use animations intentionally.

Examples:

- Subtle page transitions.
- Button hover and active states.
- Navigation transitions.
- Dropdown animations.
- Progress animations.
- Card interactions.
- Loading transitions.
- Feedback when completing actions.

Animations must be smooth, restrained and purposeful.

Respect reduced-motion preferences.

Avoid animations that interfere with learning or slow down the interface.

## 12. UX Requirements

Every major workflow should have appropriate:

- Loading states.
- Error states.
- Success feedback.
- Empty states.
- Disabled states.
- Confirmation where necessary.
- Form validation.
- Accessible labels.
- Keyboard interactions.

Do not leave the user wondering whether an action worked.

Reduce unnecessary steps in existing workflows without changing their underlying behaviour.

## 13. Implementation Strategy

Work in stages.

### Phase 1: Repository Audit

Before modifying any files:

1. Inspect the complete project structure.
2. Identify the existing routes and pages.
3. Identify shared layouts and components.
4. Understand authentication and authorization.
5. Inspect Supabase integrations.
6. Identify the existing styling system.
7. Identify installed dependencies.
8. Identify existing reusable components.
9. Identify areas with existing UI/UX problems.

Produce a concise audit report.

Identify what should be retained, improved, refactored or replaced.

Do not start implementation before completing the audit.

### Phase 2: Design Planning

Develop a cohesive visual direction.

Define:

- Colour system.
- Typography.
- Spacing system.
- Component styles.
- Navigation patterns.
- Student dashboard layout.
- Course discovery layout.
- Learning interface.
- CBT interface.
- Administrative dashboard.

Explain the proposed changes before implementation.

### Phase 3: Foundation

Implement the shared design system and reusable components.

Make sure the foundation is consistent before redesigning every page.

### Phase 4: Student Experience

Redesign student-facing pages and workflows incrementally.

Test existing functionality after each major change.

### Phase 5: Administrative Experience

Redesign the admin and super_admin experience while preserving authorization and administrative workflows.

### Phase 6: Responsive and UX Refinement

Test mobile, tablet and desktop layouts.

Refine accessibility, interactions, loading states and error states.

### Phase 7: Quality Assurance

Run:

- Production build.
- TypeScript checks where applicable.
- Existing lint checks.
- Relevant tests.
- Authentication checks.
- Student workflow checks.
- Admin workflow checks.
- Quiz and submission checks.
- Responsive layout checks.

Fix regressions before considering the work complete.

## 14. Working Rules

- Work directly within the existing repository.
- Do not replace the entire application with a new scaffold.
- Do not delete existing functionality.
- Keep components modular and maintainable.
- Follow the existing folder structure unless a refactor is justified.
- Reuse existing Supabase queries and server actions.
- Avoid unnecessary dependencies.
- Avoid duplicating components.
- Keep code readable and maintainable.
- Do not silently ignore errors.
- Do not claim a feature works without verifying it.

If something is unclear, inspect the implementation before making assumptions.

If you discover a feature that cannot be preserved safely, explain the issue before proceeding.

## 15. Definition of Success

The redesign is successful when:

1. Delyte Academy looks like a professionally designed EdTech SaaS product.
2. The student experience is intuitive and enjoyable.
3. The administrative experience is efficient and polished.
4. Existing functionality remains intact.
5. Authentication and authorization still work.
6. Supabase integrations remain functional.
7. Existing data is preserved.
8. The application is responsive.
9. The interface is consistent across all pages.
10. The application builds successfully.

## Final Instruction

Think like a senior product designer, UX engineer and experienced frontend architect.

Do not prioritise visual appearance over usability.

Do not prioritise speed of implementation over preservation of working features.

The objective is to elevate the existing Delyte Academy product into a premium, production-quality learning platform while respecting the existing architecture and functionality.

Start with the repository audit. Do not immediately rewrite the application.

Work incrementally and report completed changes, modified files, tests performed and any outstanding issues after each phase.