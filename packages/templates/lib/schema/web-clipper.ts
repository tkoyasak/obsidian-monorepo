import * as v from "valibot";

export const schema = v.object({
  /**
   * Schema version is currently v0.1.0.
   *
   * See https://github.com/obsidianmd/obsidian-clipper/blob/main/src/utils/import-export.ts#L15
   */
  schemaVersion: v.literal("0.1.0"),

  /**
   * Template name.
   */
  name: v.string(),

  /**
   * Save behavior.
   */
  behavior: v.picklist([
    "append-daily",
    "append-specific",
    "create",
    "overwrite",
    "prepend-daily",
    "prepend-specific",
  ]),

  /**
   * Customize the content of the note. Use variables to pre-populate data from the page.
   *
   * For references, see https://help.obsidian.md/web-clipper/variables
   */
  noteContentFormat: v.string(),

  /**
   * Properties to add to the top of the clipped note. Use variables to pre-populate data from the page.
   */
  properties: v.array(
    v.object({
      /**
       * Property name.
       */
      name: v.string(),

      /**
       * Data type of Obsidian properties.
       */
      type: v.picklist(["checkbox", "date", "datetime", "multitext", "number", "text"]),

      /**
       * Variables can be used here.
       *
       * For reference, see https://help.obsidian.md/web-clipper/variables
       */
      value: v.string(),
    }),
  ),

  /**
   * Define rules to automatically select this template if it matches a URL pattern or contains schema.org data.
   */
  triggers: v.array(v.pipe(v.string(), v.url())),

  /**
   * Format for the file name of the note. You can use variables like {{title}}, {{date}}, and {{published}} to pre-populate data from the page.
   *
   * For references, see https://help.obsidian.md/web-clipper/variables
   */
  noteNameFormat: v.string(),

  /**
   * The folder or path of the note.
   */
  path: v.string(),

  /**
   * The context used to interpret prompt variables. Overrides the default context defined in Interpreter settings. Variables can be used here.
   *
   * For references, see https://help.obsidian.md/web-clipper/interpreter
   */
  context: v.optional(v.string()),
});
