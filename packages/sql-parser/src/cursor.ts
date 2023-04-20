/**
 * Iterates over a collection.
 *
 * @template T The type of each element in the collection.
 */
export class Cursor<T> {
  /**
   * The current index of the cursor.
   */
  private position = 0;

  constructor(private collection: T[]) {}

  /**
   * The current element.
   *
   * In order to bypass unnecessary null checks in TypeScript,
   * the return type is always coerced into `T`, even if the cursor
   * has crossed the boundary and points to `undefined`.
   *
   * This, however, delegates the responsibility of checking
   * the state of the cursor to the developer, so always remember
   * to ensure that the cursor is open before calling this method.
   */
  public get current() {
    return this.collection[this.position] as T;
  }

  /**
   * Returns the current element, and moves forward to the next one.
   */
  public consume() {
    const value = this.current;
    this.position++;
    return value;
  }

  /**
   * Returns true if the cursor has not reached the end
   * of the collection, or false otherwise.
   */
  public isOpen() {
    return this.position < this.collection.length;
  }
}
