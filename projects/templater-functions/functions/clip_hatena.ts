import { ulid } from 'ulid'

const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
const hatenaKeywordLink = /https:\/\/d\.hatena\.ne\.jp\/keyword\/.*/

const isMatching = (s: string): boolean => hatenaKeywordLink.test(s)

const clip_hatena = async (tp: Tp) => {
  const id = ulid()
  const title = tp.file.title
  await tp.file.rename(id)

  tp.hooks.on_all_templates_executed(async () => {
    const file = tp.config.target_file

    const content = await tp.app.vault.read(file)
    const newContent = content.replace(
      markdownLinkRegex,
      (match, text, url) => isMatching(url) ? text : match,
    )

    await tp.app.vault.modify(tp.config.target_file, newContent)
    await tp.app.fileManager.processFrontMatter(file, (fm) => {
      fm.id = id
      fm.created = tp.file.creation_date('YYYY-MM-DD')
      fm.modified = tp.file.last_modified_date('YYYY-MM-DD')
      fm.title = title
    })
  })

  return id
}

module.exports = clip_hatena
