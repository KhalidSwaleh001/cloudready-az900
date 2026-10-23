
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

function Dashboard({ user, onLogout }) {
  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "Learner";

  return (
    <main className="page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          CloudReady
        </a>

        <button className="submit-button" onClick={onLogout}>
          Log out
        </button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR LEARNING DASHBOARD</span>
          <h1>Welcome, {displayName}!</h1>
          <p>
            Your cloud learning journey starts here. Prepare for the Azure
            Fundamentals AZ-900 exam one topic at a time.
          </p>
        </div>

        <div className="auth-card">
          <span className="eyebrow">AZ-900 EXAM PREP</span>
          <h2>Ready to practise?</h2>
          <p className="card-description">
            Your account is connected. Next, we'll add practice questions,
            explanations, scores, and learning progress.
          </p>

          <div className="feature">
            <span>01</span>
            <div>
              <strong>Cloud concepts</strong>
              <p>Learn cloud computing fundamentals.</p>
            </div>
          </div>

          <div className="feature">
            <span>02</span>
            <div>
              <strong>Azure architecture and services</strong>
              <p>Revise core Azure services and solutions.</p>
            </div>
          </div>

          <div className="feature">
            <span>03</span>
            <div>
              <strong>Management and governance</strong>
              <p>Explore cost management, security, and compliance.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() || "Learner" },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        setMessage(
          data.session
            ? "Account created successfully!"
            : "Account created. Check your email to verify your account."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        // Supabase's auth state listener will show the dashboard.
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          CloudReady
        </a>
        <span className="nav-caption">AZ-900 EXAM PREP</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">YOUR CLOUD JOURNEY STARTS HERE</span>
          <h1>Build your cloud confidence.</h1>
          <p>
            Prepare for the Azure Fundamentals exam with focused practice,
            track your progress, and discover the topics you need to improve.
          </p>

          <div className="feature">
            <span>01</span>
            <div>
              <strong>Practice with purpose</strong>
              <p>Test your understanding with topic-based quizzes.</p>
            </div>
          </div>

          <div className="feature">
            <span>02</span>
            <div>
              <strong>Track your progress</strong>
              <p>Keep your attempts and scores together in one place.</p>
            </div>
          </div>

          <div className="feature">
            <span>03</span>
            <div>
              <strong>Study smarter</strong>
              <p>Identify weak areas and focus your revision.</p>
            </div>
          </div>

          <small className="disclaimer">
            Independent learning project. Not affiliated with Microsoft.
          </small>
        </div>

        <div className="auth-card">
          <div className="card-top">
            <span className="card-symbol">✳</span>
            <span className="eyebrow">CLOUDREADY LEARNING</span>
          </div>

          <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
          <p className="card-description">
            {mode === "signup"
              ? "Start preparing for your AZ-900 exam."
              : "Sign in to continue your preparation."}
          </p>

          <div className="mode-switch">
            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Log in
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label>
                Display name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required
              />
            </label>

            <button className="submit-button" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create account →"
                  : "Log in →"}
            </button>
          </form>

          {message && (
            <p className="status-message" role="status">
              {message}
            </p>
          )}

          <p className="secure-note">
            Your account is protected by Supabase authentication.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (mounted) {
        if (error) console.error("Session check failed:", error);
        setUser(data?.session?.user ?? null);
        setCheckingSession(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    }
  }

  if (checkingSession) {
    return <main className="page"><p style={{ padding: 40 }}>Loading CloudReady...</p></main>;
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthScreen />
  );
}
