<script setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import Kitchen from "../components/icons/Kitchen.vue";
import Lock from "../components/icons/Lock.vue";

import { useStore } from "../store"

const props = defineProps({
  counts: { type: Object, default: () => ({}) },
})

const store = useStore()
const router = useRouter()

// The board runs unattended all service; the clock says it is still alive.
const now = ref(new Date())
let timer
onMounted(() => { timer = setInterval(() => (now.value = new Date()), 1000) })
onUnmounted(() => clearInterval(timer))

const time = computed(() => now.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))

const returnBack = () => {
  store.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white border-b border-border">
    <div class="flex items-center gap-6 px-5 h-16">
      <img src="../assets/images/logo.png" alt="Chicken Coop" class="h-11">
      <div class="flex items-center gap-2.5">
        <Kitchen class="h-9 fill-main" />
        <span class="font-bree-serif text-lg">Cuisine</span>
      </div>

      <!-- What is actually on the board right now, before anyone reads a column -->
      <div v-if="counts.waiting !== undefined" class="hidden md:flex items-center gap-5 ml-4 text-[15px]">
        <span class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-main" />
          <span class="text-black/55">En attente</span>
          <span class="font-bree-serif text-xl tabular-nums">{{ counts.waiting }}</span>
        </span>
        <span class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-third" />
          <span class="text-black/55">En cours</span>
          <span class="font-bree-serif text-xl tabular-nums">{{ counts.cooking }}</span>
        </span>
      </div>

      <div class="ml-auto flex items-center gap-5">
        <!-- Socket state: a board that has quietly lost the server looks
             identical to a quiet service otherwise. -->
        <span class="flex items-center gap-2 text-[15px]" :title="store.connected ? 'Connecté' : 'Hors ligne'">
          <span class="w-2.5 h-2.5 rounded-full" :class="store.connected ? 'bg-second' : 'bg-danger animate-pulse'" />
          <span class="text-black/55 hidden sm:inline">{{ store.connected ? 'En ligne' : 'Hors ligne' }}</span>
        </span>
        <span class="font-bree-serif text-xl tabular-nums text-black/70">{{ time }}</span>
        <button
          @click="returnBack"
          class="h-12 px-5 rounded-lg bg-white border border-border text-black flex gap-2.5 items-center transition-colors hover:bg-gray-light"
        >
          <Lock />
          <span>Verrouiller</span>
        </button>
      </div>
    </div>
  </header>
</template>
