const keywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
];

const dataTypes = ["NUMERIC", "TEXT", "BOOLEAN"];

const operators = ["+", "-", "*", "/", "=", "!=", "<", ">", "<=", ">="];

const symbols = ["(", ")", ",", "."];

/**
 * Validates a character or a string.
 */
export class Validator {
  public static isWhitespace(character: string) {
    return " " === character;
  }

  public static isDigit(character: string) {
    return /^\d$/.test(character);
  }

  public static isDigitOrDot(character: string) {
    return /^[\d.]$/.test(character);
  }

  public static isLetter(character: string) {
    return /^[a-zA-Z]$/.test(character);
  }

  public static isWordComponent(character: string) {
    return /^[a-zA-Z\d_]$/.test(character);
  }

  public static isQuote(character: string) {
    return ["'", '"'].includes(character);
  }

  public static isMinus(character: string) {
    return "-" === character;
  }

  public static isSymbol(character: string) {
    return symbols.includes(character);
  }

  public static isOperatorInitial(character: string) {
    return operators.some((operator) => operator.startsWith(character));
  }

  public static isOperatorComponent(character: string) {
    return operators.some((operator) => operator.includes(character));
  }

  public static isNumberLiteral(sequence: string) {
    return !isNaN(Number(sequence));
  }

  public static isBooleanLiteral(sequence: string) {
    return ["TRUE", "FALSE"].includes(sequence.toUpperCase());
  }

  public static isNullLiteral(sequence: string) {
    return "NULL" === sequence.toUpperCase();
  }

  public static isKeyword(sequence: string) {
    return keywords.includes(sequence.toUpperCase());
  }

  public static isDataType(sequence: string) {
    return dataTypes.includes(sequence.toUpperCase());
  }

  public static isOperator(sequence: string) {
    return operators.includes(sequence);
  }
}
