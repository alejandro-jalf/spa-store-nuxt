<template>
  <b-avatar
    class="Floatbtn"
    :variant="variantFloat"
    :size="sizeFloat"
    :button="true"
    :style="styleFloat"
    :icon="iconFloat"
    @click="clickFloat"
  >
  </b-avatar>
</template>

<script>
export default {
  props: {
    iconFloat: {
      type: String,
      required: false,
      default: 'arrow-clockwise',
    },
    variantFloat: {
      type: String,
      required: false,
      default: 'primary',
    },
    sizeFloat: {
      type: String,
      required: false,
      default: '3rem',
    },
    scaleIconFloat: {
      type: String,
      required: false,
      default: '2',
    },
    alignVertical: {
      type: String,
      required: false,
      default: 'bottom',
    },
    alignHorizontal: {
      type: String,
      required: false,
      default: 'right',
    },
    clickFloat: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  computed: {
    styleFloat() {
      const vertical =
        this.alignVertical === 'bottom' ? 'bottom: 15px;' : 'top: 15px;'
      const horizontal =
        this.alignHorizontal === 'right' ? 'right: 15px;' : 'left: 15px;'
      return `${vertical} ${horizontal}`
    },
  },
}
</script>

<style scoped>
.Floatbtn {
  position: fixed;
  cursor: pointer;
  z-index: 15;
}
</style>
