import React from "react";
import { JsonValidationIssue } from "../../../core/json-validator";

export interface JsonErrorPanelProps {
  pageId?: string;
  issues: JsonValidationIssue[];
  rowsWithErrors: number[];
  totalRowsWithErrors: number;
  fallbackMessage?: string;
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
}: JsonErrorPanelProps): React.ReactElement | null {
  if (!issues?.length && !fallbackMessage) {
    return null;
  }

  const grouped = groupByLine(issues);
  const summary =
    totalRowsWithErrors > 0
      ? `${totalRowsWithErrors} ${pluralize(totalRowsWithErrors, "row", "rows")} contain errors`
      : fallbackMessage ?? "";

  const lineKeys = Object.keys(grouped)
    .map((line) => Number(line))
    .sort((a, b) => a - b);

  return (
    <div className="json-error-panel" aria-live="polite" data-page-id={pageId ?? ""}>
      {summary && <div className="json-error-panel__summary">{summary}</div>}
      <div className="json-error-panel__list">
        {lineKeys.map((line) => {
          const lineIssues = grouped[line] ?? [];
          return (
            <div key={line} className="json-error-panel__line-group">
              <div className="json-error-panel__line-label">Line {line}</div>
            <ul className="json-error-panel__items">
                {lineIssues.map((issue: JsonValidationIssue, idx: number) => (
                  <li key={`${issue.index}-${idx}`} className="json-error-panel__item">
                    <span className="json-error-panel__badge">
                      col {issue.column}
                      {issue.code ? ` · ${issue.code}` : ""}
                    </span>
                    <span className="json-error-panel__message">{issue.message}</span>
                    {issue.snippet ? (
                      <span className="json-error-panel__snippet">…{issue.snippet}…</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {rowsWithErrors.length > 0 && (
        <div className="json-error-panel__legend">
          Rows highlighted in the editor match the errors listed above.
        </div>
      )}
    </div>
  );
}

export default JsonErrorPanel;
