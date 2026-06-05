import { useEffect } from 'react'
import CodeBlock from '@tiptap/extension-code-block'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { CodeBlockNodeView } from '@/components/CodeBlockNodeView'
import type { TiptapDoc } from '@/types/compendium'
import { cn } from '@/lib/utils'

type RichTextViewerProps = {
  doc: TiptapDoc
  className?: string
}

export function RichTextViewer({ doc, className }: RichTextViewerProps) {
  const editor = useEditor({
    editable: false,
    content: doc,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlock.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockNodeView)
        },
      }),
    ],
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(doc)
    }
  }, [editor, doc])

  return (
    <EditorContent
      editor={editor}
      className={cn(
        'prose prose-sm max-w-none',
        '[&_.ProseMirror]:outline-none',
        '[&_.ProseMirror_p]:mb-3 [&_.ProseMirror_p:last-child]:mb-0',
        '[&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ol]:my-3',
        '[&_.ProseMirror_li]:my-1',
        className,
      )}
    />
  )
}
