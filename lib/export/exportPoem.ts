export function exportPoemAsText(poem: { title?: string; content: string }) {
  const lines = [poem.title, '', poem.content].filter((l) => l !== undefined)
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${poem.title?.replace(/\s+/g, '-').toLowerCase() ?? 'poem'}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
