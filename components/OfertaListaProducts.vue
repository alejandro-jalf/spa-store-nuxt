<template>
  <div>
    <b-modal
      id="modalSelectProduct"
      v-model="formModalProductos.showModal"
      title="Productos encontrados"
      size="xl"
      centered
      @ok="handleOk"
    >
      <b-table
        ref="tableSelectProduct"
        head-variant="dark"
        hover
        :fields="formModalProductos.fields"
        :items="formModalProductos.products"
        select-mode="single"
        responsive="sm"
        selectable
        @row-selected="onRowSelected"
        @keydown.stop.native="enterSelect"
        @keyup.down.stop.native="downSelect"
        @keyup.up.stop.native="upSelect"
        @mounted="showSelected"
      >
        <template #cell(seleccionado)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    formModalProductos: {
      type: Object,
      required: true,
    },
    handleOk: {
      type: Function,
      required: true,
    },
    onRowSelected: {
      type: Function,
      required: true,
    },
    enterSelect: {
      type: Function,
      required: true,
    },
    showSelected: {
      type: Function,
      required: true,
    },
  },
  updated() {
    this.$refs.tableSelectProduct.selectRow(0)
  },
  methods: {
    downSelect() {
      const tam = this.formModalProductos.products.length
      if (this.formModalProductos.position < tam - 1) {
        this.formModalProductos.position++
        this.$refs.tableSelectProduct.selectRow(
          this.formModalProductos.position
        )
      }
    },
    upSelect() {
      if (this.formModalProductos.position > 0) {
        this.formModalProductos.position--
        this.$refs.tableSelectProduct.selectRow(
          this.formModalProductos.position
        )
      }
    },
  },
}
</script>
