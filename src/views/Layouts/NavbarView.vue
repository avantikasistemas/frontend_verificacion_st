<template>
  <nav class="navbar">
    <div class="navbar-left navbar-links">
      <router-link to="/main" class="nav-link">Lista de Checkeo</router-link>
      <router-link to="/carga" class="nav-link">Carga Suelta</router-link>
      <!-- <router-link to="/generico" class="nav-link">Creación de Genéricos</router-link> -->
    </div>
    
    <div class="navbar-right">
      <div class="user-info">
        <i class="bi bi-person-circle"></i>
        <span class="user-name">{{ userName }}</span>
      </div>
      <button @click="handleLogout" class="btn-logout">
        <i class="bi bi-box-arrow-right"></i>
        Cerrar Sesión
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userName = ref('Usuario');

onMounted(() => {
  // Obtener usuario desde localStorage
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.nombre) {
        userName.value = user.nombre;
      }
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
    }
  }
});

const handleLogout = () => {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigir al login
    router.push('/');
  }
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: #fff7dd;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navbar-left {
  display: flex;
  align-items: center;
}
.navbar-logo {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}
.navbar-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2778bf;
}
.navbar-links {
  display: flex;
  gap: 24px;
}
.nav-link {
  position: relative;
  color: #2778bf;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: 
    background 0.3s,
    color 0.3s,
    box-shadow 0.3s;
  overflow: hidden;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #2778bf 0%, #679b3a 100%);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  border-radius: 2px;
  transform: translateX(-50%);
}
.nav-link:hover {
  background: #eaf6ff;
  color: #679b3a;
  box-shadow: 0 2px 12px rgba(39,120,191,0.08);
  transform: translateY(-2px) scale(1.04);
}
.nav-link:hover::after {
  width: 80%;
}
.router-link-exact-active {
  background: #2778bf;
  color: #fff !important;
  box-shadow: 0 2px 12px rgba(39,120,191,0.12);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2778bf;
  font-weight: 500;
  font-size: 0.95rem;
}

.user-info i {
  font-size: 1.5rem;
}

.user-name {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-logout i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .navbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .user-name {
    max-width: 100px;
  }
}
</style>
