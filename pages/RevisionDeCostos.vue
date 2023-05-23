<template>
  <div class="containerRevision">
    <h4 class="text-center my-4">Revision de Costos</h4>
    <div class="siteLeft">
      <b-input-group prepend="Suc" size="sm" class="w-100 mb-3">
        <b-form-select
          :value="sucursal"
          :options="options"
          :disabled="!accessChangeSucursal"
          @change="selectSucursal"
        ></b-form-select>
      </b-input-group>
      <b-form-group label="Tienda:" label-for="tienda">
        <b-form-input
          id="tienda"
          v-model="tienda"
          type="text"
          required
          :class="backgroundInputTheme"
          readonly
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Almacen:" label-for="almacen">
        <b-form-input
          id="almacen"
          v-model="almacen"
          type="text"
          required
          :class="backgroundInputTheme"
          readonly
        ></b-form-input>
      </b-form-group>
      <b-calendar
        v-model="dia"
        locale="es-mx"
        label-today="Hoy"
        label-selected="Seleccione dia"
        label-current-month="Mes Actual"
        label-next-month="Siguiente Mes"
        label-prev-month="Mes Anterior"
        label-next-year="Siguiente Año"
        label-prev-year="Año Anterior"
        label-no-date-selected="Seleccione una Fecha"
        label-help="Use el cursor para navegar entre las fechas"
      />
      <b-button block variant="info" class="mt-3" size="sm" @click="loadData">
        Buscar
      </b-button>
      <div v-if="countCostos > 0" class="articles">
        {{ countCostos }} Articulos
      </div>
      <b-button
        v-if="countCostosUpdate > 0"
        block
        variant="success"
        class="mt-3"
        size="sm"
        @click="prepareUpdateCostos"
      >
        Actualizar [ {{ countCostosUpdate }} ]
      </b-button>
      <div v-else class="success-art">
        Costos Actualizados
        <b-icon icon="patch-check-fill" />
      </div>
    </div>
    <div class="siteRight">
      <b-table
        hover
        small
        head-variant="dark"
        sticky-header="750px"
        outlined
        responsive
        :fields="fields"
        :items="dataCostos"
        :class="variantThemeTableBody"
        class="mt-0"
      >
        <template #cell(Fecha)="row">
          {{ utils.toDate(row.item.Fecha) }}
        </template>
        <template #cell(CostoUnitario)="row">
          {{ formatNumber(row.item.CostoUnitario) }}
        </template>
        <template #cell(UltimoCosto)="row">
          {{ formatNumber(row.item.UltimoCosto) }}
        </template>
        <template #cell(Diferencia)="row">
          {{ utils.roundTo(row.item.Diferencia) }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      sucursal: 'ZR',
      tienda: 0,
      almacen: 0,
      dia: '',
      utils,
      fields: [
        'Fecha',
        'Documento',
        'Articulo',
        'Nombre',
        'CostoUnitario',
        'UltimoCosto',
        'Diferencia',
      ],
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
      ],
    }
  },
  computed: {
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    dataCostos() {
      const data = [...this.$store.state.revisiondecostos.data.data]
      data.forEach((article) => {
        if (article.Diferencia >= 0.01) article._rowVariant = 'warning'
      })
      return data
    },
    countCostos() {
      return this.$store.state.revisiondecostos.data.data.length
    },
    countCostosUpdate() {
      let count = 0
      this.$store.state.revisiondecostos.data.data.forEach((article) => {
        if (article.Diferencia >= 0.01) count++
      })
      return count
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
  },
  mounted() {
    this.setSucursalForUser()
    this.setDay()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
      setSucursal: 'revisiondecostos/setSucursal',
    }),
    ...mapActions({
      changeData: 'revisiondecostos/changeData',
      updateCostos: 'revisiondecostos/updateCostos',
    }),
    setDay() {
      const fecha = this.$store.state.revisiondecostos.fecha
      if (!fecha || fecha === '')
        this.dia = utils.getDateNow().format('YYYY-MM-DD')
      else
        this.dia =
          `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-` + fecha.slice(6, 8)
    },
    selectSucursal(suc) {
      this.tienda = utils.getTiendaBySuc(suc)
      this.almacen = utils.getAlmacenBySuc(suc)
      this.setSucursal(suc)
    },
    formatNumber(value) {
      return utils.aplyFormatNumeric(utils.roundTo(value))
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.sucursal = sucUser
        this.selectSucursal(sucUser)
      } else this.selectSucursal(this.$store.state.revisiondecostos.sucursal)
    },
    async loadData() {
      const sucursal = this.$store.state.revisiondecostos.sucursal
      const dia = this.dia
      if (dia === '') this.showAlertDialog(['Falta seleccionar una fecha'])
      this.setLoading(true)
      const response = await this.changeData([sucursal, dia.replace(/-/g, '')])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
    },
    prepareUpdateCostos() {
      this.showAlertDialogOption([
        `¿Quiere actualizar el costo de los [ ${this.countCostosUpdate} ] Articulos?`,
        'Actualizando Costos',
        () => {
          this.hideAlertDialogOption()
          this.update()
        },
        'warning',
        'light',
        this.hideAlertDialogOption,
      ])
    },
    async update() {
      const sucursal = this.$store.state.revisiondecostos.sucursal
      const costos = [...this.$store.state.revisiondecostos.data.data]
      const listCostos = costos.reduce((list, article) => {
        if (article.Diferencia >= 0.01)
          list.push({
            Article: article.Articulo,
            CostoUnitario: article.CostoUnitario,
          })
        return list
      }, [])
      this.setLoading(true)
      const response = await this.updateCostos([sucursal, listCostos])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.loadData()
    },
  },
}
</script>

<style scoped>
.containerRevision {
  position: relative;
}

.siteLeft {
  position: absolute;
  left: 0px;
  width: 270px;
}

#sucursal,
#tienda,
#almacen {
  background: #fff;
  color: black;
  height: 30px;
}

.articles {
  margin: auto;
  margin-top: 5px;
  width: 50%;
  max-width: 300px;
  border-radius: 5px;
  border: 2px solid rgb(1, 160, 228);
  padding: 5px;
  text-align: center;
}

.success-art {
  margin-top: 10px;
  background: rgb(32, 126, 1);
  color: #fff;
  padding: 5px 15px;
  border-radius: 8px;
  text-align: center;
}

.siteRight {
  display: inline-block;
  margin-left: 290px;
  width: calc(100% - 410px);
}
</style>
