import { useMemo, useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type MultiSelectOption = {
  value: string
  label: string
}

export type MultiSelectChipsProps = {
  id?: string
  options: MultiSelectOption[]
  selected: string[]
  onChange: (next: string[]) => void
  placeholder: string
  /** Toon zoekveld boven de lijst (handig bij veel opties). */
  enableSearch?: boolean
  /** Toon "Alles selecteren" / alles deselecteren wanneer er meer dan één optie is. */
  showSelectAll?: boolean
  /** Toon knop om alle selecties in één keer te wissen (terug naar leeg = alles). */
  showClearButton?: boolean
  emptyListMessage?: string
}

function orderSelectedByOptions(
  selected: string[],
  options: MultiSelectOption[],
): string[] {
  const index = new Map(options.map((o, i) => [o.value, i]))
  return [...selected].sort(
    (a, b) => (index.get(a) ?? 0) - (index.get(b) ?? 0),
  )
}

export function MultiSelectChips({
  id,
  options,
  selected,
  onChange,
  placeholder,
  enableSearch = false,
  showSelectAll = false,
  showClearButton = true,
  emptyListMessage = 'Geen opties',
}: MultiSelectChipsProps) {
  const [search, setSearch] = useState('')

  const orderedSelected = useMemo(
    () => orderSelectedByOptions(selected, options),
    [selected, options],
  )

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    )
  }, [options, search])

  const optionValues = useMemo(() => options.map((o) => o.value), [options])
  const allSelected =
    optionValues.length > 0 &&
    optionValues.every((v) => selected.includes(v))

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const selectAll = () => {
    onChange([...optionValues])
  }

  const clearAllSelection = () => {
    onChange([])
  }

  const removeOne = (value: string) => {
    onChange(selected.filter((v) => v !== value))
  }

  const triggerClassName = cn(
    'flex w-full max-w-md min-h-8 cursor-pointer items-start justify-between gap-2 rounded-lg border border-input bg-transparent py-1.5 pr-2 pl-2.5 text-left text-sm transition-colors outline-none select-none',
    'hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'dark:bg-input/30 dark:hover:bg-input/50',
  )

  return (
    <Popover.Root modal={false}>
      <Popover.Trigger
        id={id}
        nativeButton={false}
        className={triggerClassName}
        render={(props) => (
          <div {...props} className={cn(props.className)} />
        )}
      >
        <span className="flex min-h-6 flex-1 flex-wrap items-center gap-1.5 py-0.5">
          {orderedSelected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            orderedSelected.map((value) => {
              const label =
                options.find((o) => o.value === value)?.label ?? value
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="max-w-full gap-0.5 pr-0.5 font-normal"
                >
                  <span className="truncate">{label}</span>
                  <button
                    type="button"
                    className="inline-flex shrink-0 rounded-sm p-0.5 opacity-70 hover:opacity-100"
                    aria-label={`Verwijder ${label}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeOne(value)
                    }}
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              )
            })
          )}
        </span>
        <span className="flex shrink-0 items-center gap-0.5 self-center pt-0.5">
          {showClearButton && orderedSelected.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Alle selecties wissen"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                clearAllSelection()
              }}
            >
              <XIcon className="size-4" />
            </Button>
          ) : null}
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          sideOffset={4}
          align="start"
          className="z-50 outline-none"
        >
          <Popover.Popup
            className={cn(
              'w-(--anchor-width) max-h-[min(320px,70vh)] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10',
              'origin-[var(--transform-origin)] duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
              'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            )}
          >
            <div className="flex max-h-[inherit] flex-col">
              {enableSearch ? (
                <div className="shrink-0 border-b border-border p-2">
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Zoeken…"
                      className="h-8 pl-8"
                      aria-label="Zoek in opties"
                    />
                  </div>
                </div>
              ) : null}

              {showSelectAll && options.length > 1 ? (
                <label className="flex cursor-pointer items-center gap-2 border-b border-border px-2.5 py-2 text-sm hover:bg-muted/50">
                  <input
                    type="checkbox"
                    className="size-4 shrink-0 rounded border-input accent-foreground"
                    checked={allSelected}
                    onChange={() => {
                      if (allSelected) clearAllSelection()
                      else selectAll()
                    }}
                  />
                  <span>(Alles selecteren)</span>
                </label>
              ) : null}

              <div
                role="listbox"
                aria-multiselectable
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1"
              >
                {filteredOptions.length === 0 ? (
                  <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                    {emptyListMessage}
                  </p>
                ) : (
                  filteredOptions.map((opt) => {
                    const checked = selected.includes(opt.value)
                    return (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          className="size-4 shrink-0 rounded border-input accent-foreground"
                          checked={checked}
                          onChange={() => toggleValue(opt.value)}
                        />
                        <span className="min-w-0 flex-1 break-words">
                          {opt.label}
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
