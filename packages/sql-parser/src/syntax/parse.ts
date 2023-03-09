import type { Token } from "src/types";
import { SyntacticError } from "./error";
import {
  CreateParser,
  DeleteParser,
  InsertParser,
  SelectParser,
  UpdateParser,
} from "./parsers";

type Parser = {
  parse: () => unknown;
};

const getParserMap: Record<string, (tokens: Token[]) => Parser> = {
  SELECT: (tokens) => new SelectParser(tokens),
  INSERT: (tokens) => new InsertParser(tokens),
  UPDATE: (tokens) => new UpdateParser(tokens),
  DELETE: (tokens) => new DeleteParser(tokens),
  CREATE: (tokens) => new CreateParser(tokens),
};

export function parseSyntax(tokens: Token[]) {
  if (!tokens[0] || tokens[0].type !== "keyword") {
    throw new SyntacticError("Expect keyword at the beginning");
  }

  const keyword = tokens[0].value as string;
  const parser = getParserMap[keyword];

  if (!parser) {
    throw new SyntacticError(`Unknown keyword ${keyword} at the beginning`);
  }

  return parser(tokens).parse();
}
