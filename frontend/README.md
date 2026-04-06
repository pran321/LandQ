# Frontend - Land Selling Platform

React + TypeScript + Vite + Tailwind CSS

## Structure

```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── context/       # React Context (Auth)
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── public/            # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Pages
- Home - Landing page
- Login/Register - Authentication
- Land Listing - Browse all lands
- Land Details - View single land
- Dashboard - User dashboard
- Admin Panel - Admin management

### Components
- Navbar - Navigation bar
- LandCard - Land listing card
- ProtectedRoute - Route protection

### Context
- AuthContext - Authentication state management

### Services
- API service with Axios
- Authentication service
- Land service
- Saved lands service
- Buyer leads service

## Styling

Using Tailwind CSS for utility-first styling:
- Responsive design
- Modern UI components
- Smooth transitions
- Loading states

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

## Build

```bash
npm run build
```

Output in `dist/` directory.

## Deployment

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy
```

Set environment variable:
```
VITE_API_URL=https://your-backend-url.com
```
