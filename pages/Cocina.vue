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
        <p>I'm a disabled tab!</p>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CocinaTotales from '../components/CocinaTotales'
import CocinaCrecimiento from '../components/CocinaCrecimiento'

export default {
  components: {
    CocinaTotales,
    CocinaCrecimiento,
  },
}
</script>
