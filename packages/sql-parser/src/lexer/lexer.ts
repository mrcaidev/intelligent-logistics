import { LexerCursor } from "./cursor";
import { LexerError } from "./error";
import { TokenType, type Token } from "./types";
import { Validator } from "./validator";

/**
 * Parses a SQL statement into a list of tokens.
 */
export class Lexer {
  /**
   * Cursor that iterates over every character.
   */
  private cursor: LexerCursor;

  /**
   * Point the cursor to the first character.
   * @param input Input string.
   */
  constructor(input: string) {
    this.cursor = new LexerCursor(input);
  }

  /**
   * Parse the input into a list of tokens.
   * @returns List of tokens.
   */
  public tokenize() {
    const tokens: Token[] = [];

    while (this.cursor.isOpen()) {
      tokens.push(this.parseNextToken());
    }

    return tokens;
  }

  /**
   * Parse the next token after the cursor.
   * @returns Parsed token.
   * @throws When the initial is invalid.
   */
  private parseNextToken(): Token {
    this.skipWhitespaces();

    if (Validator.isDigit(this.cursor.current)) {
      return this.parseNumberLiteral();
    }

    if (Validator.isLetter(this.cursor.current)) {
      return this.parseWord();
    }

    if (Validator.isQuote(this.cursor.current)) {
      return this.parseStringLiteral();
    }

    if (Validator.isMinus(this.cursor.current)) {
      return this.parseFromMinus();
    }

    if (Validator.isSymbol(this.cursor.current)) {
      return this.parseSymbol();
    }

    if (Validator.isOperatorInitial(this.cursor.current)) {
      return this.parseOperator();
    }

    throw new LexerError(`Invalid initial: ${this.cursor.current}`);
  }

  /**
   * Skip all whitespaces after the cursor,
   * and land on the next non-whitespace character.
   */
  private skipWhitespaces() {
    this.cursor.consumeAsLongAs(Validator.isWhitespace);
  }

  /**
   * Parse a number literal.
   * @returns Number literal token.
   * @throws When the number is invalid.
   */
  private parseNumberLiteral() {
    const value = this.cursor.consumeAsLongAs(Validator.isDigitOrDot);

    if (Validator.isNumberLiteral(value)) {
      return { type: TokenType.LITERAL, value: Number(value) };
    }

    throw new LexerError(`Invalid number: ${value}`);
  }

  /**
   * Parse a token that starts with a letter.
   * @returns Parsed token.
   */
  private parseWord() {
    const value = this.cursor.consumeAsLongAs(Validator.isLetter);

    if (Validator.isBooleanLiteral(value)) {
      return { type: TokenType.LITERAL, value: value.toUpperCase() === "TRUE" };
    }

    if (Validator.isNullLiteral(value)) {
      return { type: TokenType.LITERAL, value: null };
    }

    if (Validator.isKeyword(value)) {
      return { type: TokenType.KEYWORD, value: value.toUpperCase() };
    }

    if (Validator.isDataType(value)) {
      return { type: TokenType.DATA_TYPE, value: value.toUpperCase() };
    }

    return { type: TokenType.IDENTIFIER, value };
  }

  /**
   * Parse a string literal.
   * @returns String literal token.
   * @throws When the string is unterminated.
   */
  private parseStringLiteral() {
    const quote = this.cursor.consume();

    const value = this.cursor.consumeAsLongAs(
      (character) => character !== quote
    );

    if (this.cursor.isClosed()) {
      throw new LexerError(`Unterminated string: ${quote}${value}`);
    }

    this.cursor.consume();

    return { type: TokenType.LITERAL, value };
  }

  /**
   * Parse a token that starts with "-".
   * @returns Parsed token.
   */
  private parseFromMinus() {
    const value = this.cursor.consume();

    if (Validator.isDigit(this.cursor.current)) {
      const negativeNumber = -this.parseNumberLiteral().value;
      return { type: TokenType.LITERAL, value: negativeNumber };
    }

    if (Validator.isMinus(this.cursor.current)) {
      this.cursor.consume();
      const comment = this.cursor.consumeAsLongAs(() => true).trim();
      return { type: TokenType.COMMENT, value: comment };
    }

    return { type: TokenType.OPERATOR, value };
  }

  /**
   * Parse a symbol.
   * @returns Symbol token.
   */
  private parseSymbol() {
    const value = this.cursor.consume();
    return { type: TokenType.SYMBOL, value };
  }

  /**
   * Parse an operator.
   * @returns Operator token.
   * @throws When the operator is invalid.
   */
  private parseOperator() {
    const value = this.cursor.consumeAsLongAs(Validator.isOperatorComponent);

    if (Validator.isOperator(value)) {
      return { type: TokenType.OPERATOR, value };
    }

    throw new LexerError(`Invalid operator: ${value}`);
  }
}
