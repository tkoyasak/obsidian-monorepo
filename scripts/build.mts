import fs from 'node:fs'
import modules from 'node:module'
import process from 'node:process'

const targetDir = './functions'
const distDir = './dist'

const build = async (entry: string): Promise<void> => {
  await Bun.build({
    entrypoints: [entry],
    outdir: distDir,
    target: 'node',
    format: 'cjs',
    minify: true,
    external: [...modules.builtinModules],
    banner: `/**
 * https://github.com/oven-sh/bun v${Bun.version} — ${new Date().toISOString()}
 */
'use strict';`,
  })
}

const arg = process.argv[2]

if (arg === undefined) {
  const entries = fs.readdirSync(targetDir).filter((e) => e.endsWith('.ts'))
  for (const e of entries) {
    await build(`${targetDir}/${e}`)
  }
} else {
  if (!fs.existsSync(arg)) {
    console.error(`not found '${arg}'`)
    process.exit(1)
  }
  await build(arg)
}
