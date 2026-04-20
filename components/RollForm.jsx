"use client";
import { useState, useRef } from "react";

export default function RollForm({ onSubmit, loading }) {
  const [rollNo, setRollNo] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  const trimmed = rollNo.trim();
  const isInvalid = touched && trimmed === "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="glass-card">
      {/* Shimming top band */}
      <div className="glass-card-band" />

      <div className="glass-card-body">
        {/* Icon */}
        <div className="glass-icon-wrap" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="glass-card-title">Retrieve Your Certificate</h2>
        <p className="glass-card-desc">
          Enter your roll number to download your certificate of participation for{" "}
          <strong style={{ color: "var(--primary-light)", fontWeight: 600 }}>
            NSS IIT Patna
          </strong>
        </p>

        <form onSubmit={handleSubmit} noValidate style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Field */}
          <div className="glass-input-field">
            <label htmlFor="rollNo" className="glass-label">
              Roll Number
            </label>

            <div className="glass-input-wrapper">
              {/* Prefix icon */}
              <span className="glass-input-prefix" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>

              <input
                ref={inputRef}
                id="rollNo"
                type="text"
                placeholder="e.g. 2501CS06"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  if (touched && e.target.value.trim()) setTouched(false);
                }}
                onBlur={() => setTouched(true)}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                aria-describedby={isInvalid ? "rollNo-error" : undefined}
                aria-invalid={isInvalid}
                className={`glass-input ${isInvalid ? "error" : ""}`}
              />
            </div>

            {isInvalid && (
              <p id="rollNo-error" role="alert" className="glass-error-msg">
                ⚠ Please enter your roll number.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.95rem 1.5rem", marginTop: "0.25rem" }}
            aria-label="View certificate"
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Fetching...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
                View Certificate
              </>
            )}
          </button>
        </form>

        <p className="glass-note">
          Only registered NSS IIT Patna volunteers who passed will get their certificates.
        </p>
      </div>
    </div>
  );
}
