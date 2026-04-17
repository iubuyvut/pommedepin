import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Reservations API", () => {
  it("should create a reservation", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    const result = await caller.reservations.create({
      date: "2026-04-25",
      time: "20:00",
      guests: 2,
      name: "Jean Dupont",
      phone: "+32 2 374 27 36",
      email: "jean@example.com",
      notes: "Pas de piment s'il vous plaît",
    });

    expect(result).toBeDefined();
    expect(result.date).toBe("2026-04-25");
    expect(result.time).toBe("20:00");
    expect(result.guests).toBe(2);
    expect(result.name).toBe("Jean Dupont");
    expect(result.email).toBe("jean@example.com");
    expect(result.status).toBe("confirmed");
  });

  it("should retrieve a reservation by ID", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as any,
      res: {} as any,
    });

    // First create a reservation
    const created = await caller.reservations.create({
      date: "2026-04-26",
      time: "19:30",
      guests: 4,
      name: "Marie Martin",
      phone: "+32 2 374 27 36",
      email: "marie@example.com",
    });

    // Then retrieve it
    const retrieved = await caller.reservations.get({
      id: created.id,
    });

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.name).toBe("Marie Martin");
    expect(retrieved?.guests).toBe(4);
  });
});
