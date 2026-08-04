// One place for the shapes the board reads. Line items are JSON snapshots on
// the order, so they arrive either parsed or as a string depending on the route.

const TYPES = [
  { value: 'SUR_PLACE', name: 'Sur place' },
  { value: 'A_EMPORTER', name: 'À emporter' },
  { value: 'LIVRAISON', name: 'Livraison' },
  { value: 'GRATUIT', name: 'Gratuit' },
  { value: 'GLOVO', name: 'Glovo' },
]

export const typeName = (type) => TYPES.find((t) => t.value === type)?.name || ''

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
