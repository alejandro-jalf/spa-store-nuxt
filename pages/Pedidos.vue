<template>
  <div>
    <h2 class="text-center my-4">
      <b-icon icon="display"></b-icon>
      Monitor de pedidos - {{ sucursal }}
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sucursal: 'Zaragoza',
    }
  },
}
</script>
