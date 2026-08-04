<script setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from "vue"
import axios from 'axios'

import Header from "../components/Header.vue";
import Modal from '../components/Modal.vue';
import Order from '../components/Order.vue';
import OrderCard from '../components/OrderCard.vue';
import AppButton from '../components/ui/AppButton.vue';
import { useStore } from "../store"

const store = useStore()
const router = useRouter()

const showModal = ref(false)
const loading = ref(true)
const saving = ref(false)
const order = ref({})
// Re-read every minute so the wait badges age on their own
const now = ref(Date.now())
let ticker

// The three columns of the board, in the order the ticket moves through them.
const COLUMNS = [
  { status: 'EN_ATTENTE', title: 'En attente', accent: 'main', dot: 'bg-main', details: true },
  { status: 'EN_COURS', title: 'En cours', accent: 'third', dot: 'bg-third', details: true },
  { status: 'TERMINEE', title: 'Terminées', accent: 'green', dot: 'bg-second', details: false },
]

const statusText = computed(() =>
  order.value.status === 'EN_ATTENTE' ? 'Commencer à cuisiner' : 'Terminer la commande'
)

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

const counts = computed(() => ({
  waiting: filtreOrders('EN_ATTENTE').length,
  cooking: filtreOrders('EN_COURS').length,
  done: filtreOrders('TERMINEE').length,
}))

const showOrder = (item) => {
  order.value = item
  showModal.value = true
}

const closeModal = () => {
  order.value = {}
  showModal.value = false
}

// EN_ATTENTE → EN_COURS → TERMINEE, from the card or from the dialog.
const advance = async (item) => {
  if (saving.value || item.status === 'TERMINEE') return
  saving.value = true
  try {
    await axios.put(`/orders/status/${item.id}`, {
      status: item.status === 'EN_ATTENTE' ? 'EN_COURS' : 'TERMINEE',
    }, {
      headers: {
        'Authorization': `Bearer ${store.user.accessToken}`
      }
    })
    closeModal()
    await getTodayOrders()
  } catch (error) {
    console.log(error);
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  checkUser()
  getTodayOrders()
  ticker = setInterval(() => (now.value = Date.now()), 60000)
})

onUnmounted(() => clearInterval(ticker))
</script>

<template>
  <Modal :is-open="showModal" @close-modal="closeModal">
    <template v-slot:body>
      <Order v-if="order.id" :item="order" />
    </template>
    <template v-if="order.status !== 'TERMINEE'" v-slot:buttons>
      <div class="grid grid-cols-2 gap-4">
        <AppButton variant="secondary" size="lg" @click="closeModal">Fermer</AppButton>
        <AppButton
          :variant="order.status === 'EN_ATTENTE' ? 'primary' : 'success'"
          size="lg"
          :loading="saving"
          @click="advance(order)"
        >
          {{ statusText }}
        </AppButton>
      </div>
    </template>
  </Modal>

  <Header :counts="counts" />

  <div v-if="loading" class="flex justify-center items-center min-h-[70vh]">
    <span class="loading big"></span>
  </div>

  <main v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 items-start">
    <!-- A column is the page's own surface, not a card: the cards are what sit
         inside it, and two nested whites would flatten both. -->
    <section
      v-for="column in COLUMNS"
      :key="column.status"
      class="bg-black/[.03] border border-black/[.07] rounded-xl flex flex-col max-h-[calc(100vh-96px)]"
    >
      <!-- Column head stays put while the stack under it scrolls -->
      <div class="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <span class="w-2.5 h-2.5 rounded-full" :class="column.dot" />
        <h2 class="uppercase tracking-[.08em] text-[13px] font-bold text-black/55">{{ column.title }}</h2>
        <span class="ml-auto font-bree-serif text-2xl tabular-nums">
          {{ filtreOrders(column.status).length }}
        </span>
      </div>

      <div class="flex flex-col gap-3 p-3 overflow-y-auto">
        <OrderCard
          v-for="item in filtreOrders(column.status)"
          :key="item.id"
          :item="item"
          :show-details="column.details"
          :accent="column.accent"
          :now="now"
          @open="showOrder"
          @advance="advance"
        />
        <p
          v-if="filtreOrders(column.status).length === 0"
          class="border border-dashed border-border rounded-xl py-10 text-center text-black/40"
        >
          Aucune commande
        </p>
      </div>
    </section>
  </main>
</template>
