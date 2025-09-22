<template>
    <div class="container mt-2">
        <div class="general-header">
            <div class="header-app">
                <img :src="logotipo" :alt="logotipo" class="logo-app" />
                <h4 class="titulo-app">VERIFICACIÓN PUERTAS, VENTANAS Y BARRERAS INTERIORES</h4>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card p-4 mb-4">
                    <form @submit.prevent="guardarVerificacion">
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <label class="form-label"><strong>Nombre quien verifica:</strong></label>
                                <select class="form-select" v-model="usuario">
                                    <option value="null">Seleccione</option>
                                    <option key="RTORRES" value="RTORRES">RTORRES</option>
                                    <option key="RODRIGUEZC" value="RODRIGUEZC">RODRIGUEZC</option>
                                </select>
                            </div>

                            <div class="col-md-12 mt-3">
                                <label class="form-label"><strong>Verificación de elementos</strong></label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="puertas" v-model="puertas" >
                                    <label class="form-check-label" for="puertas">Puertas</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="ventanas" v-model="ventanas" >
                                    <label class="form-check-label" for="ventanas">Ventanas</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="iluminacionOficinas" v-model="iluminacionOficinas" >
                                    <label class="form-check-label" for="iluminacionOficinas">Iluminación Oficinas</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="barrerasInteriores" v-model="barrerasInteriores" >
                                    <label class="form-check-label" for="barrerasInteriores">Barreras Interiores</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="estadoCamaras" v-model="estadoCamaras" >
                                    <label class="form-check-label" for="estadoCamaras">Estado Cámaras</label>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <label class="form-label"><strong>Novedades</strong></label>        
                                <textarea 
                                    id="novedades" 
                                    class="form-control" 
                                    rows="2"
                                    v-model="novedades" 
                                    :maxlength="300"
                                ></textarea>
                                <span class="text-end d-block small text-muted">{{ (novedades ? novedades.length : 0) }} / 300 caracteres</span>
                            </div>
                        </div>
                        <button class="btn btn-success">Guardar</button>
                    </form>
                </div>
            </div>
            <div class="col-lg-12" v-if="registros.length > 0">
                <div class="card p-4 mb-4">
                    <div class="row mb-4">
                        <h4>Listado de Registros</h4>
                        <div style="display: flex; gap: 2rem; align-items: flex-end; justify-content: space-between; flex-wrap: wrap;">
                            <div style="display: flex; gap: 2rem; align-items: flex-end;">
                                <div>
                                    <label for="fechaDesde">Desde:</label>
                                    <input type="date" class="form-control mb-3" v-model="fechaDesde">
                                </div>
                                <div>
                                    <label for="fechaHasta">Hasta:</label>
                                    <input type="date" class="form-control mb-3" v-model="fechaHasta">
                                </div>
                                <div style="align-self: center;">
                                    <button class="btn btn-primary" @click="cargarDatos()">Filtrar</button>
                                </div>
                            </div>
                            <div style="align-self: center;">
                                <button class="btn-excel" @click="exportarExcel">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#217346" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;"><rect x="3" y="3" width="18" height="18" rx="2" fill="#fff" stroke="#217346"/><path d="M8 8l8 8M16 8l-8 8" stroke="#217346"/><rect x="6" y="6" width="12" height="12" rx="1" fill="#d6f5e3" stroke="#217346"/></svg>
                                    Exportar Excel
                                </button>
                            </div>
                        </div>
                        <div class="tabla-scroll">
                          <table class="tabla-registros w-100">
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>USUARIO</th>
                                      <th>PUERTAS</th>
                                      <th>VENTANAS</th>
                                      <th>ILUMINACIÓN OFICINAS</th>
                                      <th>BARRERAS INTERIORES</th>
                                      <th>ESTADO CÁMARAS</th>
                                      <th>NOVEDADES</th>
                                      <th>FECHA CREACIÓN</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="reg in registros" :key="reg.id">
                                      <td>{{ reg.id }}</td>
                                      <td>{{ reg.usuario }}</td>
                                      <td>{{ reg.puertas }}</td>
                                      <td>{{ reg.ventanas }}</td>
                                      <td>{{ reg.iluminacion_oficinas }}</td>
                                      <td>{{ reg.barreras_interiores }}</td>
                                      <td>{{ reg.estado_camaras }}</td>
                                      <td>{{ reg.novedades }}</td>
                                      <td>{{ reg.fecha_creacion }}</td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                        <div class="pagination" v-if="total_registros >= 10">
                            <label for="records-per-page">Registros por página:</label>
                            <select 
                                id="records-per-page" 
                                v-model="limit" 
                                @change="changePage(1)"
                            >
                                <option value="10">10</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <button 
                                :disabled="position <= 1" 
                                @click="changePage(1)"
                            >
                                Primera
                            </button>
                            
                            <button 
                                :disabled="position <= 1" 
                                @click="changePage(position - 1)"
                            >
                                Anterior
                            </button>
                            
                            <span>Página {{ position }} de {{ total_paginas }}</span>
                            
                            <button 
                                :disabled="position >= total_paginas" 
                                @click="changePage(position + 1)"
                            >
                                Siguiente
                            </button>
                            
                            <button 
                                :disabled="position >= total_paginas" 
                                @click="changePage(total_paginas)"
                            >
                                Última
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Modal de éxito -->
    <div class="modal fade" id="exitoModal" tabindex="-1" aria-labelledby="exitoModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="exitoModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10004;</span>
                        <h5 class="modal-title flex-grow-1" id="exitoModalLabel">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-success text-center">
                    <p>{{ msg }}</p>                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de error -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true" data-bs-backdrop="static" ref="errorModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <div class="d-flex align-items-center w-100">
                        <span class="me-2" style="font-size:2.5rem;line-height:1;">&#10006;</span>
                        <h5 class="modal-title flex-grow-1" id="errorModalLabel">Error</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body text-danger text-center">
                    <strong>{{ errorMsg }}</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Overlay de carga -->
    <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-light" role="status">
            <span class="visually-hidden"></span>
        </div>
        <p class="mt-2 text-light">{{ loading_msg }}</p>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";

const usuario = ref(null);
const fechaDesde = ref(null);
const fechaHasta = ref(null);
const fechaDesdeFormateada = ref(null);
const fechaHastaFormateada = ref(null);

// Checkboxes
const puertas = ref(false);
const ventanas = ref(false);
const iluminacionOficinas = ref(false);
const barrerasInteriores = ref(false);
const estadoCamaras = ref(false);
const novedades = ref(null);
const registros = ref([]);

const msg = ref('');
const errorMsg = ref('');
const modalTitle = ref('');

const modalInstance = ref(null);
const modalErrorInstance = ref(null);

const loading = ref(false);
const loading_msg = ref('');

const total_paginas = ref(0);
const total_registros = ref(0);
const limit = ref(10);
const position = ref(1);

const router = useRouter();

// Función para guardar la verificación
const guardarVerificacion = async () => {
    if (!usuario.value || usuario.value === 'null') {
        errorMsg.value = 'Por favor, seleccione el nombre de quien verifica.';
        modalErrorInstance.value.show();
        return;
    }
    try {
        loading.value = true;
        loading_msg.value = 'Guardando...';

        const response = await axios.post(
            `${apiUrl}/guardar_verificacion`,
            { 
                usuario: usuario.value,
                puertas: puertas.value,
                ventanas: ventanas.value,
                iluminacion_oficinas: iluminacionOficinas.value,
                barreras_interiores: barrerasInteriores.value,
                estado_camaras: estadoCamaras.value,
                novedades: novedades.value,
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            msg.value = response.data.message;
            modalTitle.value = 'Operación Exitosa';
            modalInstance.value.show();

            // Limpiar los campos después de guardar
            limpiar();
            await cargarDatos();
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = error.response.data.message;
    } finally {
        loading.value = false;
        loading_msg.value = '';
    }
};

// Función para cargar los datos de las verificaciones
const cargarDatos = async () => {
    try {
        loading.value = true;
        loading_msg.value = 'Cargando datos...';

        if (fechaDesde.value){
            fechaDesdeFormateada.value = fechaDesde.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (fechaHasta.value){
            fechaHastaFormateada.value = fechaHasta.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }

        const response = await axios.post(
            `${apiUrl}/cargar_datos`, 
            {
                fecha_desde: fechaDesdeFormateada.value,
                fecha_hasta: fechaHastaFormateada.value,
                limit: parseInt(limit.value),
                position: parseInt(position.value),
                flag_excel: false,
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            registros.value = response.data.data.registros;
            total_registros.value = response.data.data.total_registros;
            total_paginas.value = response.data.data.total_pag;
            position.value = response.data.data.posicion_pag;
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los datos.';
    } finally {
        loading.value = false;
        loading_msg.value = '';
    }
};

// Función para exportar los datos a Excel
const exportarExcel = async () => {
    try {
        loading.value = true;
        loading_msg.value = 'Exportando datos...';

        if (fechaDesde.value){
            fechaDesdeFormateada.value = fechaDesde.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }
        if (fechaHasta.value){
            fechaHastaFormateada.value = fechaHasta.value.replace(/-/g, ""); // Reemplaza los guiones por nada
        }

        const response = await axios.post(
            `${apiUrl}/cargar_datos`, 
            {
                fecha_desde: fechaDesdeFormateada.value,
                fecha_hasta: fechaHastaFormateada.value,
                limit: parseInt(limit.value),
                position: parseInt(position.value),
                flag_excel: true,
            },
            {
                headers: {
                    Accept: "application/json",
                },
                responseType: 'blob'
            }
        );
        if (response.status === 200) {
            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_verificacion.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Liberar memoria
        }
    } catch (error) {
        console.error(error);
        modalErrorInstance.value.show();
        errorMsg.value = 'Error al cargar los datos.';
    } finally {
        loading.value = false;
        loading_msg.value = '';
    }
};

// Función para limpiar los campos del formulario
const limpiar = () => {
    usuario.value = null;
    puertas.value = false;
    ventanas.value = false;
    iluminacionOficinas.value = false;
    barrerasInteriores.value = false;
    estadoCamaras.value = false;
    novedades.value = null;
};

// ✅ Función para cambiar pagina del paginador
const changePage = async (newPosition) => {
  position.value = newPosition;
  await cargarDatos(); // Vuelve a cargar los datos con el nuevo límite y posición
};

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  cargarDatos();
});

</script>

<style scoped>

.general-header {
    display: flex;
    justify-content: flex-start;
}

.header-app {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.logo-app {
    height: 48px;
    width: auto;
    object-fit: contain;
}

.titulo-app {
    margin-bottom: 0;
    font-weight: bold;
}

.container {
    max-width: 85vw;
    width: 98vw;
    margin: 0 auto;
}

.detalle-title{
    display: flex;
    justify-content: space-between;
}

.btn-excel {
    background-color: #d6f5e3;
    color: #217346;
    border: 1px solid #217346;
    border-radius: 5px;
    padding: 8px 18px 8px 14px;
    font-size: 1em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border 0.2s;
    box-shadow: 0 2px 6px rgba(33,115,70,0.08);
}
.btn-excel:hover {
    background-color: #b6e6c9;
    color: #145c2c;
    border-color: #145c2c;
}

/* Tabla de activos entregados - estilos modernos y fríos */
.tabla-scroll {
    max-height: 320px;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,40,0.08);
}

.tabla-registros {
    border-collapse: separate;
    border-spacing: 0;
    background: linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%);
    border-radius: 10px;
    overflow: hidden;
}

.tabla-registros th {
    background: linear-gradient(90deg, #64b5f6 0%, #1976d2 100%);
    color: #fff;
    font-weight: 600;
    text-align: center;
    padding: 12px 8px;
    font-size: 1rem;
    border-bottom: 2px solid #1976d2;
}

.tabla-registros td {
    text-align: center;
    padding: 10px 8px;
    font-size: 0.98rem;
    color: #1565c0;
    background: rgba(255,255,255,0.85);
    border-bottom: 1.5px solid #bbdefb;
}

.tabla-registros tr:last-child td {
    border-bottom: none;
}

.tabla-registros tbody tr:hover {
    background: #e3f2fd;
    transition: background 0.2s;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 2px;
  font-size: 14px; /* Reduce el tamaño de la fuente */
  padding: 8px;
}

.pagination label {
  margin-right: 10px;
  font-size: 0.9rem;
}

.pagination select {
  margin-right: 20px;
  padding: 4px;
  font-size: 0.8rem;
  height: 30px;
}

.pagination button {
  background-color: #351bff;
  color: white;
  border: none;
  padding: 4px 8px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  height: 30px;
}

.pagination button:hover {
    background-color: #2c16cc;
    transition: background 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 0.9rem;
}

/* Overlay de carga */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(44, 62, 80, 0.45);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loading-overlay .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.35em;
}

.loading-overlay p {
    color: #fff;
    font-size: 1.15rem;
    margin-top: 1.2rem;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
</style>