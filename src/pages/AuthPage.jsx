import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname !== "/signup";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
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

  function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (isLogin) {
      if (!formData.identifier.trim() || !formData.password) {
        setError("Please enter your username/email and password.");
        return;
      }
    } else {
      if (formData.username.trim().length < 3) {
        setError("Username must contain at least 3 characters.");
        return;
      }

      const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

      if (!phoneRegex.test(formData.phone.trim())) {
        setError("Please enter a valid phone number.");
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

    if (isLogin) {
      const savedUser = JSON.parse(localStorage.getItem("powerCutUser"));

      if (!savedUser) {
        setError("No account found. Please sign up first.");
        return;
      }

      const identifier = formData.identifier.trim().toLowerCase();

      if (
        identifier !== savedUser.username.toLowerCase() &&
        identifier !== savedUser.email.toLowerCase()
      ) {
        setError("Username or email is incorrect.");
        return;
      }

      if (formData.password !== savedUser.password) {
        setError("Incorrect password.");
        return;
      }

      localStorage.setItem("loggedIn", "yes");
      setSuccess("Login successful!");

      setTimeout(() => navigate("/"), 700);
    } else {
      if (!formData.email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      const savedUser = {
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      localStorage.setItem("powerCutUser", JSON.stringify(savedUser));

      setSuccess("Account created successfully!");

      setTimeout(() => navigate("/dashboard"), 700);
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
            </>
          )}

          {isLogin && (
            <div className="field-group">
              <label htmlFor="identifier">Username or email</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Enter your username or email"
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

          <button type="submit" className="btn auth-submit">
            {isLogin ? "Log in" : "Create account"}
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
