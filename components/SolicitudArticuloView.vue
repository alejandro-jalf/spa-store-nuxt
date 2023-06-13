<template>
  <b-card
    border-variant="primary"
    header-bg-variant="primary"
    header-text-variant="white"
    :header="typeRequest"
    class="mb-4"
    :class="variantTheme"
  >
    <div class="mt-0 mb-1">Fecha:</div>
    <b-form inline>
      <b-form-datepicker
        id="fechaCreado"
        v-model="requestActual.FechaCreado"
        placeholder="Fecha de Solicitud"
        class="solicitud"
        disabled
      ></b-form-datepicker>
      <b-form-input
        id="inputEstatus"
        ref="inputEstatus"
        v-model="requestActual.Estatus"
        placeholder="Estatus"
        class="solicitud"
        readonly
      ></b-form-input>
    </b-form>

    <div class="mt-2 mb-1">Solicitud:</div>
    <b-form inline>
      <b-form-input
        id="inputConsecutivo"
        ref="inputConsecutivo"
        v-model="requestActual.Consecutivo"
        placeholder="Consecutivo"
        class="solicitud"
        readonly
      ></b-form-input>
      <b-form-input
        id="inputSuc"
        ref="inputSuc"
        v-model="requestActual.Sucursal"
        placeholder="Sucursal"
        class="solicitud"
        readonly
      ></b-form-input>
    </b-form>

    <b-form inline>
      <b-input-group class="mt-3" prepend="Codigo de Barras:">
        <b-form-input
          id="inputCodigo"
          ref="inputCodigo"
          v-model="requestActual.CodigoBarra"
          placeholder="Codigo de Barras"
          class="codes"
          autocomplete="off"
          :readonly="!allowEdit"
          @keyup.enter="$refs.inputIVA.focus()"
        ></b-form-input>
      </b-input-group>
      <b-input-group class="mt-3" prepend="IVA:">
        <b-form-select
          id="inputIVA"
          ref="inputIVA"
          v-model="requestActual.IVA"
          :options="optionsImpuestos"
          class="codes"
          :disabled="!allowEdit"
          @keyup.enter="$refs.inputIEPS.focus()"
        />
      </b-input-group>
      <b-input-group class="mt-3" prepend="IEPS:">
        <b-form-select
          id="inputIEPS"
          ref="inputIEPS"
          v-model="requestActual.Ieps"
          :options="optionsImpuestos"
          class="codes"
          :disabled="!allowEdit"
          @keyup.enter="$refs.inputTazaIeps.focus()"
        />
      </b-input-group>
      <b-input-group class="mt-3" prepend="Taza IEPS:">
        <b-form-input
          id="inputTazaIeps"
          ref="inputTazaIeps"
          v-model="requestActual.TazaIeps"
          placeholder="Taza IEPS"
          class="codes"
          :disabled="!requestActual.Ieps || !allowEdit"
          @keyup.enter="$refs.inputName.focus()"
        ></b-form-input>
      </b-input-group>
    </b-form>

    <div class="mt-3">Datos para el Nombre:</div>
    <div class="dataName">
      <b-input-group class="mt-1" prepend="Nombre:">
        <b-form-input
          id="inputName"
          ref="inputName"
          v-model="requestActual.Nombre"
          placeholder="Nombre"
          autocomplete="off"
          :readonly="!allowEdit"
          @keyup.enter="$refs.inputTipoModelo.focus()"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="info" @click="showHelpers('Nombre')">
            <b-icon icon="question-circle-fill" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
      <b-form inline>
        <b-input-group class="TipoMarca" prepend="Tipo o Modelo:">
          <b-form-input
            id="inputTipoModelo"
            ref="inputTipoModelo"
            v-model="requestActual.TipoModelo"
            placeholder="Tipo o Modelo"
            autocomplete="off"
            :readonly="!allowEdit"
            @keyup.enter="$refs.inputMarca.focus()"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="showHelpers('TipoModelo')">
              <b-icon icon="question-circle-fill" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="TipoMarca" prepend="Marca:">
          <b-form-input
            id="inputMarca"
            ref="inputMarca"
            v-model="requestActual.Marca"
            placeholder="Marca"
            autocomplete="off"
            :readonly="!allowEdit"
            @keyup.enter="$refs.inputPresentacion.focus()"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="showHelpers('Marca')">
              <b-icon icon="question-circle-fill" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
      <div inline>
        <b-input-group class="mt-3 w-100" prepend="Presentacion:">
          <b-form-input
            id="inputPresentacion"
            ref="inputPresentacion"
            v-model="requestActual.Presentacion"
            placeholder="Presentacion"
            autocomplete="off"
            type="text"
            :readonly="!allowEdit"
            @keyup.enter="$refs.inputCompra.focus()"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="showHelpers('Presentacion')">
              <b-icon icon="question-circle-fill" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div class="mt-3 font-weight-bold">Posible Nombre Final:</div>
      <div class="nameResult">{{ nameResult }}</div>
      <Divider class="my-2" />
      <b-input-group class="mt-3" prepend="Ejemplo:">
        <b-form-select
          id="selectExample"
          ref="selectExample"
          v-model="example"
          :options="optionsExamples"
          :disabled="!allowEdit"
        />
        <template #append>
          <b-button
            variant="success"
            :disabled="!allowEdit"
            @click="tryExample"
          >
            Lanzar
          </b-button>
        </template>
      </b-input-group>
    </div>

    <div class="mt-3">Relacion:</div>
    <div class="dataName">
      <b-form inline>
        <b-input-group class="mt-1" prepend="Compra:">
          <b-form-input
            id="inputCompra"
            ref="inputCompra"
            v-model="requestActual.FactorCompra"
            type="number"
            min="0"
            placeholder="Compra"
            class="realtion"
            autocomplete="off"
            :readonly="!allowEdit"
            @keyup.enter="$refs.selectUnidadCompra.focus()"
          ></b-form-input>
        </b-input-group>
        <b-input-group class="mt-1" prepend="Unidad Compra:">
          <b-form-select
            id="selectUnidadCompra"
            ref="selectUnidadCompra"
            v-model="requestActual.UnidadCompra"
            :options="unidadesCompra"
            :disabled="!allowEdit"
            @keyup.enter="$refs.inputVenta.focus()"
          />
        </b-input-group>
        <span class="dividerRelation">/</span>
        <b-input-group class="mt-1" prepend="Venta:">
          <b-form-input
            id="inputVenta"
            ref="inputVenta"
            v-model="requestActual.FactorVenta"
            type="number"
            min="0"
            placeholder="Venta"
            class="realtion"
            autocomplete="off"
            :readonly="!allowEdit"
            @keyup.enter="$refs.selectUnidadVenta.focus()"
          ></b-form-input>
        </b-input-group>
        <b-input-group class="mt-1" prepend="Unidad Venta:">
          <b-form-select
            id="selectUnidadVenta"
            ref="selectUnidadVenta"
            v-model="requestActual.UnidadVenta"
            :disabled="!allowEdit"
            :options="unidadesVenta"
          />
        </b-input-group>
      </b-form>
      <div class="mt-3 font-weight-bold">Relacion Final:</div>
      <div class="nameResult">{{ relationFinal }}</div>
    </div>

    <div class="notaTitle">Importante:</div>
    <p>
      Los artículos nuevos deben ser solicitados con mínimo
      <strong>1 dia de anticipacion</strong>, ya que la atención del artículo
      dependerá totalmente de la carga de trabajo de la bodega, aunado a ello se
      debe considerar cualquier fallo en los sistemas.
    </p>
    <div class="float-right">
      <b-button variant="secondary" @click="backToList">
        <b-icon icon="x-lg" />
        Regresar
      </b-button>
      <b-button
        v-if="isSucursal"
        variant="info"
        @click="prepareChangeEstatus('ENVIADO')"
      >
        <b-icon icon="telegram" />
        Enviar
      </b-button>
      <b-button
        v-if="isSucursal"
        variant="warning"
        @click="prepareChangeEstatus('CANCELADO')"
      >
        <b-icon icon="x-circle-fill" />
        Cancelar
      </b-button>
      <b-button v-if="isSending" variant="info">
        <b-icon icon="arrow-up-right-circle-fill" />
        En Proceso
      </b-button>
      <b-button
        v-if="isInProcess"
        variant="info"
        @click="$bvModal.show('modal-code')"
      >
        <b-icon icon="patch-check-fill" />
        Atendido
      </b-button>
      <b-button v-if="isCancel" variant="danger">
        <b-icon icon="trash-fill" />
        Eliminar
      </b-button>
      <b-button
        v-if="isCancel"
        variant="success"
        @click="prepareChangeEstatus('EN SUCURSAL')"
      >
        <b-icon icon="arrow-up-left-circle-fill" />
        Restaurar
      </b-button>
      <b-button
        v-if="isSucursal && allowEdit"
        variant="success"
        @click="prepareUpdateRequest"
      >
        <b-icon icon="shield-fill-check" />
        Guardar
      </b-button>
    </div>

    <b-modal
      id="modal-code"
      hide-footer
      header-bg-variant="info"
      header-text-variant="white"
      body-text-variant="dark"
    >
      <template #modal-title>Codigo de Articulo</template>
      <b-form-group id="gpCode" label="Codigo de WinCaja:" label-for="ipCode">
        <b-form-input
          id="ipCode"
          v-model="codigo"
          type="text"
          placeholder="Codigo del Articulo"
          :state="validation"
          required
          autocomplete="off"
          :class="backgroundInputTheme"
        ></b-form-input>
        <b-form-invalid-feedback :state="validation">
          Codigo No Puede Quedar Vacio
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="float-right">
        <b-button class="mt-3" @click="$bvModal.hide('modal-code')">
          Cancelar
        </b-button>
        <b-button variant="info" class="mt-3 ml-2" @click="atender">
          Aceptar
        </b-button>
      </div>
    </b-modal>
  </b-card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  props: {
    loadData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      codigo: '',
      validation: true,
      optionsImpuestos: [
        { value: false, text: 'NO' },
        { value: true, text: 'SI' },
      ],
      unidadesMedida: ['', 'Lt', 'Ml', 'Kg', 'Gr'],
      unidadesCompra: ['CJA', 'MZO', 'PZA', 'CBT', 'BTO', 'ROY', 'PQT', 'KGM'],
      unidadesVenta: ['MZO', 'PZA', 'BTO', 'PQT', 'KGM'],
      example: 0,
      optionsExamples: [
        { value: 0, text: '....' },
        { value: 1, text: 'Refresco' },
        { value: 2, text: 'Refresco Lata' },
        { value: 3, text: 'Sabrita' },
        { value: 4, text: 'Escoba' },
        { value: 5, text: 'Aceite' },
        { value: 6, text: 'Suavizante' },
        { value: 7, text: 'Enbutido' },
      ],
      examples: [
        {
          example: 1,
          Nombre: 'Refresco', // 'Que es: bebida, shampoo'
          TipoModelo: 'No Retornable', // gasificada,
          Marca: 'CocaCola',
          Presentacion: '2.5Lt',
        },
        {
          example: 2,
          Nombre: 'Refresco',
          TipoModelo: 'Lata',
          Marca: 'CocaCola',
          Presentacion: '255Ml',
        },
        {
          example: 3,
          Nombre: 'Botana',
          TipoModelo: 'Con Queso',
          Marca: 'Ruffles',
          Presentacion: '55Gr',
        },
        {
          example: 4,
          Nombre: 'Escoba',
          TipoModelo: 'Abanico',
          Marca: 'Max Ideal',
          Presentacion: 'Corta PL-14',
        },
        {
          example: 5,
          Nombre: 'Aceite',
          TipoModelo: '',
          Marca: 'Patrona',
          Presentacion: '900Ml',
        },
        {
          example: 6,
          Nombre: 'Suavizante ',
          TipoModelo: 'Primaveral Color Plus',
          Marca: 'Ensueño',
          Presentacion: '450ml',
        },
        {
          example: 7,
          Nombre: 'Jamon ',
          TipoModelo: 'Virginia de Pavo',
          Marca: 'Vitadeli',
          Presentacion: 'A granel',
        },
      ],
      requestActual: {
        Consecutivo: 4,
        Sucursal: 'Zaragoza',
        FechaCreado: '2023-06-10',
        CodigoBarra: '',
        Articulo: '',
        Nombre: '',
        IVA: false,
        Ieps: false,
        TazaIeps: 0,
        TipoModelo: '',
        Marca: '',
        Presentacion: '',
        UnidadCompra: '',
        FactorCompra: 0,
        UnidadVenta: '',
        FactorVenta: 0,
        Estatus: 'EN SUCURSAL',
        CreadoPor: 'aleflo_1996@outlook.com',
        FechaActualizado: '2023-06-10T19:53:59.133Z',
        ActualizadoPor: 'aleflo_1996@outlook.com',
        UUID: 'FFA1DB0B-ED76-4C02-81B7-3B38C94F5715',
      },
      ayudas: {
        Nombre:
          'Para llenar este campo debe responder a la pregunta: ¿Que es?, por ejemplo es: <br/>Refresco, Bebida, Jamon, Aceite, Jabon. etc.',
        TipoModelo:
          'Para este puede responder a la pregunta ¿Como es? o tambien ¿De que es?, por ejemplo es: <br/>Liquido, Polvo, Gaseoso, Energizante, De Lata, Entera, Original, Deslactosada, etc. <br/> o tambien escribiendo es de: Algun aroma en especifico, un sabor, un color, etc',
        Marca:
          'Este campo se llena con la marca del articulo: CocaCola, Pepsi, Patrona, Moderna, etc.',
        Presentacion:
          'Aqui pondra especificamente la cantidad que trae cada producto siempre y cuando se especifique, si no lo especifica el articulo, puede quedar vacio. <br/>Por ejemplo puede ponerlo en gramos, litros, mililitros, o tamaños como grande, chico, etc, o si es a granel',
      },
    }
  },
  computed: {
    isSucursal() {
      return this.requestActual.Estatus === 'EN SUCURSAL'
    },
    isSending() {
      return this.requestActual.Estatus === 'ENVIADO'
    },
    isCancel() {
      return this.requestActual.Estatus === 'CANCELADO'
    },
    isInProcess() {
      return this.requestActual.Estatus === 'EN PROCESO'
    },
    isAtendido() {
      return this.requestActual.Estatus === 'ATENDIDO'
    },
    nameResult() {
      const { Nombre, TipoModelo, Marca, Presentacion } = this.requestActual
      return `${Nombre} ${TipoModelo} ${Marca} ${Presentacion}`
    },
    relationFinal() {
      const { FactorCompra, UnidadCompra, FactorVenta, UnidadVenta } =
        this.requestActual
      return `${FactorCompra}${UnidadCompra} / ${FactorVenta}${UnidadVenta}`
    },
    typeRequest() {
      const type = this.$store.state.solicitudarticulo.tipoSolicitud
      return type === 'VIEW'
        ? 'Vizualizando Solicitud'
        : type === 'EDIT'
        ? 'Editando Solicitud'
        : 'Generando solicitud'
    },
    allowEdit() {
      return this.$store.state.solicitudarticulo.tipoSolicitud !== 'VIEW'
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
  },
  mounted() {
    if (this.$store.state.solicitudarticulo.actual.length !== 0)
      this.requestActual = {
        ...this.$store.state.solicitudarticulo.actual.data[0],
      }
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
      setVentana: 'solicitudarticulo/setVentana',
    }),
    ...mapActions({
      changeEstatus: 'solicitudarticulo/changeEstatus',
      saveRequest: 'solicitudarticulo/saveRequest',
    }),
    atender() {
      if (this.codigo.trim() === '') this.validation = false
      else {
        this.validation = true
        this.requestActual.Articulo = this.codigo
        this.$bvModal.hide('modal-code')
        this.saveEstatus('ATENDIDO')
      }
    },
    backToList() {
      if (this.requestActual.Estatus === 'EN SUCURSAL')
        this.showAlertDialogOption([
          `¿Guardar cambios realizados en la solicitud?`,
          'Regresando',
          () => {
            this.hideAlertDialogOption()
            this.saveChanges()
          },
          'warning',
          'light',
          () => {
            this.hideAlertDialogOption()
            this.setVentana('LIST')
          },
        ])
      else this.setVentana('LIST')
    },
    showHelpers(type) {
      const message = this.ayudas[type]
      this.showAlertDialog([message, 'Ayuda', 'info'])
    },
    tryExample() {
      this.showAlertDialogOption([
        `Al lanzar un ejemplo los datos que tenga escrito en "Datos para el nombre" se remplazaran, ¿Quiere lanzarlo?`,
        'Vizualizando ejemplo',
        () => {
          this.hideAlertDialogOption()
          this.setExample()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    setExample() {
      const exampleSelected = this.examples.filter(
        (exa) => exa.example === this.example
      )
      if (this.example !== 0) {
        this.requestActual.Nombre = exampleSelected[0].Nombre
        this.requestActual.TipoModelo = exampleSelected[0].TipoModelo
        this.requestActual.Marca = exampleSelected[0].Marca
        this.requestActual.Presentacion = exampleSelected[0].Presentacion
      } else
        this.showAlertDialog([
          'No ha seleccionado un ejemplo',
          'Falta seleccionar ejemplo',
        ])
    },
    prepareUpdateRequest() {
      this.showAlertDialogOption([
        `¿Guardar cambios en la solicitud?`,
        'Guardando Cambios',
        () => {
          this.hideAlertDialogOption()
          this.saveChanges()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async saveChanges() {
      const uuid = this.requestActual.UUID
      const data = { ...this.requestActual }
      delete data.UUID
      delete data.CreadoPor
      delete data.FechaCreado
      delete data.FechaActualizado
      delete data.Consecutivo
      delete data.Sucursal
      delete data.Articulo
      delete data.UnidadMedida
      delete data.Estatus
      data.IVA = data.IVA ? 1 : 0
      data.Ieps = data.Ieps ? 1 : 0
      data.TazaIeps = data.Ieps ? data.TazaIeps : 0
      this.setLoading(true)
      const response = await this.saveRequest([uuid, data])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
    prepareChangeEstatus(estatus) {
      let message = ''
      if (estatus === 'CANCELADO') message = '¿Quiere Cancelar la solicitud?'
      else if (estatus === 'ENVIADO') message = '¿Quiere Enviar la solicitud?'
      else if (estatus === 'EN SUCURSAL')
        message = '¿Quiere Restaurar la solicitud?'
      this.showAlertDialogOption([
        message,
        'Cambiando Estatus',
        () => {
          this.hideAlertDialogOption()
          this.saveEstatus(estatus)
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async saveEstatus(Estatus) {
      if (Estatus === 'ENVIADO') await this.prepareUpdateRequest()
      const uuid = this.requestActual.UUID
      const articulo = this.requestActual.Articulo
      this.setLoading(true)
      const response = await this.changeEstatus([uuid, Estatus, articulo])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
  },
}
</script>

<style scoped>
.solicitud {
  width: calc(50% - 10px);
  margin-right: 10px;
}

#inputCodigo {
  width: 300px;
}

.codes {
  margin-right: 10px;
}

.TipoMarca {
  width: calc(50% - 10px);
  margin-right: 10px;
  margin-top: 15px;
}

.realtion {
  width: 100px;
  margin-right: 10px;
}

.dividerRelation {
  margin-left: 15px;
  width: 25px;
}

.dataName {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgb(133, 133, 133);
}

.nameResult {
  font-size: 18px;
  font-weight: 500;
}

.notaTitle {
  color: red;
  font-weight: bold;
  margin-top: 15px;
}
</style>
