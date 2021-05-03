<template>
  <b-avatar
    class="Floatbtn"
    :variant="variant"
    :size="size"
    :button="true"
    :style="style"
    @click="click"
  >
    <b-icon-arrow-clockwise :font-scale="scaleIcon"></b-icon-arrow-clockwise>
  </b-avatar>
</template>

<script>
import { BIconArrowClockwise } from 'bootstrap-vue'

export default {
  name: 'FloatButton',
  components: {
    BIconArrowClockwise,
  },
  props: {
    icon: {
      type: String,
      require: false,
      default: 'iconDefault',
    },
    variant: {
      type: String,
      require: false,
      default: 'primary',
    },
    size: {
      type: String,
      require: false,
      default: '3rem',
    },
    scaleIcon: {
      type: String,
      require: false,
      default: '2',
    },
    alignVertical: {
      type: String,
      require: false,
      default: 'bottom',
    },
    alignHorizontal: {
      type: String,
      require: false,
      default: 'right',
    },
    click: {
      type: Function,
      require: false,
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
}
</style>
