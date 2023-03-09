import type { Token } from "src/types";
import { SyntacticCursor } from "../cursor";

export class CreateParser {
  private cursor: SyntacticCursor;

  constructor(tokens: Token[]) {
    this.cursor = new SyntacticCursor(tokens);
  }

  public parse() {
    this.cursor.consumeByValue("CREATE");
    this.cursor.consumeByValue("TABLE");
    const table = this.cursor.consumeByType("identifier") as string;
    this.cursor.consumeByValue("(");
    const definitions = this.cursor.consumeManyDefinitions();
    this.cursor.consumeByValue(")");

    return {
      type: "create",
      table,
      definitions,
    };
  }
}
