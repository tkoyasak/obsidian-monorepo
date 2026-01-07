import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const VAULT_DIRS = process.env.VAULT_DIRS;

if (!VAULT_DIRS) {
  console.error("Error: VAULT_DIRS is not defined in .env");
  process.exit(1);
}

const vaultDirs = VAULT_DIRS.split(",").map((dir) => path.resolve(dir.trim()));

for (const vaultDir of vaultDirs) {
  if (!fs.existsSync(vaultDir)) {
    console.error(`Error: Vault directory does not exist: ${vaultDir}`);
    process.exit(1);
  }
}

const srcsDir = path.join(import.meta.dir, "../srcs");
const cssFiles = fs.readdirSync(srcsDir).filter((file) => file.endsWith(".css"));

if (cssFiles.length === 0) {
  console.log("No CSS files found in srcs directory");
  process.exit(0);
}

console.log(`Found ${cssFiles.length} CSS file(s) to deploy:`);
cssFiles.forEach((file) => console.log(`  - ${file}`));

for (const vaultDir of vaultDirs) {
  const snippetsDir = path.join(vaultDir, ".obsidian/snippets");

  console.log(`\nDeploying to: ${snippetsDir}`);

  try {
    await Bun.$`mkdir -p ${snippetsDir}`;

    for (const cssFile of cssFiles) {
      const srcPath = path.join(srcsDir, cssFile);
      const destPath = path.join(snippetsDir, path.basename(cssFile));

      await Bun.write(destPath, Bun.file(srcPath));
      console.log(`  ✓ Copied ${cssFile}`);
    }
  } catch (error) {
    console.error(`  ✗ Failed to deploy to ${vaultDir}:`, error);
  }
}

console.log("\nDeployment complete!");
