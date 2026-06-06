import { cn } from '@/lib/utils'

type MermaidSvgDisplayProps = {
  svg: string
  variant?: 'inline' | 'expanded'
  className?: string
}

export function MermaidSvgDisplay({
  svg,
  variant = 'inline',
  className,
}: MermaidSvgDisplayProps) {
  return (
    <div
      className={cn(
        '[&_svg]:mx-auto [&_svg]:max-w-none',
        variant === 'inline' &&
          'overflow-x-auto rounded-md border border-border bg-card p-4',
        variant === 'expanded' && 'min-w-max p-2',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
