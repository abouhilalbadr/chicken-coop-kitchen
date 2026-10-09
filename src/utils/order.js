// One place for the shapes the board reads. Line items are JSON snapshots on
// the order, so they arrive either parsed or as a string depending on the route.

// Each type has its own solid colour so the cooks tell a Glovo bag from a
// table order at a glance on the old kitchen screens. Glovo keeps its brand
// yellow, which is what the riders' bags look like. Those screens wash purple
// into the same blue as Sur place, so À emporter is pink.
const TYPES = [
  { value: 'SUR_PLACE', name: 'Sur place', tone: 'bg-[#185fa5] text-white' },
  { value: 'A_EMPORTER', name: 'À emporter', tone: 'bg-[#c2185b] text-white' },
  { value: 'LIVRAISON', name: 'Livraison', tone: 'bg-[#0f6e56] text-white' },
  { value: 'GRATUIT', name: 'Gratuit', tone: 'bg-[#444441] text-white' },
  { value: 'GLOVO', name: 'Glovo', tone: 'bg-[#ffc244] text-[#3d2c00]' },
]

export const typeName = (type) => TYPES.find((t) => t.value === type)?.name || ''

export const typeTone = (type) =>
  TYPES.find((t) => t.value === type)?.tone || 'bg-[#444441] text-white'

// What goes into a line, each in its own tint: meat red, sauces amber,
// extras green — the same order the cook builds it in.
export const DETAILS = [
  { key: 'viandes', label: 'Viandes', tone: 'bg-[#fcebeb] text-[#791f1f]' },
  { key: 'sauces', label: 'Sauces', tone: 'bg-[#faeeda] text-[#633806]' },
  { key: 'extras', label: 'Extras', tone: 'bg-[#eaf3de] text-[#27500a]' },
]

export const parseProducts = (products) => {
  if (typeof products === 'string') {
    try {
      return JSON.parse(products)
    } catch {
      return []
    }
  }
  return products || []
}

// Total number of items, not lines — "3 articles" is what the cook counts.
export const itemCount = (products) =>
  parseProducts(products).reduce((sum, p) => sum + (parseInt(p.number) || 1), 0)

// Minutes since the order was rung up. The board leans on this to say which
// ticket has been waiting longest.
export const minutesSince = (at) => {
  if (!at) return null
  const diff = Date.now() - new Date(at).getTime()
  if (Number.isNaN(diff) || diff < 0) return 0
  return Math.floor(diff / 60000)
}

export const waitLabel = (minutes) => {
  if (minutes === null) return ''
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  return `${h} h ${minutes % 60} min`
}

// Late once it has been sitting for a quarter of an hour, urgent at half.
export const waitTone = (minutes) => {
  if (minutes === null) return 'neutral'
  if (minutes >= 30) return 'danger'
  if (minutes >= 15) return 'warning'
  return 'neutral'
}

