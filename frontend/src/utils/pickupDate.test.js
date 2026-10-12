import assert from "node:assert/strict";
import test from "node:test";

import { getPickupDate } from "./pickupDate.js";

test("uses the local calendar date for pickup orders", () => {
  const shortlyAfterMidnightInSpain = new Date("2026-09-21T00:30:00+02:00");

  assert.equal(getPickupDate("today-13:00", shortlyAfterMidnightInSpain), "2026-09-21");
  assert.equal(getPickupDate("tomorrow-13:00", shortlyAfterMidnightInSpain), "2026-09-22");
});

test("uses the restaurant calendar date regardless of the customer's timezone", () => {
  assert.equal(getPickupDate("2026-10-14T21:00", new Date("2026-10-13T01:00:00Z")), "2026-10-14");
});
