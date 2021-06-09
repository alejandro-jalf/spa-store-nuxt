<template>
  <b-avatar
    :variant="variantFloat"
    :size="sizeFloat"
    :button="true"
    class="Floatbtn"
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
    <b-icon-person-lines-fill
      v-else-if="iconFloat === 'person-lines-fill'"
      :font-scale="fontScale"
    ></b-icon-person-lines-fill>
    <b-icon-x v-else-if="iconFloat === 'x'" :font-scale="fontScale"></b-icon-x>
    <b-icon-arrow-repeat v-else :font-scale="fontScale"></b-icon-arrow-repeat>
  </b-avatar>
</template>

<script>
import {
  BIconArrowClockwise,
  BIconArrowUpCircle,
  BIconArrowRepeat,
  BIconPersonLinesFill,
  BIconX,
} from 'bootstrap-vue'

export default {
  components: {
    BIconArrowClockwise,
    BIconArrowUpCircle,
    BIconArrowRepeat,
    BIconPersonLinesFill,
    BIconX,
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
  mounted() {
    const floatButton = document.querySelector('.Floatbtn')

    if (
      this.$store.state.general.barraInferior === 'true' &&
      this.$store.state.general.widthWindow < 992 &&
      this.alignVertical === 'bottom'
    )
      floatButton.style.bottom = '65px'
    else if (this.alignVertical === 'bottom') floatButton.style.bottom = '15px'
    else floatButton.style.top = '15px'

    if (this.alignHorizontal === 'right') floatButton.style.right = '15px'
    else floatButton.style.left = '15px'

    window.addEventListener('resize', () => {
      if (this.alignVertical === 'bottom') {
        if (window.innerWidth < 992) {
          if (this.$store.state.general.barraInferior === 'true')
            floatButton.style.bottom = '65px'
          else floatButton.style.bottom = '15px'
        } else {
          floatButton.style.bottom = '15px'
        }
      }
    })
  },
}
</script>

<style scoped>
.Floatbtn {
  position: fixed;
  cursor: pointer;
  z-index: 1;
  box-shadow: 1px 2px 5px 1px rgb(114, 114, 114);
}

.align-left {
  left: 15px;
  right: none;
}

.align-right {
  left: none;
  right: 15px;
}

.align-top {
  top: 15px;
  bottom: none;
}

.align-bottom {
  top: none;
  bottom: 65px;
}
</style>
