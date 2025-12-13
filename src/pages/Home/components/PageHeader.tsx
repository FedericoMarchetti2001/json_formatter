import React from "react";

function PageHeader() {
  return (
    <header className="page-banner">
      <div className="page-banner__wrapper">
        {/* Text Column */}
        <div className="page-banner__text-column">
          <h5 className="page-banner__title">JGoth Validator</h5>
          <p className="page-banner__subtitle">Honestly, I have no clue what I&apos;m doing, I&apos;m just building a JSON validator that somehow rewards you with goth girls.</p>
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
