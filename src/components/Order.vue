<script setup>
defineProps(['item'])

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
  <div class="flex flex-col gap-6">
    <div class="flex gap-2 items-center">
      <h2 class="text-2xl font-bold py-2">La commande N&#186 {{ item.number }}</h2>
      <span class="text-black/60 text-lg">({{ setType(item.type) }})</span>
    </div>
    <div class="flex flex-col gap-8 py-4">
      <div
        v-for="(product, index) in changeProductsType(item.products)"
        :key="index"
        class="flex items-center gap-8"
      >
        <img :src="product.image" :alt="product.name" class="h-32 w-40 object-cover rounded-md">
        <div class="flex flex-col gap-2">
          <h2 class="text-black text-lg font-bree-serif">{{ product.name }} <span v-if="product.size" class="uppercase text-main">({{ product.size }})</span></h2>
          <p class="flex flex-col gap-1 text-black/50 text-sm">
            <span v-if="product.viandes && product.viandes.length > 0">Les viandes: {{ product.viandes.join(',  ') }}</span>
            <span v-if="product.sauces && product.sauces.length > 0">Les sauces: {{ product.sauces.join(', ') }}</span>
            <span v-if="product.extras && product.extras.length > 0">Les extras: {{ product.extras.join(', ') }}</span>
            <span v-if="product.note" class="text-[red] font-bold">Note: {{ product.note }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>