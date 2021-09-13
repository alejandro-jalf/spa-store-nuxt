<template>
  <b-modal
    id="alertSimple"
    :visible="alertShow"
    :title="alertTitle"
    :header-bg-variant="alertHeaderBg"
    :header-text-variant="alertHeaderText"
    :centered="true"
    :body-bg-variant="bodyBgVariant"
    :footer-bg-variant="bodyBgVariant"
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
    bodyBgVariant() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      else return 'light'
    },
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
  mounted() {
    this.$root.$on('bv::modal::hidden', (evt) => {
      if (evt.componentId === 'alertSimple') {
        this.hideAlertDialog()
      }
    })
  },
  methods: {
    ...mapMutations({
      hideAlertDialog: 'general/hideAlertDialog',
    }),
  },
}
</script>
