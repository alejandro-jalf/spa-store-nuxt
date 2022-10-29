<template>
  <div class="container-back">
    <b-form-group
      id="group-article"
      label="Articulo"
      label-for="input-article"
      description="Puede incluir los comodines **"
      class="middle"
    >
      <b-form-input
        id="input-article"
        v-model="article"
        type="text"
        placeholder="*articulo*"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="group-name"
      label="Nombre"
      label-for="input-name"
      description="Puede incluir los comodines **"
      class="middle"
    >
      <b-form-input
        id="input-name"
        v-model="name"
        type="text"
        placeholder="*nombre*"
        required
      ></b-form-input>
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'MayoristasAsignar',
  data() {
    return {
      article: '',
      name: '',
    }
  },
}
</script>

<style scoped>
.container-back {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  padding: 20px;
  z-index: 9;
  background: rgba(224, 224, 224, 0.858);
}

.middle {
  display: inline-block;
  width: calc(50% - 5px);
  margin-bottom: 10px;
}

@media screen and (max-width: 994px) {
  .middle {
    width: 100%;
  }
}
</style>
