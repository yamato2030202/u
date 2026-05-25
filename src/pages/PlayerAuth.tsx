import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/urban-legends-logo.png";

const PlayerAuth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/profile");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      setSubmitting(false);
      return;
    }

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created successfully! You can now sign in.");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Urban Legends" className="h-16 w-auto" />
        </div>
        <h1 className="text-2xl font-heading font-black text-primary text-center mb-1">
          {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
        </h1>
        <p className="text-center font-body text-sm text-muted-foreground mb-8">
          {isLogin ? "Welcome back, legend" : "Join the Urban Legends community"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            required
          />
          {!isLogin && (
            <input
              type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              required
            />
          )}
          {error && <p className="font-body text-sm text-destructive">{error}</p>}
          {success && <p className="font-body text-sm text-primary">{success}</p>}
          <button
            type="submit" disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 font-heading font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "LOADING..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="text-primary font-bold hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <div className="text-center mt-4">
          <button onClick={() => navigate("/")} className="font-body text-xs text-muted-foreground hover:text-foreground">
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerAuth;
