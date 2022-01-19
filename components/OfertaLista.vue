<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta: ' + uuid"
      :title="tipoOferta + ' Del ' + fechaInicio + ' al ' + fechaFin"
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
            :class="backgroundInputTheme"
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
            :class="backgroundInputTheme"
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
        <b-form inline class="mt-2 mb-2">
          <b-form-group label="Costo" class="input-resp-dt-ofe">
            <b-form-input
              id="input-costo"
              v-model="formArticulo.costo"
              placeholder="Costo"
              class="w-100"
              desc
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
          Agregar a la lista
        </b-button>
        <b-button variant="warning" class="mb-3" @click="clearFormArticulo">
          <b-icon icon="backspace-fill" />
          Limpiar campos
        </b-button>
      </div>
      <b-card-text class="font-weight-bold mb-1">
        Articulos incluidos
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
              @click="deleteArticulo(row.item.articulo)"
            >
              <b-icon icon="trash" />
            </b-button>
          </template>
        </b-table>
      </div>
      <div v-if="ofertaEditable" class="text-right mt-3 buttons-end">
        <b-button variant="secondary" class="mb-2" @click="editarDatosOferta">
          <b-icon icon="arrow-left-circle-fill" />
          Datos de oferta
        </b-button>
        <b-button variant="danger" class="mb-2" @click="cancelarOferta">
          <b-icon icon="trash-fill" />
          Cancelar oferta
        </b-button>
        <b-button variant="primary" class="mb-2" @click="saveAndSend">
          <b-icon icon="upload-fill" />
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
          Al dar click en "Datos de oferta" podra editar los datos generales de
          la oferta, como lo es el tipo, fechas o descripcion.
          <br />
          <br />
          Al dar click en "Cancelar oferta" se eliminara toda la oferta junto
          con todos los articulos registrados.
          <br />
          <br />
          Al dar click en "Guardar y enviar" la oferta sera almacenada y enviada
          para su programacion
        </b-toast>
      </div>
      <div v-if="!ofertaEditable" class="text-right mt-3 buttons-end">
        <div v-if="!status">
          <b-button
            variant="secondary"
            class="mb-2"
            @click="setProgramandoLista(false)"
          >
            <b-icon icon="file-earmark-excel-fill" />
            Cerrar
          </b-button>
        </div>
        <div v-if="status">
          <b-button
            variant="secondary"
            class="mb-2"
            @click="setProgramandoLista(false)"
          >
            <b-icon icon="file-earmark-excel-fill" />
            Cerrar
          </b-button>
          <b-button variant="primary" class="mb-2">
            <b-icon icon="folder-symlink-fill" />
            Guardar cambios
          </b-button>
          <b-button
            variant="info"
            class="mb-2"
            @click="$bvToast.show('toast-view-ofert')"
          >
            <b-icon icon="question-circle-fill" />
          </b-button>
          <b-toast
            id="toast-view-ofert"
            title="Ayuda"
            static
            no-auto-hide
            class="toast-buttons text-justify"
            variant="info"
            solid
          >
            Al dar click en "Cerrar" solamente se cerrar la oferta, esto no
            afecta en nada a los datos ya registrado.
            <br />
            <br />
            <div>
              Al dar click en "Guardar cambios" Se guardara los ajustes que se
              le haya realizado a algun producto y en automatico se enviaran los
              datos.
            </div>
          </b-toast>
        </div>
      </div>
    </b-card>
    <alert-option
      :alert-title="alert.title"
      :alert-message="alert.message"
      :alert-show="showAlert"
      :click-cancel="hideAlertDialog"
      :click-acept="functionGeneralAcept"
    ></alert-option>
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
import { mapMutations } from 'vuex'
import utils from '../modules/utils'
import Divider from './Divider'
import MessageText from './MessageText'
import AlertOption from './AlertOption'
import OfertaListProducts from './OfertaListaProducts'

export default {
  components: {
    Divider,
    MessageText,
    AlertOption,
    OfertaListProducts,
  },
  data() {
    return {
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
      },
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
        'Descripcion',
        'Acciones',
      ],
      articulos: [],
      articuloActual: '',
      productsNames: [],
      searchProducts: false,
    }
  },
  computed: {
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
      return (
        this.$store.state.ofertas.ofertaActual.status === 0 ||
        this.$store.state.ofertas.ofertaActual.status === 2
      )
    },
    status() {
      if (
        this.$store.state.ofertas.ofertaActual.status === 4 ||
        this.$store.state.ofertas.ofertaActual.status === 3
      ) {
        return false
      }
      return true
    },
    listaProductos() {
      return this.$store.state.ofertas.listaArticulos.data
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
      if (item.status === 'selected') return 'table-secondary'
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.formModalProductos.showModal = false
      this.getArticuloByPosition()
      this.$refs.oferta.focus()
    },
    functionGeneralAcept() {},
    showAlertDialogOption(title, message, functionR) {
      this.alert.title = title
      this.alert.message = message
      this.functionGeneralAcept = functionR
      this.showAlert = true
    },
    hideAlertDialog() {
      this.showAlert = false
    },
    editArticle(articuloRe) {
      this.setArticle(articuloRe.item.articulo)
      const {
        articulo,
        codigobarras,
        nombre,
        precio,
        costo,
        margen,
        oferta,
        utilidad,
      } = this.$store.state.ofertas.formArticulo
      this.formArticulo = {
        articulo,
        codigobarras,
        nombre,
        precio,
        costo,
        margen,
        oferta,
        utilidad,
      }
      this.editingArticle = true
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
      }
    },
    validaArticulo() {
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
      if (this.formArticulo.oferta.trim() === '') {
        this.showAlertDialog(['Falta ingresar el precio de oferta'])
        return false
      }
      if (!this.status_utulidad) {
        this.showAlertDialog(['La utilidad no puede ser menor que el 8%'])
        return false
      }
      return true
    },
    agregarArticulo() {
      if (this.validaArticulo()) {
        const articulofinded = this.$store.state.ofertas.ofertaActual.listaProductos.find(
          (elemento) => this.formArticulo.articulo === elemento.articulo
        )
        if (this.editingArticle) {
          this.deleteArticulo(this.formArticulo.articulo)
          this.editingArticle = false
        } else if (articulofinded !== undefined) {
          this.showAlertDialog(['Este articulo ya esta en la lista'])
          return false
        }
        this.addArticulo(this.formArticulo)
        this.clearFormArticulo()
        this.$refs.articulo.focus()
      }
    },
    verifyData(evt) {
      if (
        evt.keyCode !== 190 &&
        evt.keyCode !== 13 &&
        evt.keyCode !== 8 &&
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
      if (porcentaje < 8) {
        this.status_utulidad = false
      } else {
        this.status_utulidad = true
      }
    },
    ...mapMutations({
      setProgramandoLista: 'ofertas/setProgramandoLista',
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      addArticulo: 'ofertas/addArticulo',
      deleteArticulo: 'ofertas/deleteArticulo',
      setArticle: 'ofertas/setArticle',
      setEditandoOferta: 'ofertas/setEditandoOferta',
      addOFerta: 'ofertas/addOFerta',
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
    editarDatosOferta() {
      this.setEditandoOferta(true)
      this.setProgramandoOferta(true)
      this.setProgramandoLista(false)
    },
    saveAndSend() {
      const newFunction = () => {
        this.addOFerta(this.$store.state.ofertas.ofertaActual)
        this.setProgramandoLista(false)
      }
      this.showAlertDialogOption(
        'Guardando la lista de ofertas',
        '¿Teminar el proceso de guardar la oferta?',
        newFunction
      )
    },
    cancelarOferta() {
      const newFunction = () => {
        this.setProgramandoLista(false)
      }
      this.showAlertDialogOption(
        'Cancelando oferta',
        '¿Quiere cancelar la oferta?',
        newFunction
      )
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
      const rounded = utils.roundTo(operacion, 4)
      const porcentaje = utils.parseToPorcent(rounded)
      this.formArticulo.margen = `${porcentaje}%`
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
            this.formArticulo.nombre = article.Nombre
            this.formArticulo.costo = utils.roundTo(article.UltimoCosto)
            this.formArticulo.precio = utils.roundTo(article.Precio1IVAUV)
            const operacion = 1 - article.UltimoCosto / article.Precio1IVAUV
            const rounded = utils.roundTo(operacion, 4)
            const porcentaje = utils.parseToPorcent(rounded)
            this.formArticulo.margen = `${porcentaje}%`
            this.$refs.oferta.focus()
            this.articuloActual = article.Articulo
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
      this.formArticulo.costo = utils.roundTo(article.UltimoCosto)
      this.formArticulo.precio = utils.roundTo(article.Precio1IVAUV)
      const operacion = 1 - article.UltimoCosto / article.Precio1IVAUV
      const rounded = utils.roundTo(operacion, 4)
      const porcentaje = utils.parseToPorcent(rounded)
      this.formArticulo.margen = `${porcentaje}%`
      this.$refs.oferta.focus()
      this.articuloActual = article.Articulo
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
}
</style>
