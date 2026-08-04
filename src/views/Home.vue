<script setup>
import Kitchen from "../components/icons/Kitchen.vue";

import { useRouter } from "vue-router"

const router = useRouter()

const redirectPage = () => {
  router.push('/password')
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center gap-10 p-8">
    <img src="../assets/images/logo.png" alt="Chicken Coop" class="w-56">

    <!-- One destination, so it is one target: the whole card is the button -->
    <button
      @click="redirectPage"
      class="group w-[380px] max-w-full rounded-xl bg-white border border-black/[.07] shadow-sm px-8 py-10 flex flex-col items-center gap-4
        transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40"
    >
      <span class="w-20 h-20 rounded-xl bg-main/[.10] flex items-center justify-center transition-colors group-hover:bg-main/20">
        <Kitchen class="h-12 fill-main" />
      </span>
      <span class="font-bree-serif text-2xl">Cuisine</span>
      <span class="text-[13px] text-black/50">Écran des commandes</span>
    </button>
  </div>
</template>
