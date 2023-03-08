import { LexicalParser } from "./parser";

export function parseLexicon(sql: string) {
  const parser = new LexicalParser(sql);
  return parser.parse();
}
