import type { TiptapDoc, TiptapNode } from '@/types/compendium'

function isMermaidCodeBlock(node: TiptapNode): boolean {
  return (
    node.type === 'codeBlock' &&
    'attrs' in node &&
    node.attrs?.language === 'mermaid'
  )
}

function walkNodeText(node: TiptapNode): string {
  if (isMermaidCodeBlock(node)) {
    return ''
  }
  if (node.type === 'text' && 'text' in node) {
    return node.text
  }
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(walkNodeText).join(' ')
  }
  return ''
}

function paragraphText(node: TiptapNode): string {
  return walkNodeText(node).replace(/\s+/g, ' ').trim()
}

export function extractFlashcardParagraphs(doc: TiptapDoc): string[] {
  if (!doc.content) return []

  return doc.content
    .map(paragraphText)
    .filter((text) => text.length > 0)
}

export function extractFlashcardDefinition(doc: TiptapDoc): string {
  return extractFlashcardParagraphs(doc).join('\n\n')
}

export function parseChapterFromText(text: string): number {
  const match = text.match(/\bH(\d{1,2})\b/i)
  if (!match?.[1]) return 0
  const chapter = Number(match[1])
  return Number.isFinite(chapter) && chapter > 0 ? chapter : 0
}

export function parseChapterFromDoc(doc: TiptapDoc): number {
  const paragraphs = extractFlashcardParagraphs(doc)
  for (const paragraph of paragraphs) {
    const chapter = parseChapterFromText(paragraph)
    if (chapter > 0) return chapter
  }
  return 0
}
