<template>
  <div>
    <b-card :class="variantTheme">
      <h5 class="pb-0">{{ article.Nombre }}</h5>
      <div class="text-muted h6">{{ article.Articulo }}</div>
      <div class="container-dato">
        <span class="font-weight-bold">Tipo Rotacion:</span>
        {{ article.estatusRotacion.split(' ')[1] }}
      </div>
      <div class="container-dato">
        <span class="font-weight-bold">Exist Local:</span>
        {{ dataFormated(article.ExistLoc) }}
      </div>
      <div class="container-dato">
        <span class="font-weight-bold">Exist Bodega:</span>
        {{ dataFormated(article.ExistExt) }}
      </div>
      <div class="container-dato">
        <span class="font-weight-bold">Factor Compra:</span>
        {{ dataFormated(article.FactorCompra) }}
      </div>
      <div class="container-dato">
        <span class="font-weight-bold">Factor Venta:</span>
        {{ dataFormated(article.FactorVenta) }}
      </div>
      <div class="container-dato">
        <span class="font-weight-bold">Sujerido:</span>
        {{ dataFormated(article.FactorVenta) }}
      </div>
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
    dataFormated: {
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
.container-dato {
  width: calc(50% - 5px);
  display: inline-block;
  border-radius: 8px;
  border: 1px solid rgb(0, 151, 154);
  padding: 5px;
  margin: 0px 2px 2px 0px;
}

@media screen and (max-width: 495px) {
  .container-dato {
    width: 100%;
  }
}
</style>
