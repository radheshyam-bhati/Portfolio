## 2026-05-29 - Added accessible labels to icon-only project links
**Learning:** Icon-only anchor tags (like GitHub and Live Project links) lacked `aria-label` for screen readers and tooltips for mouse users.
**Action:** Always add descriptive `aria-label` and `title` attributes to icon-only links or buttons, using interpolated variables (like project titles) to keep them distinct in mapped arrays.
