/**
 * Iterates over a collection.
 * @template T The type of the elements in the collection.
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
   * Note: To make the cursor work better with TypeScript,
   * the return type is always cast to `T`, even if
   * it has crossed the boundary and points to `undefined`.
   */
  public get current() {
    return this.collection[this.position] as T;
  }

  /**
   * Returns the current element, and moves forward to the next element.
   */
  public consume() {
    const value = this.current;
    this.position++;
    return value;
  }

  /**
   * Returns true if the cursor has not reached the end of the collection,
   * or false otherwise.
   */
  public isOpen() {
    return this.position < this.collection.length;
  }
}
