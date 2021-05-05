<template>
  <b-avatar
    class="Floatbtn"
    :variant="variant"
    :size="size"
    :button="true"
    :style="style"
    :icon="icon"
    @click="click"
  >
  </b-avatar>
</template>

<script>
export default {
  name: 'FloatButton',
  props: {
    icon: {
      type: String,
      required: false,
      default: 'arrow-clockwise',
    },
    variant: {
      type: String,
      required: false,
      default: 'primary',
    },
    size: {
      type: String,
      required: false,
      default: '3rem',
    },
    scaleIcon: {
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
    click: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  computed: {
    style() {
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
