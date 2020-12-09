<template>
  <div v-if="showMessage" :class="['font-italic', colorText]">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      require: false,
      default: '',
    },
    colorText: {
      type: String,
      require: false,
      default: 'text-secondary',
    },
    showMessage: {
      type: Boolean,
      require: false,
      default: true,
    },
  },
}
</script>
