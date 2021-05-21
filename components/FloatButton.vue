<template>
  <b-avatar
    class="Floatbtn"
    :variant="variantFloat"
    :size="sizeFloat"
    :button="true"
    :style="styleFloat"
    @click="clickFloat"
  >
    <b-icon-arrow-clockwise
      v-if="iconFloat === 'arrow-clockwise'"
      :font-scale="fontScale"
    ></b-icon-arrow-clockwise>
    <b-icon-arrow-up-circle
      v-else-if="iconFloat === 'arrow-up-circle'"
      :font-scale="fontScale"
    ></b-icon-arrow-up-circle>
    <b-icon-arrow-repeat v-else :font-scale="fontScale"></b-icon-arrow-repeat>
  </b-avatar>
</template>

<script>
import {
  BIconArrowClockwise,
  BIconArrowUpCircle,
  BIconArrowRepeat,
} from 'bootstrap-vue'

export default {
  components: {
    BIconArrowClockwise,
    BIconArrowUpCircle,
    BIconArrowRepeat,
  },
  props: {
    fontScale: {
      type: String,
      required: false,
      default: '2.5',
    },
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
      default: '60px',
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
  z-index: 5;
  box-shadow: 1px 2px 5px 1px rgb(114, 114, 114);
}
</style>
