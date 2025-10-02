import { describe, it, expect } from "bun:test";
import { signToken, verifyToken } from "../../src/utils/jwt";

describe("JWT utils", () => {
  it("should sign and verify a token", () => {
    const payload = { userId: 123 };
    const token = signToken(payload, "1h");
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(123);
  });

  it("should throw error for invalid token", () => {
    expect(() => verifyToken("invalid.token")).toThrow();
  });
});
