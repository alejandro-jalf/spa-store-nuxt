<template>
  <div>
    <b-alert variant="info" :show="isEmptyDetails">
      No hay detalles que mostrar
    </b-alert>
    <div v-if="!isEmptyDetails" class="mb-5">
      <div class="mb-3 mt-3">
        <b-button
          :variant="variantClean"
          :block="width < 528"
          class="mt-2"
          @click="setDetails({ data: [] })"
        >
          <b-icon icon="arrow-left-right" />
          Limpiar detalles
        </b-button>
        <Colors
          class="space-colors"
          :show-warning="true"
          :show-danger="true"
          :show-info="true"
          :show-dark="true"
          title-warning="No encontrado"
          title-danger="Sin Conexion"
          title-info="Encontrado"
          title-dark="Encontrado"
          content-message-warning="Esto sucede cuando el articulo No existe en dicha sucursal, ya bien sea por la fecha de cracion, o por que no esta dado de alta ahi. <br/> Si quiere ocuparlo en la sucursal, le sugerimos que avise al departamento de sistemas para que se de de alta en la sucursal"
          content-message-danger="Esto sucede cuando no hay conexion con la sucursal, ya bien sea por falta de internet o por conexion inactiva (caida). <br/> Se recomienda que se reporte con el departamento de sistemas"
          content-message-dark="Se encontro el articulo en la sucursal"
          content-message-info="Se encontro el articulo en la sucursal"
        />
      </div>

      <b-card
        v-for="(sucursal, indexSuc) in details"
        :key="indexSuc"
        :header-bg-variant="
          colorHeader(sucursal.success, sucursal.Article.Articulo)
        "
        header-text-variant="white"
        class="p-0 m-0"
        :border-variant="borderTheme()"
        no-body
      >
        <template #header>
          <b-button
            v-b-toggle="'collapse-' + sucursal.sucursal"
            variant="link"
            class="btn-block text-right text-white dropdown-toggle"
          >
            {{ sucursal.sucursal }}
          </b-button>
        </template>

        <b-collapse :id="'collapse-' + sucursal.sucursal">
          <b-card-body :class="variantBodyCard">
            <div class="row">
              <div class="col-sm">
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Sucursal:</span>
                  {{ sucursal.sucursalSiglas }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Estado de la conexion:</span>
                  {{ sucursal.status }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Articulo:</span>
                  {{ sucursal.Article.Articulo }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Codigo de Barras:</span>
                  {{ sucursal.Article.CodigoBarras }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Nombre:</span>
                  {{ sucursal.Article.Nombre }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Relacion:</span>
                  {{ sucursal.Article.Relacion }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">IVACompra:</span>
                  {{ utils.roundTo(sucursal.Article.IVACompra, 2) }}
                </div>
                <div class="divider-h"></div>
              </div>
              <div class="col-sm">
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">IVAVenta:</span>
                  {{ utils.roundTo(sucursal.Article.IVAVenta, 2) }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">IEPSCompra:</span>
                  {{ sucursal.Article.IEPSCompra }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">IEPSVenta:</span>
                  {{ sucursal.Article.IEPSVenta }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">Clave SAT:</span>
                  {{ sucursal.Article.c_ClaveProdServ }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">FechaAlta:</span>
                  {{ sucursal.Article.FechaAlta }}
                </div>
                <div class="divider-h"></div>
                <div class="form-group mt-1 mb-0">
                  <span class="font-weight-bold">HoraAlta:</span>
                  {{ sucursal.Article.HoraAlta }}
                </div>
                <div class="divider-h"></div>
              </div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'
import Colors from '../components/Colors'

export default {
  components: {
    Colors,
  },
  data() {
    return {
      utils,
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantBodyCard() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    isEmptyDetails() {
      return (
        this.$store.state.consolidacionesarticulos.details.data.length === 0
      )
    },
    details() {
      const listArticles = []
      this.$store.state.consolidacionesarticulos.details.data.forEach(
        (article) => {
          listArticles.push(article)
        }
      )

      return listArticles
    },
  },
  methods: {
    ...mapMutations({
      setDetails: 'consolidacionesarticulos/setDetails',
    }),
    borderTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'secondary'
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'secondary'
      return 'light'
    },
    colorHeader(success, articulo) {
      if (!success) return 'danger'
      if (articulo === 'Articulo no Encontrado') return 'warning'
      else if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'dark'
        return 'info'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      return 'info'
    },
  },
}
</script>

<style scoped>
.divider-h {
  width: 100%;
  height: 1px;
  background: #c3c3c3;
}

@media screen and (max-width: 767px) {
  .space-colors {
    margin-top: 20px;
  }
}
</style>
