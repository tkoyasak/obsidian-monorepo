import fs from 'node:fs'
import { ulid } from 'ulid'

const unique_note = async (tp: Tp, dir: string) => {
  if (!(tp.app.vault.adapter instanceof tp.obsidian.FileSystemAdapter)) {
    return
  }

  const templates = fs
    .readdirSync(tp.app.vault.adapter.getFullPath(dir), { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .filter((dirent) => dirent.name !== 'unique-note.md')
    .map((dirent) => dirent.name)

  const target = await tp.system.suggester(
    templates,
    templates,
    true,
    "Select a template. If the file isn't empty, only the file name will be changed.",
  )

  const id = ulid()
  const title = tp.file.title
  await tp.file.rename(id)

  tp.hooks.on_all_templates_executed(async () => {
    const file = tp.config.target_file
    const template = tp.file.find_tfile(target)

    if (template && (await tp.file.content).length === 0) {
      const content = await tp.app.vault.read(template)
      await tp.app.vault.modify(file, content)
    }

    await tp.app.fileManager.processFrontMatter(file, (fm) => {
      fm.id = id
      fm.created = tp.file.creation_date('YYYY-MM-DD')
      fm.modified = tp.file.last_modified_date('YYYY-MM-DD')
      fm.title = title
    })
  })
}

module.exports = unique_note
