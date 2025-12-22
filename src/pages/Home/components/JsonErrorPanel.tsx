import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, TextField, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { JsonValidationIssue } from "../../../core/json-validator";

export interface JsonErrorPanelProps {
  pageId?: string;
  issues: JsonValidationIssue[];
  rowsWithErrors: number[];
  totalRowsWithErrors: number;
  fallbackMessage?: string;
  isOpen: boolean;
  onToggleOpen: (nextOpen: boolean) => void;
  onJumpToLine?: (line: number) => void;
}

function groupByLine(issues: JsonValidationIssue[]): Record<number, JsonValidationIssue[]> {
  return issues.reduce<Record<number, JsonValidationIssue[]>>((acc, issue) => {
    const lineIssues = acc[issue.line] ?? [];
    lineIssues.push(issue);
    acc[issue.line] = lineIssues;
    return acc;
  }, {});
}

const pluralize = (count: number, singular: string, plural: string): string =>
  count === 1 ? singular : plural;

export function JsonErrorPanel({
  pageId,
  issues,
  rowsWithErrors,
  totalRowsWithErrors,
  fallbackMessage,
  isOpen,
  onToggleOpen,
  onJumpToLine,
}: JsonErrorPanelProps): React.ReactElement {
  const { t } = useTranslation();
  const [filterInput, setFilterInput] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedFilter(filterInput.trim());
    }, 200);

    return () => window.clearTimeout(handle);
  }, [filterInput]);

  const normalizedFilter = debouncedFilter.toLowerCase();

  const filteredIssues = useMemo(() => {
    if (!normalizedFilter) return issues;
    return issues.filter((issue) => {
      const lineText = `${issue.line}`;
      const columnText = `${issue.column}`;
      const messageText = issue.message?.toLowerCase() ?? "";
      const snippetText = issue.snippet?.toLowerCase() ?? "";
      const codeText = issue.code?.toLowerCase() ?? "";
      return (
        lineText.includes(normalizedFilter) ||
        columnText.includes(normalizedFilter) ||
        messageText.includes(normalizedFilter) ||
        snippetText.includes(normalizedFilter) ||
        codeText.includes(normalizedFilter)
      );
    });
  }, [issues, normalizedFilter]);

  const grouped = useMemo(() => groupByLine(filteredIssues), [filteredIssues]);
  const summary =
    totalRowsWithErrors > 0
      ? `${totalRowsWithErrors} ${pluralize(totalRowsWithErrors, "row", "rows")} contain errors`
      : "";
  const emptyStateMessage = fallbackMessage ?? t("JsonErrorPanel.emptyState");
  const hasIssues =
    issues.length > 0 ||
    rowsWithErrors.length > 0 ||
    totalRowsWithErrors > 0 ||
    Boolean(fallbackMessage);

  const lineKeys = useMemo(
    () =>
      Object.keys(grouped)
        .map((line) => Number(line))
        .sort((a, b) => a - b),
    [grouped]
  );

  useEffect(() => {
    setActiveLineIndex(0);
  }, [lineKeys.length, normalizedFilter]);

  const jumpToLine = useCallback(
    (line: number): void => {
      if (!onJumpToLine) return;
      onJumpToLine(line);
    },
    [onJumpToLine]
  );

  const jumpToIndex = useCallback(
    (nextIndex: number): void => {
      if (!lineKeys.length) return;
      const next = Math.min(Math.max(nextIndex, 0), lineKeys.length - 1);
      const line = lineKeys[next];
      if (typeof line !== "number") return;
      setActiveLineIndex(next);
      jumpToLine(line);
    },
    [jumpToLine, lineKeys]
  );

  const handleNextError = useCallback((): void => {
    if (!lineKeys.length) return;
    const nextIndex = (activeLineIndex + 1) % lineKeys.length;
    jumpToIndex(nextIndex);
  }, [activeLineIndex, jumpToIndex, lineKeys.length]);

  const handlePreviousError = useCallback((): void => {
    if (!lineKeys.length) return;
    const nextIndex = (activeLineIndex - 1 + lineKeys.length) % lineKeys.length;
    jumpToIndex(nextIndex);
  }, [activeLineIndex, jumpToIndex, lineKeys.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "F8") return;
      event.preventDefault();
      if (event.shiftKey) {
        handlePreviousError();
      } else {
        handleNextError();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextError, handlePreviousError]);

  const badgeValue = totalRowsWithErrors > 0 ? totalRowsWithErrors : rowsWithErrors.length;
  const showNoMatches = normalizedFilter.length > 0 && lineKeys.length === 0;

  return (
    <div className="json-error-panel" aria-live="polite" data-page-id={pageId ?? ""}>
      <div className="gothSidebarHeader">
        <div className="gothSidebarActions">
          <Tooltip
            title={t(
              isOpen
                ? "JsonErrorPanel.close"
                : hasIssues
                  ? "JsonErrorPanel.expand"
                  : "JsonErrorPanel.noErrors"
            )}
          >
            <IconButton
              aria-label={t(
                isOpen
                  ? "JsonErrorPanel.close"
                  : hasIssues
                    ? "JsonErrorPanel.expand"
                    : "JsonErrorPanel.noErrors"
              )}
              onClick={() => onToggleOpen(!isOpen)}
              size="small"
            >
              {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Tooltip>
          <span className="gothSidebarBadge">{badgeValue}</span>
          {isOpen && (
            <div className="gothSidebarActions gothSidebarActions--nav">
              <Tooltip title={t("JsonErrorPanel.previousError")}>
                <span>
                  <IconButton
                    aria-label={t("JsonErrorPanel.previousError")}
                    onClick={handlePreviousError}
                    size="small"
                    disabled={lineKeys.length === 0}
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t("JsonErrorPanel.nextError")}>
                <span>
                  <IconButton
                    aria-label={t("JsonErrorPanel.nextError")}
                    onClick={handleNextError}
                    size="small"
                    disabled={lineKeys.length === 0}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <>
          {summary && <div className="json-error-panel__summary">{summary}</div>}
          <TextField
            className="gothSidebarFilter"
            size="small"
            placeholder={t("JsonErrorPanel.filterPlaceholder")}
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            inputProps={{ "aria-label": t("JsonErrorPanel.filterPlaceholder") }}
          />
          {showNoMatches && (
            <div className="json-error-panel__empty">{t("JsonErrorPanel.noMatches")}</div>
          )}
          <div className="json-error-panel__list">
            {lineKeys.map((line) => {
              const lineIssues = grouped[line] ?? [];
              return (
                <div key={line} className="json-error-panel__line-group">
                  <button
                    type="button"
                    className="json-error-panel__line-button"
                    onClick={() => jumpToLine(line)}
                  >
                    {t("JsonErrorPanel.lineLabel", { line })}
                  </button>
                  <ul className="json-error-panel__items">
                    {lineIssues.map((issue: JsonValidationIssue, idx: number) => (
                      <li key={`${issue.index}-${idx}`} className="json-error-panel__item">
                        <button
                          type="button"
                          className="json-error-panel__item-button"
                          onClick={() => jumpToLine(line)}
                        >
                          <span className="json-error-panel__badge">
                            {t("JsonErrorPanel.columnLabel", { column: issue.column })}
                            {issue.code ? ` | ${issue.code}` : ""}
                          </span>
                          <span className="json-error-panel__message">{issue.message}</span>
                          {issue.snippet ? (
                            <span className="json-error-panel__snippet">...{issue.snippet}...</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          {rowsWithErrors.length > 0 && (
            <div className="json-error-panel__legend">{t("JsonErrorPanel.legend")}</div>
          )}
        </>
      )}
      {isOpen && !showNoMatches && !issues.length && (
        <div className="json-error-panel__empty">{emptyStateMessage}</div>
      )}
    </div>
  );
}

export default JsonErrorPanel;
