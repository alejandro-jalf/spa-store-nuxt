<template>
  <b-list-group-item class="d-flex align-items-center" :class="variantItem">
    <b-icon
      :icon="iconStatus(sucursal.success)"
      :variant="variantStatus(sucursal.success)"
      class="mr-3"
      font-scale="2"
    />

    <span class="mr-auto">
      <strong>{{ sucursal.conexion }}</strong>
    </span>
    <b-badge variant="ligth">{{ sucursal.message }}</b-badge>
  </b-list-group-item>
</template>

<script>
export default {
  name: 'ConexionesItem',
  props: {
    sucursal: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dataUser: this.$store.state.user.user,
    }
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
      else return ''
    },
  },
  methods: {
    iconStatus(status) {
      return status ? 'toggle-on' : 'toggle-off'
    },
    variantStatus(status) {
      return status ? 'primary' : 'danger'
    },
    refactorName(sucursal) {
      const sucSplited = this.dataUser.sucursal_user.split(' ')
      if (sucSplited[0].trim().toUpperCase() === 'CAASA') return sucursal
      const arraySucursal = sucursal.split('.')
      const name = arraySucursal[0].slice(3)
      if (name === 'SUPERUNO') return 'ZARAGOZA'
      if (name === 'CENTRO') return 'VICTORIA'
      return name
    },
  },
}
</script>
