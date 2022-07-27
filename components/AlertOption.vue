<template>
  <b-modal
    id="alertOption"
    :visible="alertOptionShow"
    :title="alertOptionTitle"
    :header-bg-variant="alertOptionHeaderBg"
    :header-text-variant="alertOptionHeaderText"
    :header-border-variant="alertOptionHeaderBorder"
    :centered="true"
    :body-bg-variant="bodyBgVariant"
    :body-text-variant="textBgVariant"
    :footer-bg-variant="bodyBgVariant"
    :footer-text-variant="textBgVariant"
    :footer-border-variant="bodyBgVariant"
  >
    <b-container fluid>
      {{ alertOptionMessage }}
    </b-container>

    <template #modal-footer>
      <div class="w-100">
        <b-button
          :variant="variantAccept"
          size="sm"
          class="float-right"
          @click="alertOptionClickAcept"
        >
          Aceptar
        </b-button>
        <b-button
          :variant="variantCancel"
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
    bodyBgVariant() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'secondary'
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'secondary'
      else return 'light'
    },
    textBgVariant() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'light'
        return 'dark'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'light'
      else return 'dark'
    },
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
      const variant = this.$store.state.general.alertOption.headerBg
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'dark'
        return variant
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      return variant
    },
    alertOptionHeaderText() {
      const variant = this.$store.state.general.alertOption.headerBg
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return variant
        return 'dark'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return variant
      else if (variant === 'warning' || variant === 'light') return 'dark'
      return 'light'
    },
    alertOptionHeaderBorder() {
      const variant = this.$store.state.general.alertOption.headerBg
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return variant
        return 'light'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return variant
      return 'light'
    },
    variantAccept() {
      return this.$store.state.general.alertOption.headerBg
    },
    variantCancel() {
      const variant = this.$store.state.general.alertOption.headerBg
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        if (systemDark) return 'dark'
        return variant === 'primary' ? 'secondary' : 'primary'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'dark'
      return variant === 'primary' ? 'secondary' : 'primary'
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
