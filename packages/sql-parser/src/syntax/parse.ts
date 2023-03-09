import type { Token } from "src/types";
import { SyntacticError } from "./error";
import { InsertParser, SelectParser, UpdateParser } from "./parsers";

export function parseSyntax(tokens: Token[]) {
  if (!tokens[0] || tokens[0].type !== "keyword") {
    throw new SyntacticError("Expect keyword at the beginning");
  }

  const keyword = tokens[0].value;

  switch (keyword) {
    case "SELECT": {
      const parser = new SelectParser(tokens);
      return parser.parse();
    }
    case "INSERT": {
      const parser = new InsertParser(tokens);
      return parser.parse();
    }
    case "UPDATE": {
      const parser = new UpdateParser(tokens);
      return parser.parse();
    }
    case "DELETE": {
      console.log("Not implemented");
      return;
    }
    case "CREATE": {
      console.log("Not implemented");
      return;
    }
    default:
      throw new SyntacticError(`Unknown keyword ${keyword} at the beginning`);
  }
}
