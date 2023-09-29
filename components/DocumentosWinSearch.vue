<template>
  <div>
    <div class="card-search">
      <div class="suc-db">
        <span class="mr-5">Sucursal: Zaragoza</span>
        <span>Base de Datos: SPASUPER1</span>
      </div>
      <b-input-group prepend="Tipo de Movimiento" class="mb-2">
        <b-form-select v-model="optionType" :options="documents" />
      </b-input-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    documents: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      optionType: 'C',
    }
  },
}
</script>
<style scoped>
.card-search {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 600px;
  color: black;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
}

.suc-db {
  float: right;
  padding-right: 30px;
  font-weight: bold;
  font-size: 17px;
  height: 50px;
}
</style>
