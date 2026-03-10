import { assert } from "./assert.js";

describe("assert", () => {
  it("does not throw when condition is truthy", () => {
    expect(() => assert(true, "should not throw")).not.toThrow();
  });

  it("throws with provided message when condition is falsy", () => {
    expect(() => assert(false, "boom")).toThrow("boom");
  });
});
