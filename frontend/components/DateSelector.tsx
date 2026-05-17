'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function DateSelector({ value }: { value: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateDate(nextDate: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', nextDate)
    router.push(`/?${params.toString()}`)
  }

  return (
    <label className="block rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
      <span className="block text-slate-400">Data Date</span>
      <input
        type="date"
        value={value}
        onChange={(event) => updateDate(event.target.value)}
        className="mt-1 w-full bg-transparent font-mono text-white outline-none [color-scheme:dark]"
      />
    </label>
  )
}
