import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as v from "valibot";

const schemaDir = path.join(import.meta.dir, "../lib/schema");
const templatesDir = path.join(import.meta.dir, "../templates");

const schemaFiles = fs.readdirSync(schemaDir).filter((file) => file.endsWith(".ts"));

if (schemaFiles.length === 0) {
  console.log("No schema files found");
  process.exit(0);
}

let hasErrors = false;

for (const schemaFile of schemaFiles) {
  const schemaName = path.basename(schemaFile, ".ts");
  const schemaPath = path.join(schemaDir, schemaFile);
  const templateDir = path.join(templatesDir, schemaName);

  console.log(`\nValidating templates for schema: ${schemaName}`);

  if (!fs.existsSync(templateDir)) {
    console.warn(`  ⚠ Template directory not found: ${templateDir}`);
    continue;
  }

  const { schema } = await import(schemaPath);

  const templateFiles = fs.readdirSync(templateDir).filter((file) => file.endsWith(".json"));

  if (templateFiles.length === 0) {
    console.log(`  No template files found in ${templateDir}`);
    continue;
  }

  for (const templateFile of templateFiles) {
    const templatePath = path.join(templateDir, templateFile);
    const templateContent = await Bun.file(templatePath).text();

    try {
      const data = JSON.parse(templateContent);
      v.parse(schema, data);
      console.log(`  ✓ ${templateFile}`);
    } catch (error) {
      hasErrors = true;
      console.error(`  ✗ ${templateFile}`);
      if (error instanceof v.ValiError) {
        console.error("    ", JSON.stringify(v.flatten(error.issues), null, 2));
      } else {
        console.error("    ", error);
      }
    }
  }
}

if (hasErrors) {
  console.error("\n✗ Validation failed");
  process.exit(1);
} else {
  console.log("\n✓ All templates are valid");
}
