import { expandGlob } from '@std/fs'
import * as path from '@std/path'
import { consola } from 'consola'
import { Config, createGenerator } from 'ts-json-schema-generator'

const buildOutputPath = (entry: string) => {
  return path.format({
    dir: 'schemas',
    ext: '.json',
    name: path.basename(entry, '.ts'),
  })
}

const createSchema = (entry: string) => {
  const config: Config = {
    path: entry,
    type: 'Config',
  }
  return createGenerator(config).createSchema(config.type)
}

for await (const entry of expandGlob('./configs/*.ts')) {
  consola.info(`generating schema for ${entry.path}`)
  const output = buildOutputPath(entry.path)
  const schema = createSchema(entry.path)

  await Deno.writeTextFile(
    output,
    JSON.stringify(
      schema,
      null,
      2,
    ),
  )

  consola.success(`schmea generated: ${output}`)
}
