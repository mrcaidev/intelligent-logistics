import type { Token } from "src/types";
import { LexicalCursor } from "./cursor";
import { LexicalError } from "./error";
import { Validator } from "./validator";

export class LexicalParser {
  private cursor: LexicalCursor;

  constructor(input: string) {
    this.cursor = new LexicalCursor(input);
  }

  public parse() {
    const tokens: Token[] = [];

    while (this.cursor.isOpen()) {
      tokens.push(this.getNextToken());
    }

    return tokens;
  }

  private getNextToken() {
    this.skipWhitespaces();

    if (Validator.isSeparator(this.cursor.current)) {
      return this.parseSeparator();
    }

    if (Validator.isDigit(this.cursor.current)) {
      return this.parseNumberLiteral();
    }

    if (Validator.isQuote(this.cursor.current)) {
      return this.parseStringLiteral();
    }

    if (Validator.isSymbol(this.cursor.current)) {
      return this.parseOperator();
    }

    if (Validator.isLetter(this.cursor.current)) {
      return this.parseWord();
    }

    throw new LexicalError(`Unexpected character ${this.cursor.current}`);
  }

  private skipWhitespaces() {
    while (Validator.isWhitespace(this.cursor.current)) {
      this.cursor.consume();
    }
  }

  private parseSeparator() {
    this.cursor.consume();
    return { type: "separator", value: ";" } as Token;
  }

  private parseNumberLiteral() {
    let value = "";

    while (Validator.isDigitOrDot(this.cursor.current)) {
      value += this.cursor.consume();
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      throw new LexicalError(`Invalid number ${value}`);
    }

    return { type: "literal", value: numberValue } satisfies Token;
  }

  private parseStringLiteral() {
    const quote = this.cursor.consume();

    let value = "";

    while (this.cursor.current !== quote) {
      if (this.cursor.isClosed()) {
        throw new LexicalError(`Unterminated string ${quote}${value}`);
      }

      value += this.cursor.consume();
    }

    this.cursor.consume();

    return { type: "literal", value } satisfies Token;
  }

  private parseComment() {
    let value = "";

    while (this.cursor.isOpen()) {
      value += this.cursor.consume();
    }

    return { type: "comment", value: value.trim() } as Token;
  }

  private parseOperator() {
    let value = "";

    while (Validator.isSymbol(this.cursor.current)) {
      value += this.cursor.consume();
    }

    if (value === "--") {
      return this.parseComment();
    }

    if (value === "-" && Validator.isDigit(this.cursor.current)) {
      const { value } = this.parseNumberLiteral();
      return { type: "literal", value: -value } satisfies Token;
    }

    return { type: "operator", value } as Token;
  }

  private parseWord() {
    let value = "";

    while (Validator.isLetter(this.cursor.current)) {
      value += this.cursor.consume();
    }

    if (Validator.isKeyword(value)) {
      return { type: "keyword", value: value.toUpperCase() } as Token;
    }

    if (Validator.isDataType(value)) {
      return { type: "dataType", value: value.toUpperCase() } as Token;
    }

    if (Validator.isBoolean(value)) {
      const booleanValue = value.toUpperCase() === "TRUE";
      return { type: "literal", value: booleanValue } satisfies Token;
    }

    if (Validator.isNull(value)) {
      return { type: "literal", value: null } satisfies Token;
    }

    return { type: "identifier", value } as Token;
  }
}
