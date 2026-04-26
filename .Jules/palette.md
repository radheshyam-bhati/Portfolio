## 2026-04-26 - Dynamic ARIA Labels in Loops
**Learning:** When adding `aria-label` attributes to icon-only links rendered inside a mapped array or loop, it is crucial to interpolate a unique identifier (like the item's title) into the label. Otherwise, screen reader users will encounter a series of identical labels (e.g., "GitHub Link", "GitHub Link"), making it impossible to distinguish which item the link belongs to.
**Action:** Always verify that mapped, icon-only interactive elements include dynamically interpolated `aria-label` attributes that reference the specific item they represent.
