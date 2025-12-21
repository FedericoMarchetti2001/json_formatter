import React from "react";

interface JsonEditorGutterProps {
  lineCount: number;
  errorRowSet: Set<number>;
  scrollTop?: number;
}

export function JsonEditorGutter({
  lineCount,
  errorRowSet,
  scrollTop = 0,
}: JsonEditorGutterProps): React.ReactElement {
  return (
    <div
      className="json-editor__gutter"
      style={{ "--json-editor-scroll": `-${scrollTop}px` } as React.CSSProperties}
    >
      {Array.from({ length: lineCount }, (_, i) => {
        const lineNo = i + 1;
        const errorClass = errorRowSet.has(lineNo) ? " json-editor__line-number--error" : "";
        return (
          <div
            key={lineNo}
            className={`json-editor__line-number${errorClass}`}
          >
            {lineNo}
          </div>
        );
      })}
    </div>
  );
}

export default JsonEditorGutter;
