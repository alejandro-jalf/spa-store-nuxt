<template>
  <div>
    <h3 class="text-center py-3">Bases de datos</h3>
    <b-tabs content-class="mt-3">
      <b-tab
        title="Zaragoza"
        :active="isActiveSucursal('ZR')"
        @click="setSucursal('ZR')"
      >
        <DatabBasesSucursal sucursal="ZR" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="ZR" />
      </b-tab>
      <b-tab
        title="Victoria"
        :active="isActiveSucursal('VC')"
        @click="setSucursal('VC')"
      >
        <DatabBasesSucursal sucursal="VC" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="VC" />
      </b-tab>
      <b-tab
        title="Enriquez"
        :active="isActiveSucursal('ER')"
        @click="setSucursal('ER')"
      >
        <DatabBasesSucursal sucursal="ER" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="ER" />
      </b-tab>
      <b-tab
        title="Oluta"
        :active="isActiveSucursal('OU')"
        @click="setSucursal('OU')"
      >
        <DatabBasesSucursal sucursal="OU" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="OU" />
      </b-tab>
      <b-tab
        title="Sayula"
        :active="isActiveSucursal('SY')"
        @click="setSucursal('SY')"
      >
        <DatabBasesSucursal sucursal="SY" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="SY" />
      </b-tab>
      <b-tab
        title="Jaltipan"
        :active="isActiveSucursal('JL')"
        @click="setSucursal('JL')"
      >
        <DatabBasesSucursal sucursal="JL" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="JL" />
      </b-tab>
      <b-tab
        title="Bodega"
        :active="isActiveSucursal('BO')"
        @click="setSucursal('BO')"
      >
        <DatabBasesSucursal sucursal="BO" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="BO" />
      </b-tab>
      <b-tab title="Soconusco">
        <DatabBasesSucursal sucursal="SC" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="SC" />
      </b-tab>
      <b-tab title="T Acayucan" disabled><p>T Acayucan</p></b-tab>
      <b-tab title="T Sayula" disabled><p>T Sayula</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import DatabBasesSucursal from '../components/DataBasesSucursal'
import DatabBasesSucursalChart from '../components/DataBasesSucursalChart'

export default {
  components: {
    DatabBasesSucursal,
    DatabBasesSucursalChart,
  },
  computed: {
    showGraph() {
      return this.$store.state.databases.showGraph
    },
  },
  methods: {
    ...mapMutations({
      setShowGraph: 'databases/setShowGraph',
      setSucursal: 'databases/setSucursal',
    }),
    refreshGrafico() {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setShowGraph(true)
      }, 100)
    },
    isActiveSucursal(sucursal) {
      const sucursalF = this.$store.state.databases.sucursal
      return sucursal.toUpperCase() === sucursalF.toUpperCase()
    },
  },
}
</script>
