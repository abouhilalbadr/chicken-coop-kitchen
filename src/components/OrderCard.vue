<script setup>
defineProps(['item', 'showDetails'])

const changeProductsType = (products) => {
  if(typeof products === 'string') {
    return JSON.parse(products)
  }
  return products
}

const types = [
  { name: 'Sur place', value: 'SUR_PLACE' },
  { name: 'À emporter', value: 'A_EMPORTER' },
  { name: 'Livraison', value: 'LIVRAISON' },
  { name: 'Gratuit', value: 'GRATUIT' },
]

const setType = (type) => {
  const activeType = types.find((t) => t.value === type)
  return activeType?.name || ''
}
</script>

<template>
  <div class="bg-white rounded-md p-4 flex flex-col gap-1 cursor-pointer">
    <div class="flex gap-2 items-center">
      <h3 class="text-2xl">La commande N&#186 {{ item.number }}</h3>
      <span class="text-black/60 text-xl">({{ setType(item.type) }})</span>
    </div>
    <div v-if="showDetails" class="flex flex-col gap-4 py-4">
      <div
        v-for="(product, index) in changeProductsType(item.products)"
        :key="index"
        class="flex flex-col gap-2"
      >
        <h2 class="text-black/80 text-lg font-bree-serif">{{ product.name }} <span v-if="product.size" class="uppercase text-main">({{ product.size }})</span></h2>
        <p class="flex flex-col gap-1 text-black/40">
          <span v-if="product.viandes && product.viandes.length > 0">Les viandes: {{ product.viandes.join(',  ') }}</span>
          <span v-if="product.sauces && product.sauces.length > 0">Les sauces: {{ product.sauces.join(', ') }}</span>
          <span v-if="product.extras && product.extras.length > 0">Les extras: {{ product.extras.join(', ') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>