/**
 * A pointer to some position in an iterable.
 * @template T The type of the items in the iterable.
 */
export class Cursor<T> {
  /**
   * Current index of the cursor in the iterable.
   */
  private position: number;

  /**
   * Store the iterable and point the cursor to the first item.
   */
  constructor(private iterable: T[]) {
    this.position = 0;
  }

  /**
   * The current item in the iterable.
   *
   * Note: The return type is cast to `T` even when the cursor
   * has crossed the boundary and pointed to `undefined`.
   */
  public get current() {
    return this.iterable[this.position] as T;
  }

  /**
   * Return the current item, and move one step forward.
   */
  public consume() {
    const value = this.current;
    this.position++;
    return value;
  }

  /**
   * Check if the cursor is still iterating over the iterable.
   */
  public isOpen() {
    return this.position < this.iterable.length;
  }

  /**
   * Check if the cursor has finished iterating over the iterable.
   */
  public isClosed() {
    return this.position >= this.iterable.length;
  }
}
