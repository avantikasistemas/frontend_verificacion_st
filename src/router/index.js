import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import CargaSueltaView from '@/views/CargaSueltaView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'login', 
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/main', 
      name: 'main', 
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/carga', 
      name: 'carga', 
      component: CargaSueltaView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*', 
      name: 'not-found', 
      component: NotFoundView
    }
  ]
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  // Verificar si hay token en localStorage
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // No está autenticado, redirigir al login
      next({ name: 'login' });
    } else {
      // Está autenticado, permitir acceso
      next();
    }
  } else {
    // Si está en login y ya está autenticado, redirigir a main
    if (to.name === 'login' && isAuthenticated) {
      next({ name: 'main' });
    } else {
      next();
    }
  }
});

export default router