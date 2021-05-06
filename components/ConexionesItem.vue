<template>
  <b-list-group-item class="d-flex align-items-center">
    <b-icon
      :variant="isOn(sucursal.success)"
      :icon="loadActive(sucursal.success)"
      class="mr-3"
      font-scale="2"
    ></b-icon>
    <span class="mr-auto">
      <strong>{{ refactorName(sucursal.conexion) }}</strong>
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
  methods: {
    loadActive(value) {
      return value ? 'toggle-on' : 'toggle-off'
    },
    isOn(success) {
      return success ? 'primary' : 'danger'
    },
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
