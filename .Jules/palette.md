## 2024-05-24 - Interactive Card Accessibility
**Learning:** Icon-only links within mapped lists (like project cards) are frequently overlooked for screen readers. Using `aria-label` with unique identifying text (e.g., project titles) ensures each link's context is preserved.
**Action:** Always verify icon-only interactive elements in arrays/lists include dynamic, interpolated descriptions as `aria-label`s.
