<template>
  <div>
    <div class="mt-4">
      <div class="mt-2" style="display: inline-block">
        <b-form inline>
          <span class="font-weight-bold mr-2">Del</span>
          <b-form-datepicker id="dateInit" v-model="date1"></b-form-datepicker>
        </b-form>
      </div>
      <div class="mt-2" style="display: inline-block">
        <b-form inline>
          <span class="font-weight-bold mr-2 ml-4">Al</span>
          <b-form-datepicker id="dateEnd" v-model="date2"></b-form-datepicker>
        </b-form>
      </div>
      <div class="ml-3 mt-2" style="display: inline-block">
        <b-form-select v-model="selected" :options="options"></b-form-select>
      </div>
      <div class="ml-3 mt-2" style="display: inline-block">
        <b-button variant="outline-success" @click="setDetails()">
          Buscar
        </b-button>
      </div>
    </div>
    <div v-b-toggle.dataFiltros class="extras mt-3">Filtros</div>
    <b-collapse id="dataFiltros" class="mt-2">
      <div class="container-filter">
        <b-list-group>
          <b-list-group-item
            button
            :active="allArticulos"
            class="d-flex justify-content-between align-items-center ml-1"
            @click="selectArticle('All')"
          >
            Todos
            <b-icon-check-square-fill v-if="allArticulos" />
            <b-icon-square v-else />
          </b-list-group-item>
          <b-list-group-item
            v-for="(articulo, keyArticulo) in listArticulos"
            :key="keyArticulo"
            button
            :active="isSelected(articulo)"
            class="d-flex justify-content-between align-items-center ml-1"
            @click="selectArticle(articulo.Articulo)"
          >
            {{ `${articulo.Articulo} - ${articulo.Nombre}` }}
            <b-icon-check-square-fill v-if="isSelected(articulo)" />
            <b-icon-square v-else />
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="container-filter">
        <b-list-group>
          <b-list-group-item
            button
            :active="allFechas"
            class="d-flex justify-content-between align-items-center ml-1"
            @click="selectFecha('All')"
          >
            Todas
            <b-icon-check-square-fill v-if="allFechas" />
            <b-icon-square v-else />
          </b-list-group-item>
          <b-list-group-item
            v-for="(fecha, keyFecha) in listFechas"
            :key="keyFecha"
            button
            :active="isSelectedFecha(fecha)"
            class="d-flex justify-content-between align-items-center ml-1"
            @click="selectFecha(fecha)"
          >
            {{ toDate(fecha) }}
            <b-icon-check-square-fill v-if="isSelectedFecha(fecha)" />
            <b-icon-square v-else />
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-collapse>
    <b-table
      striped
      hover
      head-variant="dark"
      responsive=""
      :fields="fields"
      :items="itemsRafactor"
      :class="variantThemeTableBody"
      class="mt-4"
      :tbody-tr-class="rowClass"
    >
      <template #cell(CantidadRegular)="row">
        {{ formatNumeric(row.item.CantidadRegular) }}
      </template>
      <template #cell(VentaValorNeta)="row">
        {{ formatNumeric(row.item.VentaValorNeta) }}
      </template>
      <template #cell(Fecha)="row">
        {{ toDate(row.item.Fecha, row.item.status) }}
      </template>
      <template #cell(Hora)="row">
        {{ toHour(row.item.Hora, row.item.status) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { BIconSquare, BIconCheckSquareFill } from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconSquare,
    BIconCheckSquareFill,
  },
  data() {
    return {
      utils,
      date1: '',
      date2: '',
      allArticulos: true,
      articulosSelected: [],
      allFechas: true,
      datesSelected: [],
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
      ],
    }
  },
  computed: {
    fields() {
      return this.$store.state.cocina.detalles.fields
    },
    itemsRafactor() {
      const datos = []
      let sumaCantidad = 0
      let sumaVenta = 0

      const addDetalle = (detalle) => {
        datos.push(detalle)
        sumaCantidad += detalle.CantidadRegular
        sumaVenta += detalle.VentaValorNeta
      }

      this.$store.state.cocina.detalles.data.forEach((detalle) => {
        if (this.allArticulos) {
          if (this.allFechas) addDetalle(detalle)
          else {
            const dateFinded = this.datesSelected.find(
              (date) => date === detalle.Fecha
            )
            if (dateFinded) addDetalle(detalle)
          }
        } else if (this.allFechas) {
          const articleFinded = this.articulosSelected.find(
            (art) => art === detalle.Articulo
          )
          if (articleFinded) addDetalle(detalle)
        } else {
          const dateFinded = this.datesSelected.find(
            (date) => date === detalle.Fecha
          )
          const articleFinded = this.articulosSelected.find(
            (art) => art === detalle.Articulo
          )
          if (dateFinded && articleFinded) addDetalle(detalle)
        }
      })

      datos.push({
        Suc: 'Total',
        status: 'end',
        CantidadRegular: sumaCantidad,
        VentaValorNeta: sumaVenta,
      })
      return datos
    },
    listArticulos() {
      const articulos = []

      this.$store.state.cocina.detalles.data.forEach((detalle, index) => {
        const articuloFinded = articulos.find(
          (articulo) => articulo.Articulo === detalle.Articulo
        )
        if (!articuloFinded) {
          articulos.push({
            Articulo: detalle.Articulo,
            Nombre: detalle.Nombre,
          })
        }

        if (index === this.$store.state.cocina.detalles.data.length - 1)
          this.articulosSelected = articulos.reduce((acum, art) => {
            acum.push(art.Articulo)
            return acum
          }, [])
      })
      return articulos
    },
    listFechas() {
      const fechas = []

      this.$store.state.cocina.detalles.data.forEach((detalle, index) => {
        const fechaFinded = fechas.find((fecha) => fecha === detalle.Fecha)
        if (!fechaFinded) fechas.push(detalle.Fecha)
        if (index === this.$store.state.cocina.detalles.data.length - 1)
          this.datesSelected = fechas
      })
      return fechas
    },
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
  },
  mounted() {
    this.loadFechas()
  },
  methods: {
    ...mapActions({
      loadDetails: 'cocina/loadDetails',
    }),
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
    loadFechas() {
      const dateActual = new Date()
      const diaActual = `${dateActual.getFullYear()}-${utils.completeDateHour(
        dateActual.getMonth() + 1
      )}-${utils.completeDateHour(dateActual.getDate())}`
      this.date1 = diaActual
      this.date2 = diaActual
    },
    selectArticle(articulo) {
      if (articulo === 'All') {
        this.allArticulos = !this.allArticulos
        if (!this.allArticulos) this.articulosSelected = []
        else
          this.articulosSelected = this.listArticulos.reduce((acum, art) => {
            acum.push(art.Articulo)
            return acum
          }, [])
      } else {
        const findedArticulo = this.articulosSelected.find(
          (art) => art === articulo
        )
        if (!findedArticulo) this.articulosSelected.push(articulo)
        else {
          this.articulosSelected = this.articulosSelected.filter(
            (art) => art !== articulo
          )
        }
        this.allArticulos =
          this.listArticulos.length === this.articulosSelected.length
      }
    },
    selectFecha(fecha) {
      if (fecha === 'All') {
        this.allFechas = !this.allFechas
        if (!this.allFechas) this.datesSelected = []
        else
          this.datesSelected = this.listFechas.reduce((acum, date) => {
            acum.push(date)
            return acum
          }, [])
      } else {
        const findedFecha = this.datesSelected.find((art) => art === fecha)
        if (!findedFecha) this.datesSelected.push(fecha)
        else
          this.datesSelected = this.datesSelected.filter((art) => art !== fecha)
        this.allFechas = this.listFechas.length === this.datesSelected.length
      }
    },
    isSelected(articulo) {
      const findedArticulo = this.articulosSelected.find(
        (art) => art === articulo.Articulo
      )
      return !!findedArticulo
    },
    isSelectedFecha(fecha) {
      const findedFecha = this.datesSelected.find((date) => date === fecha)
      return !!findedFecha
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.status === 'end') return 'table-primary'
    },
    formatNumeric(num) {
      return utils.aplyFormatNumeric(utils.roundTo(num))
    },
    toDate(date, status) {
      if (status === 'end') return ''
      return utils.toDate(date)
    },
    toHour(hour, status) {
      if (status === 'end') return ''
      return utils.toHour(hour)
    },
    verifyMeses() {
      if (this.date1.trim() === '') {
        this.showAlertDialog(['Debe elejir la fecha de inicio"'])
        return false
      }
      if (this.date1.trim() === '') {
        this.showAlertDialog(['Debe elejir la fecha de termino'])
        return false
      }
      if (this.selected === null) {
        this.showAlertDialog(['Debe seleccionar una sucursal'])
        return false
      }
      return true
    },
    async setDetails() {
      if (!this.verifyMeses()) return false
      this.setLoading(true)
      const response = await this.loadDetails({
        sucursal: this.selected,
        dateStart: this.date1.replace(/-/g, ''),
        dateEnd: this.date2.replace(/-/g, ''),
      })
      if (response.case)
        this.showAlertDialog([
          'Erro con el servidor intentelo as tarde',
          'Error al consultar',
          'danger',
        ])
      else if (!response.success)
        this.showAlertDialog([response.message, 'Error al consultar'])

      this.setLoading(false)
    },
  },
}
</script>

<style scoped>
.container-filter {
  width: max-content;
  display: inline-block;
}

.extras {
  border-bottom: 1px solid rgb(138, 138, 138);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
</style>
