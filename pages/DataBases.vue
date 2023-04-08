<template>
  <div>
    <h3 class="text-center py-3">Bases de datos</h3>
    <b-tabs content-class="mt-3">
      <b-tab title="Zaragoza" active>
        <DatabBasesSucursal sucursal="ZR" />
        <DatabBasesSucursalChart sucursal="ZR" />
      </b-tab>
      <b-tab title="Victoria">
        <DatabBasesSucursal sucursal="VC" />
        <DatabBasesSucursalChart sucursal="VC" />
      </b-tab>
      <b-tab title="Enriquez">
        <DatabBasesSucursal sucursal="ER" />
        <DatabBasesSucursalChart sucursal="ER" />
      </b-tab>
      <b-tab title="Oluta">
        <DatabBasesSucursal sucursal="OU" />
        <DatabBasesSucursalChart sucursal="OU" />
      </b-tab>
      <b-tab title="Sayula">
        <DatabBasesSucursal sucursal="SY" />
        <DatabBasesSucursalChart sucursal="SY" />
      </b-tab>
      <b-tab title="Jaltipan">
        <DatabBasesSucursal sucursal="JL" />
        <DatabBasesSucursalChart sucursal="JL" />
      </b-tab>
      <b-tab title="Bodega">
        <DatabBasesSucursal sucursal="BO" />
        <DatabBasesSucursalChart sucursal="BO" />
      </b-tab>
      <b-tab title="Soconusco" disabled>
        <DatabBasesSucursal sucursal="SC" />
        <DatabBasesSucursalChart sucursal="SC" />
      </b-tab>
      <b-tab title="T Acayucan" disabled><p>T Acayucan</p></b-tab>
      <b-tab title="T Sayula" disabled><p>T Sayula</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import DatabBasesSucursal from '../components/DataBasesSucursal'
import DatabBasesSucursalChart from '../components/DataBasesSucursalChart'

export default {
  components: {
    DatabBasesSucursal,
    DatabBasesSucursalChart,
  },
}
</script>
