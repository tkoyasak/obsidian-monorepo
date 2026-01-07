import { builtinModules } from "node:module";
import path from "node:path";
import process from "node:process";

const srcsDir = path.join(import.meta.dir, "../srcs");
const distDir = path.join(import.meta.dir, "../dist");

const glob = new Bun.Glob("*.ts");
const entries: string[] = [];

for await (const file of glob.scan({ cwd: srcsDir })) {
  entries.push(path.join(srcsDir, file));
}

console.log(`Found ${entries.length} entry files:`);
entries.forEach((entry) => console.log(`  - ${entry}`));

for (const entry of entries) {
  const fileName = entry.split("/").pop()!.replace(".ts", ".js");
  const outfile = path.join(distDir, fileName);

  console.log(`\nBuilding ${fileName}...`);

  const result = await Bun.build({
    entrypoints: [entry],
    outdir: distDir,
    format: "cjs",
    target: "node",
    minify: true,
    external: [...builtinModules],
  });

  if (!result.success) {
    console.error(`Failed to build ${fileName}:`);
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  console.log(`✓ Built ${outfile}`);
}

console.log(`\n✓ Build completed successfully!`);
