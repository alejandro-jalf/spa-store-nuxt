<template>
  <div>
    <h1 class="text-center mt-2">Pedido Sujerido</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        :disabled="!accessChangeSucursal"
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
        :variant="variantSuccess"
        :block="width < 428"
        class="mt-2"
        @click="actionNotAviable"
      >
        <b-icon icon="file-earmark-plus-fill" />
        Generar Pedido
      </b-button>

      <div class="h3 mb-3 mt-4">
        Articulos sujeridos de "{{ getNameBySuc(sucConsult) }}"
      </div>
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
        {{ dataFormated(row.item.ExistLoc) }}
      </template>
      <template #cell(ExistBo)="row">
        {{ dataFormated(row.item.ExistExt) }}
      </template>
      <template #cell(RotacionPromedio)="row">
        {{ dataFormated(row.item.CalculoRotacion) }}
      </template>
      <template #cell(FacCompra)="row">
        {{ dataFormated(row.item.FactorCompra) }}
      </template>
      <template #cell(FacVenta)="row">
        {{ dataFormated(row.item.FactorVenta) }}
      </template>
      <template #cell(Sujerido)="row">
        {{ dataFormated(row.item.tipoSugerido) }}
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
        'TipoRotacion',
        'ExistLoc',
        'ExistBo',
        'RotacionPromedio',
        'FacCompra',
        'FacVenta',
        'Sujerido',
      ],
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
    sucConsult() {
      return this.$store.state.pedidosujerido.sucursalConsult
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      return this.$store.state.pedidosujerido.data.data
    },
  },
  mounted() {
    const tablePedidoSujerido = document.getElementById('tablePedidoSujerido')

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
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
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
