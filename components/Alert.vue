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
          @click="hideAlertDialog"
        >
          Aceptar
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    alertShow() {
      return this.$store.state.general.alert.show
    },
    alertTitle() {
      return this.$store.state.general.alert.title
    },
    alertMessage() {
      return this.$store.state.general.alert.message
    },
    alertHeaderBg() {
      return this.$store.state.general.alert.headerBackground
    },
    alertHeaderText() {
      return this.$store.state.general.alert.headerTexColor
    },
  },
  methods: {
    ...mapMutations({
      hideAlertDialog: 'general/hideAlertDialog',
    }),
  },
}
</script>
