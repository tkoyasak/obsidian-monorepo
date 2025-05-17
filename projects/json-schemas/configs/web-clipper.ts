export type Config =
  & {
    $schema?: string
  }
  & {
    schemaVersion?: '0.1.0'
    name: string
    noteContentFormat: string
    properties: {
      name: string
      value: string
      type?:
        | 'text'
        | 'multitext'
        | 'number'
        | 'checkbox'
        | 'date'
        | 'datetime'
    }[]
    triggers?: string[]
    context?: string
  }
  & (
    | {
      behavior:
        | 'append-daily'
        | 'prepend-daily'
      noteNameFormat?: string
      path?: string
    }
    | {
      behavior:
        | 'create'
        | 'append-specific'
        | 'prepend-specific'
        | 'overwrite'
      noteNameFormat: string
      path: string
    }
  )
