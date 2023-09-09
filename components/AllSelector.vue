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
          v-model="selecteds"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="flavors"
          class="ml-4"
          aria-label="Item"
          stacked
          @change="selectItems"
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
    setOptions: {
      type: Function,
      required: false,
      default: (items) => {},
    },
    initials: {
      type: Array,
      required: false,
      default: (() => [])(),
    },
  },
  data() {
    return {
      selecteds: [],
      allSelected: false,
      indeterminate: false,
    }
  },
  watch: {
    selecteds(newValue, oldValue) {
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
  mounted() {
    const itemsInit = [...this.initials]
    this.selecteds = itemsInit
  },
  methods: {
    toggleAll(checked) {
      const all = this.options.map((item) => item.value || item)
      this.selecteds = checked ? all : []
      this.setOptions(checked ? all : [])
    },
    selectItems(items) {
      this.setOptions(items)
    },
  },
}
</script>
