import { parseLexicon } from "./lexicon";
import { parseSyntax } from "./syntax";

const sql = "INSERT INTO users(id, name) VALUES (1, 'John')";

const tokens = parseLexicon(sql);
const tree = parseSyntax(tokens);
console.log(JSON.stringify(tree, undefined, 2));
