# GitHub Profile Viewer

A GitHub profile viewer and comparison tool built with React and Vite.

## Features

- **Profile Search**: Search GitHub users by username using the public GitHub REST API
- **Profile Card**: Display avatar, name, bio, location, followers, following, public repos, and join date
- **Repository List**: Browse repos with sorting (stars, forks, updated date) and filtering
- **Language Breakdown**: Pie chart showing language distribution across all repositories (powered by Recharts)
- **Activity Timeline**: View recent repository activity
- **User Comparison**: Compare two GitHub users side-by-side with stat comparisons
- **Favorites**: Save favorite users to localStorage for quick access

## Tech Stack

- React 18+ with hooks and functional components
- Vite for build tooling
- Recharts for data visualization
- GitHub REST API (no authentication required for public data)
- localStorage for favorites persistence

## Getting Started

```bash
npm install
npm run dev
```

## API

- `https://api.github.com/users/{username}` — User profile data
- `https://api.github.com/users/{username}/repos` — User repositories

> Note: GitHub API has a rate limit of 60 requests/hour for unauthenticated requests.
