<template>
  <div>
    <h2 class="text-center my-4">Fichas Tecnicas</h2>
    <b-card title="Agregando Ficha" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanFolio" class="input-sel mb-3">
          <div class="label">Codigo de Inventario</div>
          <b-form-input
            ref="inputFolio"
            v-model="Folio"
            class="w-100 cajaFolio"
            placeholder="XXDXXTXX-XXXXX-XXXXXXXX"
            maxlength="25"
            readonly
            @focus="$refs.inputFolio.select()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanCiudad" class="input-sel">
          <div class="label">Ciudad</div>
          <b-form-input
            ref="inputCiudad"
            v-model="Ciudad"
            class="w-100 caja"
            placeholder="Ciudad"
            @focus="$refs.inputCiudad.select()"
            @keyup.esc="clean"
            @keyup.enter="$refs.inputResponsable.focus()"
          />
        </span>
        <span id="spanResponsable" class="input-sel">
          <div class="label">Responsable</div>
          <b-form-input
            ref="inputResponsable"
            v-model="Responsable"
            class="w-100 caja"
            placeholder="Responsable"
            @focus="$refs.inputResponsable.select()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanFechaCaptura" class="input-sel ml-3 mb-3">
          <div class="label">Fecha de Captura</div>
          <b-form-datepicker
            id="dateEnd"
            v-model="FechaCaptura"
            today-button
            reset-button
            label-no-date-selected="Fecha no seleccionada"
            label-calendar="Calendario"
            label-current-month="Mes Actual"
            label-next-month="Mes Siguiente"
            label-prev-month="Mes Anterior"
            label-next-year="Año Siguiente"
            label-prev-year="Año anterior"
            label-help="Seleccione la fecha de captura"
            label-today-button="Hoy"
            label-reset-button="Limpiar"
          ></b-form-datepicker>
        </span>
        <span id="spanSucursal" class="input-sel ml-3 mb-3">
          <div class="label">Sucursal</div>
          <b-input-group>
            <b-form-select
              v-model="Sucursal"
              :options="sucursales"
              :disabled="!isSelectedFecha"
            ></b-form-select>
            <b-input-group-append>
              <b-button variant="info" @click="updateSucursales">
                <b-icon icon="arrow-clockwise" :animation="animationSuc" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </span>
        <span id="spanDepartamento" class="input-sel ml-3 mb-3">
          <div class="label">Departamento</div>
          <b-input-group>
            <b-form-select
              v-model="Departamento"
              :options="departamentos"
              :disabled="!isSelectedSucursal"
            ></b-form-select>
            <b-input-group-append>
              <b-button variant="info" @click="updateDepartamentos">
                <b-icon icon="arrow-clockwise" :animation="animationDep" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </span>
        <span id="spanTipoEquipo" class="input-sel ml-3 mb-3">
          <div class="label">Tipo de Equipo</div>
          <b-input-group>
            <b-form-select
              v-model="tipoSelected"
              :options="tipos"
              :disabled="!isSelectedSucursal || !isSelectedDepartamento"
              @change="getCamposByType"
            ></b-form-select>
            <b-input-group-append>
              <b-button variant="info" @click="updateTipos">
                <b-icon icon="arrow-clockwise" :animation="animationTipo" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </span>
        <span id="spanObservaciones" class="input-sel">
          <div class="label">Observaciones</div>
          <b-form-textarea
            id="textarea"
            ref="inputObservaciones"
            v-model="Observaciones"
            class="w-100"
            placeholder="Ingresa tus Observaciones"
            rows="4"
            max-rows="6"
            :disabled="
              !isSelectedSucursal || !isSelectedDepartamento || !seleccionoTipo
            "
            @focus="$refs.inputObservaciones.select()"
            @keyup.enter="$refs.inputModelo.focus()"
            @keyup.esc="clean"
          />
        </span>
        <Divider class="my-3" />
        <div v-if="!seleccionoTipo" class="w-100 mb-3">
          <h5 class="mt-3">Esperando seleccion de Tipo de Equipo</h5>
          <b-card>
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
          </b-card>
        </div>
        <span v-else>
          <span v-if="vF('Modelo')" id="spanModelo" class="input-sel">
            <div class="label">Modelo</div>
            <b-form-input
              ref="inputModelo"
              v-model="Modelo"
              class="w-100 caja"
              placeholder="Modelo"
              @focus="$refs.inputModelo.select()"
              @keyup.enter="$refs.inputMarca.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Marca')" id="spanMarca" class="input-sel">
            <div class="label">Marca</div>
            <b-form-input
              ref="inputMarca"
              v-model="Marca"
              class="w-100"
              @focus="$refs.inputMarca.select()"
              @keyup.enter="$refs.inputPantallaPulgadas.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('PantallaPulgadas')"
            id="spanPantallaPulgadas"
            class="input-sel"
          >
            <div class="label">Pulgadas de la Pantalla</div>
            <b-form-input
              ref="inputPantallaPulgadas"
              v-model="PantallaPulgadas"
              class="w-100"
              type="number"
              @focus="$refs.inputPantallaPulgadas.select()"
              @keyup.enter="$refs.inputTamañoPulgadas.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('TamañoPulgadas')"
            id="spanTamañoPulgadas"
            class="input-sel"
          >
            <div class="label">Tamaño de Pulgadas</div>
            <b-form-input
              ref="inputTamañoPulgadas"
              v-model="TamañoPulgadas"
              class="w-100"
              type="number"
              @focus="$refs.inputTamañoPulgadas.select()"
              @keyup.enter="$refs.inputFabricante.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Fabricante')" id="spanFabricante" class="input-sel">
            <div class="label">Fabricante</div>
            <b-form-input
              ref="inputFabricante"
              v-model="Fabricante"
              class="w-100"
              @focus="$refs.inputFabricante.select()"
              @keyup.enter="$refs.inputPuertoHDMI.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('PuertoHDMI')" id="spanPuertoHDMI" class="input-sel">
            <div class="label">Numero de Puertos HDMI</div>
            <b-form-input
              ref="inputPuertoHDMI"
              v-model="PuertoHDMI"
              class="w-100"
              type="number"
              @focus="$refs.inputPuertoVGA.select()"
              @keyup.enter="$refs.inputPuertoVGA.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('PuertoVGA')" id="spanPuertoVGA" class="input-sel">
            <div class="label">Numero de Puertos VGA</div>
            <b-form-input
              ref="inputPuertoVGA"
              v-model="PuertoVGA"
              class="w-100"
              type="number"
              @focus="$refs.inputPuertoVGA.select()"
              @keyup.enter="$refs.inputColor.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Color')" id="spanColor" class="input-sel">
            <div class="label">Color</div>
            <b-form-input
              ref="inputColor"
              v-model="Color"
              class="w-100"
              @focus="$refs.inputColor.select()"
              @keyup.enter="$refs.inputSerie.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Serie')" id="spanSerie" class="input-sel">
            <div class="label">Numero de Serie</div>
            <b-form-input
              ref="inputSerie"
              v-model="Serie"
              class="w-100"
              @focus="$refs.inputSerie.select()"
              @keyup.enter="$refs.inputCodigo.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Codigo')" id="spanCodigo" class="input-sel">
            <div class="label">Codigo</div>
            <b-form-input
              ref="inputCodigo"
              v-model="Codigo"
              class="w-100"
              @focus="$refs.inputCodigo.select()"
              @keyup.enter="$refs.inputClave.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Clave')" id="spanClave" class="input-sel">
            <div class="label">Clave</div>
            <b-form-input
              ref="inputClave"
              v-model="Clave"
              class="w-100"
              @focus="$refs.inputClave.select()"
              @keyup.enter="$refs.inputDigitos.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Digitos')" id="spanDigitos" class="input-sel">
            <div class="label">Digitos</div>
            <b-form-input
              ref="inputDigitos"
              v-model="Digitos"
              class="w-100"
              type="number"
              @focus="$refs.inputDigitos.select()"
              @keyup.enter="$refs.inputLargo.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Largo')" id="spanLargo" class="input-sel">
            <div class="label">Largo</div>
            <b-form-input
              ref="inputLargo"
              v-model="Largo"
              class="w-100"
              type="number"
              @focus="$refs.inputLargo.select()"
              @keyup.enter="$refs.inputAncho.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Ancho')" id="spanAncho" class="input-sel">
            <div class="label">Ancho</div>
            <b-form-input
              ref="inputAncho"
              v-model="Ancho"
              class="w-100"
              type="number"
              @focus="$refs.inputAncho.select()"
              @keyup.enter="$refs.inputGrosor.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Grosor')" id="spanGrosor" class="input-sel">
            <div class="label">Grosor</div>
            <b-form-input
              ref="inputGrosor"
              v-model="Grosor"
              class="w-100"
              type="number"
              @focus="$refs.inputGrosor.select()"
              @keyup.enter="$refs.inputSO.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Alambrico')" id="spanGrosor" class="input-sel">
            <div class="label">Conectividad</div>
            <b-form-checkbox
              id="checkAlambrico"
              v-model="Alambrico"
              name="checkAlambrico"
              @keyup.enter="$refs.inputSO.focus()"
              @keyup.esc="clean"
            >
              Es Alambrico
            </b-form-checkbox>
          </span>
          <span v-if="vF('SO')" id="spanSO" class="input-sel">
            <div class="label">Sistema Operativo</div>
            <b-form-input
              ref="inputSO"
              v-model="SO"
              class="w-100"
              @focus="$refs.inputSO.select()"
              @keyup.enter="$refs.inputMotherBoard.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('MotherBoard')" id="spanMotherBoard" class="input-sel">
            <div class="label">Mother Board</div>
            <b-form-input
              ref="inputMotherBoard"
              v-model="MotherBoard"
              class="w-100"
              @focus="$refs.inputMotherBoard.select()"
              @keyup.enter="$refs.inputProcesador.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Procesador')" id="spanProcesador" class="input-sel">
            <div class="label">Tipo de Procesador</div>
            <b-form-input
              ref="inputProcesador"
              v-model="Procesador"
              class="w-100"
              @focus="$refs.inputProcesador.select()"
              @keyup.enter="$refs.inputDiscoDuro.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('DiscoDuro')" id="spanDiscoDuro" class="input-sel">
            <div class="label">Capacidad de Disco Duro</div>
            <b-form-input
              ref="inputDiscoDuro"
              v-model="DiscoDuro"
              class="w-100"
              @focus="$refs.inputDiscoDuro.select()"
              @keyup.enter="$refs.inputDRAM.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('RAM')" id="spanRAM" class="input-sel">
            <div class="label">RAM</div>
            <b-form-input
              ref="inputRAM"
              v-model="RAM"
              class="w-100"
              @focus="$refs.inputRAM.select()"
              @keyup.enter="$refs.inputConectividad.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('Conectividad')"
            id="spanConectividad"
            class="input-sel"
          >
            <div class="label">Conectividad</div>
            <b-form-input
              ref="inputConectividad"
              v-model="Conectividad"
              class="w-100"
              @focus="$refs.inputConectividad.select()"
              @keyup.enter="$refs.inputTipoPila.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('TipoPila')" id="spanTipoPila" class="input-sel">
            <div class="label">Tipo de Pila</div>
            <b-form-input
              ref="inputTipoPila"
              v-model="TipoPila"
              class="w-100"
              @focus="$refs.inputTipoPila.select()"
              @keyup.enter="$refs.inputDuracionBateria.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('DuracionBateria')"
            id="spanDuracionBateria"
            class="input-sel"
          >
            <div class="label">Duracion de Bateria</div>
            <b-form-input
              ref="inputDuracionBateria"
              v-model="DuracionBateria"
              class="w-100"
              @focus="$refs.inputDuracionBateria.select()"
              @keyup.enter="$refs.inputVoltaje.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Voltaje')" id="spanVoltaje" class="input-sel">
            <div class="label">Voltaje</div>
            <b-form-input
              ref="inputVoltaje"
              v-model="Voltaje"
              class="w-100"
              @focus="$refs.inputVoltaje.select()"
              @keyup.enter="$refs.inputAccesorios.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Accesorios')" id="spanAccesorios" class="input-sel">
            <div class="label">Accesorios</div>
            <b-form-input
              ref="inputAccesorios"
              v-model="Accesorios"
              class="w-100"
              @focus="$refs.inputAccesorios.select()"
              @keyup.enter="$refs.inputGarantia.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Garantia')" id="spanGarantia" class="input-sel">
            <div class="label">Garantia</div>
            <b-form-input
              ref="inputGarantia"
              v-model="Garantia"
              class="w-100"
              @focus="$refs.inputGarantia.select()"
              @keyup.enter="$refs.inputToner.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Toner')" id="spanToner" class="input-sel">
            <div class="label">Toner</div>
            <b-form-input
              ref="inputToner"
              v-model="Toner"
              class="w-100"
              @focus="$refs.inputToner.select()"
              @keyup.enter="$refs.inputTambor.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Tambor')" id="spanTambor" class="input-sel">
            <div class="label">Tambor</div>
            <b-form-input
              ref="inputTambor"
              v-model="Tambor"
              class="w-100"
              @focus="$refs.inputTambor.select()"
              @keyup.enter="$refs.inputTipo.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Tipo')" id="spanTipo" class="input-sel">
            <div class="label">Tipo</div>
            <b-form-input
              ref="inputTipo"
              v-model="Tipo"
              class="w-100"
              @focus="$refs.inputTipo.select()"
              @keyup.enter="$refs.inputNumeroSerial.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('NumeroSerial')"
            id="spanNumeroSerial"
            class="input-sel"
          >
            <div class="label">Numero Serial</div>
            <b-form-input
              ref="inputNumeroSerial"
              v-model="NumeroSerial"
              class="w-100"
              @focus="$refs.inputNumeroSerial.select()"
              @keyup.enter="$refs.inputMaterial.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Material')" id="spanMaterial" class="input-sel">
            <div class="label">Material</div>
            <b-form-input
              ref="inputMaterial"
              v-model="Material"
              class="w-100"
              @focus="$refs.inputMaterial.select()"
              @keyup.enter="$refs.inputVelocidades.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Velocidades')" id="spanVelocidades" class="input-sel">
            <div class="label">Velocidades</div>
            <b-form-input
              ref="inputVelocidades"
              v-model="Velocidades"
              class="w-100"
              @focus="$refs.inputVelocidades.select()"
              @keyup.enter="$refs.inputCapacidad.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Capacidad')" id="spanCapacidad" class="input-sel">
            <div class="label">Capacidad</div>
            <b-form-input
              ref="inputCapacidad"
              v-model="Capacidad"
              class="w-100"
              @focus="$refs.inputCapacidad.select()"
              @keyup.enter="$refs.inputContieneBateria.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('ContieneBateria')"
            id="spanContieneBateria"
            class="input-sel"
          >
            <div class="label">Bateria</div>
            <b-form-checkbox
              id="checkContieneBateria"
              v-model="ContieneBateria"
              name="checkContieneBateria"
              @keyup.enter="$refs.inputNumeroPuertas.focus()"
              @keyup.esc="clean"
            >
              Contiene Bateria
            </b-form-checkbox>
          </span>
          <span
            v-if="vF('NumeroPuertas')"
            id="spanNumeroPuertas"
            class="input-sel"
          >
            <div class="label">Numero de Puertas</div>
            <b-form-input
              ref="inputNumeroPuertas"
              v-model="NumeroPuertas"
              class="w-100"
              type="number"
              @focus="$refs.inputNumeroPuertas.select()"
              @keyup.enter="$refs.inputTemperaturaOperacion.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('TemperaturaOperacion')"
            id="spanTemperaturaOperacion"
            class="input-sel"
          >
            <div class="label">Temperatura de Operacion</div>
            <b-form-input
              ref="inputTemperaturaOperacion"
              v-model="TemperaturaOperacion"
              class="w-100"
              type="number"
              @focus="$refs.inputTemperaturaOperacion.select()"
              @keyup.enter="$refs.inputConsumoEnergetico.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('ConsumoEnergetico')"
            id="spanConsumoEnergetico"
            class="input-sel"
          >
            <div class="label">Consumo Energetico</div>
            <b-form-input
              ref="inputConsumoEnergetico"
              v-model="ConsumoEnergetico"
              class="w-100"
              @focus="$refs.inputConsumoEnergetico.select()"
              @keyup.enter="$refs.inputIluminacion.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Iluminacion')" id="spanIluminacion" class="input-sel">
            <div class="label">Iluminacion</div>
            <b-form-input
              ref="inputIluminacion"
              v-model="Iluminacion"
              class="w-100"
              @focus="$refs.inputIluminacion.select()"
              @keyup.enter="$refs.inputSistemaRefrigeracion.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span
            v-if="vF('SistemaRefrigeracion')"
            id="spanSistemaRefrigeracion"
            class="input-sel"
          >
            <div class="label">Sistema de Refrigeracion</div>
            <b-form-input
              ref="inputSistemaRefrigeracion"
              v-model="SistemaRefrigeracion"
              class="w-100"
              @focus="$refs.inputSistemaRefrigeracion.select()"
              @keyup.enter="$refs.inputCombustible.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Combustible')" id="spanCombustible" class="input-sel">
            <div class="label">Combustible</div>
            <b-form-input
              ref="inputCombustible"
              v-model="Combustible"
              class="w-100"
              @focus="$refs.inputCombustible.select()"
              @keyup.enter="$refs.inputContactos.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Contactos')" id="spanContactos" class="input-sel">
            <div class="label">Contactos</div>
            <b-form-input
              ref="inputContactos"
              v-model="Contactos"
              class="w-100"
              type="number"
              @focus="$refs.inputContactos.select()"
              @keyup.enter="$refs.inputCargador.focus()"
              @keyup.esc="clean"
            />
          </span>
          <span v-if="vF('Cargador')" id="spanCargador" class="input-sel">
            <div class="label">Cargador</div>
            <b-form-input
              ref="inputCargador"
              v-model="Cargador"
              class="w-100"
              @focus="$refs.inputCargador.select()"
              @keyup.enter="$refs.btnAgregar.focus()"
              @keyup.esc="clean"
            />
          </span>
        </span>
      </b-form>
      <div class="footer-card-add">
        <b-button
          ref="btnAgregar"
          variant="success"
          type="button"
          class="float-right"
          @keyup.esc="clean"
          @click="prepareCreateSuc"
        >
          <b-icon icon="plus-lg" />
          Agregar
        </b-button>
        <b-button
          ref="btnCancelar"
          variant="warning"
          type="button"
          class="float-right mr-3"
          @keyup.esc="clean"
          @keyup.enter="clean"
          @click="clean"
        >
          <b-icon icon="x-lg" />
          Cancelar (ESC)
        </b-button>
      </div>
    </b-card>
    <b-card class="mt-3" body-text-variant="dark">
      <b-button
        ref="btnRefrescar"
        variant="info"
        type="button"
        @click="loadData"
      >
        <b-icon icon="arrow-clockwise" />
        Refrescar
      </b-button>
      <b-table
        hover
        head-variant="dark"
        outlined
        responsive
        :items="sucursales"
        :fields="fields"
        class="mt-3"
      >
        <template #cell(Direccion)="row">
          {{ address(row.item) }}
        </template>
        <template #cell(Acciones)>
          <b-button variant="warning" size="sm" class="mb-1">
            <b-icon icon="pencil" />
          </b-button>
          <b-button variant="danger" size="sm" class="mb-1">
            <b-icon icon="trash-fill" />
          </b-button>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Divider from '../components/Divider.vue'
import utils from '../modules/utils'

export default {
  components: {
    Divider,
  },
  data() {
    return {
      utils,
      loadingSuc: false,
      loadingDep: false,
      loadingTipo: false,
      Consecutivo: -1,
      tipoSelected: '',
      FechaCaptura: '',
      Folio: '',
      Ciudad: '',
      Responsable: '',
      Sucursal: '',
      Departamento: '',
      Modelo: '',
      Marca: '',
      PantallaPulgadas: 0,
      TamañoPulgadas: 0,
      Fabricante: '',
      PuertoHDMI: 0,
      PuertoVGA: 0,
      Color: '',
      Serie: '',
      Codigo: '',
      Clave: '',
      Digitos: 0,
      Largo: 0,
      Ancho: 0,
      Grosor: 0,
      Alambrico: false,
      SO: '',
      MotherBoard: '',
      Procesador: '',
      DiscoDuro: '',
      RAM: '',
      Conectividad: '',
      TipoPila: '',
      DuracionBateria: '',
      Voltaje: '',
      Accesorios: '',
      Garantia: '',
      Toner: '',
      Tambor: '',
      Tipo: '',
      NumeroSerial: '',
      Material: '',
      Velocidades: '',
      Capacidad: '',
      ContieneBateria: false,
      NumeroPuertas: 0,
      TemperaturaOperacion: 0,
      ConsumoEnergetico: '',
      Iluminacion: '',
      SistemaRefrigeracion: '',
      Combustible: '',
      Contactos: 0,
      Cargador: '',
      Observaciones: '',
      listFieldsFicha: [],
      fields: [
        'Codigo',
        'Descripcion',
        'Estado',
        'Ciudad',
        { key: 'Direccion', label: 'Calle y Num' },
        'CP',
        'Acciones',
      ],
    }
  },
  watch: {
    FechaCaptura(newValue, oldValue) {
      const before =
        (this.Sucursal.trim() === '' ? 'XX' : this.Sucursal) +
        (this.Departamento.trim() === '' ? 'DXX' : this.Departamento) +
        (this.tipoSelected.trim() === '' ? 'TXX' : this.tipoSelected) +
        '-XXXXX-'
      this.Folio = before + newValue.replaceAll('-', '')
    },
    Sucursal(newValue, oldValue) {
      const dateC =
        this.FechaCaptura === ''
          ? 'XXXXXXXX'
          : this.FechaCaptura.replaceAll('-', '')
      const after =
        (this.Departamento.trim() === '' ? 'DXX' : this.Departamento) +
        (this.tipoSelected.trim() === '' ? 'TXX' : this.tipoSelected) +
        '-XXXXX-' +
        dateC

      this.Folio = newValue + after
    },
    Departamento(newValue, oldValue) {
      const dateC =
        this.FechaCaptura === ''
          ? 'XXXXXXXX'
          : this.FechaCaptura.replaceAll('-', '')
      const before = this.Sucursal.trim() === '' ? 'XX' : this.Sucursal
      const after =
        (this.tipoSelected.trim() === '' ? 'TXX' : this.tipoSelected) +
        '-XXXXX-' +
        dateC
      this.Folio = before + newValue + after
    },
    tipoSelected(newValue, oldValue) {
      const dateC =
        this.FechaCaptura === ''
          ? 'XXXXXXXX'
          : this.FechaCaptura.replaceAll('-', '')
      const before =
        (this.Sucursal.trim() === '' ? 'XX' : this.Sucursal) +
        (this.Departamento.trim() === '' ? 'DXX' : this.Departamento)
      const after = '-XXXXX-' + dateC
      this.Folio = before + newValue + after
    },
    Consecutivo(newValue, oldValue) {
      const dateC =
        this.FechaCaptura === ''
          ? 'XXXXXXXX'
          : this.FechaCaptura.replaceAll('-', '')
      const before =
        (this.Sucursal.trim() === '' ? 'XX' : this.Sucursal) +
        (this.Departamento.trim() === '' ? 'DXX' : this.Departamento) +
        (this.tipoSelected.trim() === '' ? 'TXX' : this.tipoSelected)
      const after = dateC
      const CodigoConsecutivo = this.completaConsecutivo(newValue + 1)
      this.Folio = before + '-' + CodigoConsecutivo + '-' + after
    },
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    animationSuc() {
      return this.loadingSuc ? 'spin-pulse' : ''
    },
    animationDep() {
      return this.loadingDep ? 'spin-pulse' : ''
    },
    animationTipo() {
      return this.loadingTipo ? 'spin-pulse' : ''
    },
    seleccionoTipo() {
      return this.tipoSelected.trim() !== ''
    },
    isSelectedFecha() {
      return this.FechaCaptura.trim() !== ''
    },
    isSelectedSucursal() {
      return this.Sucursal.trim() !== ''
    },
    isSelectedDepartamento() {
      return this.Departamento.trim() !== ''
    },
    sucursales() {
      const sucs = this.$store.state.sucursalesinvcea.data.data
      return sucs.reduce((cargadas, suc) => {
        cargadas.push({
          value: suc.Codigo,
          text: suc.Codigo + ' - ' + suc.Descripcion,
        })
        return cargadas
      }, [])
    },
    departamentos() {
      const deps = this.$store.state.departamentosinvcea.data.data
      return deps.reduce((cargadas, dep) => {
        cargadas.push({
          value: dep.Codigo,
          text: dep.Codigo + ' - ' + dep.Descripcion,
        })
        return cargadas
      }, [])
    },
    tipos() {
      const tips = this.$store.state.tiposequiposinvcea.data.data
      return tips.reduce((cargadas, tip) => {
        cargadas.push({
          value: tip.Codigo,
          text: tip.Codigo + ' - ' + tip.Descripcion,
        })
        return cargadas
      }, [])
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
    ...mapActions({
      getSucursales: 'sucursalesinvcea/changeData',
      getDepartamentos: 'departamentosinvcea/changeData',
      getTipos: 'tiposequiposinvcea/changeData',
      addFicha: 'sucursalesinvcea/addFicha',
      getConsecutivo: 'fichastecnicasinvcea/getConsecutivo',
    }),
    async loadData() {
      this.setLoading(true)
      const response = await this.changeData()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    completaConsecutivo(number) {
      const numberString = number.toString().trim()
      let before = ''
      for (let pos = 0; pos < 5 - numberString.length; pos++) before += '0'
      return before + numberString
    },
    async getCamposByType(tipo) {
      this.setLoading(true)
      const response = await this.getConsecutivo(tipo)
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        const dataConsecutivo =
          this.$store.state.fichastecnicasinvcea.consecutivo.data
        this.Consecutivo = dataConsecutivo[0].Consecutivo
        this.getListFieldsFicha()
      }
    },
    getListFieldsFicha() {
      const tipoEquipo = this.tipoSelected
      const tiposEquipos = this.$store.state.tiposequiposinvcea.data.data
      if (tipoEquipo.trim() === '') this.listFieldsFicha = []
      const tipoFind = tiposEquipos.find((value) => value.Codigo === tipoEquipo)
      this.listFieldsFicha = tipoFind.Campos.split(',')
    },
    vF(field) {
      const fieldFind = this.listFieldsFicha.find((value) => value === field)
      return !!fieldFind
    },
    address(items) {
      return items.Calle + ' ' + items.Numero
    },
    clean() {
      this.Codigo = ''
      this.Descripcion = ''
      this.Estado = ''
      this.Ciudad = ''
      this.Calle = ''
      this.Numero = 'S/N'
      this.CP = ''
      this.$refs.inputCodigo.focus()
    },
    async updateSucursales() {
      this.loadingSuc = true
      const response = await this.getSucursales()
      this.loadingSuc = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async updateDepartamentos() {
      this.loadingDep = true
      const response = await this.getDepartamentos()
      this.loadingDep = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    async updateTipos() {
      this.loadingTipo = true
      const response = await this.getTipos()
      this.loadingTipo = false
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    validateData() {
      if (this.Codigo.trim().length < 2) {
        this.showAlertDialog([
          'Codigo debe tener 2 Caracteres',
          'Campo requerido',
        ])
        return false
      }
      if (this.Descripcion.trim() === '') {
        this.showAlertDialog(['Falta Nombre de la Sucursal', 'Campo requerido'])
        return false
      }
      return true
    },
    prepareCreateSuc() {
      this.showAlertDialogOption([
        `Quiere agregar una nueva sucursal?`,
        'Agregando Sucursal',
        () => {
          this.hideAlertDialogOption()
          this.createSucursal()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async createSucursal() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.addFicha({
        Codigo: this.Codigo.toUpperCase(),
        Descripcion: this.Descripcion,
        Estado: this.Estado,
        Ciudad: this.Ciudad,
        Calle: this.Calle,
        Numero: this.Numero,
        CP: this.CP,
      })
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else {
        this.loadData()
        this.clean()
      }
    },
  },
}
</script>

<style scoped>
.input-sel {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 16px;
  width: 100%;
}

#spanResponsable {
  max-width: 450px;
}
#spanFolio,
#spanSucursal,
#spanCiudad,
#spanTemperaturaOperacion {
  max-width: 250px;
}
#spanFechaCaptura {
  max-width: 400px;
}
#spanDepartamento {
  max-width: 450px;
}
#spanTipoEquipo,
#spanModelo,
#spanMarca,
#spanFabricante,
#spanSerie,
#spanCodigo,
#spanClave,
#spanSO,
#spanMotherBoard,
#spanProcesador,
#spanDiscoDuro,
#spanRAM,
#spanConectividad,
#spanAccesorios,
#spanToner,
#spanTambor,
#spanTipo,
#spanNumeroSerial,
#spanMaterial,
#spanCargador {
  max-width: 350px;
}
#spanPantallaPulgadas,
#spanTamañoPulgadas,
#spanPuertoHDMI,
#spanPuertoVGA,
#spanColor,
#spanCapacidad,
#spanContieneBateria,
#spanConsumoEnergetico,
#spanSistemaRefrigeracion,
#spanCombustible {
  max-width: 200px;
}

#spanDigitos,
#spanLargo,
#spanAncho,
#spanGrosor,
#spanTipoPila,
#spanDuracionBateria,
#spanVoltaje,
#spanGarantia,
#spanVelocidades,
#spanNumeroPuertas,
#spanIluminacion,
#spanContactos {
  max-width: 150px;
}

#spanNumero,
#spanCP {
  width: 13%;
  min-width: 110px;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.cajaCodigo {
  text-transform: uppercase;
}

.description {
  font-style: italic;
  color: rgb(127, 127, 127);
}

.footer-card-add {
  padding: 15px;
}
</style>
