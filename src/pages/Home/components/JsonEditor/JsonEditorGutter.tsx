import React from "react";

interface JsonEditorGutterProps {
  lineCount: number;
  errorRowSet: Set<number>;
  gutterStyle: React.CSSProperties;
  lineHeightPx: number;
}

export function JsonEditorGutter({
  lineCount,
  errorRowSet,
  gutterStyle,
  lineHeightPx,
}: JsonEditorGutterProps): React.ReactElement {
  return (
    <div className="json-editor__gutter" style={gutterStyle}>
      {Array.from({ length: lineCount }, (_, i) => {
        const lineNo = i + 1;
        const errorClass = errorRowSet.has(lineNo) ? " json-editor__line-number--error" : "";
        return (
          <div
            key={lineNo}
            className={`json-editor__line-number${errorClass}`}
            style={{ height: lineHeightPx }}
          >
            {lineNo}
          </div>
        );
      })}
    </div>
  );
}

export default JsonEditorGutter;
