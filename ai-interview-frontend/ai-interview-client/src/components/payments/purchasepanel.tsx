import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const PRESETS = [50, 100, 250, 500]

export function PurchasePanel({
  onPurchase,
  isProcessing,
}: {
  onPurchase: (credits: number) => void
  isProcessing: boolean
}) {
  const [selected, setSelected] = useState<number>(100)
  const [customValue, setCustomValue] = useState('')
  const isCustom = customValue.trim().length > 0
  const credits = isCustom ? Number(customValue) : selected
  const isValid = Number.isInteger(credits) && credits > 0

  return (
    <div className="space-y-5">
      <div>
        <Label>Choose an amount</Label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRESETS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setSelected(amount)
                setCustomValue('')
              }}
              className={cn(
                'rounded-md border py-2.5 text-sm font-medium transition-colors',
                !isCustom && selected === amount
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-fg-muted hover:border-border-strong',
              )}
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="custom-credits">Or enter a custom amount</Label>
        <Input
          id="custom-credits"
          type="number"
          min={1}
          placeholder="e.g. 75"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          className="mt-2"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!isValid || isProcessing}
        onClick={() => onPurchase(credits)}
      >
        {isProcessing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Zap className="size-4" />
        )}
        Buy {isValid ? credits : ''} credits
      </Button>
    </div>
  )
}