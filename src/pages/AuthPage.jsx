import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signInUser, signUpUser } from "../userAuth";
import AreaSelect from "../components/AreaSelect";

export default function AuthPage() {
  const location = useLocation();

  const isLogin = location.pathname !== "/signup";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    area: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (isLogin) {
      if (!formData.identifier.trim() || !formData.password) {
        setError("Please enter your email and password.");
        return;
      }
    } else {
      if (!/^[A-Za-z0-9_]{3,20}$/.test(formData.username.trim())) {
        setError("Username must be 3 to 20 letters, numbers or underscores.");
        return;
      }

      const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

      if (!phoneRegex.test(formData.phone.trim())) {
        setError("Please enter a valid phone number.");
        return;
      }

      if (!formData.email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      if (!formData.area) {
        setError("Please choose your area.");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setBusy(true);

    try {
      if (isLogin) {
        await signInUser(formData.identifier.trim(), formData.password);
        setSuccess("Login successful!");
      } else {
        const result = await signUpUser({
          email: formData.email.trim(),
          password: formData.password,
          username: formData.username,
          phone: formData.phone.trim(),
          area: formData.area,
        });

        setSuccess(
          result.session
            ? "Account created successfully!"
            : "Account created. Check your email to confirm it, then log in.",
        );
      }
      // When the sign-in works, the app sends you to the map automatically.
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>

          <p>
            {isLogin
              ? "Log in to continue with Power-Cut Bounties."
              : "Join the community and start earning rewards."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="field-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="area">Your area</label>
                <AreaSelect
                  value={formData.area}
                  onChange={(area) => {
                    setFormData((prev) => ({ ...prev, area }));
                    setError("");
                  }}
                />
              </div>
            </>
          )}

          {isLogin && (
            <div className="field-group">
              <label htmlFor="identifier">Email address</label>
              <input
                id="identifier"
                name="identifier"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="field-group">
            <label htmlFor="password">Password</label>

            <div className="password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="btn auth-submit" disabled={busy}>
            {busy ? "Please wait..." : isLogin ? "Log in" : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>

          <Link
            to={isLogin ? "/signup" : "/login"}
            className="auth-switch-link"
          >
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </div>
      </div>
    </main>
  );
}