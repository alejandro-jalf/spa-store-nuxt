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
      conexionesSkeleton: [0, 1, 2, 3, 4],
    }
  },
  computed: {
    variantClass() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeItemList'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeItemList'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
  },
}
</script>
