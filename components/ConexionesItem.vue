<template>
  <b-list-group-item class="d-flex align-items-center" :class="variantItem">
    <b-icon-toggle-on
      v-if="sucursal.success"
      variant="primary"
      class="mr-3"
      font-scale="2"
    ></b-icon-toggle-on>
    <b-icon-toggle-off
      v-else
      variant="danger"
      class="mr-3"
      font-scale="2"
    ></b-icon-toggle-off>

    <span class="mr-auto">
      <strong>{{ refactorName(sucursal.conexion) }}</strong>
    </span>
    <b-badge variant="ligth">{{ sucursal.message }}</b-badge>
  </b-list-group-item>
</template>

<script>
import { BIconToggleOff, BIconToggleOn } from 'bootstrap-vue'

export default {
  name: 'ConexionesItem',
  components: {
    BIconToggleOn,
    BIconToggleOff,
  },
  props: {
    sucursal: {
      type: Object,
      required: true,
    },
  },
  computed: {
    variantItem() {
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
  methods: {
    refactorName(sucursal) {
      const arraySucursal = sucursal.split('.')
      const name = arraySucursal[0].slice(3)
      if (name === 'SUPERUNO') return 'ZARAGOZA'
      if (name === 'CENTRO') return 'VICTORIA'
      return name
    },
  },
}
</script>
