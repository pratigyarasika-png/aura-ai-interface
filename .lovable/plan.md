# Gemini-Assisted Writing Workspace

## Goal
Turn the existing Writing Workspace into a mobile-ready, AI-assisted academic editor. The selected Gemini mode will apply consistently across the research canvas and writing tools, with responses grounded in the active manuscript and explicitly selected saved papers.

## Writing Layout and Mobile Pass
- Reshape `/write` into three functional areas: source library, manuscript editor, and AI assistance.
- Keep the manuscript central on desktop; show sources and AI assistance as compact drawers/panels on narrow phones so the editor remains usable.
- Replace the crowded mobile citation-style button row with a compact selector, keep export/actions reachable, and prevent toolbar, header, editor, and bibliography overflow.
- Preserve the existing light/dark themes, custom accent, citation markers, local draft saving, and source-library behavior.

## Shared Gemini Engine
- Centralize the five engine modes and persist the chosen mode across pages.
- Map the modes to supported Google Gemini models and behavior:
  - **Flash:** Gemini 3.8 Flash for quick transformations and summaries.
  - **Pro:** Gemini 3.1 Pro for standard analysis.
  - **Expert:** Gemini 3.1 Pro with deeper synthesis instructions.
  - **Deep Research:** Gemini 3.1 Pro with multi-step comparison and evidence-gap analysis across the selected sources.
  - **Journal Focus:** Gemini 3.1 Pro constrained to supplied academic sources, with unsupported claims clearly identified.
- Send AI requests through a secure server boundary using Lovable AI; no model key will be exposed in the browser.
- Include the current manuscript text, selected source metadata/abstracts, citation style, and chosen mode in each request. Keep prompts and model configuration server-side.
- Stream responses, show progress and reasoning summaries where supported, surface real provider errors, and allow the user to stop an active request.

## AI Assistance and Paper Chat
- Add source checkboxes so users can choose which saved papers ground an AI request.
- Add focused actions for paper summaries, literature-review drafting, paraphrasing, and claim verification.
- Let users review generated text before inserting it into the manuscript; generated claims will not be silently added.
- Add “Chat with Paper” for one chosen saved paper, grounded in its available abstract, citation metadata, and manuscript context.
- Clearly identify when only an abstract is available; this phase will not claim to read inaccessible remote PDF full text.

## Inline AI Toolbar
- Detect meaningful text selections inside the editor and position a compact floating toolbar near the selection.
- Provide Rephrase, Summarize, Academic Polish, and Fix Grammar actions.
- Preserve the selected range while the request runs, then offer Replace selection or Insert after selection rather than modifying text automatically.
- Keep the toolbar keyboard accessible and reposition/dismiss it safely on scrolling, resizing, selection changes, and mobile devices.

## Export
- Add browser-generated Word (`.docx`) and PDF downloads containing the manuscript and current formatted bibliography.
- Add BibTeX and RIS downloads for the current cited references.
- Sanitize filenames, preserve major paragraph/list/heading structure where supported, and show a clear empty-document or empty-reference state instead of producing misleading files.

## Technical Details
- Add a shared engine definition/state helper, a Gemini server function, focused writing-assistant UI components, and client-side export utilities.
- Use the existing AI SDK pattern with `google/gemini-*` models through the Lovable AI Gateway; keep all calls streaming-capable and propagate gateway request identifiers.
- Use browser-compatible export packages so document generation does not depend on unsupported server binaries.
- Continue using local storage for the manuscript, selected engine, and saved-paper library; no database migration is required.
- Treat saved abstracts and metadata as quoted source context, isolate them from system instructions, and limit request size before sending.

## Validation
- Make a real Gemini request through every engine/model path used by the switcher and verify errors appear in the interface.
- Verify summarization, review drafting, paraphrasing, claim checking, paper chat, selection replacement/insertion, citation updates, and all four export formats.
- Test `/write` at desktop and narrow-phone widths, including long titles, empty library, multiple saved papers, open mobile drawers, dark mode, and no overlapping controls.
- Confirm route metadata remains complete and the latest preview build has no errors.

## Scope Boundary
- “Chat with Paper” uses the abstract and metadata already saved from academic search. Full remote-PDF extraction, OCR, uploads, persistent cloud projects, and real parallel web-search agents are not added in this pass.
