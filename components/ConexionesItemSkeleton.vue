<template>
  <div>
    <b-card
      v-for="(skeleto, indexSkele) of conexionesSkeleton"
      :key="indexSkele"
      :class="variantClass"
    >
      <b-row>
        <b-col cols="2">
          <b-skeleton
            type="avatar"
            width="20px"
            height="20px"
            animation="null"
          ></b-skeleton>
        </b-col>
        <b-col cols="6">
          <b-skeleton height="20px" animation="null"></b-skeleton>
        </b-col>
        <b-col cols="3">
          <b-skeleton type="button" height="20px" animation="null"></b-skeleton>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conexionesSkeleton: [],
      dataUser: this.$store.state.user.user,
    }
  },
  computed: {
    variantClass() {
      return this.$store.state.general.themesComponents.themeItemList
    },
  },
  mounted() {
    const sucSplited = this.dataUser.sucursal_user.split(' ')
    if (sucSplited[0].trim().toUpperCase() === 'CAASA')
      this.conexionesSkeleton = [0, 1, 2]
    else this.conexionesSkeleton = [0, 1, 2, 3, 4, 5, 6]
  },
}
</script>
