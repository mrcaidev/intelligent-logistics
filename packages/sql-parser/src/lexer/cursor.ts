import { Cursor } from "src/cursor";

/**
 * Cursor used by lexer.
 */
export class LexerCursor extends Cursor<string> {
  /**
   * Split the statement into single characters,
   * so that the cursor can iterate over each character.
   * @param statement A SQL statement.
   */
  constructor(statement: string) {
    super(statement.split(""));
  }

  /**
   * Consume all the characters that is permitted by the predicate function,
   * and land on the first character that is not.
   * @param predicate Predicate function that returns `true`
   * if the character should be consumed, or `false` otherwise.
   * @returns The consumed string.
   */
  public consumeAsLongAs(predicate: (character: string) => boolean) {
    let value = "";

    while (this.isOpen() && predicate(this.current)) {
      value += this.consume();
    }

    return value;
  }
}
