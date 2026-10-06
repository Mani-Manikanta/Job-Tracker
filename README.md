# DevConnect: Job Application Tracker

A React app to track job applications on a drag-and-drop Kanban board, with search, sorting, analytics, dark mode and CSV export. Data is saved in the browser (localStorage).

## Tech
React 18, Vite, JavaScript (ES6+), HTML5 (native drag and drop), CSS3 (Grid, Flexbox, CSS variables), Recharts

## Run locally
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub, then import the repo on Vercel or Netlify (build command `npm run build`, output directory `dist`).

## Features
- Add, edit and delete applications
- Drag cards between Applied, Interview, Offer and Rejected
- Search by company or role, and sort by date or company
- Analytics: status breakdown and applications per week
- Light and dark theme, responsive layout
- Export all applications to CSV

## Ideas to extend
Firebase Auth and Firestore, reminders for follow-ups, React Router, unit tests with Vitest.
