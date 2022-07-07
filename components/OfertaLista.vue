<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta: ' + uuid"
      :title="
        tipoOferta +
        ' Del ' +
        fechaInicio +
        ' al ' +
        fechaFin +
        ', Suc ' +
        sucursal()
      "
      :class="variantTheme"
    >
      <b-alert v-if="!ofertaEditable" variant="warning">
        Oferta no editable
      </b-alert>
      <div v-if="ofertaEditable">
        <b-card-text class="font-weight-bold mt-3 mb-1">
          Elija un articulo
        </b-card-text>
        <divider></divider>
        <b-form inline class="mt-2">
          <b-form-input
            id="codigo-articulo"
            ref="articulo"
            v-model="formArticulo.articulo"
            :class="backgroundInputTheme + { 'text-dark': !editableArticulo }"
            :readonly="!editableArticulo"
            placeholder="Codigo de articulo"
            @keyup.enter="getDetailsArticleByArticle"
            @keyup.esc="clearFormArticulo"
          ></b-form-input>
          <b-form-input
            id="codigo-barras"
            v-model="formArticulo.codigobarras"
            placeholder="Codigo de barras"
            class="text-dark"
            :class="backgroundInputTheme"
            readonly
            @keyup.enter="getArticuloByCodigoCarras"
          ></b-form-input>
          <b-form-input
            id="nombre-articulo"
            v-model="formArticulo.nombre"
            placeholder="*Nombre articulo*"
            :class="backgroundInputTheme + { 'text-dark': !editableArticulo }"
            :readonly="!editableArticulo"
            @keyup.enter="getArticleByName"
            @keyup.esc="clearFormArticulo"
          ></b-form-input>
        </b-form>
        <message-text
          message="No se encontro el articulo"
          :show-message="showError"
          color-text="text-danger"
          class="mb-2 text-center"
        ></message-text>
        <b-card-text class="font-weight-bold mb-1">
          Datos de la oferta para el articulo: {{ articuloActual }}
        </b-card-text>
        <divider class="mb-2"></divider>
        <b-form class="mt-2">
          <b-form-group label="Existencia Actual" class="inputs-2-data">
            <b-form-input
              id="input-existencia"
              v-model="formArticulo.existencia"
              placeholder="Existencia Actual"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Relacion" class="inputs-2-data">
            <b-form-input
              id="input-relacion"
              v-model="formArticulo.relacion"
              placeholder="Relacion"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
        </b-form>

        <b-form inline class="mt-2 mb-2">
          <b-form-group label="Costo" class="input-resp-dt-ofe">
            <b-form-input
              id="input-costo"
              v-model="formArticulo.costo"
              placeholder="Costo"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Precio" class="input-resp-dt-ofe">
            <b-form-input
              id="input-precio"
              v-model="formArticulo.precio"
              placeholder="Precio"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Margen" class="input-resp-dt-ofe">
            <b-form-input
              id="input-margen"
              v-model="formArticulo.margen"
              placeholder="Margen"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Oferta" class="input-resp-dt-ofe">
            <b-form-input
              id="input-oferta"
              ref="oferta"
              v-model="formArticulo.oferta"
              placeholder="Precio de oferta"
              class="w-100"
              :class="backgroundInputTheme"
              @keydown="verifyData"
              @keyup="calcUtilidad"
              @keyup.enter="agregarArticulo"
              @keyup.esc="clearFormArticulo"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Utilidad" class="input-resp-dt-ofe">
            <b-form-input
              id="input-utilidad"
              v-model="formArticulo.utilidad"
              placeholder="Utilidad"
              class="w-100"
              :state="status_utulidad"
              readonly
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-button variant="success" class="mb-3" @click="agregarArticulo">
          <b-icon icon="plus-circle-fill" />
          {{ messageButtonAddArticle }}
        </b-button>
        <b-button variant="warning" class="mb-3" @click="clearFormArticulo">
          <b-icon icon="backspace-fill" />
          Limpiar campos
        </b-button>
      </div>
      <b-card-text class="font-weight-bold mb-1">
        Articulos incluidos
        <b-badge pill variant="info" class="chip">
          Total: {{ cantidadArticulos }}
        </b-badge>
      </b-card-text>
      <divider class="mb-2"></divider>
      <div>
        <b-table
          hover
          head-variant="dark"
          fixed
          outlined
          :items="listaProductos"
          :fields="fields"
          responsive=""
          :class="variantThemeTableBody"
        >
          <template #cell(margen)="row">
            {{ getCalculaUtilidad(row.item.costo, row.item.precio) }}
          </template>
          <template #cell(utilidad)="row">
            {{ getCalculaUtilidad(row.item.costo, row.item.oferta) }}
          </template>
          <template #cell(precio)="row">
            {{ utils.roundTo(row.item.precio) }}
          </template>
          <template #cell(oferta)="row">
            {{ utils.roundTo(row.item.oferta) }}
          </template>
          <template v-if="ofertaEditable" #cell(Acciones)="row">
            <b-button
              variant="warning"
              size="sm"
              class="mb-1"
              @click="editArticle(row)"
            >
              <b-icon icon="pencil-square" />
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              class="mb-1"
              @click="prepareDeleteArticle(row.item.articulo, row.item.nombre)"
            >
              <b-icon icon="trash" />
            </b-button>
          </template>
        </b-table>
      </div>
      <div class="text-right mt-3 buttons-end">
        <b-button
          variant="secondary"
          class="mb-2"
          @click="cerrarListaArticulos"
        >
          <b-icon icon="x-circle-fill"></b-icon>
          Cerrar
        </b-button>
        <span v-if="ofertaEditable && statusActual === 0">
          <b-button variant="secondary" class="mb-2" @click="editarDatosOferta">
            <b-icon icon="arrow-left-circle-fill" />
            Datos de oferta
          </b-button>
          <b-button variant="danger" class="mb-2" @click="prepareCancelOffert">
            <b-icon icon="trash-fill" />
            Cancelar oferta
          </b-button>
          <b-button variant="primary" class="mb-2" @click="prepareSendOffer">
            <b-icon icon="arrow-right-circle-fill" />
            Guardar y enviar
          </b-button>
          <b-button
            variant="info"
            class="mb-2"
            @click="$bvToast.show('toast-create-ofer')"
          >
            <b-icon icon="question-circle-fill" />
          </b-button>
          <b-toast
            id="toast-create-ofer"
            title="Ayuda"
            static
            no-auto-hide
            class="toast-buttons text-justify"
            variant="info"
            solid
          >
            Al dar click en "Datos de oferta" podra editar los datos generales
            de la oferta, como lo es el tipo, fechas o descripcion.
            <br />
            <br />
            Al dar click en "Cancelar oferta" se eliminara toda la oferta junto
            con todos los articulos registrados.
            <br />
            <br />
            Al dar click en "Guardar y enviar" la oferta sera almacenada y
            enviada para su programacion
          </b-toast>
        </span>
        <span v-else-if="statusActual != 0">
          <b-button
            v-if="visibleButton($store.state.ofertas.ofertaActual, 'validate')"
            variant="success"
            class="mb-2"
            @click="
              validateArticlesForProgram($store.state.ofertas.ofertaActual)
            "
          >
            <b-icon icon="info-circle-fill" />
            Validar Articulos
          </b-button>
          <b-button
            v-if="visibleButton($store.state.ofertas.ofertaActual, 'action')"
            variant="primary"
            class="mb-2"
            @click="changeStatus"
          >
            <b-icon icon="folder-symlink-fill" />
            {{ messageButton }}
          </b-button>
        </span>
      </div>
      <b-card-text class="font-weight-bold mb-1">
        Ultima Actualizacion:
        {{ ultimaActualizacion }}
      </b-card-text>
    </b-card>
    <OfertaListProducts
      :form-modal-productos="formModalProductos"
      :handle-ok="handleOk"
      :on-row-selected="onRowSelected"
      :enter-select="enterSelect"
    ></OfertaListProducts>
    <div v-if="searchProducts" class="background-names">
      <b-button
        class="btnSearchProducts"
        variant="danger"
        @click="searchProducts = false"
      >
        Cancelar
      </b-button>
      <b-table
        sticky-header
        striped
        hover
        :fields="fieldsProducts"
        :items="productsNames"
        class="tableProducts"
      >
        <template #cell(Acciones)="row">
          <b-button variant="success" @click="selectProduct(row.item)">
            Agregar
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import Divider from './Divider'
import MessageText from './MessageText'
// import AlertOption from './AlertOption'
import OfertaListProducts from './OfertaListaProducts'

export default {
  components: {
    Divider,
    MessageText,
    // AlertOption,
    OfertaListProducts,
  },
  props: {
    prepareChangeStatusOffer: {
      type: Function,
      required: true,
    },
    visibleButton: {
      type: Function,
      required: true,
    },
    validateArticlesForProgram: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      utils,
      formModalProductos: {
        position: 0,
        selected: [],
        showModal: false,
        fields: ['seleccionado', 'articulo', 'codigobarras', 'nombre'],
        products: [],
      },
      alert: {
        title: 'Accion',
        message: 'Realizar',
      },
      showAlert: false,
      formArticulo: {
        articulo: '',
        codigobarras: '',
        nombre: '',
        precio: '',
        costo: '',
        margen: '',
        oferta: '',
        utilidad: '',
        existencia: '',
        relacion: '',
      },
      editableArticulo: true,
      showError: false,
      status_utulidad: false,
      editingArticle: false,
      fields: [
        'articulo',
        'nombre',
        'costo',
        'precio',
        'margen',
        'oferta',
        'utilidad',
        'Acciones',
      ],
      fieldsProducts: [
        'Articulo',
        'CodigoBarras',
        'Nombre',
        'ExistenciaActualRegular',
        'Relacion',
        'Acciones',
      ],
      articulos: [],
      articuloActual: '',
      productsNames: [],
      searchProducts: false,
    }
  },
  computed: {
    messageButton() {
      switch (this.$store.state.ofertas.ofertaActual.estatus) {
        case 0:
          return 'Enviar'
        case 1:
          return 'Poner En Proceso'
        case 2:
          return 'Programar'
        case 4:
          return 'Restaurar'
        default:
          return ''
      }
    },
    messageButtonAddArticle() {
      return this.editingArticle ? 'Guardar cambios' : 'Agregar a la lista'
    },
    dataUser() {
      return this.$store.state.user.user
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
    ofertaEditable() {
      const tipoUser = this.$store.state.user.user.tipo_user
      return (
        this.$store.state.ofertas.ofertaActual.estatus === 0 ||
        (this.$store.state.ofertas.ofertaActual.estatus === 2 &&
          tipoUser === 'manager')
      )
    },
    status() {
      if (
        this.$store.state.ofertas.ofertaActual.estatus === 4 ||
        this.$store.state.ofertas.ofertaActual.estatus === 3
      ) {
        return false
      }
      return true
    },
    statusActual() {
      return this.$store.state.ofertas.ofertaActual.estatus
    },
    listaProductos() {
      return this.$store.state.ofertas.listaArticulos.data
    },
    cantidadArticulos() {
      return this.$store.state.ofertas.listaArticulos.data.length
    },
    ultimaActualizacion() {
      const articles = this.$store.state.ofertas.listaArticulos.data
      let fecha = null
      if (articles.length === 0)
        fecha =
          this.$store.state.ofertas.ofertaActual.fechaModificado ||
          utils.getDateNow().format('YYYY-MM-DD HH:mm:ss.SSS')
      else fecha = articles[0].fechaModificado
      const date = utils.toMoment(fecha.replace('T', ' ').replace('Z', ''))
      return date.format('DD/MM/YYYY hh:mm:ss a')
    },
    uuid() {
      return this.$store.state.ofertas.ofertaActual.uuid
    },
    tipoOferta() {
      return this.$store.state.ofertas.ofertaActual.tipoOferta
    },
    fechaInicio() {
      return utils.parseFecha(
        this.$store.state.ofertas.ofertaActual.fechaInicio
      )
    },
    fechaFin() {
      return utils.parseFecha(this.$store.state.ofertas.ofertaActual.fechaFin)
    },
    descripcion() {
      return this.$store.state.ofertas.ofertaActual.descripcion
    },
  },
  mounted() {
    // console.log(this.$store.state.ofertas.ofertaActual.listaProductos)
  },
  methods: {
    ...mapMutations({
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      setEditandoOferta: 'ofertas/setEditandoOferta',
      addOFerta: 'ofertas/addOFerta',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
      setLoading: 'general/setLoading',
    }),
    ...mapActions({
      changeListaArticulos: 'ofertas/changeListaArticulos', // nuevas
      changeListaOfertas: 'ofertas/changeListaOfertas', // nuevas
    }),
    sucursal() {
      const suc = this.$store.state.ofertas.ofertaActual.sucursal
      if (suc.toUpperCase() === 'ZR') return 'SPAZARAGOZA'
      if (suc.toUpperCase() === 'VC') return 'SPAVICTORIA'
      if (suc.toUpperCase() === 'ER') return 'SPAENRIQUEZ'
      if (suc.toUpperCase() === 'OU') return 'SPAOLUTA'
      if (suc.toUpperCase() === 'SY') return 'SPASAYULA'
      if (suc.toUpperCase() === 'JL') return 'SPAJALTIPAN'
      return 'SPA'
    },
    cerrarListaArticulos() {
      // eslint-disable-next-line no-console
      console.log('cierra')
      this.setProgramandoOferta(false)
      this.setProgramandoLista(false)
    },
    changeStatus() {
      this.prepareChangeStatusOffer(this.$store.state.ofertas.ofertaActual)
    },
    enterSelect(evt) {
      if (evt.keyCode === 65) {
        this.formModalProductos.showModal = false
        this.getArticuloByPosition()
        this.$refs.oferta.focus()
      }
    },
    onRowSelected(items) {
      if (items.length > 0) {
        this.formModalProductos.position = this.formModalProductos.products.findIndex(
          (product) => product.articulo === items[0].articulo
        )
      }
      this.formModalProductos.selected = items
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.estatus === 'selected') return 'table-secondary'
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.formModalProductos.showModal = false
      this.getArticuloByPosition()
      this.$refs.oferta.focus()
    },
    hideAlertDialog() {
      this.showAlert = false
    },
    editArticle(articuloRe) {
      const editArtiicle = { ...articuloRe.item }

      // eslint-disable-next-line no-console
      console.log(editArtiicle)
      this.formArticulo = editArtiicle
      this.formArticulo.codigobarras = editArtiicle.articulo
      this.editableArticulo = false
      this.editingArticle = true
      const operacion = 1 - editArtiicle.costo / editArtiicle.precio
      const rounded = utils.roundTo(operacion, 4)
      const porcentaje = utils.parseToPorcent(rounded)
      this.formArticulo.margen = `${porcentaje}%`
      this.articuloActual = editArtiicle.articulo
      this.calcUtilidad()
      this.$refs.oferta.focus()
    },
    clearFormArticulo() {
      this.formArticulo = {
        articulo: '',
        codigobarras: '',
        nombre: '',
        precio: '',
        costo: '',
        margen: '',
        oferta: '',
        utilidad: '',
        existencia: '',
        relacion: '',
      }
      this.editableArticulo = true
      this.editingArticle = false
      this.$refs.articulo.focus()
    },
    validaArticulo() {
      // eslint-disable-next-line no-console
      console.log(this.formArticulo)
      if (!this.editingArticle) {
        if (this.formArticulo.costo.trim() === '') {
          this.showAlertDialog(['No a seleccionado algun producto'])
          return false
        }
        if (this.formArticulo.nombre.trim() === '') {
          this.showAlertDialog(['No puede dejar vacio el campo de nombre'])
          return false
        }
        if (this.formArticulo.articulo.trim() === '') {
          this.showAlertDialog(['No puede quedar vacio el campo de articulo'])
          return false
        }
      }
      if (this.formArticulo.oferta.trim() === '') {
        this.showAlertDialog(['Falta ingresar el precio de oferta'])
        return false
      }
      if (!this.status_utulidad) {
        this.showAlertDialog(['La utilidad no puede ser menor que el 10%'])
        return false
      }
      return true
    },
    async agregarArticulo() {
      if (!this.validaArticulo()) return false
      if (this.editingArticle) {
        this.actualizaArticulo()
        return true
      }
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        this.setLoading(true)
        const response = await this.$axios({
          url: urlBase + 'api/v1/ofertas/' + sucursal + '/articulos',
          method: 'post',
          data: {
            uuid_maestro: this.uuid,
            articulo: this.formArticulo.articulo,
            nombre: this.formArticulo.nombre,
            costo: this.formArticulo.costo,
            descripcion: this.formArticulo.descripcion,
            precio: this.formArticulo.precio,
            oferta: this.formArticulo.oferta,
            creadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)
        this.showError = false
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaArticulos(this.uuid)
          this.setLoading(false)
          this.clearFormArticulo()
          this.editableArticulo = true
          this.$refs.articulo.focus()
        } else this.showAlertDialog([response.data.message])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    async actualizaArticulo() {
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        const articulo = this.formArticulo.articulo
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            sucursal +
            '/articulos/' +
            articulo +
            '?uuidmaster=' +
            this.uuid,
          method: 'put',
          data: {
            nombre: this.formArticulo.nombre,
            costo: this.formArticulo.costo,
            descripcion: this.formArticulo.descripcion,
            precio: this.formArticulo.precio,
            oferta: this.formArticulo.oferta,
            modificadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)
        this.showError = false
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaArticulos(this.uuid)
          this.setLoading(false)
          this.clearFormArticulo()
          this.editableArticulo = true
          this.editingArticle = false
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    prepareDeleteArticle(articulo, nombre) {
      this.showAlertDialogOption([
        `¿Quiere quitar el articulo "${nombre}" de la oferta?`,
        'Quitando articulo',
        () => {
          this.hideAlertDialogOption()
          this.deleteArticulo(articulo)
        },
        'danger',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async deleteArticulo(articulo) {
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            sucursal +
            '/articulos/' +
            articulo +
            '?uuidmaster=' +
            this.uuid,
          method: 'delete',
        })
        this.setLoading(false)
        this.showError = false
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaArticulos(this.uuid)
          this.setLoading(false)
          this.clearFormArticulo()
          this.editableArticulo = true
          this.editingArticle = false
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    verifyData(evt) {
      if (
        evt.keyCode !== 190 &&
        evt.keyCode !== 13 &&
        evt.keyCode !== 8 &&
        evt.keyCode !== 37 &&
        evt.keyCode !== 39 &&
        evt.keyCode !== 110
      ) {
        if (isNaN(parseInt(evt.key))) evt.preventDefault()
      }
    },
    calcUtilidad() {
      const porcentaje = utils.parseToPorcent(
        utils.roundTo(1 - this.formArticulo.costo / this.formArticulo.oferta, 4)
      )
      this.formArticulo.utilidad = `${porcentaje}%`
      if (porcentaje < 10) {
        this.status_utulidad = false
      } else {
        this.status_utulidad = true
      }
    },
    getCalculaUtilidad(costo, precio) {
      return utils.roundTo((1 - costo / precio) * 100) + '%'
    },
    editarDatosOferta() {
      this.setEditandoOferta(true)
      this.setProgramandoOferta(true)
      this.setProgramandoLista(false)
    },
    prepareSendOffer() {
      this.showAlertDialogOption([
        '¿Quiere guardar y enviar la oferta?',
        'Enviando la lista de ofertas',
        () => {
          this.hideAlertDialogOption()
          this.saveAndSend()
        },
        'primary',
        'white',
        this.hideAlertDialogOption,
      ])
    },
    async saveAndSend() {
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            sucursal +
            '/maestros/' +
            this.uuid +
            '/status',
          method: 'put',
          data: {
            status: 1,
            modificadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas(sucursal)
          this.setLoading(false)
          this.setProgramandoLista(false)
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    prepareCancelOffert() {
      this.showAlertDialogOption([
        '¿Quiere cancelar toda la oferta?',
        'Cancelando oferta',
        () => {
          this.hideAlertDialogOption()
          this.cancelarOferta()
        },
        'danger',
        'white',
        this.hideAlertDialogOption,
      ])
    },
    async cancelarOferta() {
      try {
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            sucursal +
            '/maestros/' +
            this.uuid +
            '/status',
          method: 'put',
          data: {
            status: 4,
            modificadoPor: this.dataUser.correo_user,
          },
        })
        this.setLoading(false)
        this.showError = false
        // eslint-disable-next-line no-console
        console.log(response.data)

        if (response.data.success) {
          this.setLoading(true)
          await this.changeListaOfertas(sucursal)
          this.setLoading(false)
          this.setProgramandoLista(false)
        } else {
          this.showAlertDialog([response.data.message])
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    showTableArticulosFinded() {
      if (this.formArticulo.nombre.trim() === '') {
        this.showAlertDialog(['No ha ingresado a ningun nombre'])
        return
      }
      const palabreFormated = this.formArticulo.nombre
        .toLowerCase()
        .replace(/\*/, '')
      const expresion = new RegExp(palabreFormated)
      const articulosLike = this.articulos.filter((articulo) =>
        expresion.test(articulo.nombre.toLowerCase())
      )
      this.formModalProductos.products = articulosLike
      this.formModalProductos.showModal = true
      this.formModalProductos.position = -1
    },
    getArticuloByPosition() {
      if (this.formModalProductos.products.length === 0) {
        this.showError = true
        this.clearFormArticulo()
        return true
      }
      const productSelected = this.formModalProductos.products[
        this.formModalProductos.position
      ]
      const articulofinded = this.articulos.find(
        (product) => product.articulo === productSelected.articulo
      )
      this.showError = false
      this.formArticulo.articulo = articulofinded.articulo
      this.formArticulo.codigobarras = articulofinded.codigobarras
      this.formArticulo.nombre = articulofinded.nombre
      this.formArticulo.costo = utils.roundTo(articulofinded.costo)
      this.formArticulo.precio = utils.roundTo(articulofinded.precio)
      const operacion = 1 - articulofinded.costo / articulofinded.precio
      this.formArticulo.margen = `${utils.roundTo(operacion * 100, 4)}%`
      this.$refs.oferta.focus()
    },
    async getDetailsArticleByArticle() {
      try {
        const articulo = this.formArticulo.articulo
        if (articulo.trim() === '') return false
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase + 'api/v1/ofertas/' + sucursal + '/articulos/' + articulo,
          method: 'get',
        })
        this.setLoading(false)

        if (response.data.success) {
          if (response.data.data.length !== 0) {
            const article = response.data.data[0]
            this.showError = false
            this.formArticulo.articulo = article.Articulo
            this.formArticulo.codigobarras = article.CodigoBarras
            this.formArticulo.descripcion = article.Descripcion
            this.formArticulo.nombre = article.Nombre
            this.formArticulo.existencia = article.ExistenciaActualRegular
            this.formArticulo.relacion = article.Relacion
            this.formArticulo.costo = utils.roundTo(article.UltimoCosto)
            this.formArticulo.precio = utils.roundTo(article.Precio1IVAUV)
            const operacion = 1 - article.UltimoCosto / article.Precio1IVAUV
            const rounded = utils.roundTo(operacion, 4)
            const porcentaje = utils.parseToPorcent(rounded)
            this.formArticulo.margen = `${porcentaje}%`
            this.$refs.oferta.focus()
            this.articuloActual = article.Articulo
            this.editableArticulo = false
          } else {
            this.showError = true
            this.clearFormArticulo()
            this.editableArticulo = true
          }
        } else {
          this.showAlertDialog([response.data.message])
          this.showError = true
          this.clearFormArticulo()
          this.editableArticulo = true
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.editableArticulo = true
        this.setLoading(false)
        this.showError = true
        this.clearFormArticulo()
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    async getArticleByName() {
      try {
        if (this.formArticulo.nombre.trim() === '') {
          this.showAlertDialog(['No ha ingresado a ningun nombre'])
          return
        }
        const urlBase = process.env.spastore_url_backend
        const sucursal = this.$store.state.ofertas.ofertaActual.sucursal
        const nombre = this.formArticulo.nombre
        this.setLoading(true)
        const response = await this.$axios({
          url:
            urlBase +
            'api/v1/ofertas/' +
            sucursal +
            '/articulos/' +
            nombre +
            '/details',
          method: 'get',
        })
        this.setLoading(false)

        if (response.data.success) {
          if (response.data.data.length !== 0) {
            this.productsNames = response.data.data
            this.searchProducts = true
          } else {
            this.showError = true
            this.clearFormArticulo()
          }
        } else {
          this.showAlertDialog([response.data.message])
          this.showError = true
          this.clearFormArticulo()
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, error.response)
        this.setLoading(false)
        this.showError = true
        this.clearFormArticulo()
        if (error.response) this.showAlertDialog([error.response.data.message])
        else this.showAlertDialog(['Error con el servidor'])
      }
    },
    selectProduct(article) {
      // eslint-disable-next-line no-console
      console.log(article)
      this.searchProducts = false
      this.showError = false
      this.formArticulo.articulo = article.Articulo
      this.formArticulo.codigobarras = article.CodigoBarras
      this.formArticulo.nombre = article.Nombre
      this.formArticulo.existencia = article.ExistenciaActualRegular
      this.formArticulo.relacion = article.Relacion
      this.formArticulo.descripcion = article.Descripcion
      this.formArticulo.costo = utils.roundTo(article.UltimoCosto)
      this.formArticulo.precio = utils.roundTo(article.Precio1IVAUV)
      const operacion = 1 - article.UltimoCosto / article.Precio1IVAUV
      const rounded = utils.roundTo(operacion, 4)
      const porcentaje = utils.parseToPorcent(rounded)
      this.formArticulo.margen = `${porcentaje}%`
      this.$refs.oferta.focus()
      this.articuloActual = article.Articulo
      this.editableArticulo = false
    },
  },
}
</script>

<style scoped>
#codigo-articulo,
#codigo-barras {
  width: 25%;
  margin-right: 2%;
  margin-bottom: 2%;
}

#nombre-articulo {
  width: 46%;
  margin-bottom: 2%;
}

.input-resp-dt-ofe {
  width: calc(20% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.inputs-2-data {
  display: inline-block;
  width: calc(50% - 8px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.buttons-end {
  position: relative;
}

.toast-buttons {
  position: absolute;
  bottom: 0px;
  right: 0px;
}

.btnSearchProducts {
  position: fixed;
  margin-left: 83%;
  margin-top: 15%;
}

.background-names {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
}

.tableProducts {
  margin: auto;
  width: 80%;
  margin-top: 20%;
  background: #fff;
}

@media screen and (max-width: 767px) {
  #codigo-articulo,
  #codigo-barras,
  #nombre-articulo {
    width: 100%;
    margin-right: 0px;
  }

  .input-resp-dt-ofe {
    width: 100%;
    margin-right: 0px;
  }

  .inputs-2-data {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
