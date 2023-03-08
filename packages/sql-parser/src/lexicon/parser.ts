import { Cursor } from "src/cursor";
import type { Token } from "src/types";
import { LexicalError } from "./error";
import { Validator } from "./validator";

export class LexicalParser {
  private cursor: Cursor<string>;

  constructor(input: string) {
    this.cursor = new Cursor(input.trim().split(""));
  }

  private skipWhitespaces() {
    while (Validator.isWhitespace(this.cursor.current())) {
      this.cursor.forward();
    }
  }

  private parseNumberLiteral() {
    let value = "";

    while (Validator.isDigitOrDot(this.cursor.current())) {
      value += this.cursor.current();
      this.cursor.forward();
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      throw new LexicalError(
        `Invalid number ${value} at position ${this.cursor.position()}`
      );
    }

    return { type: "literal", value: numberValue } satisfies Token;
  }

  private parseStringLiteral() {
    const quote = this.cursor.current();
    this.cursor.forward();

    let value = "";

    while (this.cursor.current() !== quote) {
      if (!this.cursor.isOpen()) {
        throw new LexicalError(
          `Unterminated string ${quote}${value} at position ${this.cursor.position()}`
        );
      }

      value += this.cursor.current();
      this.cursor.forward();
    }

    this.cursor.forward();

    return { type: "literal", value } satisfies Token;
  }

  private parseComment() {
    let value = "";

    while (this.cursor.isOpen()) {
      value += this.cursor.current();
      this.cursor.forward();
    }

    return { type: "comment", value: value.trim() } as Token;
  }

  private parseOperator() {
    const value = this.cursor.current();
    this.cursor.forward();

    if (value !== "-") {
      return { type: "operator", value } as Token;
    }

    if (Validator.isDigit(this.cursor.current())) {
      const { value } = this.parseNumberLiteral();
      return { type: "literal", value: -value } satisfies Token;
    }

    if (this.cursor.current() === "-") {
      this.cursor.forward();
      return this.parseComment();
    }

    return { type: "operator", value } as Token;
  }

  private parseWord() {
    let value = "";

    while (Validator.isLetter(this.cursor.current())) {
      value += this.cursor.current();
      this.cursor.forward();
    }

    if (Validator.isKeyword(value)) {
      return { type: "keyword", value: value.toUpperCase() } as Token;
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

  private getNextToken() {
    this.skipWhitespaces();

    if (Validator.isDigit(this.cursor.current())) {
      return this.parseNumberLiteral();
    }

    if (Validator.isQuote(this.cursor.current())) {
      return this.parseStringLiteral();
    }

    if (Validator.isSymbol(this.cursor.current())) {
      return this.parseOperator();
    }

    if (Validator.isLetter(this.cursor.current())) {
      return this.parseWord();
    }

    throw new LexicalError(
      `Unexpected character ${this.cursor.current()} at position ${this.cursor.position()}`
    );
  }

  public parse() {
    const tokens: Token[] = [];

    while (this.cursor.isOpen()) {
      tokens.push(this.getNextToken());
    }

    return tokens;
  }
}
