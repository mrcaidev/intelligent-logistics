export class Cursor<T> {
  private _position: number;

  constructor(private iterable: T[]) {
    this._position = 0;
  }

  public current() {
    return this.iterable[this._position] as T;
  }

  public position() {
    return this._position;
  }

  public forward() {
    this._position++;
  }

  public backward() {
    this._position--;
  }

  public close() {
    this._position = this.iterable.length;
  }

  public isOpen() {
    return this._position < this.iterable.length;
  }
}
