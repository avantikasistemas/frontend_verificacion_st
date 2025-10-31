import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import CargaSueltaView from '@/views/CargaSueltaView.vue';
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'home', component: HomeView},
    {path: '/carga', name: 'carga', component: CargaSueltaView},
  ]
})

export default router