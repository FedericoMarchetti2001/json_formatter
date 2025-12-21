import React from "react";

interface JsonEditorRowsOverlayProps {
  lineCount: number;
  errorRowSet: Set<number>;
}

export function JsonEditorRowsOverlay({
  lineCount,
  errorRowSet,
}: JsonEditorRowsOverlayProps): React.ReactElement {
  return (
    <div className="json-editor__rows-overlay">
      {Array.from({ length: lineCount }, (_, i) => {
        const lineNo = i + 1;
        const isError = errorRowSet.has(lineNo);
        const striped = i % 2 === 1;
        const className = [
          "json-editor__row",
          "jsonEditorLine",
          striped ? "json-editor__row--striped" : "",
          isError ? "json-editor__row--error" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={lineNo} className={className} aria-hidden="true" />
        );
      })}
    </div>
  );
}

export default JsonEditorRowsOverlay;
