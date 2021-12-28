<template>
  <div>
    <h1 class="text-center mt-2">Valuacion de inventario</h1>
    <b-input-group prepend="Sucursal" class="mt-3 mb-3">
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
      <b-input-group-append>
        <b-button variant="info" @click="validaInventario">Buscar</b-button>
      </b-input-group-append>
    </b-input-group>

    <div class="h5">{{ 'SUCURSAL ' + sucursalData }}</div>

    <div class="mt-2 mb-3">
      <b-button variant="outline-success" @click="createPDF">
        <b-icon icon="download" />
        Descargar PDF
      </b-button>
      <b-button variant="outline-success" @click="createExcel">
        <b-icon icon="download" />
        Descargar EXCEL
      </b-button>
    </div>

    <b-container fluid="xl">
      <b-row cols="1" cols-sm="2">
        <b-col sm="3" md="2" class="mb-2">
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-col>
        <b-col sm="9" md="10" class="mb-2">
          <b-pagination
            v-model="currentPage"
            aria-controls="tableInventarioValuacion"
            :total-rows="rows"
            :per-page="perPage"
            align="fill"
            size="sm"
            first-number
            class="my-0"
            last-number
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-container>

    <b-table
      id="tableInventarioValuacion"
      responsive
      outlined
      hover
      head-variant="dark"
      :per-page="perPage"
      :current-page="currentPage"
      :items="inventarioList"
      :fields="fields"
      :class="variantThemeTableBody"
      foot-clone
    >
      <template #cell(Existencia)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Existencia, 3)) }}
      </template>
      <template #cell(UCosto)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.UCosto)) }}
      </template>
      <template #cell(Valuacion)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Valuacion)) }}
      </template>
      <template #cell(Ieps)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Ieps)) }}
      </template>
      <template #cell(Iva)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.Iva)) }}
      </template>
      <template #cell(ValuacionNeta)="row">
        {{ utils.aplyFormatNumeric(utils.roundTo(row.item.ValuacionNeta)) }}
      </template>
      <template #foot(Articulo)>{{ '' }}</template>
      <template #foot(Nombre)>{{ '' }}</template>
      <template #foot(Existencia)>{{ '' }}</template>
      <template #foot(UCosto)>{{ 'Totales' }}</template>
      <template #foot(Valuacion)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalValuacion))
      }}</template>
      <template #foot(Ieps)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalIeps))
      }}</template>
      <template #foot(Iva)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalIva))
      }}</template>
      <template #foot(ValuacionNeta)>{{
        utils.aplyFormatNumeric(utils.roundTo(totalValuacionNeta))
      }}</template>
      <template #foot(Acciones)>{{ '' }}</template>
    </b-table>

    <h5 class="font-italic">{{ horaConsulta }}</h5>

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
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      fields: [
        'Articulo',
        'Nombre',
        'Existencia',
        'UCosto',
        'Valuacion',
        'Ieps',
        'Iva',
        'ValuacionNeta',
      ],
      totalValuacion: 0,
      totalIeps: 0,
      totalIva: 0,
      totalValuacionNeta: 0,
      perPage: 15,
      currentPage: 3,
      pageOptions: [5, 10, 15, 20, 50, 100],
      selected: null,
      options: [
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPAVICTORIA' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
        { value: 'BO%TRANSITO', text: 'SPABODEGA - TRANSITO' },
        { value: 'BO%ESPERANZA', text: 'SPABODEGA - LA ESPERANZA' },
      ],
    }
  },
  computed: {
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
    sucursalData() {
      if (this.$store.state.valuacioninventario.sucursalData === 'ZR')
        return 'SPAZARAGOZA'
      else if (this.$store.state.valuacioninventario.sucursalData === 'VC')
        return 'SPAVICTORIA'
      else if (this.$store.state.valuacioninventario.sucursalData === 'OU')
        return 'SPAOLUTA'
      else if (this.$store.state.valuacioninventario.sucursalData === 'JL')
        return 'SPAJALTIPAN'
      else if (this.$store.state.valuacioninventario.sucursalData === 'BO')
        return 'SPABODEGA'
      else if (
        this.$store.state.valuacioninventario.sucursalData === 'BO%TRANSITO'
      )
        return 'SPABODEGA - TRANSITO'
      else if (
        this.$store.state.valuacioninventario.sucursalData === 'BO%ESPERANZA'
      )
        return 'SPABODEGA - LA ESPERANZA'
      return 'SPAZARAGOZA'
    },
    inventarioList() {
      const datos = []
      const lengthDatos = this.$store.state.valuacioninventario.data.data.length
      let totalValuacion = 0
      let totalIeps = 0
      let totalIva = 0
      let totalValuacionNeta = 0
      this.$store.state.valuacioninventario.data.data.forEach(
        (validacion, index) => {
          const data = { ...validacion }

          totalValuacion += data.Valuacion
          totalIeps += data.IepsValuacion
          totalIva += data.IvaValuacion
          totalValuacionNeta += data.ValuacionNeta

          data.UCosto = data.UltimoCosto
          data.Ieps = data.IepsValuacion
          data.Iva = data.IvaValuacion
          if (index === lengthDatos - 1) {
            this.totalValuacion = totalValuacion
            this.totalIeps = totalIeps
            this.totalIva = totalIva
            this.totalValuacionNeta = totalValuacionNeta
          }
          datos.push(data)
        }
      )
      return datos
    },
    rows() {
      return this.$store.state.valuacioninventario.data.data.length
    },
    horaConsulta() {
      return this.$store.state.valuacioninventario.horaConsulta
    },
    suc() {
      return this.$store.state.valuacioninventario.sucursal
    },
  },
  mounted() {
    this.selected = this.$store.state.valuacioninventario.sucursal
    this.loadDataImage()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setMoveTouch: 'general/setMoveTouch',
      showAlertDialog: 'general/showAlertDialog',
      setHoraConsulta: 'valuacioninventario/setHoraConsulta',
      setSucursalData: 'valuacioninventario/setSucursalData',
      setSucursal: 'valuacioninventario/setSucursal',
      setAlmacen: 'valuacioninventario/setAlmacen',
      setTienda: 'valuacioninventario/setTienda',
    }),
    ...mapActions({
      changeData: 'valuacioninventario/changeData',
    }),
    loadDataImage() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const imageObject = document.getElementById('imgLogoSpa')
      const object2 = new Image()
      object2.src = imageObject.src
      context.drawImage(object2, 0, 0, 100, 100)
    },
    createPDF() {
      const logo = document.getElementById('canvas')
      const listInventory = [...this.inventarioList]
      listInventory.push({
        footer: true,
        Articulo: '',
        Nombre: '',
        Existencia: '',
        UCosto: 'Totales',
        Valuacion: this.totalValuacion,
        Ieps: this.totalIeps,
        Iva: this.totalIva,
        ValuacionNeta: this.totalValuacionNeta,
      })
      utils.createPdfValuacionInventarioCierre(
        'SUPER PROMOCIONES DE ACAYUCAN SA DE CV',
        'ZARAGOZA No 109 COL. CENTRO CP 96000',
        'ACAYUCAN, VERACRUZ.',
        'SUCURSAL ' + this.sucursalData,
        listInventory,
        this.horaConsulta,
        logo
      )
    },
    selectSucursal(sucursal) {
      if (sucursal === null) return false
      const sucArray = sucursal.split('%')
      this.setSucursal(sucursal)
      if (sucArray.length > 1) {
        this.selected = sucArray[0]
        if (sucArray[1] === 'TRANSITO') {
          this.setTienda(6)
          this.setAlmacen(15)
        } else {
          this.setTienda(6)
          this.setAlmacen(1)
        }
      } else if (sucursal === 'BO') {
        this.selected = sucursal
        this.setTienda(6)
        this.setAlmacen(21)
      } else if (sucursal === 'ZR') {
        this.selected = sucursal
        this.setTienda(1)
        this.setAlmacen(2)
      } else if (sucursal === 'VC') {
        this.selected = sucursal
        this.setTienda(2)
        this.setAlmacen(3)
      } else if (sucursal === 'OU') {
        this.selected = sucursal
        this.setTienda(5)
        this.setAlmacen(19)
      } else if (sucursal === 'JL') {
        this.selected = sucursal
        this.setTienda(4)
        this.setAlmacen(7)
      }
    },
    async validaInventario() {
      if (this.selected === null)
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else {
        this.setLoading(true)
        const sucursal = this.$store.state.valuacioninventario.sucursal
        const response = await this.changeData([
          sucursal.split('%')[0],
          this.$store.state.valuacioninventario.tienda,
          this.$store.state.valuacioninventario.almacen,
        ])
        this.setLoading(false)
        if (!response.success)
          this.showAlertDialog([response.message, 'Error inesperado'])
        else {
          this.setSucursalData(sucursal)
          this.setHoraConsulta(
            utils.getDateNow().format('DD/MM/YYYY hh:mm:ss a')
          )
        }
      }
    },

    createExcel() {
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Valuacion Inventario Cierre - ' + this.sucursalData,
        Subject: 'Cierre',
        Author: this.$store.state.user.name,
      }
      wb.SheetNames.push('Hoja')

      const header = [
        'Articulo',
        'Nombre',
        'Existencia',
        'UCosto',
        'Valuacion',
        'Ieps',
        'Iva',
        'ValuacionNeta',
      ]

      const listInventory = [...this.inventarioList]
      const listRefactor = []

      listRefactor.push(
        {
          Nombre: 'SUPER PROMOCIONES DE ACAYUCAN SA DE CV',
        },
        {
          Existencia: 'ZARAGOZA #109. CP 96000',
        },
        {
          Nombre: 'SUC ' + this.sucursalData,
        },
        {
          Existencia: 'ACAYUCAN, VERACRUZ.',
        },
        {
          Nombre: 'INVENTARIO AL ' + this.horaConsulta,
        },
        {},
        {},
        {
          Articulo: 'Articulo',
          Nombre: 'Nombre',
          Existencia: 'Existencia',
          UCosto: 'Ultimo Costo',
          Valuacion: 'Valuacion',
          Ieps: 'Ieps',
          Iva: 'Iva',
          ValuacionNeta: 'Valuacion Neta',
        }
      )

      listInventory.forEach((invetory) => {
        listRefactor.push({
          Articulo: invetory.Articulo,
          Nombre: invetory.Nombre,
          Existencia: invetory.Existencia,
          UCosto: invetory.UltimoCosto,
          Valuacion: invetory.Valuacion,
          Ieps: invetory.IepsValuacion,
          Iva: invetory.IvaValuacion,
          ValuacionNeta: invetory.ValuacionNeta,
        })
      })

      listRefactor.push({
        Articulo: '',
        Nombre: '',
        Existencia: '',
        UCosto: 'Totales',
        Valuacion: this.totalValuacion,
        Ieps: this.totalIeps,
        Iva: this.totalIva,
        ValuacionNeta: this.totalValuacionNeta,
      })

      const data = XLSX.utils.json_to_sheet(listRefactor, {
        header,
        skipHeader: true,
        origin: 'A2',
      })

      wb.Sheets.Hoja = data
      wb.Sheets.Hoja['!cols'] = [
        { wpx: 70 },
        { wpx: 250 },
        { wpx: 70 },
        { wpx: 80 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 90 },
      ]

      const num = 3
      if (num !== 2) {
        const horaImpresion = this.horaConsulta
        const fecha = horaImpresion.split(' ')
        const fechaSplit = fecha[0].split('/')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

        FileSaver.saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
          fechaSplit[2] +
            ' ' +
            fechaSplit[1] +
            '' +
            fechaSplit[0] +
            ' - Valuacion Inventario - ' +
            this.sucursalData +
            '.xlsx'
        )
      }
    },

    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      // eslint-disable-next-line prettier/prettier
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
      return buf
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
</style>
