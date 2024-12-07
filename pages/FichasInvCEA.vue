<template>
  <div>
    <h2 class="text-center my-4">Fichas Tecnicas</h2>
    <b-card title="Agregando Ficha" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanCodigo" class="input-sel mb-3">
          <div class="label">Folio</div>
          <b-form-input
            ref="inputCodigo"
            v-model="Codigo"
            class="w-100 cajaCodigo"
            placeholder="DXXTXX-XXXX-XXXXXX"
            maxlength="25"
            readonly
            @focus="$refs.inputCodigo.select()"
            @keyup.esc="clean"
          />
        </span>
        <span class="ml-3 mb-3">
          <div class="label">Fecha de Captura</div>
          <b-form-datepicker
            id="dateEnd"
            v-model="dateCaptura"
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
        <span class="ml-3 mb-3">
          <div class="label">Sucursal</div>
          <b-input-group>
            <b-form-select
              v-model="sucursalSelected"
              :options="sucursales"
            ></b-form-select>
            <b-input-group-append>
              <b-button variant="info" @click="updateSucursales">
                <b-icon icon="arrow-clockwise" :animation="animationSuc" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </span>
        <span class="ml-3 mb-3">
          <div class="label">Departamento</div>
          <b-input-group>
            <b-form-select
              v-model="departamentoSelected"
              :options="departamentos"
            ></b-form-select>
            <b-input-group-append>
              <b-button variant="info" @click="updateDepartamentos">
                <b-icon icon="arrow-clockwise" :animation="animationDep" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </span>
        <span class="ml-3 mb-3">
          <div class="label">Tipo de Equipo</div>
          <b-input-group>
            <b-form-select
              v-model="tipoSelected"
              :options="tipos"
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
          <b-form-input
            ref="inputObservaciones"
            v-model="Observaciones"
            class="w-100"
            @focus="$refs.inputObservaciones.select()"
            @keyup.enter="$refs.inputModelo.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span class="input-sel">
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
        <span class="input-sel">
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
        <span class="input-sel">
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
        <span id="spanTamañoPulgadas" class="input-sel">
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
        <span id="spanFabricante" class="input-sel">
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
        <span id="spanPuertoHDMI" class="input-sel">
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
        <span id="spanPuertoVGA" class="input-sel">
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
        <span id="spanColor" class="input-sel">
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
        <span id="spanSerie" class="input-sel">
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
        <span id="spanCodigo" class="input-sel">
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
        <span id="spanClave" class="input-sel">
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
        <span id="spanDigitos" class="input-sel">
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
        <span id="spanLargo" class="input-sel">
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
        <span id="spanAncho" class="input-sel">
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
        <span id="spanGrosor" class="input-sel">
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
        <span id="spanGrosor" class="input-sel">
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
        <span id="spanSO" class="input-sel">
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
        <span id="spanMotherBoard" class="input-sel">
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
        <span id="spanProcesador" class="input-sel">
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
        <span id="spanDiscoDuro" class="input-sel">
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
        <span id="spanRAM" class="input-sel">
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
        <span id="spanConectividad" class="input-sel">
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
        <span id="spanTipoPila" class="input-sel">
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
        <span id="spanDuracionBateria" class="input-sel">
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
        <span id="spanVoltaje" class="input-sel">
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
        <span id="spanAccesorios" class="input-sel">
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
        <span id="spanGarantia" class="input-sel">
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
        <span id="spanToner" class="input-sel">
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
        <span id="spanTambor" class="input-sel">
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
        <span id="spanTipo" class="input-sel">
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
        <span id="spanNumeroSerial" class="input-sel">
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
        <span id="spanMaterial" class="input-sel">
          <div class="label">Material</div>
          <b-form-input
            ref="inputMaterial"
            v-model="Material"
            class="w-100"
            @focus="$refs.inputMaterial.select()"
            @keyup.enter="$refs.inputValocidades.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanValocidades" class="input-sel">
          <div class="label">Valocidades</div>
          <b-form-input
            ref="inputValocidades"
            v-model="Valocidades"
            class="w-100"
            @focus="$refs.inputValocidades.select()"
            @keyup.enter="$refs.inputCapacidad.focus()"
            @keyup.esc="clean"
          />
        </span>
        <span id="spanCapacidad" class="input-sel">
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
        <span id="spanContieneBateria" class="input-sel">
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
        <span id="spanNumeroPuertas" class="input-sel">
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
        <span id="spanTemperaturaOperacion" class="input-sel">
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
        <span id="spanConsumoEnergetico" class="input-sel">
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
        <span id="spanIluminacion" class="input-sel">
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
        <span id="spanSistemaRefrigeracion" class="input-sel">
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
        <span id="spanCombustible" class="input-sel">
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
        <span id="spanContactos" class="input-sel">
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
        <span id="spanCargador" class="input-sel">
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
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      loadingSuc: false,
      loadingDep: false,
      loadingTipo: false,
      sucursalSelected: 'ZR',
      departamentoSelected: '',
      tipoSelected: '',
      dateCaptura: '',
      optionsSucs: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'TF', text: 'Tortilleria Acayucan F.' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'TY', text: 'Sayula Tortilleria' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'SC', text: 'Soconusco' },
        { value: 'BO', text: 'Bodega' },
      ],
      Folio: '',
      Ciudad: '',
      FechaCaptura: '',
      Responsable: '',
      Sucursal: '',
      Despartamento: '',
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
      Valocidades: '',
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
      addSucursal: 'sucursalesinvcea/addSucursal',
    }),
    async loadData() {
      this.setLoading(true)
      const response = await this.changeData()
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
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
      const response = await this.addSucursal({
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
  margin-left: 10px;
  margin-bottom: 16px;
  /* width: calc(33% - 30px); */
}

#spanCodigo {
  width: 100%;
  max-width: 240px;
}

#spanCalle {
  width: 50%;
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
