import React, { useEffect, useMemo, RefObject, useRef, JSX } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import GothAchievementsGallery from "./GothAchievementsGallery";
import SentenceDisplay from "./SentenceDisplay";
import JsonView from "react-json-view";
import { JsonValidationIssue } from "../../../core/json-validator";
import JsonEditor from "./JsonEditor";
import JsonErrorPanel from "./JsonErrorPanel";

interface InputOutputSectionProps {
  activePageId: string;
  text: string;
  handleTextChange: (text: string) => void;
  formattedText: string;
  gothSentence?: string;
  unlockedImages: string[];
  onImageClick: (image: string) => void;
  editorRef?: RefObject<HTMLTextAreaElement | null>;
  jsonViewRef: RefObject<HTMLDivElement | null>;
  validationIssues?: JsonValidationIssue[];
  rowsWithErrors?: number[];
  totalRowsWithErrors?: number;
  validationError?: string;
  onDeletePage: () => void;
  selectedTheme: string;
}

const scrollAreaStyle: React.CSSProperties = {
  flexGrow: 5,
  overflow: "auto",
  border: "1px solid transparent",
};

function InputOutputSection({
  activePageId,
  text,
  handleTextChange,
  formattedText,
  gothSentence,
  unlockedImages,
  onImageClick,
  editorRef,
  jsonViewRef,
  validationIssues,
  rowsWithErrors,
  totalRowsWithErrors,
  validationError,
  onDeletePage,
  selectedTheme,
}: InputOutputSectionProps): JSX.Element {
  const { t } = useTranslation();
  const [parsedJson, setParsedJson] = React.useState<object | null>(null);
  const fallbackEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const resolvedEditorRef = editorRef ?? fallbackEditorRef;

  type JsonViewTheme = "monokai" | "apathy" | "bright";
  const resolvedTheme: JsonViewTheme =
    selectedTheme === "apathy" || selectedTheme === "bright" ? selectedTheme : "monokai";

  useEffect(() => {
    try {
      const json = JSON.parse(formattedText);
      setParsedJson(json);
    } catch (error) {
      setParsedJson(null);
    }
  }, [formattedText]);

  const issues = useMemo(() => validationIssues ?? [], [validationIssues]);
  const errorLines = useMemo(() => rowsWithErrors ?? [], [rowsWithErrors]);
  const errorLineCount = useMemo(
    () => totalRowsWithErrors ?? errorLines.length,
    [totalRowsWithErrors, errorLines.length]
  );

  return (
    <Box
      className="input-output-section"
      onKeyDown={(event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          const activeElement = document.activeElement as HTMLElement | null;
          if (
            activeElement &&
            activeElement.tagName !== "TEXTAREA" &&
            activeElement.tagName !== "INPUT"
          ) {
            event.preventDefault();
            onDeletePage();
          }
        }
      }}
      tabIndex={0}
    >
      <JsonEditor
        value={text}
        onChange={handleTextChange}
        placeholder={t("InputOutputSection.placeholder")}
        rowsWithErrors={errorLines}
        editorRef={resolvedEditorRef}
      />

      <Box className="indirect-output-section">
        <JsonErrorPanel
          pageId={activePageId}
          issues={issues}
          rowsWithErrors={errorLines}
          totalRowsWithErrors={errorLineCount}
          fallbackMessage={validationError}
        />

        <GothAchievementsGallery unlockedImages={unlockedImages} onImageClick={onImageClick} />
        <SentenceDisplay sentence={gothSentence || ""} />
      </Box>

      <Box ref={jsonViewRef} style={{ ...scrollAreaStyle }}>
        <JsonView
          src={parsedJson ?? {}}
          name={false}
          collapsed={false}
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
          style={{ width: "100%", overflow: "auto" }}
          theme={resolvedTheme}
        />
      </Box>
    </Box>
  );
}

export default InputOutputSection;
