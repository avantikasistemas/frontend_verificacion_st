<template>
    <LayoutView>
        <div class="container mt-2">
            <div class="general-header">
                <div class="header-app">
                    <img :src="logotipo" :alt="logotipo" class="logo-app" />
                    <h4 class="titulo-app">LISTA DE CHEQUEO - INSPECCIONES</h4>
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
                                        <option :value="null">Seleccione</option>
                                        <option v-for="tipo in tiposInspeccion" :key="tipo.id" :value="tipo.id">
                                            {{ tipo.id }} - {{ tipo.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Campos de Aduana y Responsable (Aplican para todos los tipos) -->
                            <div class="row mb-4" v-if="tipoInspeccionId">
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Aduana:</strong></label>
                                    <select class="form-select" v-model="aduanaId">
                                        <option :value="null">Seleccione una aduana</option>
                                        <option v-for="aduana in aduanas" :key="aduana.id" :value="aduana.id">
                                            {{ aduana.nombre }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label"><strong>Responsable por Aduana:</strong></label>
                                    <select class="form-select" v-model="responsableAduanaId" :disabled="!aduanaId">
                                        <option :value="null">Seleccione un responsable</option>
                                        <option v-for="responsable in responsablesPorAduana" :key="responsable.id" :value="responsable.id">
                                            {{ responsable.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Campos adicionales según tipo de inspección -->
                            <div class="row mb-4" v-if="tipoInspeccionId">
                                <!-- Campos para Tipo 1: Carga Suelta -->
                                <template v-if="tipoInspeccionId === 1">
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Número de Contenedor:</strong></label>
                                        <input type="text" class="form-control" v-model="numeroContenedor" placeholder="Ingrese número de contenedor">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Número de Sello de Seguridad:</strong></label>
                                        <input type="text" class="form-control" v-model="numeroSelloSeguridad" placeholder="Ingrese número de sello">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Documento de Transporte:</strong></label>
                                        <input type="text" class="form-control" v-model="documentoTransporte" placeholder="Ingrese documento">
                                    </div>
                                </template>

                                <!-- Campos para Tipo 2: Contenedores -->
                                <template v-if="tipoInspeccionId === 2">
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Empresa de Transporte:</strong></label>
                                        <input type="text" class="form-control" v-model="empresaTransporte" placeholder="Ingrese empresa de transporte">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Número de Contenedor:</strong></label>
                                        <input type="text" class="form-control" v-model="numeroContenedor" placeholder="Ingrese número de contenedor">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label"><strong>Placa de Vehículo:</strong></label>
                                        <input type="text" class="form-control" v-model="placaVehiculo" placeholder="Ingrese placa del vehículo">
                                    </div>
                                </template>
                            </div>

                            <!-- Tabla de verificación -->
                            <div class="tabla-verificacion-container" v-if="tipoInspeccionId">
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
                            <div class="row mt-4 mb-3" v-if="tipoInspeccionId">
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

                            <div class="row mb-3 mt-4" v-if="tipoInspeccionId">
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
                            <button class="btn btn-success" v-if="tipoInspeccionId">Guardar</button>
                        </form>
                    </div>
                </div>

                <!-- Tabla de registros - solo se muestra si hay tipo de inspección seleccionado -->
                <div class="col-lg-12" v-if="tipoInspeccionId && registros.length > 0">
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
                                        <th>TIPO INSPECCIÓN</th>
                                        <th>FECHA CREACIÓN</th>
                                        <th>NOVEDADES</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reg in registros" :key="reg.id">
                                        <td>{{ reg.id }}</td>
                                        <td>{{ reg.tipo_inspeccion_nombre }}</td>
                                        <td>{{ reg.fecha_creacion }}</td>
                                        <td>{{ truncarTexto(reg.novedades, 50) }}</td>
                                        <td>
                                            <button 
                                                class="btn btn-info btn-sm" 
                                                @click="verDetalle(reg)"
                                                title="Ver detalle"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                </svg>
                                            </button>
                                        </td>
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

        <!-- Modal de detalle de inspección -->
        <div class="modal fade" id="detalleModal" tabindex="-1" aria-labelledby="detalleModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(90deg, #5dade2 0%, #3498db 100%); color: white;">
                        <h5 class="modal-title" id="detalleModalLabel">
                            Detalle de Inspección #{{ detalleInspeccion?.id }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="detalleInspeccion">
                        <!-- Información general -->
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><strong>Información General</strong></h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Tipo de Inspección:</strong> {{ detalleInspeccion.tipo_inspeccion_nombre }}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Fecha de Creación:</strong> {{ detalleInspeccion.fecha_creacion }}</p>
                                    </div>
                                    
                                    <!-- Campos adicionales para Tipo 1: Carga Suelta -->
                                    <template v-if="detalleInspeccion.tipo_inspeccion_id === 1">
                                        <div class="col-md-4" v-if="detalleInspeccion.numero_contenedor">
                                            <p><strong>Número de Contenedor:</strong> {{ detalleInspeccion.numero_contenedor }}</p>
                                        </div>
                                        <div class="col-md-4" v-if="detalleInspeccion.numero_sello_seguridad">
                                            <p><strong>Número de Sello de Seguridad:</strong> {{ detalleInspeccion.numero_sello_seguridad }}</p>
                                        </div>
                                        <div class="col-md-4" v-if="detalleInspeccion.documento_transporte">
                                            <p><strong>Documento de Transporte:</strong> {{ detalleInspeccion.documento_transporte }}</p>
                                        </div>
                                    </template>
                                    
                                    <!-- Campos adicionales para Tipo 2: Contenedores -->
                                    <template v-if="detalleInspeccion.tipo_inspeccion_id === 2">
                                        <div class="col-md-4" v-if="detalleInspeccion.empresa_transporte">
                                            <p><strong>Empresa de Transporte:</strong> {{ detalleInspeccion.empresa_transporte }}</p>
                                        </div>
                                        <div class="col-md-4" v-if="detalleInspeccion.numero_contenedor">
                                            <p><strong>Número de Contenedor:</strong> {{ detalleInspeccion.numero_contenedor }}</p>
                                        </div>
                                        <div class="col-md-4" v-if="detalleInspeccion.placa_vehiculo">
                                            <p><strong>Placa de Vehículo:</strong> {{ detalleInspeccion.placa_vehiculo }}</p>
                                        </div>
                                    </template>
                                    
                                    <!-- Campos de aduana (aplican a todos los tipos) -->
                                    <div class="col-md-6" v-if="detalleInspeccion.aduana_nombre">
                                        <p><strong>Aduana:</strong> {{ detalleInspeccion.aduana_nombre }}</p>
                                    </div>
                                    <div class="col-md-6" v-if="detalleInspeccion.responsable_aduana_nombre">
                                        <p><strong>Responsable Aduana:</strong> {{ detalleInspeccion.responsable_aduana_nombre }}</p>
                                    </div>
                                    
                                    <div class="col-md-12">
                                        <p><strong>Novedades:</strong></p>
                                        <p class="text-muted">{{ detalleInspeccion.novedades || 'Sin novedades' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Aspectos evaluados -->
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><strong>Aspectos Evaluados</strong></h6>
                            </div>
                            <div class="card-body">
                                <table class="tabla-verificacion w-100">
                                    <thead>
                                        <tr>
                                            <th class="col-aspecto">Aspecto</th>
                                            <th class="col-opcion text-center">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="(seccion, seccionIndex) in detalleInspeccion.aspectos" :key="`detalle_seccion_${seccion.seccion_id}`">
                                            <tr class="seccion-header">
                                                <td colspan="2">{{ seccionIndex + 1 }}. {{ seccion.seccion_nombre }}</td>
                                            </tr>
                                            <tr v-for="(aspecto, aspectoIndex) in seccion.aspectos" :key="`detalle_aspecto_${aspecto.aspecto_id}`">
                                                <td class="aspecto-cell">
                                                    <span class="numero-badge">{{ seccionIndex + 1 }}.{{ aspectoIndex + 1 }}</span> 
                                                    {{ aspecto.aspecto_nombre }}
                                                </td>
                                                <td class="text-center">
                                                    <span :class="{'text-success': aspecto.valor === '✔', 'text-danger': aspecto.valor === '✖', 'text-muted': aspecto.valor === 'N/A'}">
                                                        <strong>{{ aspecto.valor }}</strong>
                                                    </span>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Imágenes adjuntas -->
                        <div class="card" v-if="detalleInspeccion.imagenes && detalleInspeccion.imagenes.length > 0">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><strong>Imágenes Adjuntas ({{ detalleInspeccion.imagenes.length }})</strong></h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 mb-3" v-for="imagen in detalleInspeccion.imagenes" :key="imagen.id">
                                        <div class="card">
                                            <img 
                                                :src="`${apiUrl.replace('/api', '')}/Uploads/${imagen.ruta_archivo}`" 
                                                :alt="imagen.nombre_archivo"
                                                class="card-img-top"
                                                style="height: 200px; object-fit: cover; cursor: pointer;"
                                                @click="abrirImagenCompleta(imagen)"
                                            >
                                            <div class="card-body p-2">
                                                <small class="text-muted">{{ imagen.nombre_archivo }}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card" v-else>
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><strong>Imágenes Adjuntas</strong></h6>
                            </div>
                            <div class="card-body text-center text-muted">
                                <p>No hay imágenes adjuntas para esta inspección</p>
                            </div>
                        </div>
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

const tipoInspeccionId = ref(null);
const tiposInspeccion = ref([]);
const fechaDesde = ref(null);
const fechaHasta = ref(null);
const fechaDesdeFormateada = ref(null);
const fechaHastaFormateada = ref(null);

// Campos adicionales según tipo de inspección
const numeroContenedor = ref(null);
const numeroSelloSeguridad = ref(null);
const documentoTransporte = ref(null);
const empresaTransporte = ref(null);
const placaVehiculo = ref(null);

// Campos de aduana y responsable
const aduanaId = ref(null);
const aduanas = ref([]);
const responsableAduanaId = ref(null);
const responsablesPorAduana = ref([]);

const imagenes = ref([{ id: 1, base64: null, nombre: null }]);
const contadorImagenes = ref(1);

const aspectosCarga = ref([]);
const aspectosGeneralesDinamicos = ref({});

const novedades = ref(null);
const registros = ref([]);

const detalleInspeccion = ref(null);
const modalDetalleInstance = ref(null);

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
    if (!tipoInspeccionId.value) {
        errorMsg.value = 'Por favor, seleccione el tipo de inspección.';
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
                aspectos_generales_dinamicos: aspectosGeneralesDinamicos.value,
                imagenes: imagenesConDatos,
                novedades: novedades.value,
                // Campos de aduana y responsable
                aduana_id: aduanaId.value,
                responsable_aduana_id: responsableAduanaId.value,
                // Campos adicionales según tipo de inspección
                numero_contenedor: numeroContenedor.value,
                numero_sello_seguridad: numeroSelloSeguridad.value,
                documento_transporte: documentoTransporte.value,
                empresa_transporte: empresaTransporte.value,
                placa_vehiculo: placaVehiculo.value,
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
            `${apiUrl}/cargar_datos_carga`, 
            {
                tipo_inspeccion_id: tipoInspeccionId.value,
                fecha_desde: fechaDesdeFormateada.value,
                fecha_hasta: fechaHastaFormateada.value,
                limit: parseInt(limit.value),
                position: parseInt(position.value),
            },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        if (response.status === 200) {
            registros.value = response.data.data.registros;
            total_registros.value = response.data.data.cant_registros;
            // Calcular total de páginas
            total_paginas.value = Math.ceil(total_registros.value / parseInt(limit.value));
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
    
    // Limpiar aspectos dinámicos
    aspectosGeneralesDinamicos.value = {};
    aspectosCarga.value = [];
    
    // Limpiar imágenes
    imagenes.value = [{ id: 1, base64: null, nombre: null }];
    contadorImagenes.value = 1;
    
    novedades.value = null;
    
    // Limpiar campos adicionales
    numeroContenedor.value = null;
    numeroSelloSeguridad.value = null;
    documentoTransporte.value = null;
    empresaTransporte.value = null;
    placaVehiculo.value = null;
    
    // Limpiar campos de aduana
    aduanaId.value = null;
    responsableAduanaId.value = null;
    responsablesPorAduana.value = [];
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

// Función para cargar las aduanas
const cargarAduanas = async () => {
    try {
        console.log('Intentando cargar aduanas...');
        const response = await axios.post(
            `${apiUrl}/obtener_aduanas`,
            {},
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        console.log('Respuesta de aduanas:', response.data);
        if (response.status === 200) {
            aduanas.value = response.data.data || [];
            console.log('Aduanas cargadas:', aduanas.value);
        }
    } catch (error) {
        console.error('Error al cargar aduanas:', error);
        aduanas.value = [];
    }
};

// Función para cargar los responsables por aduana
const cargarResponsablesPorAduana = async (aduana_id) => {
    try {
        console.log('Cargando responsables para aduana:', aduana_id);
        const response = await axios.post(
            `${apiUrl}/obtener_responsables_por_aduana`,
            { aduana_id: aduana_id },
            {
                headers: {
                    Accept: "application/json",
                }
            }
        );
        console.log('Respuesta de responsables:', response.data);
        if (response.status === 200 && response.data.code === 200) {
            responsablesPorAduana.value = response.data.data || [];
            console.log('Responsables cargados:', responsablesPorAduana.value);
        }
    } catch (error) {
        console.error('Error al cargar responsables por aduana:', error);
        responsablesPorAduana.value = [];
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
watch(tipoInspeccionId, (newValue, oldValue) => {
    if (newValue) {
        cargarAspectosPorTipo(newValue);
        cargarDatos(); // Cargar los datos cuando se selecciona un tipo
        
        // Limpiar campos adicionales cuando cambia el tipo de inspección
        if (oldValue !== newValue) {
            numeroContenedor.value = null;
            numeroSelloSeguridad.value = null;
            documentoTransporte.value = null;
            empresaTransporte.value = null;
            placaVehiculo.value = null;
            aduanaId.value = null;
            responsableAduanaId.value = null;
            responsablesPorAduana.value = [];
        }
    } else {
        aspectosCarga.value = [];
        aspectosGeneralesDinamicos.value = {};
        numeroContenedor.value = null;
        numeroSelloSeguridad.value = null;
        documentoTransporte.value = null;
        empresaTransporte.value = null;
        placaVehiculo.value = null;
        aduanaId.value = null;
        responsableAduanaId.value = null;
        responsablesPorAduana.value = [];
    }
});

// Watcher para detectar cambios en aduana y cargar responsables
watch(aduanaId, (newValue) => {
    if (newValue) {
        cargarResponsablesPorAduana(newValue);
    } else {
        responsablesPorAduana.value = [];
        responsableAduanaId.value = null;
    }
});

// Función para truncar texto
const truncarTexto = (texto, maxLength) => {
    if (!texto) return '-';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
};

// Función para ver detalle de una inspección
const verDetalle = (inspeccion) => {
    detalleInspeccion.value = inspeccion;
    modalDetalleInstance.value.show();
};

// Función para abrir imagen en nueva pestaña
const abrirImagenCompleta = (imagen) => {
    const url = `${apiUrl.replace('/api', '')}/Uploads/${imagen.ruta_archivo}`;
    window.open(url, '_blank');
};

// Código que se ejecuta al montar el componente
onMounted(() => {
  modalInstance.value = new Modal(exitoModal);
  modalErrorInstance.value = new Modal(errorModal);
  const modalDetalleElement = document.getElementById('detalleModal');
  if (modalDetalleElement) {
    modalDetalleInstance.value = new Modal(modalDetalleElement);
  }
  cargarTiposInspeccion();
  cargarAduanas();
  // No cargar datos automáticamente, solo cuando se seleccione un tipo
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

/* Botón de ver detalle con ícono */
.btn-info {
    background: linear-gradient(90deg, #5dade2 0%, #3498db 100%);
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-info:hover {
    background: linear-gradient(90deg, #3498db 0%, #2874a6 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.4);
}
</style>