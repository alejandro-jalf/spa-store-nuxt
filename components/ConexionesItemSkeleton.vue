<template>
  <b-card v-if="!thereAreConections">
    <b-row>
      <b-col cols="2">
        <b-skeleton type="avatar" width="20px" height="20px"></b-skeleton>
      </b-col>
      <b-col cols="6">
        <b-skeleton height="20px"></b-skeleton>
      </b-col>
      <b-col cols="3">
        <b-skeleton type="button" height="20px"></b-skeleton>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  computed: {
    thereAreConections() {
      return this.$store.state.conexiones.conexiones.data
        ? this.$store.state.conexiones.conexiones.data.length
        : 0
    },
  },
}
</script>
