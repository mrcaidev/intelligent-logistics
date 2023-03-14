import { SqlParserError } from "../error";
import { CharacterCursor } from "./cursor";
import { TokenType, type Token } from "./types";
import { Validator } from "./validator";

/**
 * Parses a SQL statement into a list of tokens.
 */
export class Lexer {
  /**
   * The cursor that iterates over every character.
   */
  private cursor: CharacterCursor;

  constructor(statement: string) {
    this.cursor = new CharacterCursor(statement);
  }

  /**
   * Parses the statement into a list of tokens.
   */
  public tokenize() {
    const tokens: Token[] = [];

    while (this.cursor.isOpen()) {
      tokens.push(this.parseNextToken());
    }

    return tokens;
  }

  /**
   * Parses the next token after the cursor.
   */
  private parseNextToken(): Token {
    this.skipWhitespaces();

    if (Validator.isDigit(this.cursor.current)) {
      return this.parseNumberLiteral();
    }

    if (Validator.isQuote(this.cursor.current)) {
      return this.parseStringLiteral();
    }

    if (Validator.isLetter(this.cursor.current)) {
      return this.parseWord();
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

    throw new SqlParserError(`Invalid initial: ${this.cursor.current}`);
  }

  /**
   * Skips all whitespaces after the cursor,
   * and land on the next non-whitespace character.
   */
  private skipWhitespaces() {
    this.cursor.consumeAsLongAs(Validator.isWhitespace);
  }

  /**
   * Parses a number literal.
   */
  private parseNumberLiteral() {
    const value = this.cursor.consumeAsLongAs(Validator.isDigitOrDot);

    if (Validator.isNumberLiteral(value)) {
      return { type: TokenType.LITERAL, value: Number(value) };
    }

    throw new SqlParserError(`Invalid number: ${value}`);
  }

  /**
   * Parses a string literal.
   */
  private parseStringLiteral() {
    const quote = this.cursor.consume();

    const value = this.cursor.consumeAsLongAs(
      (character) => character !== quote
    );

    if (!this.cursor.isOpen()) {
      throw new SqlParserError(`Unterminated string: ${quote}${value}`);
    }

    this.cursor.consume();

    return { type: TokenType.LITERAL, value };
  }

  /**
   * Parses a token that starts with a letter.
   */
  private parseWord() {
    const value = this.cursor.consumeAsLongAs(Validator.isDigitOrLetter);

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
   * Parses a token that starts with "-".
   */
  private parseFromMinus() {
    this.cursor.consume();

    if (Validator.isDigit(this.cursor.current)) {
      const negativeNumber = -this.parseNumberLiteral().value;
      return { type: TokenType.LITERAL, value: negativeNumber };
    }

    return { type: TokenType.OPERATOR, value: "-" };
  }

  /**
   * Parses a symbol.
   */
  private parseSymbol() {
    const value = this.cursor.consume();
    return { type: TokenType.SYMBOL, value };
  }

  /**
   * Parses an operator.
   */
  private parseOperator() {
    const value = this.cursor.consumeAsLongAs(Validator.isOperatorComponent);

    if (Validator.isOperator(value)) {
      return { type: TokenType.OPERATOR, value };
    }

    throw new SqlParserError(`Invalid operator: ${value}`);
  }
}
