## 2024-06-17 - Do Not Rewrite Artifact Branch

**Vulnerability:** Massive Overreach via Branch Checkout
**Learning:** If a repository defaults to a compiled artifacts branch (e.g., 'gh-pages' containing only `index.html` and `assets/`), switching to `main` to modify source code will cause the resulting PR to include thousands of files, violating the "< 50 lines" negative constraint.
**Prevention:** If the task requires a small security enhancement on an artifacts branch, apply the fix directly to the artifact (e.g., adding a CSP `<meta>` tag to `index.html`) rather than reconstructing the source tree. If source modifications are absolutely necessary, ensure the initial checkout and diffs accurately reflect *only* the intended changes without pulling in the entire repository structure as new additions.
