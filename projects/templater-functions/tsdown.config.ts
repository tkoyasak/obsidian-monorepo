import { expandGlob } from '@std/fs'
import modules from 'node:module'
import { defineConfig } from 'tsdown'

const configs: ReturnType<typeof defineConfig>[] = []

for await (const entry of expandGlob('./functions/*.ts')) {
  configs.push(
    defineConfig({
      entry: entry.path,
      target: 'node20.18',
      format: 'cjs',
      minify: true,
      external: [
        ...modules.builtinModules,
      ],
    }),
  )
}

export default configs
