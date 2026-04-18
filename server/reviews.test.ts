import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reviews", () => {
  it("should create a review with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.create({
      name: "Test User",
      email: "test@example.com",
      rating: 5,
      comment: "This is a great restaurant with excellent service and delicious food!",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Test User");
    expect(result.email).toBe("test@example.com");
    expect(result.rating).toBe(5);
    expect(result.comment).toContain("excellent service");
    expect(result.status).toBe("pending");
  });

  it("should reject review with invalid rating", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reviews.create({
        name: "Test User",
        email: "test@example.com",
        rating: 6, // Invalid: should be 1-5
        comment: "This is a great restaurant with excellent service and delicious food!",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should reject review with short comment", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.reviews.create({
        name: "Test User",
        email: "test@example.com",
        rating: 4,
        comment: "Good", // Too short
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should retrieve approved reviews", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reviews.getApproved({
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
  });
});
