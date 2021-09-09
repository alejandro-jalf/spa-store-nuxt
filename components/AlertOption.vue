<template>
  <b-modal
    id="alertOption"
    :visible="alertOptionShow"
    :title="alertOptionTitle"
    :header-bg-variant="alertOptionHeaderBg"
    :header-text-variant="alertOptionHeaderText"
    :centered="true"
  >
    <b-container fluid>
      {{ alertOptionMessage }}
    </b-container>

    <template #modal-footer>
      <div class="w-100">
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          @click="alertOptionClickAcept"
        >
          Aceptar
        </b-button>
        <b-button
          variant="secondary"
          size="sm"
          class="float-right mr-3"
          @click="alertOptionClickCancel"
        >
          Cancelar
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    alertOptionShow() {
      return this.$store.state.general.alertOption.show
    },
    alertOptionTitle() {
      return this.$store.state.general.alertOption.title
    },
    alertOptionMessage() {
      return this.$store.state.general.alertOption.message
    },
    alertOptionHeaderBg() {
      return this.$store.state.general.alertOption.headerBg
    },
    alertOptionHeaderText() {
      return this.$store.state.general.alertOption.headerTexColor
    },
    alertOptionClickAcept() {
      return this.$store.state.general.alertOption.clickAcept
    },
    alertOptionClickCancel() {
      return this.$store.state.general.alertOption.clickCancel
    },
  },
  mounted() {
    this.$root.$on('bv::modal::hidden', (evt) => {
      if (evt.componentId === 'alertOption') {
        this.hideAlertDialogOption()
      }
    })
  },
  methods: {
    ...mapMutations({
      hideAlertDialogOption: 'general/hideAlertDialogOption',
    }),
  },
}
</script>
