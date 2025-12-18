import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function GothShortcutsOverlay({ visible, onClose }) {
  if (!visible) return null;

  const overlayRef = React.useRef();
  const { t } = useTranslation();

  const handleClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div className="goth-shortcuts-overlay__backdrop" ref={overlayRef} onClick={handleClick}>
      <div className="goth-shortcuts-overlay__box">
        <div className="goth-shortcuts-overlay__title">
          {t("GothShortcutsOverlay.title", "Goth Shortcuts")}
        </div>
        <ul className="goth-shortcuts-overlay__list">
          <li className="goth-shortcuts-overlay__item">
            <span className="goth-shortcuts-overlay__key">Alt + Enter</span>
            <span>{t("GothShortcutsOverlay.format", "Format JSON")}</span>
          </li>
          <li className="goth-shortcuts-overlay__item">
            <span className="goth-shortcuts-overlay__key">Tab</span>
            <span>{t("GothShortcutsOverlay.indent", "Indent in editor")}</span>
          </li>
        </ul>
        <div className="goth-shortcuts-overlay__close-hint">
          {t("GothShortcutsOverlay.closeHintPrefix", "Press")}{" "}
          <span className="goth-shortcuts-overlay__key">Esc</span>{" "}
          {t("GothShortcutsOverlay.closeHintSuffix", "or click outside to close.")}
          <br /> <br />
          <span className="goth-shortcuts-overlay__accent-text">
            {t("GothShortcutsOverlay.stayGoth", "Stay goth, keep coding.")}
          </span>
        </div>
      </div>
    </div>
  );
}

GothShortcutsOverlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GothShortcutsOverlay;
