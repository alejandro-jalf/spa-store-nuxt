<template>
  <div class="pb-5">
    <div class="form-group m-2">
      <span class="font-weight-bold">Articulo:</span>{{ details.Articulo }}
    </div>
    <div class="form-group m-2">
      <span class="font-weight-bold">Nombre:</span>{{ details.Nombre }}
    </div>
    <div class="form-group m-2">
      <span class="font-weight-bold">Relacion:</span>{{ details.Relacion }}
    </div>
    <div class="form-group m-2">
      <span class="font-weight-bold">Existencia actual UC:</span>
      {{ utils.roundTo(details.ExistActualUC) }}
    </div>
    <div class="form-group m-2">
      <span class="font-weight-bold">Stock30 UC:</span>
      {{ utils.roundTo(details.Stock30UC) }}
    </div>
    <div class="form-group m-2">
      <span class="font-weight-bold">Costo Existencia Actual:</span>
      {{ utils.aplyFormatNumeric(utils.roundTo(details.CostoExistActual, 3)) }}
    </div>

    <b-card
      v-for="(sucursal, indexSuc) in details.existencias"
      :key="indexSuc"
      :header-bg-variant="colorHeader(sucursal.status, sucursal.Articulo)"
      header-text-variant="white"
      header="Sucursal Zaragoza"
      class="p-0 m-0"
      :border-variant="borderTheme()"
      no-body
    >
      <template #header>
        <b-button
          v-b-toggle="
            'collapse-' + refactorNameSuc(sucursal.sucursal, sucursal.conexion)
          "
          variant="link"
          class="btn-block text-right text-white dropdown-toggle"
        >
          {{ refactorNameSuc(sucursal.sucursal, sucursal.conexion) }}
        </b-button>
      </template>

      <b-collapse
        :id="
          'collapse-' + refactorNameSuc(sucursal.sucursal, sucursal.conexion)
        "
      >
        <b-card-body :class="variantBodyCard">
          <div class="row">
            <div class="col-sm">
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Estado de la conexion:</span>
                {{ sucursal.status }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Almacen:</span>
                {{ sucursal.Almacen }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Tienda:</span>
                {{ sucursal.Tienda }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Articulo:</span>
                {{ sucursal.Articulo }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Codigo de Barras:</span>
                {{ sucursal.CodigoBarras }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Nombre:</span>
                {{ sucursal.Nombre }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Relacion:</span>
                {{ sucursal.Relacion }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Existencia UV:</span>
                {{ utils.roundTo(sucursal.ExistUV, 2) }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Existencia UC:</span>
                {{ utils.roundTo(sucursal.ExistUC, 2) }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Costo Neto:</span>
                {{ sucursal.CostoNet }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Costo Neto UC:</span>
                {{ sucursal.CostoNetUC }}
              </div>
              <div class="divider-h"></div>
            </div>
            <div class="col-sm">
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Costo Existencia:</span>
                {{
                  utils.aplyFormatNumeric(utils.roundTo(sucursal.CostoExist, 3))
                }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Precio UNO:</span>
                {{
                  utils.aplyFormatNumeric(
                    utils.roundTo(sucursal.PrecioUNO, 2, true)
                  )
                }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Utilidad UNO:</span>
                {{ parseToPorcent(utils.roundTo(sucursal.UtilUNO, 2, true)) }}%
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Precio DOS:</span>
                {{
                  utils.aplyFormatNumeric(
                    utils.roundTo(sucursal.PrecioDOS, 2, true)
                  )
                }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Utilidad DOS:</span>
                {{ parseToPorcent(utils.roundTo(sucursal.UtilDOS, 2, true)) }}%
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Estatus:</span>
                {{ sucursal.Estatus }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Stock30:</span>
                {{ sucursal.Stock30 }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Stock 30 UC:</span>
                {{ sucursal.Stock30UC }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Subfamilia:</span>
                {{ sucursal.Subfamilia }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Descripcion Sub:</span>
                {{ sucursal.DescSubfamila }}
              </div>
              <div class="divider-h"></div>
              <div class="form-group mt-1 mb-0">
                <span class="font-weight-bold">Ultima Actualizacion:</span>
                {{ utils.parseFecha(sucursal.Updated, true) }}
              </div>
              <div class="divider-h"></div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <div
                v-if="verifyAccess(sucursal.sucursal, sucursal.conexion)"
                class="form-group mt-1 mb-1"
              >
                <b-button
                  v-b-toggle="
                    'collapse-compras-' +
                    refactorNameSuc(sucursal.sucursal, sucursal.conexion)
                  "
                  class="btn btn-success btn-block dropdown-toggle text-right"
                >
                  Compras encontradas: {{ count(sucursal.compras) }}
                </b-button>
              </div>
              <b-collapse
                :id="
                  'collapse-compras-' +
                  refactorNameSuc(sucursal.sucursal, sucursal.conexion)
                "
              >
                <div
                  v-for="(value, key) in verifyCompras(sucursal.compras)"
                  :key="key + 'compra'"
                >
                  <b-alert show variant="info">
                    Compra #{{ key * 1 + 1 }}
                  </b-alert>
                  <div class="form-group mt-2">
                    <label for="#">
                      <span class="font-weight-bold">Fecha:</span>
                      {{ utils.parseFecha(value.Fecha) }}
                    </label>
                    <div class="divider-h"></div>
                    <label for="#">
                      <span class="font-weight-bold">NombreTercero:</span>
                      {{ value.NombreTercero }}
                    </label>
                    <div class="divider-h"></div>
                    <label for="#">
                      <span class="font-weight-bold">CantidadRegularUC:</span>
                      {{ value.CantidadRegularUC }}
                    </label>
                    <div class="divider-h"></div>
                    <label for="#">
                      <span class="font-weight-bold">CostoUnitarioNetoUC:</span>
                      {{ value.CostoUnitarioNetoUC }}
                    </label>
                    <div class="divider-h"></div>
                    <label for="#">
                      <span class="font-weight-bold">Updated:</span>
                      {{ utils.parseFecha(value.Updated, true) }}
                    </label>
                    <div class="divider-h"></div>
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <div v-if="tipo_user === 'manager'" class="form-group mt-3 mb-1">
      <b-button
        v-b-toggle.collapse-proveedores
        class="btn btn-success btn-block dropdown-toggle text-right"
      >
        Resumen de compras
      </b-button>
    </div>
    <b-collapse id="collapse-proveedores">
      <b-alert show variant="success">Mejor Precio</b-alert>
      <div>
        <label>
          <span class="font-weight-bold">Fecha:</span>
          {{ utils.parseFecha(detailsProveedor.mejorPrecio.Fecha) }}
        </label>
        <div class="divider-h"></div>
        <label>
          <span class="font-weight-bold">Nombre tercero:</span>
          {{ detailsProveedor.mejorPrecio.NombreTercero }}
        </label>
        <div class="divider-h"></div>
        <label>
          <span class="font-weight-bold">Cantidad Regular UC:</span>
          {{
            utils.aplyFormatNumeric(
              detailsProveedor.mejorPrecio.CantidadRegularUC
            )
          }}
        </label>
        <div class="divider-h"></div>
        <label>
          <span class="font-weight-bold">Costo Unitario Neto UC:</span>
          {{ utils.roundTo(detailsProveedor.mejorPrecio.CostoUnitarioNetoUC) }}
        </label>
        <div class="divider-h"></div>
        <label>
          <span class="font-weight-bold">Actualizado:</span>
          {{ utils.parseFecha(detailsProveedor.mejorPrecio.Updated, true) }}
        </label>
        <div class="divider-h"></div>
      </div>
      <b-alert show variant="success">Compras por proveedor</b-alert>
      <div
        v-for="(proveedor, indexPrv) in detailsProveedor.cantidadCompras"
        :key="indexPrv"
      >
        <label>
          <b-badge variant="primary">
            {{ proveedor.Cantidad }}
          </b-badge>
          {{ proveedor.Proveedor }}
        </label>
        <div class="divider-h"></div>
      </div>
      <b-alert show variant="success">Precio Promedio</b-alert>
      <label>
        <span class="font-weight-bold">Precio promedio:</span>
        <b-badge variant="primary">
          {{ utils.roundTo(detailsProveedor.precioPromedio, 3) }}
        </b-badge>
      </label>
      <div class="divider-h"></div>
    </b-collapse>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils,
    }
  },
  computed: {
    variantBodyCard() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkBodyCard'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkBodyCard'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaBodyCard'
      else return ''
    },
    detailsProveedor() {
      if (
        this.details.proveedores.mejorPrecio ===
        'Parametro enviado es no valido'
      )
        return {
          mejorPrecio: {},
          cantidadCompras: {},
          precioPromedio: 0,
        }
      return this.details.proveedores
    },
    validProveedores() {
      if (
        this.details.proveedores.mejorPrecio ===
        'Parametro enviado es no valido'
      )
        return false
      return true
    },
    tipo_user() {
      return this.$store.state.user.user.tipo_user || 'invited'
    },
  },
  mounted() {},
  methods: {
    refactorNameSuc(sucursal, conexion) {
      if (!sucursal) {
        if (!conexion) return sucursal
        sucursal = conexion
      }
      const arraySucursal = sucursal.split('.')
      const name = arraySucursal[0].slice(3)
      if (name === 'SUPERUNO') return 'ZARAGOZA'
      if (name === 'CENTRO') return 'VICTORIA'
      return name
    },
    parseToPorcent(value) {
      if (!value) return value
      const stringValue = value.toString()
      const arrayValue = stringValue.split('.')
      return parseInt(arrayValue[1])
    },
    count(anyObject) {
      if (!anyObject) return 0
      if (anyObject === 'Array vacio') return 0
      const length = Object.keys(anyObject).length
      return length
    },
    verifyCompras(compras) {
      if (compras === 'Array vacio') return []
      return compras
    },
    borderTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'secondary'
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'secondary'
      return 'light'
    },
    colorHeader(status, articulo) {
      if (status !== 'Online') return 'danger'
      if (!articulo) return 'warning'
      else if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'info'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      return 'info'
    },
    verifyAccess(sucursal, conexion) {
      if (this.refactorNameSuc(sucursal, conexion) !== 'BODEGA') return true
      return this.tipo_user === 'manager'
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
</style>
