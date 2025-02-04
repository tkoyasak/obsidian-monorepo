import { ulid } from 'ulid'

const unique_note = async (tp: Tp, templates: string[]) => {
  if ((await tp.file.content).length > 0) {
    new tp.obsidian.Notice(
      `ERROR: '${tp.config.target_file.path}' is not empty`,
    )
    return
  }

  const path = await tp.system.suggester(
    templates,
    templates,
    true,
    'Select a template',
  )

  const id = ulid()
  const title = tp.file.title
  await tp.file.rename(id)

  tp.hooks.on_all_templates_executed(async () => {
    const file = tp.config.target_file
    const template = tp.file.find_tfile(path)
    // @ts-ignore
    const content = await tp.app.vault.read(template)
    await tp.app.vault.modify(file, content)
    await tp.app.fileManager.processFrontMatter(file, (fm) => {
      fm.id = id
      fm.created = tp.file.creation_date('YYYY-MM-DD')
      fm.modified = tp.file.last_modified_date('YYYY-MM-DD')
      fm.title = title
    })
  })
}

module.exports = unique_note
