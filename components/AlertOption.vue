<template>
  <b-modal
    :visible="alertShow"
    :title="alertTitle"
    :header-bg-variant="alertHeaderBg"
    :header-text-variant="alertHeaderText"
    :centered="true"
  >
    <b-container fluid>
      {{ alertMessage }}
    </b-container>

    <template #modal-footer>
      <div class="w-100">
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          @click="clickAcept"
        >
          Aceptar
        </b-button>
        <b-button
          variant="secondary"
          size="sm"
          class="float-right mr-3"
          @click="clickCancel"
        >
          Cancelar
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  props: {
    alertShow: {
      type: Boolean,
      required: false,
      default: false,
    },
    alertTitle: {
      type: String,
      required: false,
      default: 'Realizando accion',
    },
    alertMessage: {
      type: String,
      required: false,
      default: '¿Realizar esta accion?',
    },
    alertHeaderBg: {
      type: String,
      required: false,
      default: 'primary',
    },
    alertHeaderText: {
      type: String,
      required: false,
      default: 'light',
    },
    clickCancel: {
      type: Function,
      required: true,
    },
    clickAcept: {
      type: Function,
      required: true,
    },
  },
}
</script>
