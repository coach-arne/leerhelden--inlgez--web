import { Maximize2 } from 'lucide-react'

import { MermaidSvgDisplay } from '@/components/MermaidSvgDisplay'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMermaidRender } from '@/modules/compendiums/helpers/useMermaidRender'
import { cn } from '@/lib/utils'

type MermaidDiagramProps = {
  code: string
  className?: string
}

export function MermaidDiagram({ code, className }: MermaidDiagramProps) {
  const { svg, error, isLoading } = useMermaidRender(code)

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

  if (isLoading || !svg) {
    return (
      <div
        className={cn('h-24 animate-pulse rounded-md bg-muted', className)}
        aria-hidden
      />
    )
  }

  return (
    <div className={cn('group relative', className)}>
      <MermaidSvgDisplay svg={svg} variant="inline" />
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              className="absolute top-2 right-2 bg-background/90 shadow-sm backdrop-blur-sm"
              aria-label="Diagram vergroten"
            />
          }
        >
          <Maximize2 />
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Modelschema</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] w-full">
            <MermaidSvgDisplay svg={svg} variant="expanded" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
