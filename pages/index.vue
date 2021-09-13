<template>
  <div class="pb-5">
    <div>
      <h1 class="pt-4 text-center title">Super Promociones de Acayucan</h1>
      <div class="text-center mb-3">
        <img src="../assets/cesta.png" alt="" width="250px" />
      </div>
      <b-card
        :header-bg-variant="variantCard"
        header-text-variant="white"
        :border-variant="variantCard"
        :class="headerConfig"
      >
        <template #header>
          <b-icon icon="gear-fill" />
          Configuraciones
        </template>
        <div class="font-weight-bold">Pagina inicial:</div>
        <hr class="m-0 mb-2" :class="themeHr" />
        <div class="titleConf">
          La opcion seleccionada es la que se abrira al iniciar la aplicación
        </div>
        <div>
          <b-button
            v-for="(tab, indexTab) in listAccess"
            :key="indexTab"
            variant="outline-info"
            class="buttonSelect text-left"
            :pressed="activo(tab)"
            :block="blockButton"
            @click="setActivo(tab)"
          >
            <b-icon :icon="activoIcon(tab)" scale="0.7" />
            {{ tab }}
          </b-button>
        </div>

        <b-button
          variant="success"
          class="float-right mt-2"
          :block="blockButton"
          @click="questionSaveMain()"
        >
          <b-icon icon="shield-fill-check" />
          Guardar Cambios
        </b-button>

        <div class="DivitionOption">
          <div class="font-weight-bold">Tema:</div>
          <hr class="m-0 mb-2 bg-white" />
          <div class="titleConf">
            Puede cambiar el color de tema de la aplicacion
          </div>

          <b-button
            :variant="variantTheme"
            :block="blockButton"
            :pressed="themPreferencesSys"
            @click="changeTheme('system')"
          >
            <b-icon icon="tv-fill" />
            Sistema
          </b-button>
          <b-button
            :variant="variantTheme"
            :block="blockButton"
            :pressed="themPreferencesDar"
            @click="changeTheme('dark')"
          >
            <b-icon icon="moon" />
            Oscuro
          </b-button>
          <b-button
            :variant="variantTheme"
            :block="blockButton"
            :pressed="themPreferencesLig"
            @click="changeTheme('light')"
          >
            <b-icon icon="brightness-high-fill" />
            Claro
          </b-button>
          <b-button
            :variant="variantTheme"
            :block="blockButton"
            :pressed="themPreferencesSep"
            @click="changeTheme('sepia')"
          >
            <b-icon icon="cup-fill" />
            Sepia
          </b-button>
          <div v-if="width < 992 || width > 1390" class="mt-4">
            <div @click="addAtajo">
              <b-icon :icon="atajoThemeIcon" :variant="atajoThemeVariant" />
              Agregar a menu lateral
            </div>
          </div>
        </div>

        <div v-if="width < 992" class="DivitionOption">
          <div class="font-weight-bold">Barra inferior:</div>
          <hr class="m-0 mb-2 bg-white" />
          <div class="titleConf">
            Puede colocar las pestañas en una barra inferior
          </div>

          <div class="mt-4">
            <div @click="changeBarraInferior">
              <b-icon
                :icon="barraInferiorIcon"
                :variant="barraInferiorVariant"
              />
              Barra inferior
            </div>
          </div>
        </div>

        <div class="DivitionOption">
          <div class="font-weight-bold">Cambio de contraseña:</div>
          <hr class="m-0 mb-2 bg-white" />
          <div class="titleConf">
            Puede cambiar su contraseña en el momento que crea conveniente
          </div>
          <div>
            <b-form inline>
              <b-form-input
                id="inputName"
                v-model="password.newPassword"
                :state="password.statePassword"
                type="password"
                placeholder="Nueva contraseña"
                :class="backgroundInputTheme"
                trim
                @keyup="veryfyPassword()"
                @keyup.enter="$refs.passwRep.focus()"
              ></b-form-input>
              <b-form-input
                id="inputAp"
                ref="passwRep"
                v-model="password.newPasswordRepeat"
                type="password"
                :state="password.statePasswordRepeat"
                placeholder="Repita su contraseña"
                :class="backgroundInputTheme"
                trim
                @keyup="verifyPasswordRepeat()"
                @keyup.enter="$refs.passwAct.focus()"
              ></b-form-input>
              <b-form-input
                id="inputAm"
                ref="passwAct"
                v-model="password.passwordActual"
                type="password"
                placeholder="Contraseña actual"
                :class="backgroundInputTheme"
                trim
                @keyup.enter="questionChangePassword()"
              ></b-form-input>
            </b-form>
            <div
              v-if="!password.statePassword || !password.statePasswordRepeat"
              class="description"
            >
              {{ password.textDescription }}
            </div>
          </div>

          <b-button
            variant="success"
            class="float-right mt-2"
            :block="blockButton"
            @click="questionChangePassword()"
          >
            <b-icon icon="key-fill" />
            Cambiar contraseña
          </b-button>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      user: this.$store.state.user.user.correo_user,
      principal: 'ventav',
      dataAlertOptions: {
        show: false,
        title: 'Modificando la pantalla principal',
        message:
          '¿Quieres establecer a _ como pantalla principal al iniciar la aplicacion web?',
        clickAccept: () => {},
      },
      listTabs: this.$store.state.general.listTabs,
      password: {
        newPassword: '',
        newPasswordRepeat: '',
        passwordActual: '',
        textDescription: '',
        statePassword: false,
        statePasswordRepeat: false,
      },
    }
  },
  computed: {
    width() {
      return this.$store.state.general.widthWindow
    },
    atajoTheme() {
      return this.$store.state.general.atajoTheme
    },
    atajoThemeIcon() {
      return this.$store.state.general.atajoTheme !== 'false'
        ? 'check-square-fill'
        : 'square-fill'
    },
    atajoThemeVariant() {
      return this.$store.state.general.atajoTheme !== 'false' ? 'info' : ''
    },
    barraInferior() {
      return this.$store.state.general.barraInferior
    },
    barraInferiorVariant() {
      return this.$store.state.general.barraInferior !== 'false' ? 'info' : ''
    },
    barraInferiorIcon() {
      return this.$store.state.general.barraInferior !== 'false'
        ? 'check-square-fill'
        : 'square-fill'
    },
    backgroundInputTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'passwordChange backgroundInputDark'
        return 'passwordChange backgroundInput'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'passwordChange backgroundInputDark'
      else return 'passwordChange backgroundInput'
    },
    headerConfig() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkBodyCard'
        return ''
      }
      if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaBodyCard'
      return this.$store.state.general.themePreferences === 'dark'
        ? 'darkBodyCard'
        : ''
    },
    variantCard() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'dark'
        return 'info'
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'dark'
        : 'info'
    },
    themeHr() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'bg-white'
        return ''
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'bg-white'
        : ''
    },
    themPreferencesSys() {
      return this.$store.state.general.themePreferences === 'system'
    },
    themPreferencesDar() {
      return this.$store.state.general.themePreferences === 'dark'
    },
    themPreferencesLig() {
      return this.$store.state.general.themePreferences === 'light'
    },
    themPreferencesSep() {
      return this.$store.state.general.themePreferences === 'sepia'
    },
    variantTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'outline-light'
        return 'outline-dark'
      }
      return this.$store.state.general.themePreferences === 'dark'
        ? 'outline-light'
        : 'outline-dark'
    },
    listAccess() {
      if (this.$store.state.user.user.access_to_user) {
        const tabsUser = this.$store.state.user.user.access_to_user.split(',')
        return this.listTabs.reduce((acumTab, tab) => {
          const tabFinded = tabsUser.find((tUser) => tUser === tab.name)
          if (tabFinded) acumTab.push(tab.nickname)
          return acumTab
        }, [])
      }
      return []
    },
    blockButton() {
      return this.width <= 500
    },
    typeUSer() {
      return this.$store.state.user.user.tipo_user
    },
  },
  mounted() {
    const that = this
    const user = { ...that.$store.state.user.user }
    this.principal = user.principal
  },
  methods: {
    addAtajo() {
      const atajoRefactor = this.atajoTheme === 'true' ? 'false' : 'true'
      this.setAtajoTheme(atajoRefactor)
    },
    changeBarraInferior() {
      const barraRefactor = this.barraInferior === 'true' ? 'false' : 'true'
      this.setBarraInferior(barraRefactor)
    },
    ...mapActions({
      logout: 'user/logout',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      showAlertDialogOption: 'general/showAlertDialogOption',
      hideAlertDialogOption: 'general/hideAlertDialogOption',
      setUser: 'user/setUser',
      setThemePreferences: 'general/setThemePreferences',
      setAtajoTheme: 'general/setAtajoTheme',
      setBarraInferior: 'general/setBarraInferior',
    }),
    changeTheme(theme) {
      this.setThemePreferences(theme)
    },
    activo(tab) {
      return tab === this.principal
    },
    iconActivo(tab) {
      return tab !== this.principal
    },
    activoIcon(tab) {
      return tab !== this.principal ? 'square' : 'check-square-fill'
    },
    setActivo(tab) {
      this.principal = tab
    },
    questionSaveMain() {
      this.showAlertDialogOption([
        `¿Quieres establecer a "${this.principal}" como pantalla principal al iniciar la aplicacion web?`,
        'Cambiando la pantalla principal',
        this.savePrincipal,
        this.hideAlertDialogOption,
        'warning',
      ])
    },
    async savePrincipal() {
      try {
        this.hideAlertDialogOption()
        this.setLoading(true)
        const response = await this.$axios({
          url:
            process.env.spastore_base_url +
            'api/v1/usuarios/' +
            this.user +
            '/main',
          method: 'put',
          headers: {
            'access-token': process.env.spastore_token,
          },
          data: {
            principal: this.principal,
          },
        })

        if (response.data.success) {
          this.showAlertDialog([
            response.data.message,
            'Exito en la actualizacion',
            'success',
          ])
          this.loadUser()
        } else {
          this.showAlertDialog([
            response.data.message,
            'Error en la actualizacion',
            'warning',
          ])
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.error, 'danger'])
        else this.showAlertDialog(['Error inesperado con la api', 'danger'])
      }
    },
    async loadUser() {
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: process.env.spastore_base_url + 'api/v1/usuarios/' + this.user,
          method: 'get',
          headers: {
            'access-token': process.env.spastore_token,
          },
        })

        if (response.data.success) {
          const user = response.data.data[0]
          this.setUser(user)
          this.user = user.correo_user
          this.principal = user.principal
        } else {
          this.showAlertDialog([
            `Se ha establecido la pantalla principal en base de datos, pero ocurrio un error durante la recarga de los datos en su equipo local, se recomienda cerrar sesion y iniciar de nuevo para que se puedan ver los cambios en su equipo local`,
            'Fallo la recarga del usuario',
            'warning',
          ])
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        if (error.response)
          this.showAlertDialog([error.response.data.error, 'danger'])
        else this.showAlertDialog(['Error inesperado con la api', 'danger'])
      }
    },
    veryfyPassword() {
      const password = this.password.newPassword

      if (password.length < 7) {
        this.password.statePassword = false
        this.password.textDescription =
          'La contraseña debe de ser mayor de 6 caracteres'
        return
      }

      const expresionLetters = new RegExp('[a-z]|[A-Z]')
      const expresionNumbers = new RegExp('\\d+')

      this.password.statePassword =
        expresionLetters.test(this.password.newPassword) &&
        expresionNumbers.test(this.password.newPassword)

      if (!this.password.statePassword) {
        this.password.textDescription =
          'La contraseña debe contener al menos una letra un numero'
        return
      }

      if (this.password.newPassword !== this.password.newPasswordRepeat) {
        this.password.statePasswordRepeat = false
        this.password.textDescription = 'Las contraseñas no coinciden'
      } else {
        this.password.statePasswordRepeat = true
        this.password.textDescription = ''
      }
    },
    verifyPasswordRepeat() {
      if (this.password.statePassword) {
        if (this.password.newPasswordRepeat !== this.password.newPassword) {
          this.password.statePasswordRepeat = false
          this.password.textDescription = 'Las contraseñas no coinciden'
        } else {
          this.password.statePasswordRepeat = true
          this.password.textDescription = ''
        }
      }
    },
    questionChangePassword() {
      if (!this.password.statePassword || !this.password.statePasswordRepeat) {
        this.showAlertDialog([
          'Verifique los requerimientos para su nueva contraseña',
          'Errores en su nueva contraseña',
          'warning',
          'dark',
        ])
        return
      }

      if (this.password.passwordActual === '') {
        this.showAlertDialog([
          'Campo contraseña actual no puede quedar vacio',
          'Error en contraseña actual',
          'warning',
          'dark',
        ])
        return
      }

      if (this.password.passwordActual === this.password.newPassword) {
        this.showAlertDialog([
          'Los datos de contraseña actual y nueva contraseña son iguales',
          'Error en el cambio de contraseña',
          'warning',
          'dark',
        ])
        return
      }

      this.showAlertDialogOption([
        '¿Quiere cambiar su contraseña?',
        'Cambiando su contraseña',
        this.changePassword,
        this.hideAlertDialogOption,
        'warning',
      ])
    },
    async changePassword() {
      try {
        this.hideAlertDialogOption()
        this.setLoading(true)
        const response = await this.$axios({
          url:
            process.env.spastore_base_url +
            'api/v1/usuarios/' +
            this.user +
            '/password',
          method: 'put',
          headers: {
            'access-token': process.env.spastore_token,
          },
          data: {
            password_user: this.password.passwordActual.trim(),
            new_password_user: this.password.newPassword.trim(),
          },
        })

        if (response.data.success) {
          this.showAlertDialog([
            response.data.message,
            'Exito en la actualizacion',
            'success',
          ])
          const that = this
          this.logout([that.$store, that.$router])
        } else {
          this.showAlertDialog([
            response.data.message,
            'Error en la actualizacion',
            'warning',
          ])
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        if (error.response) {
          this.showAlertDialog([
            error.response.data.message,
            'Error al intentar cambiar la contraseña',
            'warning',
            'dark',
          ])
        } else {
          this.showAlertDialog([
            'Error inesperado con la api',
            'Error al intentar cambiar la contraseña',
            'danger',
          ])
        }
      }
    },
  },
}
</script>

<style scoped>
.buttonSelect {
  padding: 0px 3px;
  padding-right: 5px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.titleConf {
  font-weight: 500;
  margin-bottom: 10px;
}

.DivitionOption {
  margin-top: 70px;
}

.passwordChange {
  width: 32%;
  margin-left: 1%;
}

.description {
  color: red;
  font-size: 14px;
  margin-left: 2px;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 30px;
    font-weight: bold;
  }
  .DivitionOption {
    margin-top: 110px;
  }
  .passwordChange {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 5px;
  }
}
</style>
