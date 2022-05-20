<template>
  <div>
    <b-card :class="variantTheme">
      <h5 class="pb-0">{{ article.Nombre }}</h5>
      <div class="text-muted h6">{{ article.Articulo }}</div>
      <span class="font-weight-bold">Costo:</span>
      {{ dataNumberForNull(article.UltimoCosto) }}
      <div :class="aplyColor(1)">
        <span class="font-weight-bold">Precio1:</span>
        {{ dataNumberForNull(article.Precio1IVAUV) }}
        <span class="font-weight-bold">Util1:</span>
        {{ dataPercentageForNull(article.Utilidad1) }}
      </div>
      <div :class="aplyColor(2)">
        <span class="font-weight-bold">Precio2:</span>
        {{ dataNumberForNull(article.Precio2IVAUV) }}
        <span class="font-weight-bold">Util2:</span>
        {{ dataPercentageForNull(article.Utilidad2) }}
      </div>
      <div :class="aplyColor(3)">
        <span class="font-weight-bold">Precio3:</span>
        {{ dataNumberForNull(article.Precio3IVAUV) }}
        <span class="font-weight-bold">Util3:</span>
        {{ dataPercentageForNull(article.Utilidad3) }}
      </div>
      <b-button variant="outline-info" block @click="showDetails(article)">
        Detalles
      </b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      required: true,
      type: Object,
    },
    showDetails: {
      required: true,
      type: Function,
    },
    dataNumberForNull: {
      required: true,
      type: Function,
    },
    dataPercentageForNull: {
      required: true,
      type: Function,
    },
  },
  computed: {
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCard2Body
    },
  },
  methods: {
    aplyColor(nivelPrecio) {
      switch (nivelPrecio) {
        case 1:
          if (
            this.article.Utilidad1 !== null &&
            this.article.Utilidad1 < this.article.UtilidadMinima
          )
            return 'color-danger'
          return ''
        case 2:
          if (
            this.article.Utilidad2 !== null &&
            this.article.Utilidad2 < this.article.UtilidadMinima
          )
            return 'color-danger'
          return ''
        case 3:
          if (
            this.article.Utilidad3 !== null &&
            this.article.Utilidad3 < this.article.UtilidadMinima
          )
            return 'color-danger'
          return ''
      }
    },
  },
}
</script>

<style scoped>
.color-danger {
  background: rgb(255, 216, 216);
  color: #000;
}
</style>
