"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import CERT_CONFIG from "@/cert.config";

export default function CertificateCanvas({ student, onBack }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [errMsg, setErrMsg] = useState("");

  // main draw
  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    try {
      // load img
      const img = await loadImage("/certificate-template.png");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // load fonts
      const { font } = CERT_CONFIG;
      const fontSpec = `${font.fontWeight} ${font.maxSize}px '${font.family}'`;
      try {
        await Promise.race([
          document.fonts.load(fontSpec),
          new Promise((_, rej) =>
            setTimeout(() => rej(new Error("font timeout")), 3000)
          ),
        ]);
      } catch {
        /* use system fallback — canvas still renders */
      }

      // get pos
      const x = CERT_CONFIG.name.x * canvas.width;
      const y = CERT_CONFIG.name.y * canvas.height;

      // calc font size
      // scales down when name too long
      const maxW = canvas.width * font.maxWidthFraction;

      const applyFont = (size) => {
        ctx.font = `${font.fontWeight} ${size}px '${font.family}', ${font.fallback}`;
      };

      let fontSize = font.maxSize;
      applyFont(fontSize);

      while (
        ctx.measureText(student.name).width > maxW &&
        fontSize > font.minSize
      ) {
        fontSize -= font.shrinkStep;
        applyFont(fontSize);
      }

      // render text
      ctx.fillStyle    = font.color;
      ctx.textAlign    = CERT_CONFIG.name.align;
      ctx.textBaseline = CERT_CONFIG.name.baseline;
      ctx.fillText(student.name, x, y, maxW);

      setStatus("ready");
    } catch (err) {
      console.error("Certificate render failed:", err);
      setErrMsg(
        err.message.includes("Failed to load")
          ? "Could not load certificate-template.png. Make sure the file is at public/certificate-template.png."
          : `Render error: ${err.message}`
      );
      setStatus("error");
    }
  }, [student.name]);

  useEffect(() => {
    draw();
  }, [draw]);

  // download handlers
  const download = (format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const baseName = `NSS_IITP_Certificate_${student.rollNo}`;

    if (format === "pdf") {
      /* Dynamic import to keep bundle size small and avoid SSR issues */
      import("jspdf").then(({ jsPDF }) => {
        // Create a PDF with the exact dimensions of the canvas
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height]
        });

        // Add the canvas as a JPEG image to the PDF
        // Ensure a white background
        const offscreen = document.createElement("canvas");
        offscreen.width  = canvas.width;
        offscreen.height = canvas.height;
        const octx = offscreen.getContext("2d");
        octx.fillStyle = "#ffffff";
        octx.fillRect(0, 0, offscreen.width, offscreen.height);
        octx.drawImage(canvas, 0, 0);

        const imgData = offscreen.toDataURL("image/jpeg", 0.98);
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${baseName}.pdf`);
      });
    } else {
      const a = document.createElement("a");
      a.download = `${baseName}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    }
  };

  // render
  return (
    <div className="cert-page">

      {/* actions */}
      <div className="cert-actions">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>

        {status === "ready" && (
          <div className="download-group">
            <span className="download-label">Download as:</span>
            <button
              className="btn btn-download"
              onClick={() => download("png")}
              title="Download as PNG (lossless, best quality)"
            >
              <DownloadIcon />
              PNG
            </button>
            <button
              className="btn btn-download btn-download-pdf"
              onClick={() => download("pdf")}
              title="Download as PDF (standard document format)"
            >
              <DownloadIcon />
              PDF
            </button>
          </div>
        )}
      </div>

      {/* loading */}
      {status === "loading" && (
        <div className="cert-loading">
          <span className="spinner spinner-lg" aria-hidden="true" />
          <p>Generating your certificate…</p>
        </div>
      )}

      {/* error */}
      {status === "error" && (
        <div className="error-card" role="alert" style={{ maxWidth: 560 }}>
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <h2>Certificate Error</h2>
          <p>{errMsg}</p>
          <a
            href="/calibrate"
            className="btn btn-secondary"
            style={{ marginTop: "0.5rem" }}
          >
            Open Calibrator
          </a>
        </div>
      )}

      {/* canvas container */}
      <div
        className="cert-canvas-wrapper"
        style={{ display: status === "error" ? "none" : undefined }}
      >
        <canvas
          ref={canvasRef}
          className="cert-canvas"
          aria-label={`Participation certificate for ${student.name}`}
          style={{
            opacity: status === "ready" ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>

      {/* details */}
      {status === "ready" && (
        <p className="cert-note">
          <strong>{student.name}</strong>&nbsp;·&nbsp;Roll No: {student.rollNo}
        </p>
      )}
    </div>
  );
}

// helpers

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 3v13M8 12l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
