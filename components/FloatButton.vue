<template>
  <b-avatar
    :variant="variantFloat"
    :size="sizeFloat"
    :button="true"
    class="Floatbtn"
    @click="clickFloat"
  >
    <b-icon :icon="iconFloat" :font-scale="fontScale" />
  </b-avatar>
</template>

<script>
export default {
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
      window.innerWidth < 992 &&
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
</style>
