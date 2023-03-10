import { Lexer } from "./lexer";

// const sql = "SELECT id, name FROM users WHERE id = 1 AND name = 'John'";
// const sql = "INSERT INTO users VALUES (1, 'John')";
// const sql = "UPDATE users SET name = 'John', age = 24 WHERE id = 1";
const sql = "DELETE FROM users WHERE id = 1.1.1";
// const sql = "CREATE TABLE users (id NUMERIC, name TEXT)";

const tokens = new Lexer(sql).tokenize();
console.log(tokens);
