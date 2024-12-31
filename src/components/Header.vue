<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

import Kitchen from "../components/icons/Kitchen.vue";
import Lock from "../components/icons/Lock.vue";

import { useStore } from "../store"

const store = useStore()
const router = useRouter()

const returnBack = () => {
  store.logout()
  router.push('/')
}

</script>

<template>
  <header class="px-4 py-2">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img src="../assets/images/logo.png" alt="Chicken Coop Logo" class="h-12">
          <div class="flex items-center gap-2">
            <Kitchen class="h-16 fill-main relative top-1" />
            <span class="text-main font-bree-serif">
              Cuisine
            </span>
          </div>
        </div>
        <div class="flex items-center gap-8">
          <button @click="returnBack" class="bg-main flex gap-2 items-center text-white rounded-md px-8 py-3">
            <Lock />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>
  </header>
</template>
