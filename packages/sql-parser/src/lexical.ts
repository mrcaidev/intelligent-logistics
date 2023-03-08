import { Cursor } from "./cursor";
import { keywords, type Token } from "./token";

export class LexicalParser {
  private cursor: Cursor<string>;

  constructor(input: string) {
    this.cursor = new Cursor(input.trim().split(""));
  }

  private static isWhitespace(character: string) {
    return /^\s$/.test(character);
  }

  private static isDigit(character: string) {
    return /^\d$/.test(character);
  }

  private static isDigitOrDot(character: string) {
    return /^\d|\.$/.test(character);
  }

  private static isLetter(character: string) {
    return /^[a-z]$/i.test(character);
  }

  private static isBoolean(sequence: string) {
    return /^true|false$/i.test(sequence);
  }

  private static isNull(sequence: string) {
    return /^null$/i.test(sequence);
  }

  private static isQuote(character: string) {
    return /^['"]$/.test(character);
  }

  private static isSymbol(character: string) {
    return /^[+\-*/=.!(),;]$/.test(character);
  }

  private static isKeyword(sequence: string) {
    return keywords.includes(sequence.toUpperCase());
  }

  private skipWhitespaces() {
    while (LexicalParser.isWhitespace(this.cursor.current())) {
      this.cursor.forward();
    }
  }

  private parseNumberLiteral() {
    let value = "";

    while (LexicalParser.isDigitOrDot(this.cursor.current())) {
      value += this.cursor.current();
      this.cursor.forward();
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      throw new Error(`Lexical parser: Invalid number: ${value}`);
    }

    return { type: "literal", value: numberValue } satisfies Token;
  }

  private parseStringLiteral() {
    const quote = this.cursor.current();
    this.cursor.forward();

    let value = "";

    while (this.cursor.current() !== quote) {
      if (!this.cursor.isOpen()) {
        throw new Error(
          `Lexical parser: Unterminated string: ${quote}${value}`
        );
      }

      value += this.cursor.current();
      this.cursor.forward();
    }

    this.cursor.forward();

    return { type: "literal", value } satisfies Token;
  }

  private parseOperator() {
    const value = this.cursor.current();
    this.cursor.forward();

    if (value !== "-") {
      return { type: "operator", value } satisfies Token;
    }

    if (LexicalParser.isDigit(this.cursor.current())) {
      const { value } = this.parseNumberLiteral();
      return { type: "literal", value: -value } satisfies Token;
    }

    if (this.cursor.current() === "-") {
      this.cursor.close();
      return { type: "comment", value: "--" } satisfies Token;
    }

    return { type: "operator", value } satisfies Token;
  }

  private parseWord() {
    let value = "";

    while (LexicalParser.isLetter(this.cursor.current())) {
      value += this.cursor.current();
      this.cursor.forward();
    }

    if (LexicalParser.isKeyword(value)) {
      return { type: "keyword", value: value.toUpperCase() } satisfies Token;
    }

    if (LexicalParser.isBoolean(value)) {
      const booleanValue = value.toUpperCase() === "TRUE";
      return { type: "literal", value: booleanValue } satisfies Token;
    }

    if (LexicalParser.isNull(value)) {
      return { type: "literal", value: null } satisfies Token;
    }

    return { type: "identifier", value } satisfies Token;
  }

  private getNextToken(): Token {
    this.skipWhitespaces();

    if (LexicalParser.isDigit(this.cursor.current())) {
      return this.parseNumberLiteral();
    }

    if (LexicalParser.isQuote(this.cursor.current())) {
      return this.parseStringLiteral();
    }

    if (LexicalParser.isSymbol(this.cursor.current())) {
      return this.parseOperator();
    }

    if (LexicalParser.isLetter(this.cursor.current())) {
      return this.parseWord();
    }

    throw new Error(
      `Lexical parser: Unexpected character: ${this.cursor.current()}`
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
