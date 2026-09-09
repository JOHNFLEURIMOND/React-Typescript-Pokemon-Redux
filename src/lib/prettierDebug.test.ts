import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
import { it } from "vitest";

it("prints the canonical analytics test formatting", async () => {
  const target = fileURLToPath(new URL("./googleAnalytics.test.ts", import.meta.url));
  const source = readFileSync(target, "utf8");
  const config = await resolveConfig(target);
  const formatted = await format(source, {
    ...(config ?? {}),
    filepath: target,
  });

  console.log(`PRETTIER_OUTPUT_START\n${formatted}PRETTIER_OUTPUT_END`);
});
