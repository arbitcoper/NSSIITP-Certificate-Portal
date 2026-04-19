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
    <div style={styles.card}>
      {/* Shimming gold top band */}
      <div style={styles.band} />

      <div style={styles.body}>
        {/* Icon */}
        <div style={styles.iconWrap} aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={styles.title}>Retrieve Your Certificate</h2>
        <p style={styles.desc}>
          Enter your roll number to download your certificate of participation for{" "}
          <strong style={{ color: "rgba(255,204,0,0.9)", fontWeight: 600 }}>
            NSS IIT Patna
          </strong>
        </p>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {/* Field */}
          <div style={styles.field}>
            <label htmlFor="rollNo" style={styles.label}>
              Roll Number
            </label>

            <div style={styles.inputWrap}>
              {/* Prefix icon */}
              <span style={styles.prefix} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>

              <input
                ref={inputRef}
                id="rollNo"
                type="text"
                placeholder="e.g. 2301CS01"
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
                style={{
                  ...styles.input,
                  ...(isInvalid ? styles.inputError : {}),
                }}
              />
            </div>

            {isInvalid && (
              <p id="rollNo-error" role="alert" style={styles.errorMsg}>
                ⚠ Please enter your roll number.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
            aria-label="Generate certificate"
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Verifying…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
                Generate Certificate
              </>
            )}
          </button>
        </form>

        <p style={styles.note}>
          Only registered NSS IIT Patna participants can download certificates.
        </p>
      </div>

      {/* Decorative corner brackets */}
      <span style={{ ...styles.corner, bottom: 10, left: 10, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 4px" }} aria-hidden="true" />
      <span style={{ ...styles.corner, bottom: 10, right: 10, borderWidth: "0 2px 2px 0", borderRadius: "0 0 4px 0" }} aria-hidden="true" />
    </div>
  );
}

// styles
const styles = {
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 460,
    background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(0,107,255,0.1) 100%)",
    border: "1px solid rgba(0,107,255,0.28)",
    borderRadius: 20,
    overflow: "hidden",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 14px 52px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset",
    animation: "slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
  },

  band: {
    height: 6,
    background: "linear-gradient(90deg, #B38F00 0%, #FFE366 40%, #B38F00 70%, #0057CC 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 3s linear infinite",
  },

  body: {
    padding: "2.4rem 2.2rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.35rem",
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, rgba(255,204,0,0.2), rgba(0,107,255,0.26))",
    border: "1.5px solid rgba(255,204,0,0.32)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFCC00",
    boxShadow: "0 4px 18px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,204,0,0.06)",
  },

  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "1.42rem",
    fontWeight: 700,
    color: "#FFCC00",
    letterSpacing: "0.06em",
    textAlign: "center",
    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    lineHeight: 1.2,
  },

  desc: {
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 1.65,
    maxWidth: 340,
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.42rem",
    width: "100%",
  },

  label: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
    userSelect: "none",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  prefix: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,204,0,0.5)",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "0.85rem 1rem 0.85rem 2.8rem",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,204,0,0.24)",
    borderRadius: 10,
    color: "#FFCC00",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
    outline: "none",
    caretColor: "#FFCC00",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  },

  inputError: {
    borderColor: "rgba(207,102,121,0.7)",
    background: "rgba(207,102,121,0.06)",
  },

  errorMsg: {
    fontSize: "0.78rem",
    color: "#CF6679",
    lineHeight: 1.4,
  },

  submitBtn: {
    width: "100%",
    padding: "0.9rem 1.5rem",
    fontSize: "1rem",
    borderRadius: 10,
    marginTop: "0.15rem",
  },

  note: {
    fontSize: "0.72rem",
    color: "rgba(255,204,0,0.45)",
    textAlign: "center",
    letterSpacing: "0.04em",
    lineHeight: 1.5,
  },

  corner: {
    position: "absolute",
    width: 22,
    height: 22,
    borderColor: "rgba(0,107,255,0.38)",
    borderStyle: "solid",
    pointerEvents: "none",
  },
};
