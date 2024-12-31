<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from "vue"
import axios from 'axios'

import Header from "../components/Header.vue";
import Modal from '../components/Modal.vue';
import Order from '../components/Order.vue';
import OrderCard from '../components/OrderCard.vue';
import { useStore } from "../store"

const store = useStore()
const router = useRouter()

const showModal = ref(false)
const loading = ref(true)
const order = ref({})
const statusText = ref('Commencer à cuisiner')

const checkUser = async () => {
  try {
    const { data } = await axios.post('/users/me', {
      email: 'cuisine@chickencoop.ma',
    }, {
      headers: {
        Authorization: `Bearer ${store.user.accessToken}`
      }
    })
    const user = data
		if (user?.role === 'CUISINE') {
      store.setUser(user)
		} else {
      router.push('/password')
    }
  } catch (error) {
    router.push('/password')
    console.log(error);
  }
}

const getTodayOrders = async () => {
  try {
    const { data } = await axios.get('/orders/cuisine', {
      headers: {
        'Authorization': `Bearer ${store.user.accessToken}`
      }
    })
    store.setOrders(data.data)
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}

const filtreOrders = (status) => {
  return store.orders.filter(order => order.status === status)
}

const changeProductsType = (products) => {
  if(typeof products === 'string') {
    return JSON.parse(products)
  }
  return products
}

const showOrder = (item, status) => {
  order.value = item
  showModal.value = true
  statusText.value = status === 'EN_ATTENTE' ? 'Commencer à cuisiner' : 'Terminer la commande'
}

const closeModal = () => {
  order.value = {}
  showModal.value = false
}

const saveData = async () => {
  try {
    // change order status
    await axios.put(`/orders/status/${order.value.id}`, {
      status: order.value.status === 'EN_ATTENTE' ? 'EN_COURS' : 'TERMINEE',
    }, {
      headers: {
        'Authorization': `Bearer ${store.user.accessToken}`
      }
    })
    location.reload()
  } catch (error) {
    console.log(error);
  }
}


onMounted(() => {
  checkUser()
  getTodayOrders()
})

</script>

<template>
  <Modal :is-open="showModal" @close-modal="closeModal">
    <template v-slot:body>
      <Order :item="order" />
    </template>
    <template v-if="order.status !== 'TERMINEE'" v-slot:buttons>
      <div class="grid grid-cols-2 gap-8">
        <button
          @click="closeModal"
          class="border border-main text-main rounded-md h-16 font-bold"
          >
          Fermer
        </button>
        <button
          @click="saveData"
          class="bg-main rounded-md h-16 text-white font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ statusText }}
        </button>
      </div>
    </template>
  </Modal>
  <Header />
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <span class="loading big"></span>
  </div>
  <main v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 w-full min-h-screen">
    <div class="flex flex-col bg-black/5 rounded-md">
      <h2 class="p-4 text-center uppercase text-xl bg-gray rounded-t-md">en attente</h2>
      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="(order, index) in filtreOrders('EN_ATTENTE')"
          :key="index"
          class="bg-white rounded-md p-4 flex flex-col gap-1 cursor-pointer"
          @click="showOrder(order, 'EN_ATTENTE')"
        >
          <OrderCard :item="order" :showDetails="true" />
        </div>
      </div>
    </div>
    <div class="flex flex-col bg-black/5 rounded-md">
      <h2 class="p-4 text-center uppercase text-xl bg-gray rounded-t-md">en cours</h2>
      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="(order, index) in filtreOrders('EN_COURS')"
          :key="index"
          class="bg-white rounded-md p-4 flex flex-col gap-1 cursor-pointer"
          @click="showOrder(order, 'EN_COURS')"
        >
          <OrderCard :item="order" :showDetails="true" />
        </div>
      </div>
    </div>
    <div class="flex flex-col bg-black/5 rounded-md">
      <h2 class="p-4 text-center uppercase text-xl bg-gray rounded-t-md">terminées</h2>
      <div class="flex flex-col gap-4 p-4">
        <div
          v-for="(order, index) in filtreOrders('TERMINEE')"
          :key="index"
          class="bg-white rounded-md p-4 flex flex-col gap-1 cursor-pointer"
          @click="showOrder(order, 'TERMINEE')"
        >
          <OrderCard :item="order" :showDetails="false" />
        </div>
      </div>
    </div>
  </main>
</template>
