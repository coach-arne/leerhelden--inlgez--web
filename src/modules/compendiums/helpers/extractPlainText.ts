import type { TiptapDoc, TiptapNode } from '@/types/compendium'

function walkNode(node: TiptapNode): string {
  if (node.type === 'text' && 'text' in node) {
    return node.text
  }
  if ('content' in node && Array.isArray(node.content)) {
    return node.content.map(walkNode).join(' ')
  }
  return ''
}

export function extractPlainText(doc: TiptapDoc): string {
  if (!doc.content) return ''
  return doc.content
    .map(walkNode)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
