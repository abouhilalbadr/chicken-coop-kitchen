<script setup>
/**
 * The one button on the board. Same variants as the till, one size up:
 * everything here is hit with a knuckle or the side of a hand.
 */
defineProps({
  variant: { type: String, default: 'secondary' }, // primary | secondary | ghost | success
  size: { type: String, default: 'md' }, // md | lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const variants = {
  primary: 'bg-main text-white hover:bg-main-hover',
  success: 'bg-second text-white hover:bg-second/85',
  secondary: 'bg-white text-black border border-border hover:bg-gray-light',
  ghost: 'bg-transparent text-black/70 hover:bg-black/[.05]',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="rounded-xl font-medium inline-flex items-center justify-center gap-2.5 transition-colors duration-100
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40 focus-visible:ring-offset-2
      disabled:opacity-45 disabled:pointer-events-none"
    :class="[variants[variant] || variants.secondary, size === 'lg' ? 'h-16 px-8 text-lg' : 'h-14 px-6 text-[17px]']"
  >
    <span v-if="loading" class="loading" />
    <slot />
  </button>
</template>
