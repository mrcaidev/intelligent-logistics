import { LexicalParser } from "./parser";

export function parseLexicon(input: string) {
  const parser = new LexicalParser(input);
  return parser.parse();
}
