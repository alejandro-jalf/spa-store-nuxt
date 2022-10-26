<template>
  <div>
    <h5 class="text-center py-3">Comparativa mayoristas</h5>
    <b-input-group prepend="Sucursal" class="mb-3 w-100">
      <b-form-select
        :value="sucursalSelected"
        :options="options"
        class="w-150"
      ></b-form-select>
    </b-input-group>
    <div class="middle">
      <b-input-group prepend="Documento" class="w-100">
        <b-form-select
          :value="typeSelected"
          :options="optionsType"
          class="w-10"
          @change="selectedType"
        ></b-form-select>
        <b-form-input
          id="input-document"
          v-model="document"
          :placeholder="placeHolder"
          type="text"
          class="w-50"
          :class="backgroundInputTheme"
        ></b-form-input>
      </b-input-group>
    </div>
    <div class="middle">
      <b-form-file
        v-model="excel"
        :state="Boolean(excel) && isXlsx"
        accept=".xlsx"
        browse-text="Seleccionar"
        placeholder="Seleccione o suelte archivo de cotizacion"
        drop-placeholder="Suelte el archivo aqui"
        @change="changeFile"
      ></b-form-file>
    </div>
    <b-button variant="success" @click="compara">Comparar</b-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import xlsx from 'xlsx'

export default {
  data() {
    return {
      excel: null,
      dataExcel: {},
      typeSelected: 'C',
      sucursalSelected: 'ZR',
      document: '',
      options: [
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'ALL', text: 'Todas' },
      ],
      optionsType: [
        { value: 'C', text: 'Compra' },
        { value: 'W', text: 'Orden de Compra' },
      ],
      placeHolder: 'C0000000000',
    }
  },
  computed: {
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    isXlsx() {
      const nameSplited = this.excel.name.split('.')
      return nameSplited[nameSplited.length - 1] === 'xlsx'
    },
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    selectedType(type) {
      if (type === 'C') this.placeHolder = 'C0000000000'
      else this.placeHolder = '0000000000'
    },
    compara() {
      if (this.excel === null)
        this.showAlertDialog(['Falta seleccionar el excel'])
      else {
        const nameSplited = this.excel.name.split('.')
        if (nameSplited[nameSplited.length - 1] !== 'xlsx')
          this.showAlertDialog(['Debe seleccionar un archivo excel'])
      }
    },
    isValidFormat(arrayTitles) {
      if (arrayTitles.length < 8) {
        this.showAlertDialog([
          'El archivo debe tener 9 columnas con los siguientes titulos: "CodigoBarras", "ArticuloGlobal", "Nombre", "Factor", "Unidad", "PEDIDO", "*", "Proveedor", "Observaciones"',
        ])
        return false
      } else if (arrayTitles[0] !== 'CodigoBarras') {
        this.showAlertDialog([
          `La columna 1 deberia llamarse "CodigoBarras" y tiene el titulo de: ${arrayTitles[0]}`,
        ])
        return false
      } else if (arrayTitles[1] !== 'ArticuloGlobal') {
        this.showAlertDialog([
          `La columna 2 deberia llamarse "ArticuloGlobal" y tiene el titulo de: ${arrayTitles[1]}`,
        ])
        return false
      } else if (arrayTitles[2] !== 'Nombre') {
        this.showAlertDialog([
          `La columna 3 deberia llamarse "Nombre" y tiene el titulo de: ${arrayTitles[2]}`,
        ])
        return false
      } else if (arrayTitles[3] !== 'Factor') {
        this.showAlertDialog([
          `La columna 4 deberia llamarse "Factor" y tiene el titulo de: ${arrayTitles[3]}`,
        ])
        return false
      } else if (arrayTitles[4] !== 'Unidad') {
        this.showAlertDialog([
          `La columna 5 deberia llamarse "Unidad" y tiene el titulo de: ${arrayTitles[4]}`,
        ])
        return false
      } else if (arrayTitles[5] !== 'PEDIDO') {
        this.showAlertDialog([
          `La columna 6 deberia llamarse "PEDIDO" y tiene el titulo de: ${arrayTitles[5]}`,
        ])
        return false
      } else if (arrayTitles[6] !== '*') {
        this.showAlertDialog([
          `La columna 7 deberia llamarse "*" y tiene el titulo de: ${arrayTitles[6]}`,
        ])
        return false
      } else if (arrayTitles[7] !== 'Proveedor') {
        this.showAlertDialog([
          `La columna 8 deberia llamarse "Proveedor" y tiene el titulo de: ${arrayTitles[7]}`,
        ])
        return false
      } else return true
    },
    changeFile(evt) {
      if (!evt) return false
      const selectedFile = evt.target.files[0]
      const nameSplited = selectedFile.name.split('.')
      if (nameSplited[nameSplited.length - 1] !== 'xlsx') {
        this.excel = null
        this.showAlertDialog([
          'Deberia elejir un archivo excel con extension .xlsx',
        ])
      } else {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const data = event.target.result
          const workbook = xlsx.read(data, {
            type: 'binary',
          })
          await workbook.SheetNames.forEach((sheetName) => {
            const xlRowObject = xlsx.utils.sheet_to_row_object_array(
              workbook.Sheets[sheetName]
            )
            try {
              const titles = Object.keys(xlRowObject[0])
              if (this.isValidFormat(titles)) this.dataExcel = xlRowObject
              else this.excel = null
            } catch (error) {
              this.showAlertDialog([
                'El archivo no cumple con el formato: ' + error,
              ])
            }
          })
        }

        reader.onerror = (event) => {
          this.showAlertDialog([
            'Ocurrio un error al cargar el excel: ' + event,
          ])
        }

        reader.readAsBinaryString(selectedFile)
      }
    },
  },
}
</script>

<style scoped>
.middle {
  display: inline-block;
  width: calc(50% - 5px);
}
</style>
