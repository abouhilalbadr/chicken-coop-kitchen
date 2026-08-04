import { defineStore } from 'pinia'
import { io } from "socket.io-client";

export const useStore = defineStore('main', {
  state: () => {
    return {
      baseUrl: window.navigator.onLine ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_OFFLINE,
      socket: null,
      connected: false,
      user: JSON.parse( localStorage.getItem('user') || null ),
      orders: [],
      alert: {
        show: false,
        status: '',
        message: '',
      },
    }
  },
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
      this.socket = io(this.baseUrl, {
        reconnectionDelayMax: 10000,
        auth: {
          token: user.accessToken
        }
      })
      this.socket.on("connect", () => {
        this.connected = true;
      });

      this.socket.on('order:created', (order) => {
        console.log("order:created", order);
        this.orders.unshift(order)
        this.alert.show = true
        this.alert.status = 'success'
        // Swal renders its title as text, so the entity has to be the character
        this.alert.message = `Nouvelle commande N° ${order.number}`
        setTimeout(() => {
          this.alert = {
            show: false,
            status: '',
            message: '',
          }
          location.reload()
        }, 5000);
      })
    },
    setOrders(orders) {
      this.orders = orders
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      this.connected = false;
    }
  },
})
