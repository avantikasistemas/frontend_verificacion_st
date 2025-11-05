<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="@/assets/logotipo.png" alt="Logo Avántika" class="login-logo" />
        <h2 class="login-title">Sistema de Verificación</h2>
        <p class="login-subtitle">Control Físico y Seguridad</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="bi bi-person-fill"></i>
            Usuario
          </label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="form-control"
            placeholder="Ingrese su usuario"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="bi bi-lock-fill"></i>
            Contraseña
          </label>
          <div class="password-input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              class="form-control"
              placeholder="Ingrese su contraseña"
              required
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group form-check">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="rememberMe" 
            v-model="rememberMe"
          />
          <label class="form-check-label" for="rememberMe">
            Recordar contraseña
          </label>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-box-arrow-in-right"></i>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>
      </form>
    </div>

    <div class="login-background-shape shape-1"></div>
    <div class="login-background-shape shape-2"></div>
    <div class="login-background-shape shape-3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import apiUrl from "../../config.js";

const router = useRouter();

// Configurar interceptor de axios para incluir token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación (token expirado)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (router.currentRoute.value.path !== '/') {
        router.push('/');
      }
    }
    return Promise.reject(error);
  }
);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const login = async () => {
  errorMessage.value = '';
  
  if (!username.value.trim()) {
    errorMessage.value = 'Por favor ingrese su usuario';
    return;
  }
  
  if (!password.value.trim()) {
    errorMessage.value = 'Por favor ingrese su contraseña';
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await axios.post(
        `${apiUrl}/login`, 
        {
          usuario: username.value.trim(),
          clave: password.value.trim()
        },
        {
            headers: {
                Accept: "application/json",
            }
        }
    );

    console.log('Respuesta del servidor:', response);

    // Verificar que la respuesta sea exitosa
    if (response.status === 200) {
      const userData = response.data.data;
      
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        usuario: userData.usuario,
        nombre: userData.nombre,
        email: userData.email,
      }));
      
      // Si "recordar contraseña" está marcado, guardar usuario
      if (rememberMe.value) {
        localStorage.setItem('rememberUser', username.value);
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      // Redirigir a la página principal
      router.push('/main');
    } else {
      errorMessage.value = response.data.message || 'Error al iniciar sesión';
    }
  } catch (error) {
    console.error('Error en login:', error);
    
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Usuario o contraseña incorrectos';
    } else {
      errorMessage.value = 'Error al conectar con el servidor';
    }
  } finally {
    loading.value = false;
  }
};

// Cargar usuario recordado si existe
onMounted(() => {
  const rememberedUser = localStorage.getItem('rememberUser');
  if (rememberedUser) {
    username.value = rememberedUser;
    rememberMe.value = true;
  }
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: linear-gradient(135deg, #351bff 0%, #2c16cc 50%, #1a0d80 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Formas decorativas en el fondo */
.login-background-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  z-index: 0;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #fff;
  top: -100px;
  left: -100px;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #d6f5e3;
  bottom: -150px;
  right: -150px;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: #b6e6c9;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 50px 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

.login-form {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-label i {
  margin-right: 8px;
  color: #351bff;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-control:focus {
  outline: none;
  border-color: #351bff;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(53, 27, 255, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #351bff;
}

.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.form-check-input {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #351bff;
}

.form-check-label {
  font-size: 14px;
  color: #5a6c7d;
  cursor: pointer;
  user-select: none;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #351bff 0%, #2c16cc 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(53, 27, 255, 0.3);
}

.btn-login:hover {
  background: linear-gradient(135deg, #2c16cc 0%, #1a0d80 100%);
  box-shadow: 0 6px 20px rgba(53, 27, 255, 0.4);
  transform: translateY(-2px);
}

.btn-login:active {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-login i {
  margin-right: 10px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 15px;
  border: none;
  animation: slideDown 0.3s ease-out;
}

.alert-danger {
  background-color: #fee;
  color: #c33;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-footer {
  text-align: center;
  margin-top: 25px;
}

.forgot-password {
  color: #351bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #2c16cc;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 576px) {
  .login-card {
    padding: 40px 30px;
    border-radius: 15px;
  }

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 14px;
  }

  .login-logo {
    width: 100px;
  }

  .shape-1,
  .shape-2,
  .shape-3 {
    display: none;
  }
}
</style>
