import React, { RefObject, useMemo, useRef, useState } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  rowsWithErrors?: number[];
  editorRef?: RefObject<HTMLTextAreaElement | null>;
}

const LINE_HEIGHT_PX = 22;

/**
 * Minimal JSON editor with line numbers, striping, and error row highlighting.
 */
export function JsonEditor({
  value,
  onChange,
  placeholder,
  rowsWithErrors = [],
  editorRef,
}: JsonEditorProps): React.ReactElement {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const resolvedRef = editorRef ?? internalRef;
  const [scrollTop, setScrollTop] = useState(0);

  const lineCount = Math.max(1, value.split(/\r?\n/).length);
  const errorRowSet = useMemo(() => new Set(rowsWithErrors), [rowsWithErrors]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>): void => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = resolvedRef.current;
      if (!target) return;
      const { selectionStart, selectionEnd } = target;
      const nextValue = `${value.slice(0, selectionStart)}\t${value.slice(selectionEnd)}`;
      onChange(nextValue);
      // Restore caret after update to keep UX consistent.
      requestAnimationFrame(() => {
        const caret = selectionStart + 1;
        resolvedRef.current?.setSelectionRange(caret, caret);
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onChange(e.target.value);
  };

  const overlayStyle: React.CSSProperties = {
    height: lineCount * LINE_HEIGHT_PX,
    transform: `translateY(-${scrollTop}px)`,
    lineHeight: `${LINE_HEIGHT_PX}px`,
  };

  const gutterStyle: React.CSSProperties = {
    transform: `translateY(-${scrollTop}px)`,
    lineHeight: `${LINE_HEIGHT_PX}px`,
  };

  return (
    <div className="json-editor">
      <div className="json-editor__gutter" style={gutterStyle}>
        {Array.from({ length: lineCount }, (_, i) => {
          const lineNo = i + 1;
          const errorClass = errorRowSet.has(lineNo) ? " json-editor__line-number--error" : "";
          return (
            <div
              key={lineNo}
              className={`json-editor__line-number${errorClass}`}
              style={{ height: LINE_HEIGHT_PX }}
            >
              {lineNo}
            </div>
          );
        })}
      </div>
      <div className="json-editor__surface">
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
                style={{ height: LINE_HEIGHT_PX }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <textarea
          ref={resolvedRef}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          wrap="off"
          className="json-editor__textarea"
          style={{ lineHeight: `${LINE_HEIGHT_PX}px` }}
        />
      </div>
    </div>
  );
}

export default JsonEditor;
