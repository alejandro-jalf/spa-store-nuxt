<template>
  <div>
    <b-button :variant="variantInfo" class="d-inline-block mb-3">
      <b-icon icon="arrow-repeat"></b-icon>
      Refrescar
    </b-button>

    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :fields="fields"
      :items="dataExistencias"
      :class="variantThemeTableBody"
    >
      <template #cell(ExistenciaActualRegular)="row">
        {{ formatNumber(row.item.ExistenciaActualRegular) }}
      </template>
      <template #cell(ExistenciaActualUC)="row">
        {{ formatNumber(row.item.ExistenciaActualUC) }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: 'DataBaseName', label: 'Base de Datos', sortable: true },
        { key: 'DataFileSizeMB', label: 'Tamaño de Data(MB)', sortable: true },
        { key: 'LogFileSizeMB', label: 'Tamaño Log(MB)', sortable: true },
        { key: 'Estatus', label: 'Estatus', sortable: true },
        { key: 'LastBackup', label: 'Ultimo Respaldo', sortable: true },
        { key: 'Acciones', label: 'Acciones', sortable: true },
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    dataExistencias() {
      return []
    },
  },
}
</script>
