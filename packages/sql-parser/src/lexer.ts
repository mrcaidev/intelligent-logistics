import { Cursor } from "cursor";
import { SqlParserError } from "error";
import { Token, TokenType } from "token";

/**
 * Parses a SQL statement into a list of tokens.
 */
export class Lexer extends Cursor<string> {
  constructor(statement: string) {
    super(statement.split(""));
  }

  /**
   * Returns a list of tokens parsed from the statement.
   */
  public tokenize() {
    const tokens: Token[] = [];

    while (this.isOpen()) {
      tokens.push(this.parseNextToken());
    }

    return tokens;
  }

  /**
   * Returns the next token after the cursor.
   */
  private parseNextToken(): Token {
    this.consumeAsLongAs(isWhitespace);

    const initial = this.consume();

    if (isDigit(initial)) {
      const value = initial + this.consumeAsLongAs(isDigitOrDot);

      const numberLiteral = getNumberLiteral(value);
      if (numberLiteral !== undefined) {
        return { type: TokenType.LITERAL, value: numberLiteral };
      }

      throw new SqlParserError(`Invalid number: ${value}`);
    }

    if (isLetter(initial)) {
      const value = initial + this.consumeAsLongAs(isWordComponent);

      const booleanLiteral = getBooleanLiteral(value);
      if (booleanLiteral !== undefined) {
        return { type: TokenType.LITERAL, value: booleanLiteral };
      }

      const nullLiteral = getNullLiteral(value);
      if (nullLiteral !== undefined) {
        return { type: TokenType.LITERAL, value: nullLiteral };
      }

      const keywordType = getKeywordType(value);
      if (keywordType !== undefined) {
        return { type: keywordType };
      }

      return { type: TokenType.IDENTIFIER, value };
    }

    if (isQuote(initial)) {
      const value = this.consumeAsLongAs((value) => value !== initial);

      if (this.isOpen()) {
        this.consume();
        return { type: TokenType.LITERAL, value };
      }

      throw new SqlParserError(`Unterminated string: ${initial}${value}`);
    }

    if (initial === "=") {
      return { type: TokenType.EQUAL };
    }

    if (initial === "!") {
      if (this.current === "=") {
        this.consume();
        return { type: TokenType.NOT_EQUAL };
      }

      throw new SqlParserError(`Invalid character: ${initial}`);
    }

    if (initial === "<") {
      if (this.current === "=") {
        this.consume();
        return { type: TokenType.LESS_THAN_OR_EQUAL };
      }

      return { type: TokenType.LESS_THAN };
    }

    if (initial === ">") {
      if (this.current === "=") {
        this.consume();
        return { type: TokenType.GREATER_THAN_OR_EQUAL };
      }

      return { type: TokenType.GREATER_THAN };
    }

    if (initial === "+") {
      return { type: TokenType.ADD };
    }

    if (initial === "-") {
      if (!isDigit(this.current)) {
        return { type: TokenType.SUBTRACT };
      }

      const value = initial + this.consumeAsLongAs(isDigitOrDot);

      const numberLiteral = getNumberLiteral(value);
      if (numberLiteral !== undefined) {
        return { type: TokenType.LITERAL, value: numberLiteral };
      }

      throw new SqlParserError(`Invalid number: ${value}`);
    }

    if (initial === "*") {
      return { type: TokenType.MULTIPLY };
    }

    if (initial === "/") {
      return { type: TokenType.DIVIDE };
    }

    if (initial === "(") {
      return { type: TokenType.LEFT_PARENTHESIS };
    }

    if (initial === ")") {
      return { type: TokenType.RIGHT_PARENTHESIS };
    }

    if (initial === ",") {
      return { type: TokenType.COMMA };
    }

    if (initial === ".") {
      return { type: TokenType.DOT };
    }

    throw new SqlParserError(`Invalid character: ${this.current}`);
  }

  /**
   * Returns all of the characters that satisfy the predicate function,
   * and moves to the first character that does not.
   *
   * @param predicate A function that returns true if the given character
   * satisfies its condition, or false otherwise.
   */
  private consumeAsLongAs(predicate: (character: string) => boolean) {
    let value = "";

    while (this.isOpen() && predicate(this.current)) {
      value += this.consume();
    }

    return value;
  }
}

function isWhitespace(value: string) {
  return " " === value;
}

function isDigit(value: string) {
  return /^\d$/.test(value);
}

function isDigitOrDot(value: string) {
  return /^[\d.]$/.test(value);
}

function isLetter(value: string) {
  return /^[a-zA-Z]$/.test(value);
}

function isWordComponent(value: string) {
  return /^\w$/.test(value);
}

function isQuote(value: string) {
  return ["'", '"'].includes(value);
}

function getNumberLiteral(value: string) {
  const numberLiteral = +value;

  if (isNaN(numberLiteral)) {
    return undefined;
  }

  return numberLiteral;
}

function getBooleanLiteral(value: string) {
  switch (value.toUpperCase()) {
    case "TRUE":
      return true;
    case "FALSE":
      return false;
    default:
      return undefined;
  }
}

function getNullLiteral(value: string) {
  if (value.toUpperCase() === "NULL") {
    return null;
  }

  return undefined;
}

function getKeywordType(value: string) {
  switch (value.toUpperCase()) {
    case "SELECT":
      return TokenType.SELECT;
    case "FROM":
      return TokenType.FROM;
    case "WHERE":
      return TokenType.WHERE;
    case "AND":
      return TokenType.AND;
    case "OR":
      return TokenType.OR;
    case "NOT":
      return TokenType.NOT;
    case "INSERT":
      return TokenType.INSERT;
    case "INTO":
      return TokenType.INTO;
    case "VALUES":
      return TokenType.VALUES;
    case "UPDATE":
      return TokenType.UPDATE;
    case "SET":
      return TokenType.SET;
    case "DELETE":
      return TokenType.DELETE;
    case "CREATE":
      return TokenType.CREATE;
    case "TABLE":
      return TokenType.TABLE;
    case "IF":
      return TokenType.IF;
    case "EXISTS":
      return TokenType.EXISTS;
    case "DROP":
      return TokenType.DROP;
    case "RETURNING":
      return TokenType.RETURNING;
    case "NUMERIC":
      return TokenType.NUMERIC;
    case "TEXT":
      return TokenType.TEXT;
    case "BOOLEAN":
      return TokenType.BOOLEAN;
    default:
      return undefined;
  }
}
