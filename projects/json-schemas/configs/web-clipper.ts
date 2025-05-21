export type Config =
  & {
    /**
     * Save behavior.
     */
    behavior:
      | 'append-daily'
      | 'append-specific'
      | 'create'
      | 'overwrite'
      | 'prepend-daily'
      | 'prepend-specific'

    /**
     * Template name.
     */
    name: string

    /**
     * Format for the file name of the note. You can use variables like {{title}}, {{date}}, and {{published}} to pre-populate data from the page.
     *
     * For references, see https://help.obsidian.md/web-clipper/variables
     */
    noteNameFormat: string

    /**
     * Customize the content of the note. Use variables to pre-populate data from the page.
     *
     * For references, see https://help.obsidian.md/web-clipper/variables
     */
    noteContentFormat: string

    /**
     * The folder or path of the note.
     */
    path: string

    /**
     * Properties to add to the top of the clipped note. Use variables to pre-populate data from the page.
     */
    properties: {
      /**
       * Property name.
       */
      name: string

      /**
       * Data type of Obsidian properties.
       */
      type:
        | 'checkbox'
        | 'date'
        | 'datetime'
        | 'multitext'
        | 'number'
        | 'text'

      /**
       * Variables can be used here.
       *
       * For reference, see https://help.obsidian.md/web-clipper/variables
       */
      value: string
    }[]

    /**
     * Schema version is currently v0.1.0.
     *
     * See https://github.com/obsidianmd/obsidian-clipper/blob/main/src/utils/import-export.ts#L14
     */
    schemaVersion: '0.1.0'

    /**
     * Define rules to automatically select this template if it matches a URL pattern or contains schema.org data.
     */
    triggers: string[]
  }
  & Partial<{
    /**
     * The context used to interpret prompt variables. Overrides the default context defined in Interpreter settings. Variables can be used here.
     *
     * For references, see https://help.obsidian.md/web-clipper/interpreter
     */
    context: string
  }>
