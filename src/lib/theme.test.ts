import { describe, expect, it } from "vitest";
import { parseThemePreference, resolveTheme, THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "./theme";

describe("parseThemePreference", () => {
  it("accepts light and dark", () => {
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
  });

  it.each([null, "", "system", "blue", "DARK"])("treats %j as system", (value) => {
    expect(parseThemePreference(value)).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("follows the OS setting for system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("uses an explicit choice regardless of the OS setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("THEME_INIT_SCRIPT", () => {
  // Runs the script against a fake document and storage.
  function run(stored: string | null, storageThrows = false) {
    const attributes: Record<string, string> = {};
    const localStorage = {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    };
    const document = {
      documentElement: { setAttribute: (name: string, value: string) => (attributes[name] = value) },
    };
    new Function("localStorage", "document", THEME_INIT_SCRIPT)(localStorage, document);
    return attributes["data-theme"];
  }

  it("applies a stored choice", () => {
    expect(run("dark")).toBe("dark");
    expect(run("light")).toBe("light");
  });

  it("leaves the attribute unset when there is no valid choice", () => {
    expect(run(null)).toBeUndefined();
    expect(run("purple")).toBeUndefined();
  });

  it("does not throw when storage is blocked", () => {
    expect(run(null, true)).toBeUndefined();
  });
});
