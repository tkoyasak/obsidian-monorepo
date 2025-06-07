import { builtinModules } from 'node:module'
import deno from '@deno/rolldown-plugin'
import { expandGlob } from '@std/fs'
import { defineConfig } from 'tsdown'

const paths: string[] = []

for await (const entry of expandGlob('./functions/*.ts')) {
  paths.push(entry.path)
}

export default defineConfig(
  paths.map((entry) => ({
    entry,
    target: 'node20.18',
    format: 'cjs',
    minify: true,
    external: [
      ...builtinModules,
    ],
    plugins: [
      deno(),
    ],
  })),
)
