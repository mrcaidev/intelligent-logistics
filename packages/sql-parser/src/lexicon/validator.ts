const keywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "NOT",
  "IN",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "DROP",
];

export class Validator {
  public static isWhitespace(character: string) {
    return /^\s$/.test(character);
  }

  public static isDigit(character: string) {
    return /^\d$/.test(character);
  }

  public static isDigitOrDot(character: string) {
    return /^\d|\.$/.test(character);
  }

  public static isLetter(character: string) {
    return /^[a-z]$/i.test(character);
  }

  public static isBoolean(sequence: string) {
    return /^true|false$/i.test(sequence);
  }

  public static isNull(sequence: string) {
    return /^null$/i.test(sequence);
  }

  public static isQuote(character: string) {
    return /^['"]$/.test(character);
  }

  public static isSymbol(character: string) {
    return /^[+\-*/=<>.!(),;]$/.test(character);
  }

  public static isKeyword(sequence: string) {
    return keywords.includes(sequence.toUpperCase());
  }
}
