<template>
  <div>
    <h3 class="text-center my-2">Consolidaciones de articulos</h3>
    <div class="containerInp">
      <b-input-group prepend="Del">
        <b-form-datepicker
          id="dateStart"
          v-model="dateStar"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de inicio"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="containerInp">
      <b-input-group prepend="Al">
        <b-form-datepicker
          id="dateEnd"
          v-model="dateEnd"
          today-button
          label-no-date-selected="Fecha no seleccionada"
          label-calendar="Calendario"
          label-current-month="Mes Actual"
          label-next-month="Mes Siguiente"
          label-prev-month="Mes Anterior"
          label-next-year="Año Siguiente"
          label-prev-year="Año anterior"
          label-help="Seleccione la fecha de Termino"
          label-today-button="Hoy"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-button
      variant="success"
      :block="width < 1000"
      :class="{ 'mt-2': width < 1000 }"
      @click="updateConsolidaciones"
    >
      <b-icon icon="ui-checks-grid"></b-icon>
      Verificar
    </b-button>

    <b-button-group size="md mt-4">
      <b-button
        :pressed="!showDetails"
        variant="outline-info"
        @click="setShowDetails(false)"
      >
        Lista De Consolidaciones
      </b-button>
      <b-button
        :pressed="showDetails"
        variant="outline-info"
        @click="setShowDetails(true)"
      >
        Detalles de consolidacion
      </b-button>
    </b-button-group>
    <div class="line-buttons bg-info"></div>

    <div v-if="!showDetails">
      <b-alert variant="info" :show="isEmptyConsolidaciones">
        Lista de consolidaciones esta vacia
      </b-alert>
      <b-button
        v-if="!isEmptyConsolidaciones"
        :variant="variantClean"
        :block="width < 528"
        class="my-2"
        @click="setData({ data: [], resumen: [] })"
      >
        <b-icon icon="arrow-left-right" />
        Limpiar lista de consolidaciones
      </b-button>
      <b-table
        v-if="width > 991"
        id="tableConsolidaciones"
        responsive
        striped
        hover
        :fields="fields"
        :items="dataRefactor"
        head-variant="dark"
        class="mt-3"
        :class="variantThemeTableBody"
      >
        <template #cell(Acciones)="row">
          <b-button
            variant="info"
            size="sm"
            @click="viewDetails(row.item.Articulo)"
          >
            Detalles
          </b-button>
        </template>
        <template #cell(ZR)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.ZR)"
            :icon="getIconFinded(row.item.ZR)"
            :variant="getVariantFinded(row.item.ZR)"
          />
        </template>
        <template #cell(VC)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.VC)"
            :icon="getIconFinded(row.item.VC)"
            :variant="getVariantFinded(row.item.VC)"
          />
        </template>
        <template #cell(ER)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.ER)"
            :icon="getIconFinded(row.item.ER)"
            :variant="getVariantFinded(row.item.ER)"
          />
        </template>
        <template #cell(OU)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.OU)"
            :icon="getIconFinded(row.item.OU)"
            :variant="getVariantFinded(row.item.OU)"
          />
        </template>
        <template #cell(SY)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.SY)"
            :icon="getIconFinded(row.item.SY)"
            :variant="getVariantFinded(row.item.SY)"
          />
        </template>
        <template #cell(JL)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.JL)"
            :icon="getIconFinded(row.item.JL)"
            :variant="getVariantFinded(row.item.JL)"
          />
        </template>
        <template #cell(BO)="row">
          <b-icon
            v-b-tooltip.hover
            scale="1.5"
            :title="getMessageFinded(row.item.BO)"
            :icon="getIconFinded(row.item.BO)"
            :variant="getVariantFinded(row.item.BO)"
          />
        </template>
      </b-table>
      <div v-else>
        <b-card
          v-for="(consolidacion, indexConsolidacion) in dataRefactor"
          :key="indexConsolidacion"
          no-body
          class="containerCard"
          :class="variantTheme"
        >
          <div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Articulo:</span>
              {{ consolidacion.Articulo }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Codigo de Barras:</span>
              {{ consolidacion.CodigoBarras }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Nombre:</span>
              {{ consolidacion.Nombre }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Relacion:</span>
              {{ consolidacion.Relacion }}
            </div>
            <div class="container-transferencia">
              <span class="font-weight-bold">Sucursales:</span>
              {{ consolidacion.Observaciones }}
            </div>
            <div class="container-sucs">
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.ZR)"
              >
                ZR
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.ZR)"
                  :icon="getIconFinded(consolidacion.ZR)"
                  :variant="getVariantFinded(consolidacion.ZR)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.VC)"
              >
                VC
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.VC)"
                  :icon="getIconFinded(consolidacion.VC)"
                  :variant="getVariantFinded(consolidacion.VC)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.ER)"
              >
                ER
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.ER)"
                  :icon="getIconFinded(consolidacion.ER)"
                  :variant="getVariantFinded(consolidacion.ER)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.OU)"
              >
                OU
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.OU)"
                  :icon="getIconFinded(consolidacion.OU)"
                  :variant="getVariantFinded(consolidacion.OU)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.SY)"
              >
                SY
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.SY)"
                  :icon="getIconFinded(consolidacion.SY)"
                  :variant="getVariantFinded(consolidacion.SY)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.JL)"
              >
                JL
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.JL)"
                  :icon="getIconFinded(consolidacion.JL)"
                  :variant="getVariantFinded(consolidacion.JL)"
                />
              </div>
              <div
                class="container-suc"
                :class="getColorClass(consolidacion.BO)"
              >
                BO
                <b-icon
                  v-b-tooltip.hover
                  class="mx-1"
                  scale="1.5"
                  :title="getMessageFinded(consolidacion.BO)"
                  :icon="getIconFinded(consolidacion.BO)"
                  :variant="getVariantFinded(consolidacion.BO)"
                />
              </div>
            </div>
            <b-button
              block
              variant="info"
              size="sm"
              @click="viewDetails(consolidacion.Articulo)"
            >
              Detalles
            </b-button>
          </div>
        </b-card>
      </div>
    </div>
    <Details v-else />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Details from '../components/ConsolidacionesArticlesDetails'
import utils from '../modules/utils'

export default {
  components: {
    Details,
  },
  data() {
    return {
      dateStar: '',
      dateEnd: '',
      fields: [
        'Articulo',
        'CodigoBarras',
        'Nombre',
        'Relacion',
        'ZR',
        'VC',
        'ER',
        'OU',
        'SY',
        'JL',
        'BO',
        'Acciones',
      ],
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    showDetails() {
      return this.$store.state.consolidacionesarticulos.showDetails
    },
    isEmptyConsolidaciones() {
      return (
        this.$store.state.consolidacionesarticulos.data.resumen.length === 0
      )
    },
    dataRefactor() {
      const datos = []
      const responsesFailed = []

      this.$store.state.consolidacionesarticulos.data.data.forEach(
        (response) => {
          if (!response.success) responsesFailed.push(response)
        }
      )

      this.$store.state.consolidacionesarticulos.data.resumen.forEach(
        (consolidacion) => {
          const data = { ...consolidacion }
          data._cellVariants = {}
          data.ZR = data.Sucursales.ZR
          data.VC = data.Sucursales.VC
          data.ER = data.Sucursales.ER
          data.OU = data.Sucursales.OU
          data.SY = data.Sucursales.SY
          data.JL = data.Sucursales.ZR
          data.BO = data.Sucursales.BO
          responsesFailed.forEach((response) => {
            data._cellVariants[`${response.sucursalSiglas}`] = 'danger'
            data[`${response.sucursalSiglas}`] = 'Sin Conexion'
          })
          datos.push(data)
        }
      )
      return datos
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
  },
  mounted() {
    this.dateStar = utils.getDateNow().format('yyyy-MM-DD')
    this.dateEnd = utils.getDateNow().format('yyyy-MM-DD')
  },
  methods: {
    ...mapMutations({
      setMoveTouch: 'general/setMoveTouch',
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'consolidacionesarticulos/setSucursal',
      setShowDetails: 'consolidacionesarticulos/setShowDetails',
      setData: 'consolidacionesarticulos/setData',
      setDetails: 'consolidacionesarticulos/setDetails',
    }),
    ...mapActions({
      changeData: 'consolidacionesarticulos/changeData',
    }),
    getIconFinded(value) {
      return value === 'Encontrado'
        ? 'check-circle-fill'
        : value === 'Sin Conexion'
        ? 'x-circle-fill'
        : 'exclamation-circle-fill'
    },
    getMessageFinded(value) {
      return value === 'Encontrado'
        ? 'Articulo enviado'
        : value === 'Sin Conexion'
        ? 'Fallo la conexion'
        : 'No encontrado en Sucursal'
    },
    getVariantFinded(value) {
      return value === 'Encontrado' ? 'success' : 'danger'
    },
    getColorClass(value) {
      return value === 'Sin Conexion' ? 'bg-danger' : 'bg-light'
    },
    async updateConsolidaciones() {
      this.setLoading(true)
      const response = await this.changeData([
        this.dateStar.replace(/-/g, ''),
        this.dateEnd.replace(/-/g, ''),
      ])
      this.setLoading(false)
      if (!response.success)
        this.showAlertDialog([response.message, 'Error inesperado'])
      else this.setShowDetails(false)
    },
    viewDetails(article) {
      const responses = []
      this.$store.state.consolidacionesarticulos.data.data.forEach(
        (response) => {
          responses.push({ ...response })
        }
      )

      const dataDetails = responses.map((response) => {
        const articleFinded = response.data.find(
          (art) => art.Articulo === article
        )
        response.Article = articleFinded || {
          Articulo: response.success
            ? 'Articulo no Encontrado'
            : 'Sin Conexion',
          CodigoBarras: '',
          Nombre: '',
          Relacion: '',
          IVACompra: 0,
          IVAVenta: 0,
          IEPSCompra: 0,
          IEPSVenta: 0,
          c_ClaveProdServ: '',
          FechaAlta: '01/01/2000',
          HoraAlta: '12:00:00:000',
        }
        delete response.data
        return response
      })
      this.setDetails({ data: dataDetails })
      this.setShowDetails(true)
    },
  },
}
</script>

<style scoped>
.line-buttons {
  margin-bottom: 20px;
  width: calc(100% - 5px);
  margin-left: 5px;
  height: 1px;
  margin-top: -1px;
}

.containerInp {
  display: inline-block;
  margin-top: 7px;
}

.container-info-danger {
  padding: 10px;
  background: rgba(173, 1, 1, 0.712);
  border-radius: 3px;
  color: #fff;
}

.container-info-warning {
  padding: 10px;
  background: rgba(251, 255, 29, 0.596);
  border-radius: 3px;
  color: #000;
}

.container-info {
  padding: 10px;
  border-radius: 3px;
}

.container-sucs {
  display: block;
  border: 1px solid rgb(0, 142, 152);
  border-radius: 5px;
  padding: 3px;
  margin: 4px 0px;
  text-align: center;
}

.container-suc {
  display: inline-block;
  border: 1px solid rgb(0, 64, 69);
  border-radius: 5px;
  padding: 3px;
  color: #000;
  font-weight: bold;
}

@media screen and (max-width: 1000px) {
  .containerInp {
    display: block;
  }
}
</style>
