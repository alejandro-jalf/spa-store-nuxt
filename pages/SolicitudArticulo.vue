<template>
  <div>
    <h4 class="text-center my-4">Monitor de Articulos</h4>
    <b-input-group prepend="Sucursal" size="sm" class="mb-2">
      <b-form-select :value="sucursal" :options="options"></b-form-select>
    </b-input-group>
    <b-button variant="info" size="sm">
      <b-icon icon="arrow-repeat" />
      Refrescar
    </b-button>

    <b-button variant="success" size="sm" class="float-right">
      <b-icon icon="plus-circle-fill" />
      Nuevo
    </b-button>
    <b-table
      hover
      small
      head-variant="dark"
      sticky-header="750px"
      outlined
      :fields="fields"
      :items="dataSolicitudes"
      :class="variantThemeTableBody"
      class="mt-2"
    >
      <template #cell(Fecha)="row">
        {{ utils.toDate(row.item.Fecha) }}
      </template>
      <template #cell(IVA)="row">
        {{ formatNumber(row.item.IVA) }}
      </template>
      <template #cell(Total)="row">
        {{ formatNumber(row.item.Total) }}
      </template>
      <template #cell(Subtotal)="row">
        {{ utils.roundTo(row.item.Subtotal) }}
      </template>
      <template #cell(Descuento)="row">
        {{ utils.roundTo(row.item.Descuento) }}
      </template>
      <template #cell(EdoTimbre)="row">
        {{ estadoTimbre(row.item.EdoTimbre) }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sucursal: 'ALL',
      options: [
        { value: 'ALL', text: 'Todas' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'ER', text: 'Enriquez' },
        { value: 'OU', text: 'Oluta' },
        { value: 'SY', text: 'Sayula' },
        { value: 'JL', text: 'Jaltipan' },
      ],
      fields: [
        { key: 'Consecutivo', label: 'Consecutivo', sortable: true },
        { key: 'Sucursal', label: 'Sucursal', sortable: true },
        { key: 'FechaCreado', label: 'Fecha', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'Articulo', label: 'Articulo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: false },
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataSolicitudes() {
      return []
    },
  },
}
</script>
