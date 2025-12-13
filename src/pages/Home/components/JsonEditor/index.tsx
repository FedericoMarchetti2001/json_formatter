import React, { RefObject, useMemo, useRef, useState } from "react";
import JsonEditorGutter from "./JsonEditorGutter";
import JsonEditorSurface from "./JsonEditorSurface";

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
 * Composed of specialized sub-components for better maintainability.
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
      <JsonEditorGutter
        lineCount={lineCount}
        errorRowSet={errorRowSet}
        gutterStyle={gutterStyle}
        lineHeightPx={LINE_HEIGHT_PX}
      />
      <JsonEditorSurface
        textareaRef={resolvedRef}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        lineCount={lineCount}
        errorRowSet={errorRowSet}
        overlayStyle={overlayStyle}
        lineHeightPx={LINE_HEIGHT_PX}
      />
    </div>
  );
}

export default JsonEditor;
