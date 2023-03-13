import { Cursor } from "src/cursor";

/**
 * Iterates over every character.
 */
export class CharacterCursor extends Cursor<string> {
  constructor(statement: string) {
    super(statement.split(""));
  }

  /**
   * Consumes all characters permitted by the predicate function,
   * and returns the consumed string.
   * The predicate function returns true if the given character
   * should be consumed, or false otherwise.
   */
  public consumeAsLongAs(predicate: (character: string) => boolean) {
    let value = "";

    while (this.isOpen() && predicate(this.current)) {
      value += this.consume();
    }

    return value;
  }
}
