export interface JsonValidationError {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonValidationResult {
  valid: boolean;
  error?: JsonValidationError;
}

export function validateJson(input: string): JsonValidationResult {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = error.message;
      // Basic parsing of the error message to get the position
      // This is not very reliable and might need a more robust solution
      const match = /at position (\d+)/.exec(message);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = input.substring(0, position).split("\n");
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        return {
          valid: false,
          error: {
            message: "Invalid JSON: " + message,
            line,
            column,
          },
        };
      }
      return {
        valid: false,
        error: { message: "Invalid JSON: " + message },
      };
    }
    return {
      valid: false,
      error: { message: "An unexpected error occurred during JSON parsing." },
    };
  }
}