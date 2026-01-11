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

const distDir = path.join(import.meta.dir, "../dist");
const jsFiles = fs.readdirSync(distDir).filter((file) => file.endsWith(".js"));

if (jsFiles.length === 0) {
  console.log("No JS files found in dist directory");
  process.exit(0);
}

console.log(`Found ${jsFiles.length} JS file(s) to deploy:`);
jsFiles.forEach((file) => console.log(`  - ${file}`));

for (const vaultDir of vaultDirs) {
  const scriptsDir = path.join(vaultDir, ".obsidian/scripts");

  console.log(`\nDeploying to: ${scriptsDir}`);

  try {
    await Bun.$`mkdir -p ${scriptsDir}`;

    for (const jsFile of jsFiles) {
      const srcPath = path.join(distDir, jsFile);
      const destPath = path.join(scriptsDir, path.basename(jsFile));

      await Bun.write(destPath, Bun.file(srcPath));
      console.log(`  ✓ Copied ${jsFile}`);
    }
  } catch (error) {
    console.error(`  ✗ Failed to deploy to ${vaultDir}:`, error);
  }
}

console.log("\nDeployment complete!");
