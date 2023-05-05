<template>
  <div>
    <div class="h2 my-3">Folios de facturas</div>
    <b-input-group
      v-if="dataUser.tipo_user === 'manager'"
      prepend="Suc"
      class="mb-3 w-100"
    >
      <b-form-select
        :value="suc"
        :options="options"
        class="w-150"
        @change="selectSucursal"
      ></b-form-select>
      <template #append>
        <b-form-input
          id="input-promedio"
          v-model="promedio"
          :value="promMensual"
          placeholder="Promedio"
          type="number"
          size="sm"
          min="1"
          class="h-100"
          :class="backgroundInputTheme"
          @keydown="verifyData"
          @change="savePromedio"
          @keyup.enter="calculateFolioBySuc"
        ></b-form-input>
        <b-button variant="success" @click="calculateFolioBySuc">
          Calcular
        </b-button>
      </template>
    </b-input-group>

    <b-card
      class="containerCard p-0 pb-4 mt-5"
      :class="variantTheme"
      :title="'Sucursal: ' + folio.Serie.replace('E', '')"
      header-class="p-0 pt-3 pl-3 pr-2"
      header-bg-variant="info"
      header-border-variant="light"
    >
      <template #header>
        <b-button
          ref="btnE"
          squared
          :variant="variantTabEgreso"
          @click="changeType('E')"
        >
          Egresos
        </b-button>
        <b-button
          ref="btnD"
          squared
          :variant="variantTabDegreso"
          @click="changeType('D')"
        >
          Degresos
        </b-button>
      </template>
      <div class="mt-3">
        <span class="font-weight-bold">Serie:</span>
        {{ folio.Serie }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Tienda:</span>
        {{ folio.Tienda }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Sucursal:</span>
        {{ folio.Serie.replace('E', '') }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Inicial:</span>
        {{ folio.FolioInicial }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Final:</span>
        {{ utils.aplyFormatNumeric(folio.FolioFinal) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Actual:</span>
        {{ utils.aplyFormatNumeric(folio.FolioActual) }}
        <Divider />
      </div>
      <div class="mt-3" :class="colorStatusDisponibles">
        <span class="font-weight-bold">Folios Disponibles:</span>
        {{ utils.aplyFormatNumeric(folio.FolioDisponible) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Incremento Sugerido:</span>
        {{ utils.aplyFormatNumeric(folio.INCREMENTODEFOLIO) }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Folio Final Sugerido:</span>
        {{ utils.aplyFormatNumeric(folio.FOLIOFINC) }}
        <Divider />
      </div>
      <div class="mt-3">
        <b-card-text class="font-weight-bold mb-1 mt-5">
          Incremento de Folios
        </b-card-text>
        <divider class="mb-2 bg-info"></divider>
        <b-form inline class="mt-2 mb-2">
          <b-form-group label="Final" class="input-form-folio">
            <b-form-input
              id="input-final"
              v-model="formFolio.final"
              placeholder="Final"
              class="w-100"
              desc
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Actual" class="input-form-folio">
            <b-form-input
              id="input-actual"
              v-model="formFolio.actual"
              placeholder="Actual"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Disponibles" class="input-form-folio">
            <b-form-input
              id="input-disponible"
              v-model="formFolio.disponible"
              placeholder="Disponibles"
              class="w-100"
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Incremento" class="input-form-folio">
            <b-form-input
              id="input-incremento"
              ref="incremento"
              v-model="formFolio.incremento"
              placeholder="Incremento"
              class="w-100"
              type="number"
              min="1"
              :class="backgroundInputTheme"
              @keydown="verifyData"
              @keyup="calculaFolioFinal"
              @keyup.enter="actualizaFolio"
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Final Nuevo" class="input-form-folio">
            <b-form-input
              id="input-nuevo-final"
              v-model="formFolio.nuevoFinal"
              placeholder="Final Nuevo"
              class="w-100"
              :state="statusFinalNew"
              readonly
            ></b-form-input>
          </b-form-group>
        </b-form>
        <b-button
          :block="width < 767"
          variant="primary"
          class="mb-2"
          @click="actualizaFolio"
        >
          <b-icon icon="arrow-up-right-circle-fill" />
          Incrementar Folios
        </b-button>
      </div>
      <div class="dateConsult">Consultado el {{ dateConsult }}</div>
    </b-card>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import utils from '../modules/utils'
import Divider from '../components/Divider'

export default {
  components: {
    Divider,
  },
  data() {
    return {
      utils,
      options: [],
      promedio: 0,
      formFolio: {
        final: 0,
        actual: 0,
        disponible: 0,
        incremento: 0,
        nuevoFinal: 0,
      },
      type: 'E',
      statusFinalNew: false,
    }
  },
  computed: {
    dataUser() {
      return this.$store.state.user.user
    },
    folio() {
      const lengthArray = this.$store.state.folios.folio.data.length
      const position = lengthArray > 1 && this.type === 'D' ? 1 : 0
      return this.$store.state.folios.folio.data[position]
    },
    suc() {
      return this.$store.state.folios.sucursal
    },
    promMensual() {
      return this.$store.state.folios.promMensual
    },
    dateConsult() {
      return this.$store.state.folios.dateConsult
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    variantTabEgreso() {
      return this.type === 'E' ? 'light' : 'info'
    },
    variantTabDegreso() {
      return this.type === 'D' ? 'light' : 'info'
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    backgroundInputTheme() {
      return this.$store.state.general.themesComponents.themeInputBackground
    },
    colorStatusDisponibles() {
      const disponibles = this.folio.FolioDisponible
      return disponibles < 30
        ? 'color-danger'
        : disponibles < 60
        ? 'color-warning'
        : 'color-success'
    },
  },
  mounted() {
    const prom = this.promMensual
    this.promedio = prom
    this.setDataForCompany()
    this.setDataForm()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'folios/setSucursal',
      setPromedioMensual: 'folios/setPromedioMensual',
      setDataFolio: 'folios/setDataFolio',
      setDateConsult: 'folios/setDateConsult',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    ...mapActions({
      updateDataFolio: 'folios/updateDataFolio',
    }),
    changeType(type = 'E') {
      if (type === 'E') this.$refs.btnE.blur()
      else this.$refs.btnD.blur()
      this.type = type
      this.setDataForm()
    },
    async calculateFolioBySuc() {
      if (this.suc === null)
        this.showAlertDialog(['No ha seleccionado una sucursal'])
      else if (this.promedio <= 0)
        this.showAlertDialog(['El promedio no puede ser menor que 1'])
      else if (this.promedio.trim() === '')
        this.showAlertDialog(['El promedio no puede quedar vacio'])
      else {
        this.setLoading(true)
        const response = await this.updateDataFolio([this.suc, this.promedio])
        this.setLoading(false)
        if (!response.success) this.showAlertDialog([response.message])
        else {
          this.setDataForm()
          this.setDateConsult(utils.getDateNow().format('DD/MM/YYYY'))
        }
      }
    },
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    setDataForm() {
      const folioFinalOld = this.folio.FolioFinal
      const folioActual = this.folio.FolioActual
      const disponibles = this.folio.FolioDisponible
      const incremento = this.folio.INCREMENTODEFOLIO
      const finalNew = this.folio.FOLIOFINC

      this.formFolio.final = folioFinalOld
      this.formFolio.actual = folioActual
      this.formFolio.disponible = disponibles
      this.formFolio.incremento = incremento
      this.formFolio.nuevoFinal = finalNew

      if (finalNew <= folioFinalOld) this.statusFinalNew = false
      else this.statusFinalNew = true
    },
    setDataForCompany() {
      const sucSplited = this.dataUser.sucursal_user.split(' ')
      this.company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'CAASA' : 'SPA'
      if (this.company === 'SPA') {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'ZR', text: 'Zaragoza' },
          { value: 'VC', text: 'Victoria' },
          { value: 'ER', text: 'Enriquez' },
          { value: 'OU', text: 'Oluta' },
          { value: 'SY', text: 'Sayula' },
          { value: 'JL', text: 'Jaltipan' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
          { value: 'RE', text: 'Reparto' },
          { value: 'EN', text: 'Enriquez' },
          { value: 'SA', text: 'Sayula' },
          { value: 'SB', text: 'Sayula Bodega' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
    verifyData(evt) {
      if (
        evt.keyCode !== 13 &&
        evt.keyCode !== 8 &&
        evt.keyCode !== 37 &&
        evt.keyCode !== 38 &&
        evt.keyCode !== 39 &&
        evt.keyCode !== 40
      ) {
        if (isNaN(parseInt(evt.key))) evt.preventDefault()
      }
    },
    savePromedio(dato) {
      this.setPromedioMensual(dato)
    },
    calculaFolioFinal() {
      const folioFinalOld = this.folio.FolioFinal
      const finalNuevo =
        parseInt(folioFinalOld) + parseInt(this.formFolio.incremento)
      this.formFolio.nuevoFinal = finalNuevo
      if (isNaN(finalNuevo)) this.statusFinalNew = false
      else if (finalNuevo <= folioFinalOld) this.statusFinalNew = false
      else this.statusFinalNew = true
    },
    async actualizaFolio() {
      let sucursal = this.folio.Serie
      const newFolio = this.formFolio.nuevoFinal
      if (!this.statusFinalNew)
        this.showAlertDialog([
          'Verifique que el incremento sea un numero mayor a 1',
        ])
      else if (sucursal === null || sucursal === 'null')
        this.showAlertDialog(['Falta seleccionar sucursal'])
      else if (this.dateConsult !== utils.getDateNow().format('DD/MM/YYYY'))
        this.showAlertDialog([
          'La fecha de consulta no es actual, se recomienda volver a consultar folios y posteriormente enviar el incremento de folios',
          'Datos antiguos',
        ])
      else {
        try {
          sucursal = sucursal === 'ERE' ? 'ER' : sucursal
          this.setLoading(true)
          sucursal = sucursal === 'ER' ? sucursal : sucursal.replace('E', '')
          const url =
            process.env.spastore_url_backend +
            `api/v1/general/folios/${sucursal}/${this.folio.Serie}?newFolio=${newFolio}`
          const response = await this.$axios({
            url,
            method: 'put',
          })

          if (response.data.success) {
            this.showAlertDialog(['Folio actualizados', 'Exito', 'success'])
            const result = await this.updateDataFolio([sucursal, this.promedio])
            this.setDataForm()
            if (!result.data.success)
              this.showAlertDialog([result.data.message])
          } else this.showAlertDialog([response.data.message])

          this.setLoading(false)
        } catch (error) {
          this.setLoading(false)
          if (error.response)
            this.showAlertDialog([error.response.data.message])
          else this.showAlertDialog(['Error con el servidor'])
        }
      }
    },
  },
}
</script>

<style scoped>
.input-form-folio {
  width: calc(20% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.color-danger {
  background: rgb(255, 216, 216);
  color: #000;
}

.color-success {
  background: rgb(167, 255, 156);
  color: #000;
}

.color-warning {
  background: rgb(255, 248, 156);
  color: #000;
}

.dateConsult {
  position: absolute;
  right: 15px;
  bottom: 10px;
  font-style: italic;
}

@media screen and (max-width: 767px) {
  .input-form-folio {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
