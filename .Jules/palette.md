## 2024-05-02 - Accessible Icon Links in Mapped Arrays
**Learning:** When rendering multiple similar items in a list or grid (like project cards), icon-only links must interpolate unique identifiers (like the project title) into their `aria-label` attributes to remain distinguishable for screen reader users.
**Action:** Always verify that `aria-label`s inside loops contain dynamic, item-specific context rather than static, generic text.
