# To-Do Web App — OIBSIP Web Development Level 2, Task 3

An interactive to-do list app with pending/completed lists, editing, and persistence.

## Features
- Add tasks via input + button
- New tasks appear immediately in Pending
- Mark Complete toggle moves tasks between Pending/Completed (with Undo)
- Inline Edit for task text
- Delete removes a task permanently
- Live "X pending" / "Y completed" counters
- Timestamps for added and completed times
- Tasks persist across refresh via `localStorage`
- Friendly empty-state messages for both lists

## Tech Stack
HTML5, CSS3, vanilla JavaScript (no frameworks).

## How to Run
Open `index.html` in a browser. Data is saved locally in the browser via `localStorage`, so tasks remain after a refresh (per-browser, not synced across devices).

## Files
- `index.html`
- `style.css`
- `script.js`
