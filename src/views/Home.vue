<script setup>
import Kitchen from "../components/icons/Kitchen.vue";

import { useRouter } from "vue-router"

const router = useRouter()

const redirectPage = () => {
  router.push('/password')
}

</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-screen gap-6 p-8">
    <img src="../assets/images/logo.png" alt="Chicken Coop Logo" class="w-80">
    <div class="flex justify-center gap-4 w-full lg:w-2/3 mt-16">
      <button @click="redirectPage" class="group transition flex flex-col items-center gap-2 bg-white border-2 border-main rounded-md w-64 py-4 hover:bg-main">
        <Kitchen class="h-24 fill-main group-hover:fill-white" />
        <span class="text-main group-hover:text-white font-bree-serif font-bold text-3xl">Cuisine</span>
      </button>
    </div>
  </div>
</template>
