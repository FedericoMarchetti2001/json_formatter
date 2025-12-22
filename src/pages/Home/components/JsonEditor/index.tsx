import React, { RefObject, useEffect, useMemo, useRef } from "react";
import JsonEditorGutter from "./JsonEditorGutter";
import JsonEditorSurface from "./JsonEditorSurface";
import {
  DEFAULT_EDITOR_FONT_PRESET,
  DEFAULT_EDITOR_LINE_SPACING,
  EditorFontPreset,
  EditorLineSpacing,
} from "../../../../types/editorPreferences";

interface JsonEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  rowsWithErrors?: number[];
  editorRef?: RefObject<HTMLTextAreaElement | null>;
  fontPreset?: EditorFontPreset;
  lineSpacing?: EditorLineSpacing;
}

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
  fontPreset = DEFAULT_EDITOR_FONT_PRESET,
  lineSpacing = DEFAULT_EDITOR_LINE_SPACING,
}: JsonEditorProps): React.ReactElement {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const resolvedRef = editorRef ?? internalRef;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTopRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  const lineCount = Math.max(1, value.split(/\r?\n/).length);
  const errorRowSet = useMemo(() => new Set(rowsWithErrors), [rowsWithErrors]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>): void => {
    scrollTopRef.current = e.currentTarget.scrollTop;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--json-editor-scroll",
          `-${scrollTopRef.current}px`
        );
      }
      scrollRafRef.current = null;
    });
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

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <div className="jsonEditorRoot" data-font={fontPreset} data-spacing={lineSpacing}>
      <div className="json-editor" ref={containerRef}>
        <JsonEditorGutter lineCount={lineCount} errorRowSet={errorRowSet} />
        <JsonEditorSurface
          textareaRef={resolvedRef}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          lineCount={lineCount}
          errorRowSet={errorRowSet}
        />
      </div>
    </div>
  );
}

export default JsonEditor;
