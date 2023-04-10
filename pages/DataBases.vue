<template>
  <div>
    <h3 class="text-center py-3">Bases de datos</h3>
    <b-tabs content-class="mt-3">
      <b-tab title="Zaragoza" active>
        <DatabBasesSucursal sucursal="ZR" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="ZR" />
      </b-tab>
      <b-tab title="Victoria">
        <DatabBasesSucursal sucursal="VC" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="VC" />
      </b-tab>
      <b-tab title="Enriquez">
        <DatabBasesSucursal sucursal="ER" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="ER" />
      </b-tab>
      <b-tab title="Oluta">
        <DatabBasesSucursal sucursal="OU" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="OU" />
      </b-tab>
      <b-tab title="Sayula">
        <DatabBasesSucursal sucursal="SY" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="SY" />
      </b-tab>
      <b-tab title="Jaltipan">
        <DatabBasesSucursal sucursal="JL" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="JL" />
      </b-tab>
      <b-tab title="Bodega">
        <DatabBasesSucursal sucursal="BO" />
        <DatabBasesSucursalChart v-if="showGraph" sucursal="BO" />
      </b-tab>
      <b-tab title="Soconusco" disabled>
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
    }),
    refreshGrafico() {
      const that = this
      this.setShowGraph(false)
      setTimeout(() => {
        that.setShowGraph(true)
      }, 100)
    },
  },
}
</script>
