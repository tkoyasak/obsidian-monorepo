import { defineConfig } from 'tsdown'
import modules from 'node:module'

export default defineConfig(({ entry }) => ({
  entry,
  outDir: 'dist',
  target: 'node20.18',
  format: 'cjs',
  minify: true,
  external: [...modules.builtinModules],
}))
