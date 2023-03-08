import { parseLexicon } from "./lexicon";
import { parseSyntax } from "./syntax";

const sql =
  "SELECT * FROM users WHERE price = null AND id = 1 OR salary = 1000;";

const tokens = parseLexicon(sql);
const tree = parseSyntax(tokens);
console.log(JSON.stringify(tree, undefined, 2));
