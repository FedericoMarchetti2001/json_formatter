import { EMPTY_VALIDATION_RESULT, ensureValidationByPageId, syncPageIds } from "./pageState";

describe("pageState", () => {
  test("syncPageIds reuses valid stored ids", () => {
    const ids = syncPageIds(["a", "b"], 2, () => "x");
    expect(ids).toEqual(["a", "b"]);
  });

  test("syncPageIds generates missing ids and truncates extras", () => {
    let i = 0;
    const gen = () => `gen-${++i}`;

    expect(syncPageIds(["a"], 3, gen)).toEqual(["a", "gen-1", "gen-2"]);
    expect(syncPageIds(["a", "b", "c"], 2, gen)).toEqual(["a", "b"]);
  });

  test("ensureValidationByPageId keeps existing and fills empty", () => {
    const existing = {
      a: { valid: false, issues: [{ message: "x", line: 1, column: 1, index: 0 }], rowsWithErrors: [1] },
    };

    const next = ensureValidationByPageId(["a", "b"], existing as any);
    expect(next.a.valid).toBe(false);
    expect(next.b).toEqual(EMPTY_VALIDATION_RESULT);
  });
});
