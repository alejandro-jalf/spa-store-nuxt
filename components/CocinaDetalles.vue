<template>
  <div>
    <div class="mt-4">
      <div class="containerInp">
        <b-input-group prepend="Del">
          <b-form-datepicker id="dateInit" v-model="date1"></b-form-datepicker>
        </b-input-group>
      </div>
      <div class="containerInp">
        <b-input-group prepend="Al">
          <b-form-datepicker id="dateEnd" v-model="date2"></b-form-datepicker>
        </b-input-group>
      </div>
      <div class="containerInp">
        <b-input-group>
          <b-form-select v-model="selected" :options="options"></b-form-select>
          <b-input-group-append>
            <b-button variant="outline-success" @click="setDetails()">
              Buscar
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <h3 class="text-center mb-2 mt-2">{{ dateDetails }}</h3>
    <div
      v-b-toggle.dataFiltros
      class="extras mt-3"
      :class="{ openFilter: iconFilter }"
    >
      Filtros
      <b-icon :icon="iconFilterActive" font-scale="1.6" class="float-right" />
    </div>
    <b-collapse id="dataFiltros" class="p-1">
      <div class="container-filter">
        <b-list-group>
          <b-list-group-item
            button
            :active="allArticulos"
            class="d-flex justify-content-between align-items-center ml-1"
            @click="selectArticle('All')"
          >
            Todos
            <b-icon :icon="allArticulosSelected" />
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
            <b-icon :icon="isSelectedIcon(articulo)" />
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
            <b-icon :icon="allFechasSelected" />
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
            <b-icon :icon="isSelectedFechaIcon(fecha)" />
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-collapse>
    <b-table
      v-if="viewTable"
      id="tableDetalles"
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
    <div v-else>
      <b-card
        v-for="(dia, indexDia) in itemsRafactor"
        :key="indexDia"
        no-body
        class="containerCard"
        :class="variantTheme"
      >
        <div :class="{ bgEnd: dia.status === 'end' }">
          <div v-if="dia.status !== 'end'" class="headerCard">
            <div class="card-name">{{ dia.Articulo }} -</div>
            <div class="card-name">{{ dia.Nombre }}</div>
          </div>
          <div style="padding: 10px">
            <div>
              <span class="font-weight-bold">Relacion: </span>
              {{ dia.Relacion }}
            </div>
            <div>
              <span class="font-weight-bold">Cantidad: </span>
              {{ dia.CantidadRegular }}
            </div>
            <div>
              <span class="font-weight-bold">Valor Venta: </span>
              ${{ formatNumeric(dia.VentaValorNeta) }}
            </div>
          </div>
          <div style="padding: 0px 10px 10px 10px">
            <div class="float-left">{{ dia.Suc }}</div>
            <div class="float-right font-style-italic">
              {{ toDate(dia.Fecha, dia.status) }}
              {{ toHour(dia.Hora, dia.status) }}
            </div>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
  data() {
    return {
      iconFilter: true,
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
    allArticulosSelected() {
      return this.allArticulos ? 'check-square-fill' : 'square'
    },
    allFechasSelected() {
      return this.allFechas ? 'check-square-fill' : 'square'
    },
    iconFilterActive() {
      return this.iconFilter ? 'plus-circle' : 'dash-circle'
    },
    viewTable() {
      const width = this.$store.state.general.widthWindow
      if (width > 992) return true
      return this.$store.state.cocina.vistaTable
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    fields() {
      return this.$store.state.cocina.detalles.fields
    },
    dateDetails() {
      if (this.$store.state.cocina.detalles.data.length <= 1) return ''
      const fechas = []
      this.$store.state.cocina.detalles.data.forEach((detail) => {
        const fecha = detail.Fecha.split('T')
        fechas.push(new Date(fecha[0] + 'T05' + fecha[1].slice(2)))
      })
      const minDate = new Date(Math.min.apply(null, fechas))
      const maxDate = new Date(Math.max.apply(null, fechas))
      return (
        utils.completeDateHour(minDate.getDate()) +
        '/' +
        utils.completeDateHour(minDate.getMonth() + 1) +
        '/' +
        minDate.getFullYear() +
        ' - ' +
        utils.completeDateHour(maxDate.getDate()) +
        '/' +
        utils.completeDateHour(maxDate.getMonth() + 1) +
        '/' +
        maxDate.getFullYear()
      )
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
    variantTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkBodyCard containerCarDark'
        return 'containerCard'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkBodyCard containerCarDark'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaBodyCard containerCard'
      else return 'containerCard'
    },
  },
  mounted() {
    this.loadFechas()
    const tableDetalles = document.getElementById('tableDetalles')

    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId === 'dataFiltros') {
        if (!isJustShown) this.iconFilter = true
        else this.iconFilter = false
      }
    })

    if (tableDetalles) {
      tableDetalles.addEventListener('touchstart', (evt) => {
        this.setMoveTouch(false)
      })
      tableDetalles.addEventListener('touchend', (evt) => {
        this.setMoveTouch(true)
      })
    }
  },
  methods: {
    ...mapActions({
      loadDetails: 'cocina/loadDetails',
    }),
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
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
    isSelectedIcon(articulo) {
      const findedArticulo = this.articulosSelected.find(
        (art) => art === articulo.Articulo
      )
      return findedArticulo ? 'check-square-fill' : 'square'
    },
    isSelectedFechaIcon(fecha) {
      const findedFecha = this.datesSelected.find((date) => date === fecha)
      return findedFecha ? 'check-square-fill' : 'square'
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
.containerCard {
  padding-bottom: 10px;
  margin-bottom: 5px;
  box-shadow: 2px 2px 2px #e6e6e6;
}
.containerCarDark {
  box-shadow: 2px 2px 2px #5d5d5d;
}

.headerCard {
  text-align: center;
  border-radius: 3px 3px 0px 0px;
  background: #018299;
  color: #fff;
  padding: 5px;
}

.card-name {
  font-weight: bold;
  display: inline-block;
}

.bgEnd {
  background: #03ff2d5d;
  border-radius: 5px;
  padding: 10px;
}

.container-filter {
  display: inline-block;
  margin-bottom: 15px;
}

.extras {
  padding-bottom: 5px;
  background: rgb(1, 149, 168);
  padding: 10px;
  border-radius: 5px 5px 0px 0px;
  color: #fff;
  margin-bottom: 0px;
}

.openFilter {
  border-radius: 5px;
  margin-bottom: 10px;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

#dataFiltros {
  background: rgba(255, 255, 255, 0.616);
}

@media screen and (max-width: 1200px) {
  .containerInp {
    display: block;
  }
}
</style>
