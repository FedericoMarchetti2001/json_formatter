import React, { RefObject } from "react";
import JsonEditorRowsOverlay from "./JsonEditorRowsOverlay";
import JsonEditorTextarea from "./JsonEditorTextarea";

interface JsonEditorSurfaceProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  lineCount: number;
  errorRowSet: Set<number>;
  overlayStyle: React.CSSProperties;
  lineHeightPx: number;
}

export function JsonEditorSurface({
  textareaRef,
  value,
  placeholder,
  onChange,
  onKeyDown,
  onScroll,
  lineCount,
  errorRowSet,
  overlayStyle,
  lineHeightPx,
}: JsonEditorSurfaceProps): React.ReactElement {
  return (
    <div className="json-editor__surface">
      <JsonEditorRowsOverlay
        lineCount={lineCount}
        errorRowSet={errorRowSet}
        overlayStyle={overlayStyle}
        lineHeightPx={lineHeightPx}
      />
      <JsonEditorTextarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        lineHeightPx={lineHeightPx}
      />
    </div>
  );
}

export default JsonEditorSurface;
