<template>
    <LayoutView>
        <div class="container mt-2">
            <div class="general-header">
                <div class="header-app">
                    <img :src="logotipo" :alt="logotipo" class="logo-app" />
                    <h4 class="titulo-app">LISTA DE CHEQUEO - CONTROL FÍSICO Y SEGURIDAD (Almacén / Sede Administrativa)</h4>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="card p-4 mb-4">
                        <form @submit.prevent="guardarVerificacion">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <label class="form-label"><strong>Lugar de inspección:</strong></label>
                                    <select class="form-select" v-model="lugarInspeccionId">
                                        <option value="null">Seleccione</option>
                                        <option v-for="lugar in lugaresInspeccion" :key="lugar.id" :value="lugar.id">
                                            {{ lugar.nombre }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label"><strong>Cargo quien verifica:</strong></label>
                                    <select class="form-select" v-model="cargo" :disabled="!lugarInspeccionId || lugarInspeccionId === 'null'">
                                        <option value="null">Seleccione</option>
                                        <option v-for="responsable in responsables" :key="responsable.id" :value="responsable.id">
                                            {{ responsable.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Tabla de verificación -->
                            <div class="tabla-verificacion-container">
                                <table class="tabla-verificacion">
                                    <thead>
                                        <tr>
                                            <th class="col-aspecto">ASPECTOS PARA VERIFICAR</th>
                                            <th class="col-opcion">SI</th>
                                            <th class="col-opcion">NO</th>
                                            <th class="col-opcion">N/A</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">1</span> Cuenta con iluminación suficiente y funcional para operaciones seguras.</td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_1" value="1" v-model="aspectosGenerales.aspecto_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_1" value="0" v-model="aspectosGenerales.aspecto_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_1" value="2" v-model="aspectosGenerales.aspecto_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2</span> La carga está organizada según el tipo de material, sin obstruir pasillos o accesos.</td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_2" value="1" v-model="aspectosGenerales.aspecto_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_2" value="0" v-model="aspectosGenerales.aspecto_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_2" value="2" v-model="aspectosGenerales.aspecto_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">3</span> Cuenta con los equipos necesarios (carretillas, estibas, elementos de seguridad) para la manipulación segura de carga suelta.</td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_3" value="1" v-model="aspectosGenerales.aspecto_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_3" value="0" v-model="aspectosGenerales.aspecto_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_3" value="2" v-model="aspectosGenerales.aspecto_3"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">4</span> El área destinada al almacenamiento de carga está claramente delimitadas y señalizadas.</td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_4" value="1" v-model="aspectosGenerales.aspecto_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_4" value="0" v-model="aspectosGenerales.aspecto_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="aspecto_4" value="2" v-model="aspectosGenerales.aspecto_4"></td>
                                        </tr>

                                        <!-- Sección 1: Paredes -->
                                        <tr class="seccion-header">
                                            <td colspan="4">1. PAREDES</td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">1.1</span> Sin grietas, roturas, humedad, fisuras o signos de deterioro estructural.</td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_1" value="1" v-model="paredes.paredes_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_1" value="0" v-model="paredes.paredes_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_1" value="2" v-model="paredes.paredes_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">1.2</span> La pintura o recubrimiento está en buen estado, sin desprendimientos ni corrosión.</td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_2" value="1" v-model="paredes.paredes_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_2" value="0" v-model="paredes.paredes_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_2" value="2" v-model="paredes.paredes_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">1.3</span> Señalización visible de rutas de evacuación, zonas de seguridad o advertencias.</td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_3" value="1" v-model="paredes.paredes_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_3" value="0" v-model="paredes.paredes_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_3" value="2" v-model="paredes.paredes_3"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">1.4</span> Muros o cerramientos laterales no presentan huecos, aberturas ni accesos vulnerables.</td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_4" value="1" v-model="paredes.paredes_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_4" value="0" v-model="paredes.paredes_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="paredes_4" value="2" v-model="paredes.paredes_4"></td>
                                        </tr>

                                        <!-- Sección 2: Puertas interiores/exteriores -->
                                        <tr class="seccion-header">
                                            <td colspan="4">2. PUERTAS INTERIORES/EXTERIORES</td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2.1</span> Estructura sin daños, abolladuras, corrosión o deformaciones.</td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_1" value="1" v-model="puertas.puertas_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_1" value="0" v-model="puertas.puertas_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_1" value="2" v-model="puertas.puertas_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2.2</span> Abre y cierra correctamente, sin forzar mecanismos de cerraduras.</td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_2" value="1" v-model="puertas.puertas_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_2" value="0" v-model="puertas.puertas_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_2" value="2" v-model="puertas.puertas_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2.3</span> Cuenta con señalización conforme a su función.</td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_3" value="1" v-model="puertas.puertas_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_3" value="0" v-model="puertas.puertas_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_3" value="2" v-model="puertas.puertas_3"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2.4</span> Bisagras, rieles o estera sin desgaste excesivo, roturas o piezas sueltas.</td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_4" value="1" v-model="puertas.puertas_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_4" value="0" v-model="puertas.puertas_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_4" value="2" v-model="puertas.puertas_4"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">2.5</span> Ningún objeto bloquea el acceso o la salida.</td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_5" value="1" v-model="puertas.puertas_5"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_5" value="0" v-model="puertas.puertas_5"></td>
                                            <td class="opcion-cell"><input type="radio" name="puertas_5" value="2" v-model="puertas.puertas_5"></td>
                                        </tr>

                                        <!-- Sección 3: Piso -->
                                        <tr class="seccion-header">
                                            <td colspan="4">3. PISO</td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">3.1</span> Superficie nivelada, sin hundimientos, grietas profundas, roturas o desgaste excesivo.</td>
                                            <td class="opcion-cell"><input type="radio" name="piso_1" value="1" v-model="piso.piso_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_1" value="0" v-model="piso.piso_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_1" value="2" v-model="piso.piso_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">3.2</span> Piso libre de polvo, residuos, derrames, materiales sueltos u otros contaminantes.</td>
                                            <td class="opcion-cell"><input type="radio" name="piso_2" value="1" v-model="piso.piso_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_2" value="0" v-model="piso.piso_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_2" value="2" v-model="piso.piso_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">3.3</span> Líneas o marcas visibles para zonas de almacenamiento, tránsito y seguridad.</td>
                                            <td class="opcion-cell"><input type="radio" name="piso_3" value="1" v-model="piso.piso_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_3" value="0" v-model="piso.piso_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_3" value="2" v-model="piso.piso_3"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">3.4</span> Zonas húmedas, filtraciones o acumulaciones de agua.</td>
                                            <td class="opcion-cell"><input type="radio" name="piso_4" value="1" v-model="piso.piso_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_4" value="0" v-model="piso.piso_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="piso_4" value="2" v-model="piso.piso_4"></td>
                                        </tr>

                                        <!-- Sección 4: Techo interior/exterior -->
                                        <tr class="seccion-header">
                                            <td colspan="4">4. TECHO INTERIOR/EXTERIOR</td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">4.1</span> Detectan signos de filtración de agua, humedad o acumulación de moho.</td>
                                            <td class="opcion-cell"><input type="radio" name="techo_1" value="1" v-model="techo.techo_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_1" value="0" v-model="techo.techo_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_1" value="2" v-model="techo.techo_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">4.2</span> Material aislante en buen estado, sin desprendimientos, cortes o desgaste.</td>
                                            <td class="opcion-cell"><input type="radio" name="techo_2" value="1" v-model="techo.techo_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_2" value="0" v-model="techo.techo_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_2" value="2" v-model="techo.techo_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">4.3</span> Luminarias, sensores u otros equipos están firmemente sujetos y operativos.</td>
                                            <td class="opcion-cell"><input type="radio" name="techo_3" value="1" v-model="techo.techo_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_3" value="0" v-model="techo.techo_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="techo_3" value="2" v-model="techo.techo_3"></td>
                                        </tr>

                                        <!-- Sección 5: Seguridad -->
                                        <tr class="seccion-header">
                                            <td colspan="4">5. SEGURIDAD</td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">5.1</span> Cámaras de videovigilancia instaladas y ubicadas en puntos estratégicos, en funcionamiento y cobertura total de la carga.</td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_1" value="1" v-model="seguridad.seguridad_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_1" value="0" v-model="seguridad.seguridad_1"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_1" value="2" v-model="seguridad.seguridad_1"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">5.2</span> Se lleva registro físico o digital de personas, vehículos o visitas.</td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_2" value="1" v-model="seguridad.seguridad_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_2" value="0" v-model="seguridad.seguridad_2"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_2" value="2" v-model="seguridad.seguridad_2"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">5.3</span> Se informa la existencia de videovigilancia con señalización visible.</td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_3" value="1" v-model="seguridad.seguridad_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_3" value="0" v-model="seguridad.seguridad_3"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_3" value="2" v-model="seguridad.seguridad_3"></td>
                                        </tr>
                                        <tr>
                                            <td class="aspecto-cell"><span class="numero-badge">5.4</span> Hay vigilancia física activa (guardias) según turno.</td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_4" value="1" v-model="seguridad.seguridad_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_4" value="0" v-model="seguridad.seguridad_4"></td>
                                            <td class="opcion-cell"><input type="radio" name="seguridad_4" value="2" v-model="seguridad.seguridad_4"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="row mb-3 mt-4">
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
                                        <th>ASPECTOS 1</th>
                                        <th>ASPECTOS 2</th>
                                        <th>ASPECTOS 3</th>
                                        <th>ASPECTOS 4</th>
                                        <th>PAREDES 1</th>
                                        <th>PAREDES 2</th>
                                        <th>PAREDES 3</th>
                                        <th>PAREDES 4</th>
                                        <th>PUERTAS 1</th>
                                        <th>PUERTAS 2</th>
                                        <th>PUERTAS 3</th>
                                        <th>PUERTAS 4</th>
                                        <th>PUERTAS 5</th>
                                        <th>PISOS 1</th>
                                        <th>PISOS 2</th>
                                        <th>PISOS 3</th>
                                        <th>PISOS 4</th>
                                        <th>TECHO 1</th>
                                        <th>TECHO 2</th>
                                        <th>TECHO 3</th>
                                        <th>SEGURIDAD 1</th>
                                        <th>SEGURIDAD 2</th>
                                        <th>SEGURIDAD 3</th>
                                        <th>SEGURIDAD 4</th>
                                        <th>NOVEDADES</th>
                                        <th>FECHA CREACIÓN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="reg in registros" :key="reg.id">
                                        <td>{{ reg.id }}</td>
                                        <td>{{ reg.lugar_inspeccion }}</td>
                                        <td>{{ reg.responsable_verificacion }}</td>
                                        <td>{{ reg.aspectos_1 }}</td>
                                        <td>{{ reg.aspectos_2 }}</td>
                                        <td>{{ reg.aspectos_3 }}</td>
                                        <td>{{ reg.aspectos_4 }}</td>
                                        <td>{{ reg.paredes_1 }}</td>
                                        <td>{{ reg.paredes_2 }}</td>
                                        <td>{{ reg.paredes_3 }}</td>
                                        <td>{{ reg.paredes_4 }}</td>
                                        <td>{{ reg.puertas_1 }}</td>
                                        <td>{{ reg.puertas_2 }}</td>
                                        <td>{{ reg.puertas_3 }}</td>
                                        <td>{{ reg.puertas_4 }}</td>
                                        <td>{{ reg.puertas_5 }}</td>
                                        <td>{{ reg.pisos_1 }}</td>
                                        <td>{{ reg.pisos_2 }}</td>
                                        <td>{{ reg.pisos_3 }}</td>
                                        <td>{{ reg.pisos_4 }}</td>
                                        <td>{{ reg.techo_1 }}</td>
                                        <td>{{ reg.techo_2 }}</td>
                                        <td>{{ reg.techo_3 }}</td>
                                        <td>{{ reg.seguridad_1 }}</td>
                                        <td>{{ reg.seguridad_2 }}</td>
                                        <td>{{ reg.seguridad_3 }}</td>
                                        <td>{{ reg.seguridad_4 }}</td>
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
const lugarInspeccionId = ref(null);
const lugaresInspeccion = ref([]);
const responsables = ref([]);
const fechaDesde = ref(null);
const fechaHasta = ref(null);
const fechaDesdeFormateada = ref(null);
const fechaHastaFormateada = ref(null);

// Objetos separados por sección para almacenar los aspectos verificados
const aspectosGenerales = ref({
    aspecto_1: null,
    aspecto_2: null,
    aspecto_3: null,
    aspecto_4: null,
});

const paredes = ref({
    paredes_1: null,
    paredes_2: null,
    paredes_3: null,
    paredes_4: null,
});

const puertas = ref({
    puertas_1: null,
    puertas_2: null,
    puertas_3: null,
    puertas_4: null,
    puertas_5: null,
});

const piso = ref({
    piso_1: null,
    piso_2: null,
    piso_3: null,
    piso_4: null,
});

const techo = ref({
    techo_1: null,
    techo_2: null,
    techo_3: null,
});

const seguridad = ref({
    seguridad_1: null,
    seguridad_2: null,
    seguridad_3: null,
    seguridad_4: null,
});

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

        const response = await axios.post(
            `${apiUrl}/guardar_verificacion`,
            { 
                lugar_inspeccion_id: lugarInspeccionId.value,
                responsable_verificacion_id: cargo.value,
                aspectos_generales: aspectosGenerales.value,
                paredes: paredes.value,
                puertas: puertas.value,
                piso: piso.value,
                techo: techo.value,
                seguridad: seguridad.value,
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
    lugarInspeccionId.value = null;
    cargo.value = null;
    responsables.value = [];
    
    // Limpiar todos los aspectos generales
    Object.keys(aspectosGenerales.value).forEach(key => {
        aspectosGenerales.value[key] = null;
    });
    
    // Limpiar paredes
    Object.keys(paredes.value).forEach(key => {
        paredes.value[key] = null;
    });
    
    // Limpiar puertas
    Object.keys(puertas.value).forEach(key => {
        puertas.value[key] = null;
    });
    
    // Limpiar piso
    Object.keys(piso.value).forEach(key => {
        piso.value[key] = null;
    });
    
    // Limpiar techo
    Object.keys(techo.value).forEach(key => {
        techo.value[key] = null;
    });
    
    // Limpiar seguridad
    Object.keys(seguridad.value).forEach(key => {
        seguridad.value[key] = null;
    });
    
    novedades.value = null;
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
</style>