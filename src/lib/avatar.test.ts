import { describe, expect, it } from "vitest";
import { avatarColor, avatarInitial } from "./avatar";

describe("avatarInitial", () => {
  it.each([
    ["Netflix", "N"],
    ["  spotify", "S"],
    ["iCloud+", "I"],
    ["1Password", "1"],
    ["(Work) Slack", "W"],
    ["Émile", "É"],
    ["", "?"],
    ["+++", "?"],
  ])("%j → %j", (name, expected) => {
    expect(avatarInitial(name)).toBe(expected);
  });
});

describe("avatarColor", () => {
  it("is stable for the same name, ignoring case and spaces", () => {
    expect(avatarColor("Netflix")).toBe(avatarColor("  netflix "));
  });

  it("returns a hex colour", () => {
    expect(avatarColor("Spotify")).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("spreads different names across colours", () => {
    const names = ["Netflix", "Spotify", "GitHub Copilot", "iCloud+", "Gym", "Adobe", "Notion", "Amazon Prime"];
    expect(new Set(names.map(avatarColor)).size).toBeGreaterThan(3);
  });
});
