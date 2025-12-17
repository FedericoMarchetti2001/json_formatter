import { JsonValidationResult } from "../../core/json-validator";

export type PageId = string;

export const EMPTY_VALIDATION_RESULT: JsonValidationResult = {
  valid: true,
  issues: [],
  rowsWithErrors: [],
  totalRowsWithErrors: 0,
};

export function createPageId(): PageId {
  // Prefer a stable UUID when available.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `page_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/**
 * Ensures there are exactly `pageCount` IDs.
 * - Reuses existing IDs when possible.
 * - Generates new IDs for missing slots.
 * - Truncates extra IDs.
 */
export function syncPageIds(
  existingIds: unknown,
  pageCount: number,
  generateId: () => PageId = createPageId
): PageId[] {
  const safeCount = Math.max(1, pageCount);
  const base = isStringArray(existingIds) ? existingIds : [];

  if (base.length === safeCount) {
    return base as PageId[];
  }

  const next: PageId[] = base.slice(0, safeCount) as PageId[];
  while (next.length < safeCount) {
    next.push(generateId());
  }
  return next;
}

export type ValidationByPageId = Record<PageId, JsonValidationResult>;

export function ensureValidationByPageId(
  pageIds: PageId[],
  previous: ValidationByPageId
): ValidationByPageId {
  const next: ValidationByPageId = {};
  for (const id of pageIds) {
    next[id] = previous[id] ?? EMPTY_VALIDATION_RESULT;
  }
  return next;
}
