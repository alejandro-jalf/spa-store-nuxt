<template>
  <div v-if="trabajador.header" class="mt-2">
    <b-card no-body class="cardT" :class="variantTheme">
      <div class="nameT">{{ trabajador.nombre }}</div>
      <div>
        Dias Asists:
        <span class="infoT">{{ trabajador.dias }}</span>
      </div>
      <div>
        Hrs Total: <span class="infoT">{{ trabajador.sumaHoras }}</span>
      </div>
      <b-button
        variant="outline-info"
        class="btnDetails"
        @click="showDetails(trabajador)"
        >Detalles</b-button
      >
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    trabajador: {
      type: Object,
      required: true,
    },
    showDetails: {
      type: Function,
      required: true,
    },
  },
  computed: {
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
  },
}
</script>

<style scoped>
.btnDetails {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.infoT {
  margin-left: 10px;
  background: rgb(0, 171, 194);
  padding: 0px 10px;
  border-radius: 4px;
  color: #fff;
}

.nameT {
  font-weight: bold;
  font-size: 18px;
}

.cardT {
  padding: 10px;
}

@media screen and (max-width: 650px) {
  .btnDetails {
    position: relative;
    margin-top: 5px;
    right: 0px;
    bottom: 0px;
  }
}
</style>
