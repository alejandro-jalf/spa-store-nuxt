<template>
  <div>
    <div class="h1 text-center my-5">Novedades de Spa Store</div>
    <b-card
      v-if="lastVersion"
      class="containerCard p-1 pb-0 mt-5"
      :class="variantTheme"
      :title="'Version ' + lastVersion.NumVersion"
    >
      <p
        v-for="(parrafo, indexP) in parrafos(lastVersion.Detalles)"
        :key="indexP"
      >
        {{ parrafo }}
        <br />
      </p>
      <div>
        <span class="font-weight-bold">Fecha de lanzamiento:</span>
        {{ utils.parseFecha(lastVersion.FechaDeLanzamiento, true) }}
      </div>
      <div class="card-tabs">
        <div class="font-weight-bold">Novedades en:</div>
        <div
          v-for="(tab, indexTab) in tabsVersion"
          :key="indexTab"
          class="chip"
        >
          {{ tab }}
        </div>
      </div>
      <b-alert show class="mt-5">
        Si todavia no puedes ver las nuevas pestañas o no te aparecen en tu menu
        de opciones, es muy probable que necesites recargar la pagina, ademas en
        ocaciones es necesario que preciones el boton: "Actualizar informacion".
        Por lo general este boton esta siempre cerca de donde esta tu nombre.
      </b-alert>
    </b-card>
    <div class="h4 mt-5 mb-3 text-info">Versiones anteriores.</div>
    <b-table
      hover
      head-variant="dark"
      fixed
      outlined
      responsive
      :fields="fields"
      :items="dataUpdates"
      :class="variantThemeTableBody"
    >
      <template #cell(Version)="row">
        {{ row.item.NumVersion }}
      </template>
      <template #cell(FechaDeLanzamiento)="row">
        {{ utils.toDate(row.item.FechaDeLanzamiento) }}
      </template>
      <template #cell(NovedadesEn)="row">
        <b-dropdown id="dropdown-1" text="Desplegar" variant="info">
          <b-dropdown-item
            v-for="(acess, indexAccess) in tabsUpdatedVersion(
              row.item.PaginasActualizadas
            )"
            :key="indexAccess"
            disabled
          >
            {{ acess.trim() }}
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  data() {
    return {
      utils,
      fields: ['Version', 'Detalles', 'NovedadesEn', 'FechaDeLanzamiento'],
    }
  },
  computed: {
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataUpdates() {
      const versions = []
      const lengthVersions = this.$store.state.user.user.novedades.length
      const limit = lengthVersions < 5 ? lengthVersions : 5
      for (let index = 0; index < limit; index++) {
        versions.push(this.$store.state.user.user.novedades[index])
      }
      return versions
    },
    lastVersion() {
      return this.$store.state.user.user.novedades[0]
    },
    tabsVersion() {
      const accessUser = this.$store.state.user.user.access_to_user.split(',')
      const lastVersion = this.$store.state.user.user.novedades
      if (lastVersion.length === 0) return []
      const tabs = []
      lastVersion[0].PaginasActualizadas.split(',').forEach((tab) => {
        const tabFind = accessUser.find(
          (tabU) => tabU.trim().toLowerCase() === tab.trim().toLowerCase()
        )
        if (tabFind) tabs.push(tab)
      })
      return tabs
    },
  },
  methods: {
    parrafos(detalles) {
      return detalles.split('<br/>')
    },
    tabsUpdatedVersion(PaginasActualizadas) {
      const accessUser = this.$store.state.user.user.access_to_user.split(',')
      const lastVersion = this.$store.state.user.user.novedades
      if (lastVersion.length === 0) return []
      const tabs = []
      PaginasActualizadas.split(',').forEach((tab) => {
        const tabFind = accessUser.find(
          (tabU) => tabU.trim().toLowerCase() === tab.trim().toLowerCase()
        )
        if (tabFind) tabs.push(tab)
      })
      return tabs
    },
  },
}
</script>

<style scoped>
.card-tabs {
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid rgb(0, 120, 102);
  padding: 15px;
}

.chip {
  font-size: 16px;
  display: inline-block;
  padding: 5px 10px;
  margin: 4px;
  border-radius: 8px;
  border: 1px solid rgb(0, 190, 194);
  background: rgb(0, 138, 159);
  color: #fff;
  font-weight: 500;
}
</style>
