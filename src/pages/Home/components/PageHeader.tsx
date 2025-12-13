import React from "react";
import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();

  return (
    <header className="page-banner">
      <div className="page-banner__wrapper">
        {/* Text Column */}
        <div className="page-banner__text-column">
          <h1 className="page-banner__title">
            {t("header.title", "JSON Formatter & Validator")}
          </h1>
          <p className="page-banner__subtitle">
            {t("header.subtitle", "Format, validate, and beautify JSON instantly with detailed error reporting and a unique goth aesthetic")}
          </p>
        </div>

        {/* Logo Column */}
        {/* <div className="page-banner__logo-column">
          <img src="/jg-favicon.svg" alt="JGoth Validator Logo" className="page-banner__logo" />
        </div> */}
      </div>
    </header>
  );
}

export default PageHeader;
