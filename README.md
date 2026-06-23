# UK Energy Mix Frontend

React TypeScript application for displaying UK energy mix and finding optimal EV charging windows.

## Setup

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production (Vercel):

```
REACT_APP_API_URL=https://your-backend-url/api
```

## Available Scripts

```bash
npm start       # Start development server
npm build       # Build for production
npm test        # Run tests
npm test:watch  # Run tests in watch mode
```

## Features

-   Display energy mix for today, tomorrow, and day after tomorrow
-   View clean energy percentage for each day
-   Select charging window length (1-6 hours)
-   Find optimal charging window with highest clean energy percentage
-   Responsive design with Tailwind CSS
-   Interactive pie charts with Recharts

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable `REACT_APP_API_URL` to your backend URL
4. Deploy

## Testing

```bash
npm test
npm test:watch
```
