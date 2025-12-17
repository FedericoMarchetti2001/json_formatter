import React, { useEffect, useMemo, RefObject, useRef, JSX } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import GothAchievementsGallery from "./GothAchievementsGallery";
import SentenceDisplay from "./SentenceDisplay";
import JsonView from "react-json-view";
import JsonEditor from "./JsonEditor";

interface InputOutputSectionProps {
  text: string;
  handleTextChange: (text: string) => void;
  formattedText: string;
  gothSentence?: string;
  unlockedImages: string[];
  onImageClick: (image: string) => void;
  editorRef?: RefObject<HTMLTextAreaElement | null>;
  jsonViewRef: RefObject<HTMLDivElement | null>;
  rowsWithErrors?: number[];
  onDeletePage: () => void;
  selectedTheme: string;
}

const scrollAreaStyle: React.CSSProperties = {
  flexGrow: 5,
  overflow: "auto",
  border: "1px solid transparent",
};

function InputOutputSection({
  text,
  handleTextChange,
  formattedText,
  gothSentence,
  unlockedImages,
  onImageClick,
  editorRef,
  jsonViewRef,
  rowsWithErrors,
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

  const errorLines = useMemo(() => rowsWithErrors ?? [], [rowsWithErrors]);

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
