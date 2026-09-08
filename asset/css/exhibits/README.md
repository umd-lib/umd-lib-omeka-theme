# Per-exhibit stylesheets (Tier 3)

Drop an optional stylesheet here named for a site's slug — `<slug>.css` (e.g.
`dc-punk.css`). `view/layout/layout.phtml` loads it automatically, after
`theme.css`, **only for the site whose slug matches** and **only if the file
exists**. No exhibit pays for a file it does not have.

## Rules

- **Scope everything** under `[data-exhibit="<slug>"]`. The layout sets that
  attribute on `<html>`, so scoped rules cannot leak to other exhibits or to the
  shared chrome.
- **Surface only.** Restyle content and decoration. Do **not** target the
  navigation (`.section-nav`), the universal header (`.umd-header`), the focus
  ring (`:focus`, `outline`), or `[aria-*]` state — those are the base theme's
  accessibility contract.
- Prefer the Tier 1 token seam where it fits, e.g. set the exhibit's display
  face once:

  ```css
  [data-exhibit="dc-punk"] {
    --exhibit-display-font: "Crimson Text", Georgia, serif;
  }
  ```

## Workflow

This directory is the **promotion target** for the hybrid customization model:
a curator prototypes bespoke styling in Omeka's admin CSS editor on the sandbox;
when it ships, a developer extracts that CSS, scopes it here, reviews it, and
clears the admin editor. The admin CSS editor is the workbench; this directory
is the source of truth.
