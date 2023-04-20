import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { preprocess } from "./preprocess";

/**
 * Parses a string into a list of ASTs.
 */
export function parse(input: string) {
  return preprocess(input)
    .map((statement) => new Lexer(statement).tokenize())
    .map((tokens) => new Parser(tokens).parse());
}
