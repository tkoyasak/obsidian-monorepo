import { expandGlob } from '@std/fs'
import * as path from '@std/path'
import { consola } from 'consola'

const map: [
  string,
  string[],
][] = []

for await (const schema of expandGlob('../json-schemas/schemas/*.json')) {
  const name = path.basename(schema.name, '.json')
  const glob = path.join('./templates', name, '*.json')
  const targets = []
  for await (const entry of expandGlob(glob)) {
    targets.push(path.relative('../', entry.path))
  }
  map.push([schema.path, targets])
}

const decoder = new TextDecoder()
let final = 0

for (const [schema, targets] of map) {
  const command = new Deno.Command('jsonschema-cli', {
    args: [
      schema,
      ...targets.flatMap((i) => ['-i', i]),
    ],
  })
  const { stdout, stderr, code } = await command.output()
  const out = decoder.decode(stdout)
  const err = decoder.decode(stderr)
  const name = path.relative('../', schema)

  consola.info(`schema: ${name}`)
  consola.log(out)

  err ? consola.error(err) : code
    ? consola.error(
      'One or more instances are invalid. jsonschema-cli exited with code 1.\n',
    )
    : consola.success(
      'All validations success. jsonschema-cli exited with code 0.\n',
    )

  final |= code
}

Deno.exit(final)
