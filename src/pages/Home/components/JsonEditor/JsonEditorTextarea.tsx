import React, { RefObject } from "react";

interface JsonEditorTextareaProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  lineHeightPx: number;
}

export const JsonEditorTextarea = React.forwardRef<
  HTMLTextAreaElement,
  JsonEditorTextareaProps
>(
  (
    { value, placeholder, onChange, onKeyDown, onScroll, lineHeightPx },
    ref
  ): React.ReactElement => {
    return (
      <textarea
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        spellCheck={false}
        wrap="off"
        className="json-editor__textarea"
        style={{ lineHeight: `${lineHeightPx}px` }}
      />
    );
  }
);

JsonEditorTextarea.displayName = "JsonEditorTextarea";

export default JsonEditorTextarea;
