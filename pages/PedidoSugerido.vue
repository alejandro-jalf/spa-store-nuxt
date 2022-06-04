<template>
  <div>
    <h1 class="text-center mt-2">Pedido Sugerido</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        :disabled="!(isManager || isAllowedUser)"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="getPedidoSujerido">Consultar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div v-if="!isCleanData" class="pt-2">
      <b-button
        :variant="variantClean"
        :block="width < 428"
        class="mt-2"
        @click="cleanData"
      >
        <b-icon icon="file-earmark-ruled-fill" />
        Limpiar tabla
      </b-button>
      <b-button
        v-if="isAllowedUser || isManager"
        :variant="variantSuccess"
        :block="width < 428"
        class="mt-2"
        @click="actionNotAviable"
      >
        <b-icon icon="file-earmark-plus-fill" />
        Generar Pedido
      </b-button>
      <b-button
        :variant="variantSuccess"
        :block="width < 428"
        class="mt-2"
        @click="createPDF(false)"
      >
        <b-icon icon="download" />
        Descargar
      </b-button>
      <b-button
        :variant="variantInfo"
        :block="width < 428"
        class="mt-2"
        @click="createPDF(true)"
      >
        <b-icon icon="printer-fill" />
        Vista Previa
      </b-button>

      <div class="h3 mb-1 mt-4">
        Articulos sugeridos de "{{ getNameBySuc(sucConsult) }}"
      </div>
      <b-badge pill variant="info" class="chip"
        >Total: {{ dataRefactor.length }}</b-badge
      >
    </div>

    <b-table
      v-if="width > 767"
      id="tablePedidoSujerido"
      responsive
      striped
      hover
      :fields="fields"
      :items="dataRefactor"
      head-variant="dark"
      class="my-3"
      :class="variantThemeTableBody"
    >
      <template #cell(TipoRotacion)="row">
        {{ row.item.estatusRotacion.split(' ')[1] }}
      </template>
      <template #cell(ExistLoc)="row">
        {{ dataFormated(row.item.ExitLoc) }}
      </template>
      <template #cell(ExistBo)="row">
        {{ dataFormated(row.item.ExistExt) }}
      </template>
      <template #cell(StockMin)="row">
        {{ dataFormated(row.item.StockMinimo) }}
      </template>
      <template #cell(Sugerido)="row">
        {{ dataFormated(row.item.CalculoRotacion) }}
      </template>
      <template #cell(Acciones)="row">
        <b-button
          v-b-tooltip.hover.lefttop="titleTooltip(row.item.Articulo)"
          variant="info"
          size="sm"
          @click="utils.copyToClipBoard(row.item.Articulo, $bvToast)"
        >
          <b-icon icon="files" />
        </b-button>
      </template>
    </b-table>
    <div v-else class="my-3">
      <PedidoSujeridoCard
        v-for="(article, indexArticle) in dataRefactor"
        :key="indexArticle"
        :data-formated="dataFormated"
        :article="article"
        class="mb-2"
      />
    </div>

    <div v-if="!isCleanData" class="float-right h5 mb-5">
      <span class="font-weight-bold">Fecha de consulta:</span>
      {{ horaConsult }}
    </div>

    <div class="imageLogo">
      <canvas
        id="canvas"
        class="canvasLogo"
        width="100px"
        height="100px"
      ></canvas>
      <img id="imgLogoSpa" class="imgLogo" src="../assets/cesta.png" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import PedidoSujeridoCard from '../components/PedidoSujeridoCard'
import utils from '../modules/utils'

export default {
  components: {
    PedidoSujeridoCard,
  },
  data() {
    return {
      utils,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'SY', text: 'SPASAYULA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      fields: [
        'Articulo',
        'Nombre',
        'StockMin',
        'TipoRotacion',
        'ExistLoc',
        'ExistBo',
        'Relacion',
        'Sugerido',
        'Acciones',
      ],
      allowedUsers: ['Justo Cruz Basurto'],
    }
  },
  computed: {
    isCleanData() {
      return this.$store.state.pedidosujerido.sucursalConsult.trim() === ''
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    horaConsult() {
      return this.$store.state.pedidosujerido.horaConsult
    },
    suc() {
      return this.$store.state.pedidosujerido.sucursal
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    sucConsult() {
      return this.$store.state.pedidosujerido.sucursalConsult
    },
    isManager() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = []
      this.$store.state.pedidosujerido.data.data.forEach((articulo) => {
        const data = { ...articulo }
        if (data.StockMinimo === null || data.ExitLoc === null)
          data._rowVariant = 'warning'
        if (data.CalculoRotacion === null)
          data.CalculoRotacion = data.FactorVenta
        datos.push(data)
      })
      return datos
    },
    isAllowedUser() {
      const nombreUser = this.$store.state.user.user.nombre_user
      const apellidoPUser = this.$store.state.user.user.apellido_p_user
      const apellidoMUser = this.$store.state.user.user.apellido_m_user
      const nombreCompleto =
        nombreUser + ' ' + apellidoPUser + ' ' + apellidoMUser
      return !!this.allowedUsers.find((user) => user === nombreCompleto)
    },
  },
  mounted() {
    const tablePedidoSujerido = document.getElementById('tablePedidoSujerido')

    this.loadDataImage()
    this.setSucursalForUser()
    if (tablePedidoSujerido) {
      tablePedidoSujerido.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tablePedidoSujerido.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapMutations({
      setSucursal: 'pedidosujerido/setSucursal',
      setData: 'pedidosujerido/setData',
      setHoraConsult: 'pedidosujerido/setHoraConsult',
      setSucursalConsult: 'pedidosujerido/setSucursalConsult',
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      changeData: 'pedidosujerido/changeData',
    }),
    titleTooltip(article = '') {
      return `Copiar codigo de articulo "${article}"`
    },
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      const object2 = new Image()
      object2.src = imageObject.src
      context.drawImage(object2, 0, 0, 100, 100)
    },
    createPDF(preview = false) {
      const logo = document.getElementById('canvas')
      utils.createPdfPedidoSujerido(
        'Sugerencias para Pedidos',
        'SUPER PROMOCIONES DE ACAYUCAN SA DE CV',
        'SUCURSAL ' + this.getNameBySuc(this.sucConsult),
        this.dataRefactor,
        this.horaConsult,
        logo,
        preview
      )
    },
    setSucursalForUser() {
      if (!this.isManager) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    validateData() {
      if (
        this.$store.state.pedidosujerido.sucursal === null ||
        this.$store.state.pedidosujerido.sucursal === 'null'
      ) {
        this.showAlertDialog(['Necesita seleccionar una sucursal'])
        return false
      }
      return true
    },
    async getPedidoSujerido() {
      if (!this.validateData()) return false
      this.setLoading(true)
      const response = await this.changeData(
        this.$store.state.pedidosujerido.sucursal
      )
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else
        this.setHoraConsult(utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a'))
    },
    selectSucursal(sucursal) {
      this.setSucursal(sucursal)
    },
    actionNotAviable() {
      this.showAlertDialog([
        'Por el momento esta funcion no esta habilitada',
        'No habilitado',
        'info',
      ])
    },
    getNameBySuc(sucRecived) {
      const sucFind = this.options.find((suc) => suc.value === sucRecived)
      return sucFind ? sucFind.text : ''
    },
    dataFormated(value) {
      if (value === null) return '-'
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    cleanData() {
      this.setData({ data: [] })
      this.setSucursalConsult('')
      this.setHoraConsult('')
    },
  },
}
</script>

<style scoped>
.canvasLogo,
.imgLogo {
  width: 100px;
  height: 100px;
  visibility: hidden;
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.chip {
  padding: 5px 15px;
  font-size: 15px;
}
</style>
