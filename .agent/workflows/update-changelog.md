---
description: Update WORK_DONE.md changelog after every code change
---

# Update Changelog Workflow

After making **any code changes** to the React project, always update `WORK_DONE.md`:

1. Open `react-version/WORK_DONE.md`
2. Navigate to the `## 📝 Changelog` section at the bottom of the file
3. Add a new entry at the **top** of the changelog (reverse chronological order) with:
   - **Date** in format `YYYY-MM-DD`
   - **Title** — brief description of what was done
   - **Problem** — what broke or what was requested
   - **Root causes / Changes** — table of files modified with issue and fix
   - **Files modified** — list of files changed
4. If the file tree in the `## 📁 Project Structure` section was affected (new files, renamed files, deleted files), update the tree as well
5. If stats changed (new components, new API functions, etc.), update the `## 🔢 Stats` table

This ensures every session has a complete history of changes for future reference.
