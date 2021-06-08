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
          <b-icon-pencil-square></b-icon-pencil-square>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { BIconPencilSquare } from 'bootstrap-vue'

export default {
  components: {
    BIconPencilSquare,
  },
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
      // 767
      return this.$store.state.general.widthWindow
    },
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
}
</script>
