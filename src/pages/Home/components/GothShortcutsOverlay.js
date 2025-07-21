import React from "react";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(20, 20, 20, 0.88)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(2px)",
  transition: "opacity 0.2s",
};

const boxStyle = {
  background: "linear-gradient(135deg, #18181b 80%, #2d2d2d 100%)",
  border: "2px solid #7f1d1d",
  borderRadius: "16px",
  boxShadow: "0 0 40px 10px #000000cc, 0 0 0 4px #7f1d1d55",
  padding: "2.5rem 2.5rem 2rem 2.5rem",
  minWidth: "340px",
  maxWidth: "90vw",
  color: "#e5e5e5",
  fontFamily: "'Fira Mono', 'JetBrains Mono', 'Cascadia Code', monospace",
  textShadow: "0 0 4px #000, 0 0 1px #fff1",
  position: "relative",
  borderTop: "6px solid #7f1d1d",
  borderBottom: "6px solid #7f1d1d",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  letterSpacing: "0.1em",
  color: "#fff",
  marginBottom: "1.2rem",
  textAlign: "center",
  fontFamily: "'UnifrakturCook', 'Fira Mono', monospace",
  textShadow: "0 0 8px #7f1d1d, 0 0 2px #fff1",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontSize: "1.15rem",
};

const itemStyle = {
  margin: "0.7em 0",
  display: "flex",
  alignItems: "center",
  gap: "1.2em",
};

const keyStyle = {
  background: "#18181b",
  color: "#7f1d1d",
  border: "1.5px solid #7f1d1d",
  borderRadius: "6px",
  padding: "0.2em 0.7em",
  fontWeight: "bold",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "1.1em",
  boxShadow: "0 0 6px #7f1d1d55",
};

const closeHintStyle = {
  marginTop: "2.2em",
  textAlign: "center",
  color: "#a3a3a3",
  fontSize: "0.95em",
  fontStyle: "italic",
  letterSpacing: "0.04em",
};

import PropTypes from "prop-types";

GothShortcutsOverlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function GothShortcutsOverlay({ visible, onClose }) {
  if (!visible) return null;

  // Prevent scrolling when overlay is open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Dismiss on click outside the box
  const overlayRef = React.useRef();

  const handleClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} ref={overlayRef} onClick={handleClick}>
      <div style={boxStyle}>
        <div style={titleStyle}>Goth Shortcuts</div>
        <ul style={listStyle}>
          <li style={itemStyle}>
            <span style={keyStyle}>Alt + Enter</span>
            <span>Format JSON</span>
          </li>
          <li style={itemStyle}>
            <span style={keyStyle}>Esc</span>
            <span>Show/Hide this shortcuts panel</span>
          </li>
          <li style={itemStyle}>
            <span style={keyStyle}>Tab</span>
            <span>Indent in editor</span>
          </li>
          <li style={itemStyle}>
            <span style={keyStyle}>Ctrl + C</span>
            <span>Copy selected text</span>
          </li>
          <li style={itemStyle}>
            <span style={keyStyle}>Ctrl + V</span>
            <span>Paste</span>
          </li>
        </ul>
        <div style={closeHintStyle}>
          Press <span style={keyStyle}>Esc</span> or click outside to close.<br />
          <span style={{ color: "#7f1d1d" }}>Stay goth, keep coding.</span>
        </div>
      </div>
    </div>
  );
}