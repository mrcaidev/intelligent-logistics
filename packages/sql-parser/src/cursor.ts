export class Cursor<T> {
  private position: number;

  constructor(private iterable: T[]) {
    this.position = 0;
  }

  public get current() {
    return this.iterable[this.position] as T;
  }

  public consume() {
    const value = this.current;
    this.position++;
    return value;
  }

  public isOpen() {
    return this.position < this.iterable.length;
  }

  public isClosed() {
    return this.position >= this.iterable.length;
  }
}
