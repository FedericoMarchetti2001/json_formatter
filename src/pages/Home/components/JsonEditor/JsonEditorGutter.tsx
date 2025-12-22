import React from "react";

interface JsonEditorGutterProps {
  lineCount: number;
  errorRowSet: Set<number>;
}

export function JsonEditorGutter({
  lineCount,
  errorRowSet,
}: JsonEditorGutterProps): React.ReactElement {
  return (
    <div className="json-editor__gutter jsonEditorGutter">
        {Array.from({ length: lineCount }, (_, i) => {
          const lineNo = i + 1;
          const errorClass = errorRowSet.has(lineNo) ? " json-editor__line-number--error" : "";
          return (
            <div
              key={lineNo}
              className={`json-editor__line-number jsonEditorLineNumber${errorClass}`}
            >
              {lineNo}
            </div>
          );
        })}
    </div>
  );
}

export default JsonEditorGutter;
