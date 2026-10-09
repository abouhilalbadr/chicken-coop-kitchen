<script setup>
import { computed } from 'vue'

import { typeName, typeTone, DETAILS, parseProducts, itemCount } from '../utils/order'

const props = defineProps({
  item: { type: Object, required: true },
  showDetails: { type: Boolean, default: true },
})

const emit = defineEmits(['open', 'advance'])

const products = computed(() => parseProducts(props.item.products))
const count = computed(() => itemCount(props.item.products))

const advanceLabel = computed(() =>
  props.item.status === 'EN_ATTENTE' ? 'Commencer' : 'Terminer'
)
</script>

<template>
  <article
    class="shrink-0 bg-white border border-black/[.07] rounded-xl shadow-sm overflow-hidden cursor-pointer
      transition-shadow hover:shadow-lg"
    @click="emit('open', item)"
  >
    <!-- Header: painted in the order type's colour, so a Glovo bag or a
         table order reads from across the kitchen on the 720p screens -->
    <div class="flex items-center gap-3 px-4 py-2.5" :class="typeTone(item.type)">
      <span class="shrink-0 whitespace-nowrap font-bree-serif text-[32px] leading-none">N° {{ item.number }}</span>
      <span class="ml-auto min-w-0 text-right text-[19px] font-bold uppercase tracking-[.04em] leading-tight">{{ typeName(item.type) }}</span>
    </div>

    <!-- Lines. On the done column they collapse to a count: nobody cooks from
         a finished ticket. -->
    <div v-if="showDetails" class="divide-y divide-border">
      <div v-for="(product, index) in products" :key="index" class="px-4 py-2.5">
        <div class="flex items-baseline gap-2.5">
          <span
            v-if="product.number > 1"
            class="shrink-0 rounded-md bg-black/[.06] px-2 py-0.5 text-[15px] font-bold tabular-nums"
          >
            {{ product.number }}×
          </span>
          <h3 class="font-bree-serif text-[19px] leading-tight">
            {{ product.name }}
            <span v-if="product.size" class="uppercase text-main">({{ product.size }})</span>
          </h3>
        </div>
        <!-- Meats, sauces, extras: what the cook builds from, so each is a
             tinted band in bold rather than grey small print -->
        <div v-if="DETAILS.some((d) => product[d.key]?.length)" class="mt-2 flex flex-col gap-1">
          <p
            v-for="detail in DETAILS.filter((d) => product[d.key]?.length)"
            :key="detail.key"
            class="rounded-md px-2.5 py-1 text-[17px] leading-snug font-bold"
            :class="detail.tone"
          >
            <span class="text-[12px] font-medium uppercase tracking-[.06em] opacity-75 mr-1">{{ detail.label }}</span>
            {{ product[detail.key].join(', ') }}
          </p>
        </div>
        <!-- A note is an instruction, not a detail: it gets its own band -->
        <p v-if="product.note" class="mt-2 rounded-lg bg-yellow/[.22] border-l-[3px] border-third px-3 py-1.5 text-[16px] font-medium text-[#7a5c00]">
          {{ product.note }}
        </p>
      </div>
    </div>
    <div v-else class="px-4 py-2.5 text-[15px] text-black/50">
      {{ count }} article{{ count > 1 ? 's' : '' }}
    </div>

    <!-- The action the cook takes next, on the card. The dialog stays for
         reading a long ticket in full. -->
    <div v-if="showDetails" class="p-2.5 border-t border-border">
      <button
        class="w-full h-12 rounded-lg font-medium text-[17px] text-white transition-colors"
        :class="item.status === 'EN_ATTENTE' ? 'bg-main hover:bg-main-hover' : 'bg-second hover:bg-second/85'"
        @click.stop="emit('advance', item)"
      >
        {{ advanceLabel }}
      </button>
    </div>
  </article>
</template>
