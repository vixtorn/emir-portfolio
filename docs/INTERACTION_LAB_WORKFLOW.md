# Interaction Lab Workflow

## Rules

1. Each lab tests one technical risk at a time.
2. The homepage is not an experiment space.
3. Do not add lab links to production navigation.
4. Compose every lab independently of the homepage.
5. Define acceptance criteria before implementation begins.
6. Reuse stable primitives only after a lab has proved them.
7. Delete failed experiments instead of preserving unused code.
8. Create a checkpoint commit when a lab reaches its completed state.
9. Reuse the shared GPU lifecycle provider; do not add a second GPU registry.
10. Reuse the shared GSAP and Lenis setup; do not create duplicate smooth-scroll or ticker ownership.
11. Verify reduced-motion and mobile behavior before proposing graduation.
12. Do not allow debug controls, diagnostic copy, or development-only states to leak into production routes.

## Graduation

An interaction can move from the lab into a production section only after it works reliably, performs within budget, behaves well on mobile, has been cleaned up, and passes lint, typecheck, and production build verification. The production integration must then remain isolated to its destination section.
