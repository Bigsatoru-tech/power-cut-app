import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function LocationGate({ children }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const [allowed, setAllowed] = useState(
    () => localStorage.getItem("locationAccepted") === "yes",
  );

  const [error, setError] = useState("");

  // Allow users to access authentication pages without location permission.
  if (isAuthPage || allowed) return children;

  function accept() {
    setError("");

    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem("locationAccepted", "yes");
        setAllowed(true);
      },
      () =>
        setError(
          "Location was blocked. Allow it in your browser settings, then tap Accept again.",
        ),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <h2>Location access needed</h2>

        <p>
          Power-Cut Bounties uses your device location and IP address to verify
          outage reports and show nearby skill swaps. Other users only ever see
          an approximate area. Our team can see your precise location and IP to
          prevent fake reports and abuse.
        </p>

        <p>You can't use the app without accepting.</p>

        {error && <div className="gate-error">{error}</div>}

        <button className="btn" onClick={accept}>
          Accept and continue
        </button>

        <button
          className="btn-ghost"
          onClick={() =>
            setError("You need to allow location to use Power-Cut Bounties.")
          }
        >
          Decline
        </button>
      </div>
    </div>
  );
}
