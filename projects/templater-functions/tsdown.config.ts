import { defineConfig, UserConfig } from 'tsdown'
import modules from 'node:module'

const config: UserConfig = {
  outDir: 'dist',
  target: 'node20.18',
  format: 'cjs',
  minify: true,
  external: [
    ...modules.builtinModules,
  ],
} as const

const entries = [
  './functions/unique_note.ts',
] as const

export default entries.map((entry) => defineConfig({ ...config, entry }))
