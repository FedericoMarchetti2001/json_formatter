import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import localStorageHandler from "../../utils/localStorageHandler";
// @mui material components
import Container from "@mui/material/Container";
import Grid2 from "@mui/material/Unstable_Grid2";

// Custom components
import FormatterAction from "./components/FormatterActions/FormatterActions";
import ViewerActions from "./components/ViewerActions/ViewerActions";
import InputOutputSection from "./components/InputOutputSection";
import JsonErrorPanel from "./components/JsonErrorPanel";
import GothControlPanel from "./components/GothControlPanel";
import CenteredImageViewer from "./components/CenteredImageViewer";
import GothShortcutsOverlay from "./components/GothShortcutsOverlay";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import FeaturesSection from "./components/FeaturesSection";

// Other components
import FormatterPagination from "./components/Pagination";
import { Box } from "@mui/material";
import { JsonValidationResult } from "../../core/json-validator";
import {
  createPageId,
  EMPTY_VALIDATION_RESULT,
  ensureValidationByPageId,
  PageId,
  syncPageIds,
  ValidationByPageId,
} from "./pageState";

function Presentation(): React.ReactElement {
  // Refs for the editor and JsonView components to enable scrolling
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const jsonViewRef = useRef<HTMLDivElement | null>(null);
  const errorOverlayRef = useRef<HTMLDivElement | null>(null);

  // Pagination logic: state for managing multiple pages of text input
  const [textArray, setTextArray] = useState<string[]>(() => {
    const saved = localStorageHandler.getPageContent<unknown>("textArray");
    return Array.isArray(saved) ? (saved as string[]) : [""];
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Formatted text: state for managing multiple pages of formatted JSON output
  const [formattedTextArray, setFormattedTextArray] = useState<string[]>(() => {
    const saved = localStorageHandler.getPageContent<unknown>("formattedTextArray");
    return Array.isArray(saved) ? (saved as string[]) : [""];
  });

  // Stable IDs per page (so error state won't break if reordering is added later)
  const [pageIds, setPageIds] = useState<PageId[]>(() => {
    const savedText = localStorageHandler.getPageContent<unknown>("textArray");
    const pageCount = Array.isArray(savedText) ? savedText.length : 1;
    const storedIds = localStorageHandler.getPageContent<unknown>("pageIds");
    return syncPageIds(storedIds, pageCount);
  });

  // Page-scoped validation results
  const [validationByPageId, setValidationByPageId] = useState<ValidationByPageId>(() => {
    const initial: ValidationByPageId = {};
    for (const id of pageIds) {
      initial[id] = EMPTY_VALIDATION_RESULT;
    }
    return initial;
  });
  const [, setGenericError] = useState<string>("");

  // Defensive sync: keep pageIds and validation store aligned to page count
  useEffect(() => {
    setPageIds((prevIds) => {
      const nextIds = syncPageIds(prevIds, textArray.length);
      setValidationByPageId((prevValidation) => ensureValidationByPageId(nextIds, prevValidation));
      return nextIds;
    });
  }, [textArray.length]);

  // Ensure currentPage is always valid
  useEffect(() => {
    if (currentPage < 1) {
      setCurrentPage(1);
      return;
    }
    if (currentPage > textArray.length) {
      setCurrentPage(Math.max(1, textArray.length));
    }
  }, [currentPage, textArray.length]);

  // Persist page content arrays + ids to localStorage
  useEffect(() => {
    localStorageHandler.setPageContent("textArray", textArray);
  }, [textArray]);

  useEffect(() => {
    localStorageHandler.setPageContent("formattedTextArray", formattedTextArray);
  }, [formattedTextArray]);

  useEffect(() => {
    localStorageHandler.setPageContent("pageIds", pageIds);
  }, [pageIds]);

  // Seed first page with sample data from mock_data.json when nothing is stored yet
  useEffect(() => {
    const saved = localStorageHandler.getPageContent<unknown>("textArray");
    const hasSavedContent =
      Array.isArray(saved) &&
      (saved as unknown[]).some((entry) => typeof entry === "string" && entry.trim().length > 0);

    if (hasSavedContent) return;

    const loadSample = async (): Promise<void> => {
      try {
        const response = await fetch("/mock_data.json");
        if (!response.ok) throw new Error(`Failed to fetch sample data: ${response.status}`);
        const sample = await response.json();
        const sampleString = JSON.stringify(sample, null, 2);

        const id = createPageId();
        setTextArray([sampleString]);
        setFormattedTextArray([sampleString]);
        setPageIds([id]);
        setValidationByPageId({ [id]: EMPTY_VALIDATION_RESULT });
        setCurrentPage(1);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading sample data:", error);
      }
    };

    loadSample();
  }, []);

  // Active page + validation bucket (defensive)
  const activePageIndex = Math.min(Math.max(currentPage, 1), Math.max(textArray.length, 1));
  const activePageId: PageId | undefined = pageIds[activePageIndex - 1];

  const activeValidation: JsonValidationResult = activePageId
    ? validationByPageId[activePageId] ?? EMPTY_VALIDATION_RESULT
    : EMPTY_VALIDATION_RESULT;

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const prefs = localStorageHandler.getPreferences();
    return prefs.jsonTheme || "monokai";
  });

  // Save theme to preferences when changed
  useEffect(() => {
    localStorageHandler.updatePreference("jsonTheme", selectedTheme);
  }, [selectedTheme]);

  // Shortcuts overlay state: controls the visibility of the shortcuts overlay
  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState<boolean>(false);

  // ESC key handler for overlay: toggles the shortcuts overlay visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setShowShortcutsOverlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Achievement State: manages unlocked achievements and their corresponding images
  const [achievements, setAchievements] = useState<{ unlocked: string[]; images: string[] }>({
    unlocked: [],
    images: [],
  });

  // State for centered image viewer
  const [isImageCentered, setIsImageCentered] = useState<boolean>(false);
  const [centeredImageUrl, setCenteredImageUrl] = useState<string>("");

  // Load achievements from localStorage on component mount
  useEffect(() => {
    const loaded = localStorageHandler.getAchievements();
    if (loaded && Array.isArray(loaded.unlocked) && Array.isArray(loaded.images)) {
      setAchievements(loaded);
      // eslint-disable-next-line no-console
      console.log("Achievements loaded from localStorage.");
    } else if (loaded) {
      // eslint-disable-next-line no-console
      console.error("Invalid data format in localStorage for achievements.");
    }
  }, []);

  // Save achievements to localStorage whenever the state changes
  useEffect(() => {
    localStorageHandler.setAchievements(achievements);
    // eslint-disable-next-line no-console
    console.log("Achievements saved to localStorage.");
  }, [achievements]);

  // Function to export achievements to a JSON file
  const exportAchievements = (): void => {
    const dataStr = JSON.stringify(achievements, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "achievements.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to import achievements from a JSON file
  const importAchievements = (data: string): void => {
    try {
      const importedData: unknown = JSON.parse(data);
      const isAchievements = (value: unknown): value is { unlocked: string[]; images: string[] } => {
        if (!value || typeof value !== "object") return false;
        const obj = value as Record<string, unknown>;
        return (
          Array.isArray(obj.unlocked) &&
          (obj.unlocked as unknown[]).every((v) => typeof v === "string") &&
          Array.isArray(obj.images) &&
          (obj.images as unknown[]).every((v) => typeof v === "string")
        );
      };

      if (isAchievements(importedData)) {
        setAchievements(importedData);
        // eslint-disable-next-line no-console
        console.log("Achievements imported successfully!");
      } else {
        // eslint-disable-next-line no-console
        console.error("Invalid achievement file format.");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing achievement data:", error);
    }
  };

  // GOTH THEME: State for toggling sound and AI voice
  const [gothSentence, setGothSentence] = useState<string>("");
  const [enablePlaySound, setEnablePlaySound] = useState<boolean>(() => {
    const prefs = localStorageHandler.getPreferences();
    return typeof prefs.enablePlaySound === "boolean" ? prefs.enablePlaySound : true;
  });
  const [enableAIVoice, setEnableAIVoice] = useState<boolean>(() => {
    const prefs = localStorageHandler.getPreferences();
    return typeof prefs.enableAIVoice === "boolean" ? prefs.enableAIVoice : true;
  });
  const [gothConvertResult, setGothConvertResult] = useState<{ success: boolean } | null>(null);

  // Persist audio preferences on change
  useEffect(() => {
    localStorageHandler.updatePreference("enablePlaySound", enablePlaySound);
  }, [enablePlaySound]);

  useEffect(() => {
    localStorageHandler.updatePreference("enableAIVoice", enableAIVoice);
  }, [enableAIVoice]);

  // Update textArray when text changes
  const handleTextChange = (newText: string): void => {
    setTextArray((prevArray) => {
      const next = [...prevArray];
      next[activePageIndex - 1] = newText;
      return next;
    });

    if (activePageId) {
      setValidationByPageId((prev) => ({ ...prev, [activePageId]: EMPTY_VALIDATION_RESULT }));
    }
  };

  // Update formattedTextArray when formatted text changes
  const handleFormattedTextChange = (newFormattedText: string): void => {
    setFormattedTextArray((prevArray) => {
      const next = [...prevArray];
      next[activePageIndex - 1] = newFormattedText;
      return next;
    });
  };

  // Validation writer (page-scoped)
  const setValidationResultForPage = (pageId: PageId, result: JsonValidationResult): void => {
    setValidationByPageId((prev) => ({ ...prev, [pageId]: result }));
  };

  // Handler for after conversion to trigger GothSection effects
  const handleConvert = ({ success }: { success: boolean }): void => {
    setGothConvertResult({ success });
  };

  // Handler for clicking on an achievement image to display it centered
  const handleAchievementImageClick = (imageUrl: string): void => {
    setCenteredImageUrl(imageUrl);
    setIsImageCentered(true);
  };

  // Handler to close the centered image viewer
  const handleCenteredImageClose = (): void => {
    setIsImageCentered(false);
    setCenteredImageUrl("");
  };

  // Function to add a new page
  const handleAddPage = (): void => {
    const newId = createPageId();

    setTextArray((prev) => {
      const next = [...prev, ""];
      setCurrentPage(next.length);
      return next;
    });
    setFormattedTextArray((prev) => [...prev, ""]);
    setPageIds((prev) => [...prev, newId]);
    setValidationByPageId((prev) => ({ ...prev, [newId]: EMPTY_VALIDATION_RESULT }));
  };

  // Function to delete a page (1-based)
  const handleDeletePage = (pageToDelete: number): void => {
    if (textArray.length <= 1) return;

    const deleteIndex = pageToDelete - 1;
    const deletedId = pageIds[deleteIndex];

    const nextTextArray = textArray.filter((_, index) => index !== deleteIndex);
    const nextFormattedTextArray = formattedTextArray.filter((_, index) => index !== deleteIndex);
    const nextPageIds = pageIds.filter((_, index) => index !== deleteIndex);

    setTextArray(nextTextArray);
    setFormattedTextArray(nextFormattedTextArray);
    setPageIds(nextPageIds);

    setValidationByPageId((prev) => {
      const next: ValidationByPageId = { ...prev };
      if (deletedId) {
        delete next[deletedId];
      }
      return ensureValidationByPageId(nextPageIds, next);
    });

    // If the deleted page was the active page: choose previous if exists, else next.
    if (currentPage === pageToDelete) {
      setCurrentPage(Math.max(1, pageToDelete - 1));
    } else if (currentPage > pageToDelete) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Effect to handle clicks on the window for scrolling to specific sections
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent): void => {
      const isInteractiveElement = (element: HTMLElement | null): boolean => {
        if (!element || element === document.body) return false;
        const tagName = element.tagName;
        return (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "BUTTON" ||
          tagName === "A" ||
          element.hasAttribute("role") ||
          element.hasAttribute("tabindex") ||
          element.onclick != null
        );
      };

      let currentElement = e.target as HTMLElement | null;
      while (currentElement && currentElement !== document.body) {
        if (isInteractiveElement(currentElement)) {
          return;
        }
        currentElement = currentElement.parentElement;
      }

      if (!document.activeElement || document.activeElement === document.body) {
        const viewportHeight = window.innerHeight;
        const clickY = e.clientY;

        if (clickY < viewportHeight / 2) {
          textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          jsonViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const issues = useMemo(() => activeValidation.issues ?? [], [activeValidation.issues]);
  const rowsWithErrors = useMemo(
    () => activeValidation.rowsWithErrors ?? [],
    [activeValidation.rowsWithErrors]
  );
  const totalRowsWithErrors = useMemo(
    () => activeValidation.totalRowsWithErrors ?? rowsWithErrors.length,
    [activeValidation.totalRowsWithErrors, rowsWithErrors.length]
  );
  const validationError = useMemo(() => activeValidation.error?.message, [activeValidation.error]);
  const hasErrorsToShow = issues.length > 0 || Boolean(validationError);

  useLayoutEffect(() => {
    if (!hasErrorsToShow) return;

    let rafId = 0;

    const updateOverlayPosition = (): void => {
      const editorElement = textareaRef.current?.closest(".json-editor") as HTMLElement | null;
      const overlayElement = errorOverlayRef.current;
      if (!editorElement || !overlayElement) return;

      const editorRect = editorElement.getBoundingClientRect();
      const overlayWidth = overlayElement.offsetWidth;
      const gap = 16;
      const left = Math.max(16, editorRect.left - overlayWidth - gap);

      overlayElement.style.setProperty("--json-error-overlay-left", `${left}px`);
      overlayElement.style.setProperty("--json-error-overlay-top", `${editorRect.top}px`);
      overlayElement.style.setProperty("--json-error-overlay-height", `${editorRect.height}px`);
    };

    const scheduleUpdate = (): void => {
      rafId = window.requestAnimationFrame(updateOverlayPosition);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(rafId);
    };
  }, [hasErrorsToShow]);

  return (
    <div className="home-container">
      <GothShortcutsOverlay
        visible={showShortcutsOverlay}
        onClose={() => setShowShortcutsOverlay(false)}
      />
      <PageHeader />
      <Box className="body-content">
        {hasErrorsToShow && (
          <Box ref={errorOverlayRef} className="json-error-overlay" aria-live="polite">
            <JsonErrorPanel
              pageId={activePageId ?? ""}
              issues={issues}
              rowsWithErrors={rowsWithErrors}
              totalRowsWithErrors={totalRowsWithErrors}
              fallbackMessage={validationError}
            />
          </Box>
        )}
        <Container className="home-content-container">
          <Grid2
            container
            xs={12}
            lg={12}
            justifyContent="center"
            mx="auto"
            className="home-main-grid"
          >
            <Grid2 xs={10} container direction="column" alignItems="stretch">
              <Box className="control-panel-with-pagination">
                <GothControlPanel
                  enablePlaySound={enablePlaySound}
                  setEnablePlaySound={setEnablePlaySound}
                  enableAIVoice={enableAIVoice}
                  setEnableAIVoice={setEnableAIVoice}
                  onConvert={gothConvertResult}
                  setGothSentence={setGothSentence}
                  gothSentence={gothSentence}
                  onExportAchievements={exportAchievements}
                  onImportAchievements={importAchievements}
                  achievements={achievements}
                  setAchievements={setAchievements}
                />
                <FormatterPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPageCount={textArray.length}
                  onAddPage={handleAddPage}
                  onDeletePage={handleDeletePage}
                  achievements={achievements}
                  setAchievements={setAchievements}
                />
              </Box>

              <InputOutputSection
                text={textArray[activePageIndex - 1] ?? ""}
                handleTextChange={handleTextChange}
                formattedText={formattedTextArray[activePageIndex - 1] ?? ""}
                gothSentence={gothSentence}
                unlockedImages={achievements.images}
                onImageClick={handleAchievementImageClick}
                editorRef={textareaRef}
                jsonViewRef={jsonViewRef}
                rowsWithErrors={rowsWithErrors}
                onDeletePage={() => handleDeletePage(currentPage)}
                selectedTheme={selectedTheme}
              />
            </Grid2>

            <Grid2 xs={2} container direction="column" className="home-actions-column">
              <Box className="spacer" aria-hidden="true" />

              <Box className="action-panel-group" aria-hidden="true">
                <FormatterAction
                  pageId={activePageId ?? ""}
                  textToManage={textArray[activePageIndex - 1] ?? ""}
                  setTextToManage={handleTextChange}
                  setValidationResultForPage={setValidationResultForPage}
                  setGenericError={setGenericError}
                  processedText={formattedTextArray[activePageIndex - 1] ?? ""}
                  setProcessedText={handleFormattedTextChange}
                  onConvert={handleConvert}
                  achievements={achievements}
                  setAchievements={setAchievements}
                />
                <Box className="double-spacer" aria-hidden="true" />
                <ViewerActions selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      <FeaturesSection />

      <CenteredImageViewer
        imageUrl={centeredImageUrl}
        isOpen={isImageCentered}
        onClose={handleCenteredImageClose}
      />
      <PageFooter />
    </div>
  );
}

export default Presentation;
