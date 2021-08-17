<template>
  <div>
    <h1 class="mb-5 mt-5">Analitica de cocina</h1>
    <b-tabs content-class="mt-2">
      <b-tab title="Totales" active>
        <cocina-totales />
      </b-tab>
      <b-tab title="Crecimiento">
        <p>Tabla con grafico</p>
      </b-tab>
      <b-tab title="Detalles">
        <p>I'm a disabled tab!</p>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CocinaTotales from '../components/CocinaTotales'

export default {
  components: {
    CocinaTotales,
  },
}
</script>
