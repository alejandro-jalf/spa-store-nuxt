<template>
  <div>
    <h3 class="text-center py-3">Bases de datos</h3>
    <b-tabs content-class="mt-3">
      <b-tab title="Zaragoza" active>
        <DatabBasesSucursal />
      </b-tab>
      <b-tab title="Victoria"><p>Victoria</p></b-tab>
      <b-tab title="Enriquez"><p>Enriquez</p></b-tab>
      <b-tab title="Oluta"><p>Oluta</p></b-tab>
      <b-tab title="Sayula"><p>Sayula</p></b-tab>
      <b-tab title="Jaltipan"><p>Jaltipan</p></b-tab>
      <b-tab title="Bodega"><p>Bodega</p></b-tab>
      <b-tab title="Soconusco" disabled><p>Soconusco</p></b-tab>
      <b-tab title="T Acayucan" disabled><p>T Acayucan</p></b-tab>
      <b-tab title="T Sayula" disabled><p>T Sayula</p></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import DatabBasesSucursal from '../components/DataBasesSucursal'

export default {
  components: {
    DatabBasesSucursal,
  },
}
</script>
