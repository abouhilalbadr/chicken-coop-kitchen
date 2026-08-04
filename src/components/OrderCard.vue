<script setup>
import { computed } from 'vue'

import Badge from './ui/Badge.vue'
import { typeName, parseProducts, itemCount, minutesSince, waitLabel, waitTone } from '../utils/order'

const props = defineProps({
  item: { type: Object, required: true },
  showDetails: { type: Boolean, default: true },
  // The column the card sits in colours its number and its action
  accent: { type: String, default: 'main' }, // main | third | green
  now: { type: Number, default: 0 },
})

const emit = defineEmits(['open', 'advance'])

const products = computed(() => parseProducts(props.item.products))
const count = computed(() => itemCount(props.item.products))
// `now` ticks once a minute in the board, which is what re-runs this
const waited = computed(() => (props.now, minutesSince(props.item.createdAt)))

const accents = {
  main: 'text-main',
  third: 'text-[#a37600]',
  green: 'text-second',
}

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
    <!-- Header: the number is the biggest thing on the card, everything else
         qualifies it -->
    <div class="flex items-center gap-3 px-4 py-2.5">
      <div class="flex items-baseline gap-1.5 min-w-0">
        <span class="text-black/40 text-[15px] font-medium">N°</span>
        <span class="font-bree-serif text-[32px] leading-none" :class="accents[accent]">{{ item.number }}</span>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <Badge tone="neutral">{{ typeName(item.type) }}</Badge>
        <Badge v-if="waited !== null" :tone="waitTone(waited)">{{ waitLabel(waited) }}</Badge>
      </div>
    </div>

    <!-- Lines. On the done column they collapse to a count: nobody cooks from
         a finished ticket. -->
    <div v-if="showDetails" class="border-t border-border divide-y divide-border">
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
        <dl v-if="product.viandes?.length || product.sauces?.length || product.extras?.length" class="mt-1.5 flex flex-col gap-1 text-[15px]">
          <div v-if="product.viandes?.length" class="flex gap-2">
            <dt class="text-black/45 shrink-0">Viandes</dt>
            <dd class="text-black/85">{{ product.viandes.join(', ') }}</dd>
          </div>
          <div v-if="product.sauces?.length" class="flex gap-2">
            <dt class="text-black/45 shrink-0">Sauces</dt>
            <dd class="text-black/85">{{ product.sauces.join(', ') }}</dd>
          </div>
          <div v-if="product.extras?.length" class="flex gap-2">
            <dt class="text-black/45 shrink-0">Extras</dt>
            <dd class="text-black/85">{{ product.extras.join(', ') }}</dd>
          </div>
        </dl>
        <!-- A note is an instruction, not a detail: it gets its own band -->
        <p v-if="product.note" class="mt-2 rounded-lg bg-yellow/[.22] border-l-[3px] border-third px-3 py-1.5 text-[15px] text-[#7a5c00]">
          {{ product.note }}
        </p>
      </div>
    </div>
    <div v-else class="px-4 pb-3 text-[15px] text-black/50">
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
