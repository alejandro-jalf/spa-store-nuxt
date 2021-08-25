<template>
  <div>
    <h1 class="mb-5 mt-5">Analitica de cocina</h1>
    <b-tabs content-class="mt-2">
      <b-tab title="Totales" active>
        <cocina-totales />
      </b-tab>
      <b-tab title="Crecimiento">
        <cocina-crecimiento />
      </b-tab>
      <b-tab title="Detalles">
        <cocina-detalles />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CocinaTotales from '../components/CocinaTotales'
import CocinaCrecimiento from '../components/CocinaCrecimiento'
import CocinaDetalles from '../components/CocinaDetalles.vue'

export default {
  components: {
    CocinaTotales,
    CocinaCrecimiento,
    CocinaDetalles,
  },
}
</script>
