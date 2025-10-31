<template>
    <LayoutView>
        <div class="container mt-2">
            <div class="general-header">
                <div class="header-app">
                    <img :src="logotipo" :alt="logotipo" class="logo-app" />
                    <h4 class="titulo-app">CARGA SUELTA</h4>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card p-4 mb-4">
                        <form @submit.prevent="guardarCarga">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <label class="form-label"><strong>Tipo de inspección:</strong></label>
                                    <select class="form-select" v-model="tipoInspeccionId">
                                        <option value="null">Seleccione</option>
                                        <option v-for="tipo in tiposInspeccion" :key="tipo.id" :value="tipo.id">
                                            {{ tipo.id }} - {{ tipo.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Tabla de verificación -->
                            <div class="tabla-verificacion-container" v-if="tipoInspeccionId && tipoInspeccionId !== 'null'">
                                <table class="tabla-verificacion">
                                    <thead>
                                        <tr>
                                            <th class="col-aspecto"></th>
                                            <th class="col-opcion">SI</th>
                                            <th class="col-opcion">NO</th>
                                            <th class="col-opcion">N/A</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="aspectosCarga.length === 0">
                                            <td colspan="4" class="text-center py-4" style="color: #666;">
                                                Cargando aspectos...
                                            </td>
                                        </tr>
                                        <!-- Iterar por cada sección -->
                                        <template v-for="(seccion, seccionIndex) in aspectosCarga" :key="`seccion_${seccion.seccion_id}`">
                                            <!-- Cabecera de la sección -->
                                            <tr class="seccion-header">
                                                <td colspan="4">{{ seccionIndex + 1 }}. {{ seccion.seccion_nombre }}</td>
                                            </tr>
                                            <!-- Aspectos de la sección -->
                                            <tr v-for="(aspecto, aspectoIndex) in seccion.aspectos" :key="`aspecto_${aspecto.id}`">
                                                <td class="aspecto-cell">
                                                    <span class="numero-badge">{{ seccionIndex + 1 }}.{{ aspectoIndex + 1 }}</span> {{ aspecto.nombre }}
                                                </td>
                                                <td class="opcion-cell">
                                                    <input 
                                                        type="radio" 
                                                        :name="`aspecto_${aspecto.id}`" 
                                                        value="1" 
                                                        v-model="aspectosGeneralesDinamicos[`aspecto_${aspecto.id}`]"
                                                    >
                                                </td>
                                                <td class="opcion-cell">
                                                    <input 
                                                        type="radio" 
                                                        :name="`aspecto_${aspecto.id}`" 
                                                        value="0" 
                                                        v-model="aspectosGeneralesDinamicos[`aspecto_${aspecto.id}`]"
                                                    >
                                                </td>
                                                <td class="opcion-cell">
                                                    <input 
                                                        type="radio" 
                                                        :name="`aspecto_${aspecto.id}`" 
                                                        value="2" 
                                                        v-model="aspectosGeneralesDinamicos[`aspecto_${aspecto.id}`]"
                                                    >
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Sección de imágenes -->
                            <div class="row mt-4 mb-3" v-if="tipoInspeccionId && tipoInspeccionId !== 'null'">
                                <div class="col-md-12">
                                    <label class="form-label"><strong>Adjuntar Imágenes</strong></label>
                                    <div class="imagenes-container">
                                        <div v-for="(imagen, index) in imagenes" :key="imagen.id" class="imagen-item">
                                            <div class="input-group mb-2">
                                                <input 
                                                    type="file" 
                                                    class="form-control" 
                                                    accept="image/*"
                                                    @change="handleFileChange($event, index)"
                                                >
                                                <button 
                                                    type="button" 
                                                    class="btn btn-danger btn-sm"
                                                    @click="eliminarImagen(imagen.id)"
                                                    v-if="imagenes.length > 1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div v-if="imagen.base64" class="preview-container">
                                                <img :src="imagen.base64" :alt="imagen.nombre" class="img-preview">
                                                <span class="nombre-archivo">{{ imagen.nombre }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        class="btn btn-primary btn-sm mt-2"
                                        @click="agregarImagen"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 5px;">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                        Agregar otra imagen
                                    </button>
                                </div>
                            </div>

                            <div class="row mb-3 mt-4" v-if="tipoInspeccionId && tipoInspeccionId !== 'null'">
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
                            <button class="btn btn-success" v-if="tipoInspeccionId && tipoInspeccionId !== 'null'">Guardar</button>
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
                                    <div style="align-self: center; display: flex; gap: 0.5rem;">
                                        <button class="btn btn-primary" @click="cargarDatos()">Filtrar</button>
                                        <button class="btn btn-danger" @click="limpiarFiltros()">Limpiar filtros</button>
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
                                        <th>LUGAR INSPECCIÓN</th>
                                        <th>RESPONSABLE</th>
                                        <th>HORA APERTURA Y FIN</th>
                                        <th>CANTIDAD Y TIPO</th>
                                        <th>SIN DAÑOS VISIBLES</th>
                                        <th>EMPAQUE ADECUADO</th>
                                        <th>ELEMENTOS NO DECLARADOS</th>
                                        <th>CARGA ORGANIZADA</th>
                                        <th>MANIPULACIÓN NO AUTORIZADA</th>
                                        <th>PROTECCIÓN INTERNA</th>
                                        <th>NOVEDADES</th>
                                        <th>FECHA CREACIÓN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reg in registros" :key="reg.id">
                                        <td>{{ reg.id }}</td>
                                        <td>{{ reg.nombre_lugar }}</td>
                                        <td>{{ reg.nombre_responsable }}</td>
                                        <td>{{ reg.aspectos_1 }}</td>
                                        <td>{{ reg.aspectos_2 }}</td>
                                        <td>{{ reg.aspectos_3 }}</td>
                                        <td>{{ reg.aspectos_4 }}</td>
                                        <td>{{ reg.aspectos_5 }}</td>
                                        <td>{{ reg.aspectos_6 }}</td>
                                        <td>{{ reg.aspectos_7 }}</td>
                                        <td>{{ reg.aspectos_8 }}</td>
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
    </LayoutView>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Modal } from 'bootstrap';
import logotipo from '@/assets/logotipo.png';
import apiUrl from "../../config.js";
import LayoutView from './Layouts/LayoutView.vue';

const cargo = ref(null);
const tipoInspeccionId = ref(null);
const tiposInspeccion = ref([]);
const lugarInspeccionId = ref(null);
const lugaresInspeccion = ref([]);
const responsables = ref([]);
const fechaDesde = ref(null);
const fechaHasta = ref(null);
const fechaDesdeFormateada = ref(null);
const fechaHastaFormateada = ref(null);

const imagenes = ref([{ id: 1, base64: null, nombre: null }]);
const contadorImagenes = ref(1);

const aspectosCarga = ref([]);
const aspectosGeneralesDinamicos = ref({});

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
const guardarCarga = async () => {
    if (!tipoInspeccionId.value || tipoInspeccionId.value === 'null') {
        errorMsg.value = 'Por favor, seleccione el tipo de inspección.';
        modalErrorInstance.value.show();
        return;
    }
    if (!lugarInspeccionId.value || lugarInspeccionId.value === 'null') {
        errorMsg.value = 'Por favor, seleccione el lugar de inspección.';
        modalErrorInstance.value.show();
        return;
    }
    if (!cargo.value || cargo.value === 'null') {
        errorMsg.value = 'Por favor, seleccione el nombre de quien verifica.';
        modalErrorInstance.value.show();
        return;
    }
    try {
        loading.value = true;
        loading_msg.value = 'Guardando...';

        // Filtrar solo las imágenes que tengan base64
        const imagenesConDatos = imagenes.value
            .filter(img => img.base64 !== null)
            .map(img => ({
                nombre: img.nombre,
                base64: img.base64
            }));

        const response = await axios.post(
            `${apiUrl}/guardar_carga`,
            { 
                tipo_inspeccion_id: tipoInspeccionId.value,
                lugar_inspeccion_id: lugarInspeccionId.value,
                responsable_verificacion_id: cargo.value,
                aspectos_generales: aspectosGeneralesDinamicos.value,
                imagenes: imagenesConDatos,
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
    tipoInspeccionId.value = null;
    lugarInspeccionId.value = null;
    cargo.value = null;
    responsables.value = [];
    
    // Limpiar aspectos dinámicos
    aspectosGeneralesDinamicos.value = {};
    aspectosCarga.value = [];
    
    // Limpiar imágenes
    imagenes.value = [{ id: 1, base64: null, nombre: null }];
    contadorImagenes.value = 1;
    
    novedades.value = null;
};

// Función para agregar un nuevo input de imagen
const agregarImagen = () => {
    contadorImagenes.value++;
    imagenes.value.push({ 
        id: contadorImagenes.value, 
        base64: null, 
        nombre: null 
    });
};

// Función para eliminar una imagen
const eliminarImagen = (id) => {
    if (imagenes.value.length > 1) {
        imagenes.value = imagenes.value.filter(img => img.id !== id);
    }
};

// Función para convertir imagen a base64
const convertirImagenABase64 = (file, index) => {
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
        errorMsg.value = 'Solo se permiten archivos de imagen.';
        modalErrorInstance.value.show();
        return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        errorMsg.value = 'La imagen no debe superar los 5MB.';
        modalErrorInstance.value.show();
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagenes.value[index].base64 = e.target.result;
        imagenes.value[index].nombre = file.name;
    };
    reader.readAsDataURL(file);
};

// Función para manejar el cambio de archivo
const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        convertirImagenABase64(file, index);
    }
};

// ✅ Función para cambiar pagina del paginador
const changePage = async (newPosition) => {
  position.value = newPosition;
  await cargarDatos(); // Vuelve a cargar los datos con el nuevo límite y posición
};

// Función para limpiar los filtros de fecha
const limpiarFiltros = async () => {
  fechaDesde.value = null;
  fechaHasta.value = null;
  fechaDesdeFormateada.value = null;
  fechaHastaFormateada.value = null;
  position.value = 1; // Reiniciar a la primera página
  await cargarDatos(); // Recargar datos sin filtros
};

// Función para cargar los tipos de inspección
const cargarTiposInspeccion = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/obtener_tipo_inspeccion`,
            {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            tiposInspeccion.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al cargar tipos de inspección:', error);
        tiposInspeccion.value = [];
    }
};

// Función para cargar los lugares de inspección
const cargarLugaresInspeccion = async () => {
    try {
        const response = await axios.post(
            `${apiUrl}/obtener_lugares_inspeccion`,
            {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            lugaresInspeccion.value = response.data.data || [];
        }
    } catch (error) {
        console.error('Error al cargar lugares de inspección:', error);
        lugaresInspeccion.value = [];
    }
};

// Función para cargar los responsables según el lugar de inspección
const cargarResponsables = async (lugarId) => {
    try {
        loading.value = true;
        loading_msg.value = 'Cargando responsables...';

        const response = await axios.post(
            `${apiUrl}/obtener_responsables_por_lugar`,
            { lugar_id: lugarId },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            responsables.value = response.data.data || [];
            // Limpiar selección de usuario si cambia el lugar
            cargo.value = null;
        }
    } catch (error) {
        console.error('Error al cargar responsables:', error);
        responsables.value = [];
        cargo.value = null;
    } finally {
        loading.value = false;
        loading_msg.value = '';
    }
};

// Función para cargar aspectos según el tipo de inspección
const cargarAspectosPorTipo = async (tipoInspeccionId) => {
    try {
        loading.value = true;
        loading_msg.value = 'Cargando aspectos...';

        const response = await axios.post(
            `${apiUrl}/obtener_aspectos_por_tipo_inspeccion`,
            { tipo_inspeccion_id: tipoInspeccionId },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            aspectosCarga.value = response.data.data || [];
            
            // Inicializar el objeto dinámico con los aspectos usando sus IDs reales
            const nuevosAspectos = {};
            aspectosCarga.value.forEach((seccion) => {
                seccion.aspectos.forEach((aspecto) => {
                    nuevosAspectos[`aspecto_${aspecto.id}`] = null;
                });
            });
            aspectosGeneralesDinamicos.value = nuevosAspectos;
        }
    } catch (error) {
        console.error('Error al cargar aspectos:', error);
        aspectosCarga.value = [];
        aspectosGeneralesDinamicos.value = {};
    } finally {
        loading.value = false;
        loading_msg.value = '';
    }
};

// Watcher para detectar cambios en el tipo de inspección
watch(tipoInspeccionId, (newValue) => {
    if (newValue && newValue !== 'null') {
        cargarAspectosPorTipo(newValue);
    } else {
        aspectosCarga.value = [];
        aspectosGeneralesDinamicos.value = {};
    }
});

// Watcher para detectar cambios en el lugar de inspección
watch(lugarInspeccionId, (newValue) => {
    if (newValue && newValue !== 'null') {
        cargarResponsables(newValue);
    } else {
        responsables.value = [];
        cargo.value = null;
    }
});

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  cargarTiposInspeccion();
  cargarLugaresInspeccion();
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

/* Estilos para la tabla de verificación */
.tabla-verificacion-container {
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-x: auto;
}

.tabla-verificacion {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,40,0.08);
    border-radius: 8px;
    overflow: hidden;
}

.tabla-verificacion thead tr {
    background: linear-gradient(90deg, #5dade2 0%, #3498db 100%);
    color: white;
}

.tabla-verificacion th {
    padding: 14px 12px;
    text-align: center;
    font-weight: 700;
    font-size: 0.95rem;
    border: 1px solid #2e86c1;
    text-transform: uppercase;
}

.tabla-verificacion .col-aspecto {
    background: linear-gradient(90deg, #2874a6 0%, #1f618d 100%);
    width: 55%;
    text-align: left;
}

.tabla-verificacion .col-opcion {
    background: linear-gradient(90deg, #2874a6 0%, #1f618d 100%);
    width: 15%;
}

.tabla-verificacion tbody tr.seccion-header {
    background: linear-gradient(90deg, #2874a6 0%, #1f618d 100%);
    color: white;
    font-weight: bold;
}

.tabla-verificacion tbody tr.seccion-header td {
    padding: 12px 15px;
    font-size: 0.95rem;
    border: 1px solid #1b4f72;
    text-align: left;
    font-weight: 700;
}

.tabla-verificacion tbody tr:not(.seccion-header) {
    background: #ebf5fb;
}

.tabla-verificacion tbody tr:not(.seccion-header):nth-child(even) {
    background: #d6eaf8;
}

.tabla-verificacion tbody tr:not(.seccion-header):hover {
    background: #aed6f1;
    transition: background 0.2s;
}

.tabla-verificacion td {
    padding: 12px 15px;
    border: 1px solid #aed6f1;
    text-align: center;
}

.tabla-verificacion .aspecto-cell {
    text-align: left;
    color: #21618c;
    padding-left: 15px;
    font-size: 0.92rem;
    line-height: 1.5;
}

.tabla-verificacion .numero-badge {
    display: inline-block;
    background: linear-gradient(135deg, #3498db 0%, #2874a6 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.85rem;
    margin-right: 10px;
    min-width: 35px;
    text-align: center;
}

.tabla-verificacion .opcion-cell input[type="radio"] {
    cursor: pointer;
    width: 20px;
    height: 20px;
    accent-color: #3498db;
}

.tabla-verificacion .opcion-cell {
    background: rgba(255, 255, 255, 0.7);
}

/* Estilos para la sección de imágenes */
.imagenes-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.imagen-item {
    border: 2px dashed #aed6f1;
    padding: 15px;
    border-radius: 8px;
    background: #ebf5fb;
    transition: all 0.3s;
}

.imagen-item:hover {
    border-color: #3498db;
    background: #d6eaf8;
}

.input-group {
    display: flex;
    gap: 10px;
}

.input-group .form-control {
    flex: 1;
}

.input-group .btn-danger {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    white-space: nowrap;
}

.preview-container {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.img-preview {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid #3498db;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
    object-fit: cover;
}

.nombre-archivo {
    font-size: 0.85rem;
    color: #21618c;
    font-weight: 500;
    text-align: center;
    word-break: break-word;
    max-width: 250px;
}

.btn-primary {
    background: linear-gradient(90deg, #3498db 0%, #2874a6 100%);
    border: none;
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover {
    background: linear-gradient(90deg, #2874a6 0%, #1f618d 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}
</style>