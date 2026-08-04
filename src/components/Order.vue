<script setup>
import { computed } from 'vue'

import Badge from './ui/Badge.vue'
import { typeName, parseProducts, itemCount, minutesSince, waitLabel, waitTone } from '../utils/order'

const props = defineProps({ item: { type: Object, required: true } })

const products = computed(() => parseProducts(props.item.products))
const count = computed(() => itemCount(props.item.products))
const waited = computed(() => minutesSince(props.item.createdAt))
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-wrap items-center gap-3 pb-5 border-b border-border">
      <div class="flex items-baseline gap-2.5">
        <span class="text-black/45 text-lg">Commande</span>
        <span class="font-bree-serif text-[44px] leading-none text-main">N° {{ item.number }}</span>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <Badge tone="neutral" size="lg">{{ typeName(item.type) }}</Badge>
        <Badge tone="neutral" size="lg">{{ count }} article{{ count > 1 ? 's' : '' }}</Badge>
        <Badge v-if="waited !== null" :tone="waitTone(waited)" size="lg">{{ waitLabel(waited) }}</Badge>
      </div>
    </div>

    <div class="divide-y divide-border">
      <div v-for="(product, index) in products" :key="index" class="flex gap-5 py-5">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-28 w-36 shrink-0 object-contain rounded-xl border border-border bg-gray-light p-1.5"
        >
        <div class="flex flex-col gap-2 min-w-0">
          <div class="flex items-baseline gap-2.5">
            <span
              v-if="product.number > 1"
              class="rounded-md bg-black/[.06] px-2.5 py-0.5 text-lg font-bold tabular-nums"
            >
              {{ product.number }}×
            </span>
            <h3 class="font-bree-serif text-[24px] leading-tight">
              {{ product.name }}
              <span v-if="product.size" class="uppercase text-main">({{ product.size }})</span>
            </h3>
          </div>
          <dl class="flex flex-col gap-1 text-[17px]">
            <div v-if="product.viandes?.length" class="flex gap-2.5">
              <dt class="text-black/45 shrink-0 w-20">Viandes</dt>
              <dd class="text-black/90">{{ product.viandes.join(', ') }}</dd>
            </div>
            <div v-if="product.sauces?.length" class="flex gap-2.5">
              <dt class="text-black/45 shrink-0 w-20">Sauces</dt>
              <dd class="text-black/90">{{ product.sauces.join(', ') }}</dd>
            </div>
            <div v-if="product.extras?.length" class="flex gap-2.5">
              <dt class="text-black/45 shrink-0 w-20">Extras</dt>
              <dd class="text-black/90">{{ product.extras.join(', ') }}</dd>
            </div>
          </dl>
          <p v-if="product.note" class="rounded-lg bg-yellow/[.22] border-l-[3px] border-third px-3.5 py-2 text-[17px] text-[#7a5c00]">
            {{ product.note }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
