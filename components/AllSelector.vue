<template>
  <div>
    <b-form-group>
      <template #label>
        <b>{{ title }}:</b><br />
        <b-form-checkbox
          v-model="allSelected"
          :indeterminate="indeterminate"
          aria-describedby="Items"
          aria-controls="Items"
          @change="toggleAll"
        >
          {{ allSelected ? unSelectAllMessage : selectAllMessage }}
        </b-form-checkbox>
      </template>

      <template v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          id="flavors"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="flavors"
          class="ml-4"
          aria-label="Item"
          stacked
        ></b-form-checkbox-group>
      </template>
    </b-form-group>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    selectAllMessage: {
      type: String,
      required: false,
      default: 'Todos',
    },
    unSelectAllMessage: {
      type: String,
      required: false,
      default: 'Deseleccionar Todo',
    },
  },
  data() {
    return {
      selected: [],
      allSelected: false,
      indeterminate: false,
    }
  },
  watch: {
    selected(newValue, oldValue) {
      if (newValue.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newValue.length === this.options.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    },
  },
  methods: {
    toggleAll(checked) {
      const all = this.options.map((item) => item.value || item)
      this.selected = checked ? all : []
    },
  },
}
</script>
