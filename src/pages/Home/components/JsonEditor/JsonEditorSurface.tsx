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
}: JsonEditorSurfaceProps): React.ReactElement {
  return (
    <div className="json-editor__surface">
      <JsonEditorRowsOverlay
        lineCount={lineCount}
        errorRowSet={errorRowSet}
      />
      <JsonEditorTextarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
      />
    </div>
  );
}

export default JsonEditorSurface;
