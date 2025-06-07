import { assertExists } from '@std/assert'
import '@std/dotenv/load'
import { exists, expandGlob } from '@std/fs'
import * as path from '@std/path'
import { consola } from 'consola'

const destDir = Deno.env.get('TEMPLATER_FUNCTIONS_DIR')
assertExists(destDir)

if (!await exists(destDir, { isDirectory: true })) {
  consola.error(`dir: '${destDir}' does not exist`)
  Deno.exit(1)
}

for await (const file of expandGlob('./dist/*.js')) {
  await Deno.copyFile(
    file.path,
    path.join(destDir, file.name),
  )
  consola.success(`copied '${file.name}'`)
}
