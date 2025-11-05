<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Página No Encontrada</h1>
      <p class="error-message">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div class="error-illustration">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <button @click="goHome" class="btn-home">
        <i class="bi bi-house-door"></i>
        Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/main');
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #351bff 0%, #2c16cc 50%, #1a0d80 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  color: white;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  font-size: 150px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.error-message {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.error-illustration {
  font-size: 80px;
  margin-bottom: 40px;
  opacity: 0.3;
}

.btn-home {
  padding: 15px 40px;
  background: white;
  color: #351bff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-home:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: #f8f9fa;
}

.btn-home i {
  margin-right: 10px;
}

@media (max-width: 576px) {
  .error-code {
    font-size: 100px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-illustration {
    font-size: 60px;
  }
}
</style>
