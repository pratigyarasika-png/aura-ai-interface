# AI Academic Research Platform UI Shell

## Goal
Build the first-screen research workspace at `/` with an original circular visual language, avoiding SciSpace-like composition or styling. This phase is presentation-only: the account avatar represents a future Google sign-in flow, while theme controls are fully functional.

## Layout
- Create a responsive app frame with a collapsible left navigation, top navigation/header, live task-status strip, and a spacious central research workspace.
- Keep the circular AI hub as the main visual and interaction anchor, using orbit-style action controls and rounded supporting panels without nesting cards.
- Preserve useful navigation when collapsed: desktop keeps an icon rail; mobile uses an accessible slide-over with a persistent menu trigger.

## Interface Areas
- **Header:** product identity, compact navigation, appearance popover, and account avatar placeholder.
- **Appearance picker:** light/dark mode plus a custom hex accent input; apply changes immediately and remember them across visits.
- **Sidebar:** grouped history, saved projects, and recent research sessions with active, collapsed, and mobile states.
- **Activity bar:** animated status indicator and rotating examples such as “Scraping papers…”, “Generating citations…”, and “Synthesizing PDF…”.
- **Circular AI hub:** central research prompt/input surrounded by distinct research actions, with restrained focus, press, and motion feedback.

## Responsive and Accessible Behavior
- Adapt spacing, labels, navigation, and circular controls for desktop, tablet, and narrow mobile screens without overlap or clipped text.
- Include visible focus states, keyboard-operable controls, descriptive labels/tooltips, reduced-motion support, and sufficient contrast in light and dark themes.

## Visual System
- Define an original multi-color semantic palette, typography, shadows, borders, and circular radius tokens in the global design system.
- Use rounded geometry deliberately for the AI hub and controls while keeping information areas restrained and easy to scan.
- Add subtle entrance and activity motion only where it communicates hierarchy or live work.

## Page Metadata
- Add route-specific title, description, Open Graph title/description, Open Graph type, and Twitter card metadata for the academic research workspace.

## Validation
- Check the finished screen at desktop and mobile viewport sizes.
- Verify sidebar collapse/open behavior, appearance persistence, custom accent validation, status animation, focus states, and absence of layout overlap.
- Confirm the latest preview build has no errors.

## Not Included
- Real Google authentication, user profiles, persistent research data, document uploads, scraping, citation generation, or PDF synthesis are not implemented in this UI-shell phase.
