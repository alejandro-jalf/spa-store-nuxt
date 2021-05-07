<template>
  <div>
    <div
      v-for="(articulo, indexArt) in articulos"
      :key="indexArt"
      class="card mb-3 container-gen"
      @click="showDetails(articulo.Articulo)"
    >
      <div class="row no-gutters rowsCard">
        <div id="container-image" class="col-sm-4 text-center">
          <img
            src="../assets/codigo.jpg"
            class="card-img mt-4 img-barcode"
            style="max-width: 180px"
          />
          <h6 class="font-weight-bold barcode">{{ articulo.CodigoBarras }}</h6>
        </div>
        <div class="divider-v"></div>
        <div id="container-data" class="col-sm-8">
          <div class="card-body">
            <h5 class="card-title">{{ articulo.Nombre }}</h5>
            <p class="card-text">
              <span class="font-weight-bold">Articulo:</span>
              {{ articulo.Articulo }}
            </p>
            <p class="card-text">
              <span class="font-weight-bold">Relacion:</span>
              {{ articulo.Relacion }}
            </p>
            <p class="card-text">
              <span class="font-weight-bold">Subfamilia:</span>
              {{ articulo.Subfamilia }}
            </p>
            <p class="card-text">
              <small class="text-muted">{{ articulo.DescSubfamila }}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articulos: {
      type: Array,
      required: true,
    },
    showDetails: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style scoped>
.container-gen {
  cursor: pointer;
  position: relative;
  border-left: 9px solid #00c4d6;
  max-width: 800px;
  box-shadow: 2px 2px 2px #e6e6e6;
}
.card-img {
  max-width: 180px;
}
.divider-v {
  position: absolute;
  width: 1px;
  height: 84%;
  left: 31%;
  top: 8%;
  background: #c3c3c3;
}
@media screen and (max-width: 768px) {
  #container-image {
    width: 30%;
    padding: 2%;
    padding-top: 5%;
  }
  #container-data {
    width: 70%;
  }
}
@media screen and (max-width: 575px) {
  .barcode {
    margin-top: 8%;
    font-size: small;
  }
  .card-text {
    margin: 0px;
  }
}
@media screen and (max-width: 550px) {
  .card-title {
    font-size: 18px;
  }
}
@media screen and (max-width: 450px) {
  .barcode {
    margin-top: 9%;
    font-size: 11px;
  }
  .card-text {
    font-size: medium;
  }
}
</style>
