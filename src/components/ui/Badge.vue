<script setup>
/**
 * Order type, waiting time. Tinted, never a solid fill — the order number is
 * what gets read first and nothing else should compete with it.
 */
defineProps({
  tone: { type: String, default: 'neutral' }, // neutral | brand | warning | positive | danger
  size: { type: String, default: 'md' }, // md | lg
})

const tones = {
  neutral: 'bg-black/[.06] text-black/75',
  brand: 'bg-main/[.12] text-[#c14a28]',
  warning: 'bg-yellow/[.22] text-[#7a5c00]',
  positive: 'bg-green/[.14] text-[#3c7a58]',
  danger: 'bg-danger/[.10] text-danger',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap"
    :class="[tones[tone] || tones.neutral, size === 'lg' ? 'px-3.5 py-1 text-[15px]' : 'px-2.5 py-[3px] text-[13px]']"
  >
    <slot />
  </span>
</template>
