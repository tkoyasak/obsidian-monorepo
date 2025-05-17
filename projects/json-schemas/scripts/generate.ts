import { expandGlob } from '@std/fs/expand-glob'
import * as path from '@std/path'
import { Config, createGenerator } from 'ts-json-schema-generator'

const buildConfig = (path: string): Config => ({
  path,
  type: 'Config',
})

const map: [
  string,
  object,
][] = []

for await (const entry of expandGlob('./configs/*.ts')) {
  const config = buildConfig(entry.path)
  const output = path.join('schemas', entry.name.replace('.ts', '.json'))
  const schema = createGenerator(config).createSchema(config.type)
  map.push([output, schema])
}

for (const [output, schema] of map) {
  await Deno.writeTextFile(
    output,
    JSON.stringify(
      schema,
      null,
      2,
    ),
  )
}
