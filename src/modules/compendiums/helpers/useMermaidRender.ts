import { useEffect, useId, useState } from 'react'

import { loadMermaid } from '@/modules/compendiums/helpers/mermaidConfig'

export function useMermaidRender(code: string) {
  const reactId = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setSvg(null)
    setError(null)
    setIsLoading(true)

    async function render() {
      try {
        const mermaid = await loadMermaid()
        const { svg: rendered } = await mermaid.render(
          `mermaid-${reactId}`,
          code.trim(),
        )

        if (!cancelled) {
          setSvg(rendered)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Kon diagram niet renderen',
          )
          setIsLoading(false)
        }
      }
    }

    void render()

    return () => {
      cancelled = true
    }
  }, [code, reactId])

  return { svg, error, isLoading }
}
