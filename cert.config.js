/**
 * NSS IITP Certificate Configuration
 *
 * name.x / name.y are fractions of the certificate image
 * size (0.0 – 1.0). They anchor the center of the name text.
 *
 * To re-calibrate: run `npm run dev` and open /calibrate.
 */

const CERT_CONFIG = {

  // name position
  name: {
    x: 0.521,        // exact centre of the underline measured via script
    y: 0.347,        // vertical centre of the underline (calibrated from live test)
    align: "center",
    baseline: "middle",
  },

  // font config
  font: {
    // Must match a font loaded in app/layout.jsx
    family: "EB Garamond",

    // Fallback if the web-font is unavailable
    fallback: "Georgia, 'Times New Roman', serif",

    // smart font-size rules
    // At the full export resolution (1920×1357 px approx) the
    // underline fits a ~38% wide strip. These rules make the
    // name look neither too big nor too small:
    //
    //   maxSize   – absolute ceiling (short names won't bloat)
    //   minSize   – floor before text would be illegible
    //   shrinkStep – pixels to reduce per iteration when too wide
    maxSize: 52,         // never bigger than this (feels natural for short names)
    minSize: 18,         // lowered to 18 so it naturally shrinks before horizontal condensing kicks in
    shrinkStep: 1,       // granular shrinking for smooth fit

    fontWeight: "600",   // 400 regular | 600 semibold | 700 bold

    // Match the dark-navy body text colour of the certificate
    color: "#1a2a5a",

    // The name text will not be wider than this fraction of the cert width
    // (matches the verified physical length of the underline on the template: 35%)
    maxWidthFraction: 0.35,
  },

};

export default CERT_CONFIG;


