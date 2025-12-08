import React, { useEffect, useState } from "react";
import { trackAdImpression, trackAdClose, incrementImpressionCount } from "../../../utils/adTracking";

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdModalProps {
  visible: boolean;
  onClose: () => void;
  onAdShown?: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ visible, onClose, onAdShown }) => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [shownTime, setShownTime] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      setCountdown(5);
      setCanClose(false);
      setShownTime(Date.now());
      
      // Track ad impression with utilities
      const impressionCount = incrementImpressionCount();
      trackAdImpression(impressionCount);
      
      if (onAdShown) {
        onAdShown();
      }

      // Initialize Google AdSense ad
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }

      // Start countdown timer
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible, onAdShown]);

  useEffect(() => {
    if (!visible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && canClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [visible, canClose, onClose]);

  if (!visible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canClose) {
      const timeOpen = Date.now() - shownTime;
      trackAdClose(timeOpen);
      onClose();
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(20, 20, 20, 0.95)",
    zIndex: 2500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(3px)",
    transition: "opacity 0.3s",
  };

  const boxStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #18111b 60%, #2d0036 100%)",
    border: "3px solid #a020f0",
    borderRadius: "16px",
    boxShadow:
      "0 0 50px 15px #00000099, 0 0 0 5px #a020f088, 0 8px 32px rgba(160, 32, 240, 0.4)",
    padding: "2rem",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "600px",
    position: "relative",
    animation: "fadeIn 0.3s ease-in",
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: "var(--gothic-heading), 'UnifrakturCook', cursive",
    fontSize: "1.8rem",
    color: "#ff69b4",
    textAlign: "center",
    marginBottom: "1rem",
    textShadow: "0 0 10px #ff69b4aa",
  };

  const adContainerStyle: React.CSSProperties = {
    background: "#1a1a1a",
    border: "2px solid #7f1d1d",
    borderRadius: "8px",
    padding: "1rem",
    minHeight: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.5rem",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: canClose ? "var(--primary-bg-color)" : "#555",
    color: canClose ? "#fff" : "#888",
    border: canClose ? "2px solid #ff69b4" : "2px solid #666",
    borderRadius: "8px",
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
    fontFamily: "var(--gothic-heading), 'UnifrakturCook', cursive",
    cursor: canClose ? "pointer" : "not-allowed",
    transition: "all 0.3s",
    boxShadow: canClose ? "0 0 15px #a8326e88" : "none",
    width: "100%",
    textAlign: "center",
  };

  const countdownStyle: React.CSSProperties = {
    color: "#ff69b4",
    fontSize: "0.9rem",
    textAlign: "center",
    marginBottom: "1rem",
    fontFamily: "var(--font-family)",
  };

  return (
    <div style={overlayStyle} onClick={handleBackdropClick}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <div style={boxStyle}>
        <h2 style={headerStyle}>✦ Support This Dark Corner ✦</h2>

        {/* Ad Container - Google AdSense will be injected here */}
        <div style={adContainerStyle}>
          {/* Google AdSense Ad Unit */}
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "250px" }}
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            data-ad-slot="YOUR_AD_SLOT_ID"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        {/* Countdown or Close Button */}
        {!canClose && (
          <p style={countdownStyle}>
            You can skip this ad in <strong>{countdown}</strong> second{countdown !== 1 ? "s" : ""}...
          </p>
        )}

        <button
          style={closeButtonStyle}
          onClick={() => {
            if (canClose) {
              const timeOpen = Date.now() - shownTime;
              trackAdClose(timeOpen);
              onClose();
            }
          }}
          disabled={!canClose}
          onMouseEnter={(e) => {
            if (canClose) {
              e.currentTarget.style.background = "#ff69b4";
              e.currentTarget.style.color = "#18141a";
              e.currentTarget.style.boxShadow = "0 0 25px #ff69b4aa";
            }
          }}
          onMouseLeave={(e) => {
            if (canClose) {
              e.currentTarget.style.background = "var(--primary-bg-color)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.boxShadow = "0 0 15px #a8326e88";
            }
          }}
        >
          {canClose ? "✦ Close & Continue ✦" : `⏳ Please wait ${countdown}s...`}
        </button>
      </div>
    </div>
  );
};

export default AdModal;
