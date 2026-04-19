"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SAMPLE_NAME = "Student Name";

export default function CalibratePage() {
  const canvasRef = useRef(null);
  const imgRef    = useRef(null);

  const [pos,       setPos]       = useState({ x: 0.5, y: 0.55 });
  const [imgReady,  setImgReady]  = useState(false);
  const [fontSize,  setFontSize]  = useState(100);
  const [fontColor, setFontColor] = useState("#1a1a1a");
  const [fontWeight,setFontWeight]= useState("700");
  const [noTemplate,setNoTemplate]= useState(false);

  // load template on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = "/certificate-template.png";

    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      imgRef.current = img;
      setImgReady(true);
    };

    img.onerror = () => {
      /* Draw a placeholder so the calibrator is still usable */
      canvas.width  = 2480;
      canvas.height = 1754;
      imgRef.current = null;
      setNoTemplate(true);
      setImgReady(true);
    };
  }, []);

  // redraw whenever anything changes
  useEffect(() => {
    if (!imgReady) return;
    redraw(canvasRef.current, imgRef.current, pos, fontSize, fontColor, fontWeight);
  }, [imgReady, pos, fontSize, fontColor, fontWeight]);

  // click handler
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const fx = ((e.clientX - rect.left) * scaleX) / canvas.width;
    const fy = ((e.clientY - rect.top)  * scaleY) / canvas.height;
    setPos({
      x: parseFloat(fx.toFixed(4)),
      y: parseFloat(fy.toFixed(4)),
    });
  };

  const snippet =
`name: {
  x: ${pos.x},
  y: ${pos.y},
  align: "center",
  baseline: "middle",
},
font: {
  family: "Cinzel",
  fallback: "Georgia, serif",
  size: ${fontSize},
  minSize: 40,
  fontWeight: "${fontWeight}",
  color: "${fontColor}",
  maxWidthFraction: 0.60,
},`;

  return (
    <div className="calibrate-page">
      <Link href="/" className="btn btn-ghost calib-back">← Back to Portal</Link>

      <h1>🎯 Certificate Position Calibrator</h1>
      <p>
        Click anywhere on the certificate to set where the student&apos;s name will appear.<br />
        Adjust font size and colour below, then copy the snippet into{" "}
        <code>cert.config.js</code>.
      </p>

      {noTemplate && (
        <div style={s.warn}>
          ⚠ <strong>certificate-template.png</strong> not found in <code>/public</code>.
          A placeholder is shown. Add your Canva export and refresh to see the real design.
        </div>
      )}

      {/* live coordinates */}
      <div className="calib-coords">
        <span>x: <strong>{pos.x}</strong></span>
        <span>y: <strong>{pos.y}</strong></span>
      </div>

      {/* font controls */}
      <div style={s.controls}>
        <label style={s.ctrlLabel}>
          Font size (px)
          <input
            type="number"
            min={20}
            max={400}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={s.ctrlInput}
          />
        </label>

        <label style={s.ctrlLabel}>
          Font colour
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            style={{ ...s.ctrlInput, padding: "0.2rem", width: 60, cursor: "pointer" }}
          />
        </label>

        <label style={s.ctrlLabel}>
          Font weight
          <select
            value={fontWeight}
            onChange={(e) => setFontWeight(e.target.value)}
            style={{ ...s.ctrlInput, cursor: "pointer" }}
          >
            <option value="400">400 – Regular</option>
            <option value="600">600 – SemiBold</option>
            <option value="700">700 – Bold</option>
          </select>
        </label>
      </div>

      {/* config snippet */}
      <div className="calib-config">
        <p>Copy this into <code>cert.config.js</code> and save:</p>
        <pre>{snippet}</pre>
        <CopyButton text={snippet} />
      </div>

      {/* canvas */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <canvas
          ref={canvasRef}
          className="calib-canvas"
          onClick={handleClick}
        />
      </div>

      <p className="calib-hint">
        Click on the certificate to move the name · The red crosshair marks the anchor point
      </p>
    </div>
  );
}

// drawing logic
function redraw(canvas, img, pos, fontSize, fontColor, fontWeight) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (img) {
    ctx.drawImage(img, 0, 0);
  } else {
    drawPlaceholder(ctx, canvas.width, canvas.height);
  }

  const x = pos.x * canvas.width;
  const y = pos.y * canvas.height;

  /* Sample name text */
  ctx.save();
  ctx.font         = `${fontWeight} ${fontSize}px 'Cinzel', Georgia, serif`;
  ctx.fillStyle    = fontColor;
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(SAMPLE_NAME, x, y);
  ctx.restore();

  /* Crosshair */
  ctx.save();
  ctx.strokeStyle = "rgba(220, 30, 30, 0.85)";
  ctx.lineWidth   = Math.max(2, canvas.width / 1200);
  ctx.setLineDash([8, 6]);

  const armLen = Math.max(30, canvas.width / 50);

  ctx.beginPath();
  ctx.moveTo(x - armLen, y);
  ctx.lineTo(x + armLen, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - armLen);
  ctx.lineTo(x, y + armLen);
  ctx.stroke();

  /* Centre dot */
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(220, 30, 30, 0.9)";
  ctx.beginPath();
  ctx.arc(x, y, Math.max(4, canvas.width / 600), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  /* Coordinate label near crosshair */
  const labelText = `(${pos.x}, ${pos.y})`;
  const labelSize = Math.max(18, canvas.width / 120);
  ctx.save();
  ctx.font      = `600 ${labelSize}px 'Inter', Arial, sans-serif`;
  ctx.fillStyle = "rgba(220, 30, 30, 0.9)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const lx = Math.min(x + armLen + 8, canvas.width - 200);
  const ly = y - armLen;
  ctx.fillText(labelText, lx, ly);
  ctx.restore();
}

function drawPlaceholder(ctx, w, h) {
  /* Cream background */
  ctx.fillStyle = "#fdf8f0";
  ctx.fillRect(0, 0, w, h);

  /* Outer border */
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth   = 10;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  /* Inner border */
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, w - 140, h - 140);

  /* Centre message */
  ctx.fillStyle    = "#bbb";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.font         = `bold ${w / 28}px Georgia, serif`;
  ctx.fillText("certificate-template.png not found", w / 2, h / 2 - h / 16);
  ctx.font = `${w / 42}px Georgia, serif`;
  ctx.fillText(
    "Place your Canva PNG export at  public/certificate-template.png  and refresh.",
    w / 2,
    h / 2 + h / 20
  );

  /* Decorative title area */
  ctx.fillStyle = "#d4a843";
  ctx.font      = `bold ${w / 22}px Georgia, serif`;
  ctx.fillText("Certificate of Participation", w / 2, h * 0.22);
}

// copy-to-clipboard button
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — user can copy manually */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-secondary"
      style={{ marginTop: "0.75rem", fontSize: "0.82rem", padding: "0.5rem 1.25rem" }}
    >
      {copied ? "✔ Copied!" : "Copy to clipboard"}
    </button>
  );
}

// inline styles for controls
const s = {
  warn: {
    background: "rgba(255,200,100,0.08)",
    border: "1px solid rgba(255,200,100,0.35)",
    borderRadius: 10,
    padding: "0.85rem 1.25rem",
    fontSize: "0.85rem",
    color: "rgba(255,220,130,0.85)",
    lineHeight: 1.6,
    maxWidth: 640,
    textAlign: "center",
  },

  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.25rem",
    alignItems: "flex-end",
    justifyContent: "center",
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 12,
    padding: "1.1rem 1.5rem",
  },

  ctrlLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    fontSize: "0.76rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(232,201,122,0.6)",
  },

  ctrlInput: {
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(201,168,76,0.28)",
    borderRadius: 8,
    color: "#e8c97a",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.92rem",
    fontWeight: 500,
    padding: "0.45rem 0.75rem",
    outline: "none",
    width: 110,
  },
};
