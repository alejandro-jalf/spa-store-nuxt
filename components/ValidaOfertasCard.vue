<template>
  <div>
    <b-card :class="variantTheme">
      <h5 class="pb-0">{{ article.Nombre }}</h5>
      <div class="text-muted h6">{{ article.Articulo }}</div>
      <div class="sucursal">{{ article.Suc }}</div>
      <span class="font-weight-bold">Oferta:</span>
      {{ article.PrecioOferta }}
      <span class="font-weight-bold">Utilidad:</span>
      {{ article.UtilidadOferta }}
      <br />
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
  },
  computed: {
    variantTheme() {
      const valida = this.article.OfertaValida === 'NO' ? 'color-danger' : ''
      const themeCardBody = this.$store.state.general.themesComponents
        .themeCard2Body
      return themeCardBody === 'containerCard'
        ? valida
        : `${themeCardBody} ${valida}`
    },
  },
}
</script>

<style scoped>
.sucursal {
  position: absolute;
  top: 1px;
  right: 1px;
  padding: 5px;
  background: rgb(2, 185, 155);
  color: #fff;
  border-radius: 0px 3px 0px 5px;
}

.color-danger {
  background: rgb(255, 216, 216);
  color: #000;
}
</style>
