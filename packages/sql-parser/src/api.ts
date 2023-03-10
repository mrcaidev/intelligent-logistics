import { Lexer } from "./lexer";
import { Parser } from "./parser";

export function parse(sql: string) {
  const lexer = new Lexer(sql);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  return ast;
}
