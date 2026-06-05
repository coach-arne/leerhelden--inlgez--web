import { useEffect, useId, useState } from 'react'

import { loadMermaid } from '@/modules/compendiums/helpers/mermaidConfig'
import { cn } from '@/lib/utils'

type MermaidDiagramProps = {
  code: string
  className?: string
}

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setSvg(null)
    setError(null)

    async function render() {
      try {
        const mermaid = await loadMermaid()
        const { svg: rendered } = await mermaid.render(
          `mermaid-${reactId}`,
          code.trim(),
        )

        if (!cancelled) {
          setSvg(rendered)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Kon diagram niet renderen',
          )
        }
      }
    }

    void render()

    return () => {
      cancelled = true
    }
  }, [code, reactId])

  if (error) {
    return (
      <div
        className={cn(
          'rounded-md border border-destructive/30 bg-destructive/5 p-3',
          className,
        )}
      >
        <p className="mb-2 text-sm text-destructive">{error}</p>
        <pre className="overflow-x-auto text-xs text-muted-foreground">
          {code}
        </pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div
        className={cn('h-24 animate-pulse rounded-md bg-muted', className)}
        aria-hidden
      />
    )
  }

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-md border border-border bg-card p-4',
        '[&_svg]:mx-auto [&_svg]:max-w-none',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
