<template>
  <b-modal
    id="alertSimple"
    :visible="alertShow"
    :title="alertTitle"
    :header-bg-variant="alertHeaderBg"
    :header-text-variant="alertHeaderText"
    :header-border-variant="alertHeaderBorder"
    :centered="true"
    :body-bg-variant="bodyBgVariant"
    :body-text-variant="textBgVariant"
    :footer-bg-variant="bodyBgVariant"
    :footer-text-variant="textBgVariant"
    :footer-border-variant="bodyBgVariant"
  >
    <b-container fluid>
      <div v-for="(parrafo, indexP) in alertMessage" :key="indexP">
        <br />
        {{ parrafo }}
      </div>
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
    alertShow() {
      return this.$store.state.general.alert.show
    },
    alertTitle() {
      return this.$store.state.general.alert.title
    },
    alertMessage() {
      const parrafos = this.$store.state.general.alert.message.split('<br/>')
      return parrafos
    },
    alertHeaderBg() {
      const variant = this.$store.state.general.alert.headerBackground
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
    alertHeaderText() {
      const variant = this.$store.state.general.alert.headerBackground
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
    alertHeaderBorder() {
      const variant = this.$store.state.general.alert.headerBackground
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
