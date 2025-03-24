import fs from 'node:fs'
import modules from 'node:module'
import process from 'node:process'

const FUNCS_DIR = './functions'
const DIST_DIR = './dist'

const build = async (entry: string): Promise<void> => {
  if (!fs.existsSync(entry)) {
    console.error(`ERROR: not found \`${entry}\``)
    process.exit(1)
  }

  await Bun.build({
    entrypoints: [entry],
    outdir: DIST_DIR,
    target: 'node',
    format: 'cjs',
    minify: true,
    external: [...modules.builtinModules],
    banner: `/**
 * https://github.com/oven-sh/bun v${Bun.version} — ${new Date().toISOString()}
 */`,
  })
}

const arg = process.argv[2]

if (arg === undefined) {
  const entries = fs.readdirSync(FUNCS_DIR).filter((e) => e.endsWith('.ts'))
  for (const e of entries) {
    await build(`${FUNCS_DIR}/${e}`)
  }
} else {
  await build(arg)
}
