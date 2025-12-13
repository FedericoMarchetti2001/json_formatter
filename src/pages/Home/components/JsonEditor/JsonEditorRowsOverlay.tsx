import React from "react";

interface JsonEditorRowsOverlayProps {
  lineCount: number;
  errorRowSet: Set<number>;
  overlayStyle: React.CSSProperties;
  lineHeightPx: number;
}

export function JsonEditorRowsOverlay({
  lineCount,
  errorRowSet,
  overlayStyle,
  lineHeightPx,
}: JsonEditorRowsOverlayProps): React.ReactElement {
  return (
    <div className="json-editor__rows-overlay" style={overlayStyle}>
      {Array.from({ length: lineCount }, (_, i) => {
        const lineNo = i + 1;
        const isError = errorRowSet.has(lineNo);
        const striped = i % 2 === 1;
        const className = [
          "json-editor__row",
          striped ? "json-editor__row--striped" : "",
          isError ? "json-editor__row--error" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={lineNo}
            className={className}
            style={{ height: lineHeightPx }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default JsonEditorRowsOverlay;
