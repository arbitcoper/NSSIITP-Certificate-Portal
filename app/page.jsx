"use client";
import { useState } from "react";
import RollForm from "@/components/RollForm";
import CertificateCanvas from "@/components/CertificateCanvas";

export default function Home() {
  const [view, setView] = useState("form"); // "form" | "certificate" | "error"
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (rollNo) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setView("error");
      } else {
        setStudent({ name: data.name, rollNo: data.rollNo });
        setView("certificate");
      }
    } catch {
      setError("Unable to reach the server. Please try again.");
      setView("error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setView("form");
    setStudent(null);
    setError("");
  };

  return (
    <main className="page">
      {/* header */}
      <header className="site-header">
        <img src="/nss_logo.png" alt="NSS Logo" className="nss-logo" />
        <div>
          <h1 className="site-title">NSS IIT Patna</h1>
          <p className="site-sub">Not Me, But You · Certificate Portal</p>
        </div>
      </header>

      {/* form section */}
      {view === "form" && (
        <RollForm onSubmit={handleSubmit} loading={loading} />
      )}

      {/* error handler */}
      {view === "error" && (
        <div className="error-card" role="alert">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <h2>Volunteer Not Found</h2>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={reset}>
            ← Try Again
          </button>
        </div>
      )}

      {/* output */}
      {view === "certificate" && student && (
        <CertificateCanvas student={student} onBack={reset} />
      )}

      {/* footer */}
      <footer style={{
        marginTop: "auto",
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        letterSpacing: "0.05em",
        textAlign: "center",
        paddingTop: "1.5rem",
      }}>
        © NSS IIT Patna &nbsp;|&nbsp; All Rights Reserved
      </footer>
    </main>
  );
}
