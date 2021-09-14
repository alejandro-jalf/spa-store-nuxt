<template>
  <div class="pt-5">
    <b-table
      hover
      head-variant="dark"
      outlined
      responsive
      :items="proveedoresList"
      :fields="fields"
      :class="variantItem"
    >
      <template #cell(Acciones)="row">
        <b-button variant="warning" size="sm" class="mb-1" @click="row">
          <b-icon icon="pencil-square" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        'Cuenta',
        'Proveedor',
        'RFC',
        'Direccion',
        'Telefono',
        'Email',
        'Acciones',
      ],
      proveedoresList: [
        {
          Cuenta: '2110A0004200000000003',
          Proveedor: 'ANA MARIA AGUILAR AGUILAR',
          RFC: 'AUAA841229IQ1',
          Direccion: '',
          Telefono: '',
          Email: '',
        },
      ],
      h: {
        num: 0,
        title: '',
        content: '',
      },
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    variantItem() {
      return this.$store.state.general.themesComponents.themeItemList
    },
  },
}
</script>
