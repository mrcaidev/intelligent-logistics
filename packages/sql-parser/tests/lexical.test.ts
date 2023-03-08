import { LexicalError, parseLexicon } from "src/lexicon";
import { describe, expect, it } from "vitest";

describe("empty input", () => {
  it("returns empty list", () => {
    const result = parseLexicon("   ");
    expect(result).toEqual([]);
  });
});

describe("number literal", () => {
  it("parses integer", () => {
    const result = parseLexicon("1");
    expect(result).toEqual([{ type: "literal", value: 1 }]);
  });

  it("parses decimal", () => {
    const result = parseLexicon("1.1");
    expect(result).toEqual([{ type: "literal", value: 1.1 }]);
  });

  it("parses negative integer", () => {
    const result = parseLexicon("-1");
    expect(result).toEqual([{ type: "literal", value: -1 }]);
  });

  it("parses negative decimal", () => {
    const result = parseLexicon("-1.1");
    expect(result).toEqual([{ type: "literal", value: -1.1 }]);
  });

  it("throws error on invalid number", () => {
    const result = () => parseLexicon("1.1.1");
    expect(result).toThrowError(LexicalError);
  });
});

describe("string literal", () => {
  it("parses single quoted string", () => {
    const result = parseLexicon("'John'");
    expect(result).toEqual([{ type: "literal", value: "John" }]);
  });

  it("parses double quoted string", () => {
    const result = parseLexicon('"John"');
    expect(result).toEqual([{ type: "literal", value: "John" }]);
  });

  it("parses empty single quoted string", () => {
    const result = parseLexicon("''");
    expect(result).toEqual([{ type: "literal", value: "" }]);
  });

  it("parses empty double quoted string", () => {
    const result = parseLexicon('""');
    expect(result).toEqual([{ type: "literal", value: "" }]);
  });

  it("throws error on unterminated single quoted string", () => {
    const result = () => parseLexicon("'John");
    expect(result).toThrowError(LexicalError);
  });

  it("throws error on unterminated double quoted string", () => {
    const result = () => parseLexicon('"John');
    expect(result).toThrowError(LexicalError);
  });
});

describe("boolean literal", () => {
  it("parses true", () => {
    const result = parseLexicon("true");
    expect(result).toEqual([{ type: "literal", value: true }]);
  });

  it("parses false", () => {
    const result = parseLexicon("false");
    expect(result).toEqual([{ type: "literal", value: false }]);
  });

  it("ignores case", () => {
    const result = parseLexicon("TrUe");
    expect(result).toEqual([{ type: "literal", value: true }]);
  });
});

describe("null literal", () => {
  it("parses null", () => {
    const result = parseLexicon("null");
    expect(result).toEqual([{ type: "literal", value: null }]);
  });

  it("ignores case", () => {
    const result = parseLexicon("NuLl");
    expect(result).toEqual([{ type: "literal", value: null }]);
  });
});

describe("keyword", () => {
  it("parses SELECT", () => {
    const result = parseLexicon("SELECT");
    expect(result).toEqual([{ type: "keyword", value: "SELECT" }]);
  });

  it("parses FROM", () => {
    const result = parseLexicon("FROM");
    expect(result).toEqual([{ type: "keyword", value: "FROM" }]);
  });

  it("parses WHERE", () => {
    const result = parseLexicon("WHERE");
    expect(result).toEqual([{ type: "keyword", value: "WHERE" }]);
  });

  it("parses AND", () => {
    const result = parseLexicon("AND");
    expect(result).toEqual([{ type: "keyword", value: "AND" }]);
  });

  it("ignores case", () => {
    const result = parseLexicon("SeLeCt");
    expect(result).toEqual([{ type: "keyword", value: "SELECT" }]);
  });
});

describe("identifier", () => {
  it("parses single word", () => {
    const result = parseLexicon("users");
    expect(result).toEqual([{ type: "identifier", value: "users" }]);
  });

  it("parses multiple words", () => {
    const result = parseLexicon("users.name");
    expect(result).toEqual([
      { type: "identifier", value: "users" },
      { type: "operator", value: "." },
      { type: "identifier", value: "name" },
    ]);
  });
});

describe("operator", () => {
  it("parses *", () => {
    const result = parseLexicon("*");
    expect(result).toEqual([{ type: "operator", value: "*" }]);
  });

  it("parses -", () => {
    const result = parseLexicon("-");
    expect(result).toEqual([{ type: "operator", value: "-" }]);
  });

  it("parses <=", () => {
    const result = parseLexicon("<=");
    expect(result).toEqual([{ type: "operator", value: "<=" }]);
  });
});

describe("comment", () => {
  it("parses empty comment", () => {
    const result = parseLexicon("--");
    expect(result).toEqual([{ type: "comment", value: "" }]);
  });

  it("parses normal comment", () => {
    const result = parseLexicon("-- a b c ");
    expect(result).toEqual([{ type: "comment", value: "a b c" }]);
  });
});

describe("statements", () => {
  it("parses SELECT * FROM users WHERE salary = 9832.57 AND name = 'John'", () => {
    const result = parseLexicon(
      "SELECT * FROM users WHERE salary = 9832.57 AND name = 'John'"
    );
    expect(result).toEqual([
      { type: "keyword", value: "SELECT" },
      { type: "operator", value: "*" },
      { type: "keyword", value: "FROM" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "salary" },
      { type: "operator", value: "=" },
      { type: "literal", value: 9832.57 },
      { type: "keyword", value: "AND" },
      { type: "identifier", value: "name" },
      { type: "operator", value: "=" },
      { type: "literal", value: "John" },
    ]);
  });

  it("parses INSERT INTO users (name, age) VALUES ('John', 30)", () => {
    const result = parseLexicon(
      "INSERT INTO users (name, age) VALUES ('John', 30)"
    );
    expect(result).toEqual([
      { type: "keyword", value: "INSERT" },
      { type: "keyword", value: "INTO" },
      { type: "identifier", value: "users" },
      { type: "operator", value: "(" },
      { type: "identifier", value: "name" },
      { type: "operator", value: "," },
      { type: "identifier", value: "age" },
      { type: "operator", value: ")" },
      { type: "keyword", value: "VALUES" },
      { type: "operator", value: "(" },
      { type: "literal", value: "John" },
      { type: "operator", value: "," },
      { type: "literal", value: 30 },
      { type: "operator", value: ")" },
    ]);
  });

  it("parses UPDATE users SET age = 24 WHERE id = 1", () => {
    const result = parseLexicon("UPDATE users SET age = 24 WHERE id = 1");
    expect(result).toEqual([
      { type: "keyword", value: "UPDATE" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "SET" },
      { type: "identifier", value: "age" },
      { type: "operator", value: "=" },
      { type: "literal", value: 24 },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "id" },
      { type: "operator", value: "=" },
      { type: "literal", value: 1 },
    ]);
  });

  it("parses DELETE FROM users WHERE id = 1", () => {
    const result = parseLexicon("DELETE FROM users WHERE id = 1");
    expect(result).toEqual([
      { type: "keyword", value: "DELETE" },
      { type: "keyword", value: "FROM" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "id" },
      { type: "operator", value: "=" },
      { type: "literal", value: 1 },
    ]);
  });
});
