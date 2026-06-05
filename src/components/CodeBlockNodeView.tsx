import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

import { MermaidDiagram } from '@/components/MermaidDiagram'

export function CodeBlockNodeView({ node }: NodeViewProps) {
  const language = node.attrs.language as string | null | undefined
  const code = node.textContent

  if (language === 'mermaid') {
    return (
      <NodeViewWrapper as="div" className="my-3">
        <MermaidDiagram code={code} />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper as="div" className="my-3">
      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
        <code>{code}</code>
      </pre>
    </NodeViewWrapper>
  )
}
