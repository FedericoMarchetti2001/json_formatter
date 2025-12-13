import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";

import Presentation from "pages/Home";

//Vercel Analytics
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Inject JSON-LD structured data for SoftwareApplication
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "SoftwareApplication",
      name: "JGoth Validator",
      alternateName: "JGoth JSON Validator",
      description: "A free, open-source JSON formatter and validator with detailed error reporting, multi-page document support, and a unique goth aesthetic. No backend required—runs entirely in your browser.",
      url: "https://jgothvalidator.com/",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      featureList: [
        "Real-time JSON validation with detailed error messages",
        "Multi-page document support with pagination",
        "Multiple JSON viewer themes (monokai, apathy, bright, etc.)",
        "Indentation control (2, 4, 6, 8 spaces)",
        "Copy formatted JSON to clipboard",
        "Upload JSON files from your computer",
        "Clear formatting and start fresh",
        "Achievement system for gamification",
        "Dark goth/emo theme with custom aesthetic",
        "Client-side only—all data stays on your device"
      ],
      image: "https://jgothvalidator.com/og/jgoth-validator.og.png",
      author: {
        "@type": "Organization",
        name: "JGoth Validator"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="App">
      {/* Render the routes */}
      <CssBaseline />
      <SpeedInsights />
      <Analytics />
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
