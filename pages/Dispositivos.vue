<template>
  <div>
    <h4 class="text-center my-4">Asistencias con Dispositivos</h4>
    <div v-if="accessChangeSucursal" class="mb-3">
      <b-button :variant="variantSuccess" @click="showTrabajadores">
        <b-icon icon="display" />
        Vincular Dispositivo
      </b-button>
      <b-button :variant="variantClean" @click="setView('EDITARCLAVE')">
        <b-icon icon="shield-lock-fill" />
        Editar Contraseña
      </b-button>
      <b-button :variant="variantInfo" @click="setView('EDITARTRABAJADOR')">
        <b-icon icon="person-badge-fill" />
        Reasignar Trabajador
      </b-button>
      <b-button :variant="variantClean" @click="setView('EDITARPRIVILEGIOS')">
        <b-icon icon="arrow-down-up" />
        Cambiar Privilegios
      </b-button>
    </div>

    <b-modal
      id="modalTrabajadores"
      ref="modalTrabajadores"
      title="Selecciona Trabajador"
      hide-footer
      size="xl"
      header-text-variant="dark"
    >
      <b-button variant="primary" @click="getTrabajadores">
        <b-icon icon="search" />
        Buscar
      </b-button>
      <divider class="my-3" />
      <b-table
        hover
        small
        head-variant="dark"
        sticky-header="500px"
        outlined
        responsive
        sort-by="Nombre"
        sort-direction="asc"
        :fields="fields"
        :items="dataTrabajadores"
        :class="variantThemeTableBody"
        class="mt-0"
      >
        <template #cell(FechaDeIngreso)="row">
          {{ utils.toDate(row.item.FechaDeIngreso) }}
        </template>
        <template #cell(Seleccionar)="row">
          <b-button
            variant="success"
            size="sm"
            @click="selectTrabajador(row.item)"
          >
            <b-icon icon="check-circle-fill" />
            Elejir
          </b-button>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: 'NULL',
      fields: [
        { key: 'Categoria', label: 'Sucursal', sortable: true },
        { key: 'FechaDeIngreso', label: 'Ingreso', sortable: true },
        { key: 'Nombre', label: 'Nombre', sortable: true },
        { key: 'Direccion', label: 'Direccion', sortable: true },
        { key: 'Seleccionar', label: 'Seleccionar', sortable: true },
      ],
    }
  },
  computed: {
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
    variantClean() {
      return this.$store.state.general.themesComponents.themeButtonClean
    },
    variantSuccess() {
      return this.$store.state.general.themesComponents.themeButtonSuccess
    },
    variantInfo() {
      return this.$store.state.general.themesComponents.themeButtonClose
    },
    dataTrabajadores() {
      const datos = []
      // this.$store.state.claveasistencias.data.data.forEach((trabajador) => {
      //   const item = { ...trabajador }
      //   datos.push(item)
      // })
      return datos
    },
  },
  methods: {
    showTrabajadores() {
      this.$bvModal.show('modalTrabajadores')
    },
  },
}
</script>
