# 🔥 Supabase Authentication Integration Guide

## Why Supabase?

Supabase provides:
- ✅ Built-in Google OAuth (no manual setup needed!)
- ✅ Email/Password authentication
- ✅ Facebook, GitHub, Twitter, Discord, etc.
- ✅ User management dashboard
- ✅ PostgreSQL database
- ✅ Real-time subscriptions
- ✅ Row Level Security
- ✅ Free tier (50,000 monthly active users)

---

## 🎯 Two Integration Options

### Option 1: Supabase for Auth Only (Keep MongoDB)
- Use Supabase only for authentication
- Keep MongoDB for your land data
- Sync user data between Supabase and MongoDB

### Option 2: Full Supabase (Replace MongoDB)
- Use Supabase for everything
- PostgreSQL database instead of MongoDB
- Simpler architecture

**I'll show you Option 1 (Auth only) - easier migration!**

---

## 📋 Setup Steps

### Step 1: Create Supabase Project (2 minutes)

1. Go to: https://supabase.com/
2. Click **"Start your project"**
3. Sign in with GitHub (or create account)
4. Click **"New Project"**
5. Fill in:
   - Name: **LandQ Website**
   - Database Password: (generate strong password)
   - Region: Choose closest to you
6. Click **"Create new project"**
7. Wait 2 minutes for project to be created

---

### Step 2: Configure Google OAuth in Supabase (3 minutes)

1. In your Supabase project, go to **"Authentication"** → **"Providers"**
2. Find **"Google"** in the list
3. Toggle it **ON**
4. You'll see:
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy this URL!

5. Go to Google Cloud Console: https://console.cloud.google.com/
6. Use the same project or create new one
7. Add Supabase callback URL to authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
8. Copy your Google Client ID and Secret
9. Paste them in Supabase Google provider settings
10. Click **"Save"**

**That's it! Google OAuth is configured!** 🎉

---

### Step 3: Install Supabase Client (1 minute)

```bash
# Frontend
cd frontend
npm install @supabase/supabase-js

# Backend (optional - for syncing)
cd backend
npm install @supabase/supabase-js
```

---

### Step 4: Configure Supabase in Frontend (2 minutes)

Create `frontend/src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from Supabase:
- Go to **Settings** → **API**
- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

### Step 5: Update AuthContext (5 minutes)

Replace `frontend/src/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  userType: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, userType?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserWithBackend(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUserWithBackend(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserWithBackend = async (supabaseUser: any) => {
    try {
      // Get or create user in your MongoDB backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/supabase-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
          profilePicture: supabaseUser.user_metadata?.avatar_url,
        }),
      });

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) await syncUserWithBackend(data.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string, userType?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          user_type: userType,
        },
      },
    });

    if (error) throw error;
    if (data.user) await syncUserWithBackend(data.user);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

### Step 6: Update Login Page (2 minutes)

Update `frontend/src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email address"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>

          <div className="text-center">
            <Link to="/register" className="text-green-600 hover:text-green-500">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

---

### Step 7: Create Auth Callback Page (2 minutes)

Create `frontend/src/pages/SupabaseCallback.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const SupabaseCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default SupabaseCallback;
```

---

### Step 8: Update App Routes (1 minute)

Update `frontend/src/App.tsx`:

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandListing from './pages/LandListing';
import LandDetails from './pages/LandDetails';
import AdminPanel from './pages/AdminPanel';
import SupabaseCallback from './pages/SupabaseCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<SupabaseCallback />} />
            <Route path="/lands" element={<LandListing />} />
            <Route path="/lands/:id" element={<LandDetails />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

### Step 9: Add Backend Sync Endpoint (3 minutes)

Add to `backend/controller/authController.ts`:

```typescript
export const supabaseSync = async (req: Request, res: Response) => {
  try {
    const { supabaseId, email, name, profilePicture } = req.body;

    // Find or create user
    let user = await User.findOne({ email, deletedAt: null });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId: supabaseId,
        authProvider: 'google',
        profilePicture,
        userType: 'buyer', // Default
        password: Math.random().toString(36).slice(-8),
      });
    } else {
      // Update existing user
      if (!user.googleId) {
        user.googleId = supabaseId;
        user.authProvider = 'google';
      }
      if (profilePicture && !user.profilePicture) {
        user.profilePicture = profilePicture;
      }
      await user.save();
    }

    const token = generateToken(user._id.toString());

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        profilePicture: user.profilePicture,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
```

Add route in `backend/routes/auth.ts`:

```typescript
router.post('/supabase-sync', supabaseSync);
```

---

## ✅ Benefits of Supabase

### Compared to Manual Google OAuth:

| Feature | Manual OAuth | Supabase |
|---------|-------------|----------|
| Setup Time | 15 minutes | 5 minutes |
| Google OAuth | Manual config | Built-in |
| Other Providers | Need to add each | 20+ providers ready |
| User Management | Build yourself | Dashboard included |
| Email Verification | Build yourself | Built-in |
| Password Reset | Build yourself | Built-in |
| Magic Links | Build yourself | Built-in |
| 2FA | Build yourself | Built-in |
| Session Management | Manual | Automatic |
| Security | Your responsibility | Handled by Supabase |

---

## 🧪 Testing

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev

# Test
1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. Authorize with Google
4. Redirected to dashboard
5. Logged in! 🎉
```

---

## 🎯 What You Get

- ✅ Google OAuth (one click!)
- ✅ Email/Password auth
- ✅ User management dashboard
- ✅ Automatic session handling
- ✅ Secure by default
- ✅ Free tier (50K MAU)
- ✅ Easy to add more providers
- ✅ Built-in email verification
- ✅ Password reset flows
- ✅ Magic link authentication

---

## 💰 Pricing

**Free Tier:**
- 50,000 monthly active users
- 500 MB database space
- 1 GB file storage
- Unlimited API requests

**Pro Tier ($25/month):**
- 100,000 monthly active users
- 8 GB database space
- 100 GB file storage
- Everything else

---

## 🚀 Next Steps

1. Create Supabase project
2. Configure Google OAuth
3. Install Supabase client
4. Update AuthContext
5. Test!

---

**Supabase is much easier than manual OAuth!** 🎉
