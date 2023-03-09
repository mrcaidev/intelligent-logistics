import { Cursor } from "src/cursor";

export class LexicalCursor extends Cursor<string> {
  constructor(input: string) {
    super(input.trim().split(""));
  }
}
