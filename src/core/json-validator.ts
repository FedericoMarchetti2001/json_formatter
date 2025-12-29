/**
 * JSON validation utilities with multi-issue reporting and optional tolerant (JSONC-like) parsing.
 */

export interface JsonValidationError {
  message: string;
  line?: number;
  column?: number;
  index?: number;
}

export type JsonValidationSeverity = "error" | "warning";

export interface JsonValidationIssue {
  message: string;
  line: number;
  column: number;
  index: number;
  length?: number;
  snippet?: string;
  code?: string;
  severity?: JsonValidationSeverity;
  offending?: string;
}

export interface JsonValidationOptions {
  tolerant?: boolean;
  allowComments?: boolean;
  allowTrailingCommas?: boolean;
  maxIssues?: number;
  returnParsedValue?: boolean;
  snippetRadius?: number;
}

export interface JsonValidationResult {
  valid: boolean;
  /**
   * For backward compatibility: if there are any issues, this contains the first error-like issue.
   */
  error?: JsonValidationError;
  /**
   * Full list of detected issues (errors + warnings).
   */
  issues?: JsonValidationIssue[];
  issueCount?: number;
  /**
   * Distinct rows (1-based) that contain at least one error-severity issue.
   */
  rowsWithErrors?: number[];
  /**
   * Count of rowsWithErrors.
   */
  totalRowsWithErrors?: number;
  value?: unknown;
}

type TokenType =
  | "braceL"
  | "braceR"
  | "bracketL"
  | "bracketR"
  | "colon"
  | "comma"
  | "string"
  | "number"
  | "true"
  | "false"
  | "null"
  | "comment"
  | "identifier"
  | "eof"
  | "unknown";

interface Token {
  type: TokenType;
  start: number;
  end: number;
  value?: string;
  hasError?: boolean;
  line?: number;
  column?: number;
}

interface NormalizedJsonValidationOptions {
  tolerant: boolean;
  allowComments: boolean;
  allowTrailingCommas: boolean;
  maxIssues: number;
  returnParsedValue: boolean;
  snippetRadius: number;
}

const DEFAULT_OPTIONS: NormalizedJsonValidationOptions = {
  tolerant: false,
  allowComments: false,
  allowTrailingCommas: false,
  maxIssues: 50,
  returnParsedValue: false,
  snippetRadius: 16,
};

class PositionMapper {
  private readonly lineBreaks: number[];

  constructor(private readonly text: string) {
    this.lineBreaks = [];
    for (let i = 0; i < text.length; i += 1) {
      if (text.charCodeAt(i) === 10) {
        this.lineBreaks.push(i);
      }
    }
  }

  at(index: number): { line: number; column: number } {
    const clampedIndex = Math.min(Math.max(index, 0), this.text.length);
    let low = 0;
    let high = this.lineBreaks.length - 1;
    let lastBreakIndex = -1;

    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.lineBreaks[mid] <= clampedIndex) {
        lastBreakIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const line = lastBreakIndex + 2; // +1 for 1-based, +1 because break is end of previous line
    const lastBreak = lastBreakIndex >= 0 ? this.lineBreaks[lastBreakIndex] : -1;
    const column = clampedIndex - lastBreak;
    return { line, column: column <= 0 ? 1 : column };
  }
}

class IssueCollector {
  private readonly issues: JsonValidationIssue[] = [];
  private errorSeen = false;

  constructor(
    private readonly input: string,
    private readonly options: NormalizedJsonValidationOptions,
    private readonly mapper: PositionMapper
  ) {}

  addIssue(issue: {
    message: string;
    index: number;
    length?: number;
    code?: string;
    severity?: JsonValidationSeverity;
    offending?: string;
  }): void {
    if (this.issues.length >= this.options.maxIssues) {
      return;
    }

    const { line, column } = this.mapper.at(issue.index);
    const severity: JsonValidationSeverity = issue.severity ?? "error";
    const snippet = this.buildSnippet(issue.index, issue.length ?? 1);

    const entry: JsonValidationIssue = {
      message: issue.message,
      line,
      column,
      index: issue.index,
      length: issue.length,
      snippet,
      code: issue.code,
      severity,
      offending: issue.offending,
    };

    this.issues.push(entry);
    if (severity === "error") {
      this.errorSeen = true;
    }
  }

  getIssues(): JsonValidationIssue[] {
    return this.issues;
  }

  hasErrors(): boolean {
    return this.errorSeen;
  }

  private buildSnippet(index: number, length: number): string | undefined {
    if (this.options.snippetRadius <= 0) {
      return undefined;
    }
    const radius = this.options.snippetRadius;
    const start = Math.max(0, index - radius);
    const end = Math.min(this.input.length, index + length + radius);
    return this.input.slice(start, end);
  }
}

class Scanner {
  private pos = 0;
  private readonly length: number;

  constructor(
    private readonly input: string,
    private readonly mapper: PositionMapper,
    private readonly collector: IssueCollector
  ) {
    this.length = input.length;
  }

  nextToken(): Token {
    this.skipWhitespace();

    if (this.pos >= this.length) {
      return this.makeToken("eof", this.pos, this.pos);
    }

    const ch = this.input[this.pos];

    switch (ch) {
      case "{":
        return this.makeSimpleToken("braceL", 1);
      case "}":
        return this.makeSimpleToken("braceR", 1);
      case "[":
        return this.makeSimpleToken("bracketL", 1);
      case "]":
        return this.makeSimpleToken("bracketR", 1);
      case ":":
        return this.makeSimpleToken("colon", 1);
      case ",":
        return this.makeSimpleToken("comma", 1);
      case '"':
        return this.scanString();
      case "/":
        return this.scanCommentOrUnknown();
      default:
        if (isDigit(ch) || (ch === "-" && isDigit(this.peekChar()))) {
          return this.scanNumber();
        }
        if (isIdentifierStart(ch)) {
          return this.scanIdentifier();
        }
        return this.scanUnknown();
    }
  }

  private makeSimpleToken(type: TokenType, length: number): Token {
    const start = this.pos;
    this.pos += length;
    return this.makeToken(type, start, this.pos);
  }

  private makeToken(type: TokenType, start: number, end: number, value?: string, hasError?: boolean): Token {
    const { line, column } = this.mapper.at(start);
    return { type, start, end, value, hasError, line, column };
  }

  private scanUnknown(): Token {
    const start = this.pos;
    this.pos += 1;
    return this.makeToken("unknown", start, this.pos, this.input.slice(start, this.pos));
  }

  private scanIdentifier(): Token {
    const start = this.pos;
    this.pos += 1;
    while (this.pos < this.length && isIdentifierContinuation(this.input[this.pos])) {
      this.pos += 1;
    }
    const raw = this.input.slice(start, this.pos);
    if (raw === "true") {
      return this.makeToken("true", start, this.pos, raw);
    }
    if (raw === "false") {
      return this.makeToken("false", start, this.pos, raw);
    }
    if (raw === "null") {
      return this.makeToken("null", start, this.pos, raw);
    }
    return this.makeToken("identifier", start, this.pos, raw);
  }

  private scanCommentOrUnknown(): Token {
    if (this.peekChar(1) === "/") {
      return this.scanLineComment();
    }
    if (this.peekChar(1) === "*") {
      return this.scanBlockComment();
    }
    return this.scanUnknown();
  }

  private scanLineComment(): Token {
    const start = this.pos;
    this.pos += 2; // //
    while (this.pos < this.length && this.input[this.pos] !== "\n") {
      this.pos += 1;
    }
    return this.makeToken("comment", start, this.pos, this.input.slice(start, this.pos));
  }

  private scanBlockComment(): Token {
    const start = this.pos;
    this.pos += 2; // /*
    while (this.pos < this.length && !(this.input[this.pos] === "*" && this.peekChar(1) === "/")) {
      this.pos += 1;
    }
    if (this.pos >= this.length) {
      this.collector.addIssue({
        message: "Unterminated block comment",
        index: start,
        length: this.pos - start,
        code: "UnterminatedComment",
      });
      return this.makeToken("comment", start, this.pos, this.input.slice(start, this.pos), true);
    }
    this.pos += 2; // */
    return this.makeToken("comment", start, this.pos, this.input.slice(start, this.pos));
  }

  private scanString(): Token {
    const start = this.pos;
    this.pos += 1; // opening quote
    let hasError = false;
    let closed = false;

    while (this.pos < this.length) {
      const ch = this.input[this.pos];
      if (ch === '"') {
        this.pos += 1;
        closed = true;
        break;
      }
      if (ch === "\\") {
        this.pos += 1;
        hasError = this.scanEscapeSequence(start) || hasError;
        continue;
      }
      if (ch === "\n" || ch === "\r") {
        this.collector.addIssue({
          message: "Unterminated string literal",
          index: start,
          length: this.pos - start,
          code: "UnterminatedString",
        });
        hasError = true;
        break;
      }
      this.pos += 1;
    }

    if (!closed) {
      this.collector.addIssue({
        message: "Unterminated string literal",
        index: start,
        length: this.pos - start,
        code: "UnterminatedString",
      });
      hasError = true;
    }

    return this.makeToken("string", start, this.pos, this.input.slice(start, this.pos), hasError);
  }

  private scanEscapeSequence(stringStart: number): boolean {
    if (this.pos >= this.length) {
      this.collector.addIssue({
        message: "Unexpected end after escape character",
        index: stringStart,
        length: this.pos - stringStart,
        code: "InvalidEscape",
      });
      return true;
    }
    const escaped = this.input[this.pos];
    this.pos += 1;
    if ("\"\\/bfnrt".includes(escaped)) {
      return false;
    }
    if (escaped === "u") {
      for (let i = 0; i < 4; i += 1) {
        if (!isHexDigit(this.input[this.pos + i])) {
          this.collector.addIssue({
            message: "Invalid unicode escape sequence",
            index: this.pos + i,
            length: 1,
            code: "InvalidUnicodeEscape",
            offending: this.input[this.pos + i],
          });
          this.pos += 4; // skip rest to keep moving forward
          return true;
        }
      }
      this.pos += 4;
      return false;
    }
    this.collector.addIssue({
      message: `Invalid escape sequence \\${escaped}`,
      index: this.pos - 2,
      length: 2,
      code: "InvalidEscape",
      offending: `\\${escaped}`,
    });
    return true;
  }

  private scanNumber(): Token {
    const start = this.pos;
    let hasError = false;

    if (this.input[this.pos] === "-") {
      this.pos += 1;
    }

    const first = this.input[this.pos];
    if (!isDigit(first)) {
      hasError = true;
      this.collector.addIssue({
        message: "Expected digit after '-'",
        index: this.pos,
        length: 1,
        code: "InvalidNumber",
      });
    }

    if (first === "0") {
      this.pos += 1;
      if (isDigit(this.input[this.pos])) {
        hasError = true;
        this.collector.addIssue({
          message: "Leading zeros are not allowed in JSON numbers",
          index: start,
          length: this.pos - start,
          code: "LeadingZero",
        });
        while (isDigit(this.input[this.pos])) {
          this.pos += 1;
        }
      }
    } else {
      while (isDigit(this.input[this.pos])) {
        this.pos += 1;
      }
    }

    if (this.input[this.pos] === ".") {
      this.pos += 1;
      if (!isDigit(this.input[this.pos])) {
        hasError = true;
        this.collector.addIssue({
          message: "Expected digits after decimal point",
          index: this.pos,
          length: 1,
          code: "InvalidNumber",
        });
      }
      while (isDigit(this.input[this.pos])) {
        this.pos += 1;
      }
    }

    if (this.input[this.pos] === "e" || this.input[this.pos] === "E") {
      this.pos += 1;
      if (this.input[this.pos] === "+" || this.input[this.pos] === "-") {
        this.pos += 1;
      }
      if (!isDigit(this.input[this.pos])) {
        hasError = true;
        this.collector.addIssue({
          message: "Expected digits in exponent",
          index: this.pos,
          length: 1,
          code: "InvalidNumber",
        });
      }
      while (isDigit(this.input[this.pos])) {
        this.pos += 1;
      }
    }

    const end = this.pos;
    const trailing = this.input[this.pos];
    if (isIdentifierStart(trailing)) {
      hasError = true;
      this.collector.addIssue({
        message: "Invalid character after number",
        index: this.pos,
        length: 1,
        code: "InvalidNumberTrailing",
        offending: trailing,
      });
    }

    return this.makeToken("number", start, end, this.input.slice(start, end), hasError);
  }

  private skipWhitespace(): void {
    while (this.pos < this.length) {
      const ch = this.input[this.pos];
      if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
        this.pos += 1;
        continue;
      }
      break;
    }
  }

  private peekChar(offset = 1): string {
    return this.input[this.pos + offset] ?? "";
  }
}

class JsonParser {
  private lookahead?: Token;

  constructor(
    private readonly scanner: Scanner,
    private readonly collector: IssueCollector,
    private readonly options: NormalizedJsonValidationOptions
  ) {}

  parse(): unknown {
    const firstToken = this.peekToken();
    if (firstToken.type === "eof") {
      this.collector.addIssue({
        message: "Empty JSON input",
        index: 0,
        length: 0,
        code: "EmptyInput",
      });
      return undefined;
    }

    const value = this.parseValue();
    const trailing = this.readToken();
    if (trailing.type !== "eof") {
      let effectiveToken = trailing;
      let isAnotherValue = isValueStartToken(trailing);

      if (trailing.type === "comma") {
        const nextToken = this.peekToken();
        if (isValueStartToken(nextToken)) {
          isAnotherValue = true;
          effectiveToken = nextToken;
        }
      }

      this.collector.addIssue({
        message: isAnotherValue
          ? "Multiple top-level JSON values detected. Wrap them in an array (e.g. [{\"a\":1},{\"b\":2}]) or a single object."
          : "Unexpected content after the first JSON value",
        index: effectiveToken.start,
        length: Math.max(1, effectiveToken.end - effectiveToken.start),
        code: isAnotherValue ? "MultipleTopLevelValues" : "TrailingContent",
        offending: effectiveToken.value,
      });
    }
    return value;
  }

  private parseValue(): unknown {
    const token = this.readToken();
    switch (token.type) {
      case "string":
        return this.parseStringToken(token);
      case "number":
        return this.parseNumberToken(token);
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      case "braceL":
        return this.parseObject();
      case "bracketL":
        return this.parseArray();
      case "comment":
        this.flagComment(token);
        return this.parseValue();
      case "braceR":
      case "bracketR":
        this.collector.addIssue({
          message: `Unexpected token '${this.describeToken(token)}'`,
          index: token.start,
          length: token.end - token.start,
          code: "UnexpectedToken",
          offending: token.value,
        });
        return undefined;
      case "comma":
        this.collector.addIssue({
          message: "Unexpected comma",
          index: token.start,
          length: token.end - token.start,
          code: "UnexpectedComma",
        });
        return undefined;
      case "identifier":
        this.collector.addIssue({
          message: "Unquoted keys are not allowed in JSON",
          index: token.start,
          length: token.end - token.start,
          code: "UnquotedIdentifier",
          offending: token.value,
        });
        return undefined;
      case "eof":
        this.collector.addIssue({
          message: "Unexpected end of JSON input",
          index: token.start,
          length: 0,
          code: "UnexpectedEOF",
        });
        return undefined;
      default:
        this.collector.addIssue({
          message: `Unexpected token '${this.describeToken(token)}'`,
          index: token.start,
          length: token.end - token.start,
          code: "UnexpectedToken",
          offending: token.value,
        });
        return undefined;
    }
  }

  private parseObject(): Record<string, unknown> | undefined {
    const result: Record<string, unknown> = {};
    let expectValue = false;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const next = this.peekToken();
      if (next.type === "braceR") {
        this.readToken();
        return result;
      }
      if (next.type === "eof") {
        this.collector.addIssue({
          message: "Unterminated object, missing '}'",
          index: next.start,
          length: 0,
          code: "UnterminatedObject",
        });
        return result;
      }

      if (!expectValue) {
        const keyToken = this.readToken();
        let key: string | undefined;

        if (keyToken.type === "string") {
          key = this.parseStringToken(keyToken);
        } else if (keyToken.type === "identifier") {
          this.collector.addIssue({
            message: "Object keys must be double-quoted strings",
            index: keyToken.start,
            length: keyToken.end - keyToken.start,
            code: "UnquotedKey",
            offending: keyToken.value,
          });
          key = keyToken.value;
        } else {
          this.collector.addIssue({
            message: "Expected object key",
            index: keyToken.start,
            length: keyToken.end - keyToken.start,
            code: "MissingKey",
          });
        }

        const colonToken = this.readToken();
        if (colonToken.type !== "colon") {
          this.collector.addIssue({
            message: "Expected ':' after object key",
            index: colonToken.start,
            length: colonToken.end - colonToken.start,
            code: "MissingColon",
          });
          this.unread(colonToken);
        }

        const value = this.parseValue();
        if (key !== undefined && value !== undefined) {
          result[key] = value;
        }
        expectValue = true;
      }

      const delimiter = this.readToken();
      if (delimiter.type === "comma") {
        const lookahead = this.peekToken();
        if (lookahead.type === "braceR") {
          this.collectTrailingCommaIssue(delimiter);
          this.readToken(); // consume }
          return result;
        }
        expectValue = false;
        continue;
      }
      if (delimiter.type === "braceR") {
        return result;
      }
      if (delimiter.type === "eof") {
        this.collector.addIssue({
          message: "Unterminated object, missing '}'",
          index: delimiter.start,
          length: 0,
          code: "UnterminatedObject",
        });
        return result;
      }
      this.collector.addIssue({
        message: "Expected ',' or '}' in object",
        index: delimiter.start,
        length: delimiter.end - delimiter.start,
        code: "UnexpectedToken",
        offending: delimiter.value,
      });
    }
  }

  private parseArray(): unknown[] | undefined {
    const result: unknown[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const next = this.peekToken();
      if (next.type === "bracketR") {
        this.readToken();
        return result;
      }
      if (next.type === "eof") {
        this.collector.addIssue({
          message: "Unterminated array, missing ']'",
          index: next.start,
          length: 0,
          code: "UnterminatedArray",
        });
        return result;
      }

      const value = this.parseValue();
      result.push(value);

      const delimiter = this.readToken();
      if (delimiter.type === "comma") {
        const lookahead = this.peekToken();
        if (lookahead.type === "bracketR") {
          this.collectTrailingCommaIssue(delimiter);
          this.readToken(); // consume ]
          return result;
        }
        continue;
      }
      if (delimiter.type === "bracketR") {
        return result;
      }
      if (delimiter.type === "eof") {
        this.collector.addIssue({
          message: "Unterminated array, missing ']'",
          index: delimiter.start,
          length: 0,
          code: "UnterminatedArray",
        });
        return result;
      }
      this.collector.addIssue({
        message: "Expected ',' or ']' in array",
        index: delimiter.start,
        length: delimiter.end - delimiter.start,
        code: "UnexpectedToken",
        offending: delimiter.value,
      });
    }
  }

  private parseStringToken(token: Token): string | undefined {
    if (token.hasError) {
      return undefined;
    }
    try {
      return JSON.parse(token.value ?? "\"\"");
    } catch {
      this.collector.addIssue({
        message: "Invalid string value",
        index: token.start,
        length: token.end - token.start,
        code: "InvalidString",
      });
      return undefined;
    }
  }

  private parseNumberToken(token: Token): number | undefined {
    if (token.hasError) {
      return undefined;
    }
    const parsed = Number(token.value);
    if (Number.isNaN(parsed)) {
      this.collector.addIssue({
        message: "Invalid number value",
        index: token.start,
        length: token.end - token.start,
        code: "InvalidNumber",
      });
      return undefined;
    }
    return parsed;
  }

  private collectTrailingCommaIssue(comma: Token): void {
    const severity: JsonValidationSeverity =
      this.options.allowTrailingCommas || this.options.tolerant ? "warning" : "error";
    this.collector.addIssue({
      message: "Trailing commas are not allowed in strict JSON",
      index: comma.start,
      length: comma.end - comma.start,
      code: "TrailingComma",
      severity,
      offending: comma.value,
    });
  }

  private describeToken(token: Token): string {
    if (token.value) {
      return token.value;
    }
    switch (token.type) {
      case "braceL":
        return "{";
      case "braceR":
        return "}";
      case "bracketL":
        return "[";
      case "bracketR":
        return "]";
      case "comma":
        return ",";
      case "colon":
        return ":";
      default:
        return token.type;
    }
  }

  private flagComment(token: Token): void {
    const severity: JsonValidationSeverity =
      this.options.allowComments || this.options.tolerant ? "warning" : "error";
    this.collector.addIssue({
      message: "Comments are not part of standard JSON",
      index: token.start,
      length: token.end - token.start,
      code: "Comment",
      severity,
    });
  }

  private readToken(): Token {
    if (this.lookahead) {
      const token = this.lookahead;
      this.lookahead = undefined;
      if (token.type === "comment") {
        this.flagComment(token);
        return this.readToken();
      }
      return token;
    }
    let token = this.scanner.nextToken();
    while (token.type === "comment") {
      this.flagComment(token);
      token = this.scanner.nextToken();
    }
    return token;
  }

  private peekToken(): Token {
    if (!this.lookahead) {
      this.lookahead = this.scanner.nextToken();
      while (this.lookahead.type === "comment") {
        this.flagComment(this.lookahead);
        this.lookahead = this.scanner.nextToken();
      }
    }
    return this.lookahead;
  }

  private unread(token: Token): void {
    if (this.lookahead) {
      // Should not happen in normal flow; keep the first unread token.
      return;
    }
    this.lookahead = token;
  }
}

function isValueStartToken(token: Token): boolean {
  return (
    token.type === "braceL" ||
    token.type === "bracketL" ||
    token.type === "string" ||
    token.type === "number" ||
    token.type === "true" ||
    token.type === "false" ||
    token.type === "null"
  );
}

function isDigit(ch: string | undefined): ch is string {
  return ch !== undefined && ch >= "0" && ch <= "9";
}

function isHexDigit(ch: string | undefined): boolean {
  if (!ch) return false;
  return (
    (ch >= "0" && ch <= "9") ||
    (ch >= "a" && ch <= "f") ||
    (ch >= "A" && ch <= "F")
  );
}

function isIdentifierStart(ch: string | undefined): ch is string {
  if (!ch) return false;
  const code = ch.charCodeAt(0);
  return (
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122) || // a-z
    ch === "_" ||
    ch === "$"
  );
}

function isIdentifierContinuation(ch: string | undefined): ch is string {
  return isIdentifierStart(ch) || isDigit(ch);
}

function normalizeOptions(options?: JsonValidationOptions): NormalizedJsonValidationOptions {
  const tolerant = options?.tolerant ?? false;
  return {
    tolerant,
    allowComments: options?.allowComments ?? tolerant,
    allowTrailingCommas: options?.allowTrailingCommas ?? tolerant,
    maxIssues: options?.maxIssues ?? DEFAULT_OPTIONS.maxIssues,
    returnParsedValue: options?.returnParsedValue ?? DEFAULT_OPTIONS.returnParsedValue,
    snippetRadius: options?.snippetRadius ?? DEFAULT_OPTIONS.snippetRadius,
  };
}

export function validateJson(
  input: string,
  options?: JsonValidationOptions
): JsonValidationResult {
  const normalized = normalizeOptions(options);
  const mapper = new PositionMapper(input);
  const collector = new IssueCollector(input, normalized, mapper);
  const parser = new JsonParser(new Scanner(input, mapper, collector), collector, normalized);

  const parsedValue = parser.parse();
  const issues = collector.getIssues();
  const hasErrors = collector.hasErrors();
  const errorRows = Array.from(
    new Set(
      issues
        .filter((issue) => issue.severity !== "warning")
        .map((issue) => issue.line)
    )
  ).sort((a, b) => a - b);

  const result: JsonValidationResult = {
    valid: !hasErrors,
    rowsWithErrors: errorRows,
    totalRowsWithErrors: errorRows.length,
  };

  if (issues.length > 0) {
    result.issues = issues;
    result.issueCount = issues.length;
    const primary = issues.find((issue) => issue.severity !== "warning") ?? issues[0];
    if (primary) {
      result.error = {
        message: primary.message,
        line: primary.line,
        column: primary.column,
        index: primary.index,
      };
    }
  }

  if (!hasErrors && normalized.returnParsedValue) {
    result.value = parsedValue;
  }

  return result;
}
