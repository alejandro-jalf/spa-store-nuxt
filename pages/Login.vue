<template>
  <div class="text-center">
    <h1 class="text-center mt-2 mb-5 title">{{ textTitle }}</h1>
    <b-avatar class="avatar-login">
      <b-icon :icon="recoveryPasswordIcon" font-scale="7.5" />
    </b-avatar>

    <b-form class="text-left">
      <div v-if="!recoveryPassword">
        <b-form-group
          id="input-group-1"
          label="Correo Electronico"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            placeholder="Ingrese su correo electronico"
            required
            @keyup.enter="focusPassword()"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Contraseña:"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            ref="password"
            v-model="form.password"
            :type="form.typePassword"
            placeholder="Contraseña"
            required
            @keyup.enter="iniciaSesion()"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox
          id="checkbox-1"
          v-model="form.typePassword"
          name="checkbox-1"
          value="text"
          unchecked-value="password"
          class="mb-4"
        >
          Mostrar contraseña
        </b-form-checkbox>

        <b-button
          type="button"
          variant="primary"
          :block="blockButton"
          @click="iniciaSesion()"
        >
          Iniciar Sesion
        </b-button>
      </div>

      <div v-else>
        <b-form-group
          id="groupREcovery"
          label="Correo electronico:"
          label-for="inputEmailRecovery"
          description="Escriba el correo con el que entrar normalmente a la aplicacion"
        >
          <b-form-input
            id="inputEmailRecovery"
            v-model="form.emailRecovery"
            type="email"
            placeholder="alguien@dominio.subdominio"
            @keyup.enter="recovery()"
          ></b-form-input>
        </b-form-group>

        <div class="text-right mt-5 mb-5">
          <b-button
            variant="secondary"
            :block="blockButton"
            @click="recoveryPassword = false"
          >
            Cancelar
          </b-button>
          <b-button variant="success" :block="blockButton" @click="recovery()">
            Recuperar
          </b-button>
        </div>
      </div>
    </b-form>
    <div
      v-if="!recoveryPassword"
      class="lostPassword"
      @click="recoveryPassword = true"
    >
      Olvide mi contraseña
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        typePassword: 'password',
        emailRecovery: '',
      },
      login: this.$store.state.user.login,
      listTabs: this.$store.state.general.listTabs,
      recoveryPassword: false,
    }
  },
  computed: {
    recoveryPasswordIcon() {
      return this.recoveryPassword ? 'person-badge-fill' : 'person-fill'
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    blockButton() {
      return this.width <= 500
    },
    textTitle() {
      return this.recoveryPassword
        ? 'Recuperando contraseña'
        : 'Iniciando sesion'
    },
  },
  methods: {
    focusPassword() {
      this.$refs.password.focus()
    },
    ...mapActions({
      initSesion: 'user/initSesion',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    async iniciaSesion() {
      if (this.form.email.trim() === '') {
        this.showAlertDialog([
          'Correo no puede quedar vacio',
          'Campos vacios',
          'warning',
        ])
        return
      }
      if (this.form.password.trim() === '') {
        this.showAlertDialog([
          'Campo contraseña no puede quedar vacio',
          'Campos vacios',
          'warning',
        ])
        return
      }

      this.setLoading(true)
      const response = await this.initSesion([
        this.form.email,
        this.form.password,
      ])
      if (response.case)
        this.showAlertDialog([
          'Ha ocurrido en la aplicacion',
          'Error en la ejecuion',
          'danger',
        ])
      else if (!response.success)
        this.showAlertDialog([
          response.message,
          'Error al intentar iniciar sesion',
        ])
      else {
        this.showAlertDialog([
          response.message,
          'Exito al iniciar sesion',
          'success',
        ])
        const user = response.data
        const tabFinded = this.listTabs.find(
          (tab) => tab.nickname === user.principal
        )
        if (tabFinded) this.$router.replace({ path: tabFinded.path })
        else {
          this.showAlertDialog([
            'La ruta establecida como principal, ya no esta disponible, esta siendo redireccionado a Inicio',
          ])
          this.$router.replace({ path: '/' })
        }
      }
      this.setLoading(false)
    },
    async recovery() {
      try {
        if (this.form.emailRecovery.trim() === '') {
          this.showAlertDialog([
            'Correo no puede quedar vacio',
            'Campos vacios',
            'warning',
          ])
          return
        }
        this.setLoading(true)
        const response = await this.$axios({
          url:
            process.env.spastore_base_url +
            'api/v1/usuarios/' +
            this.form.emailRecovery +
            '/recovery',
          method: 'put',
          headers: {
            'access-token': process.env.spastore_token,
          },
        })

        if (response.data.success) {
          this.showAlertDialog([
            response.data.message,
            'Exito en la recuperacion',
            'success',
          ])
          this.recoveryPassword = false
        } else {
          this.showAlertDialog([
            response.data.message,
            'Error en la recuperacion',
            'warning',
          ])
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        if (error.response) {
          // eslint-disable-next-line no-console
          console.log(error.response)
          this.showAlertDialog([
            error.response.data.message,
            'Error al intentar recuperar su cuenta',
            'danger',
          ])
        } else {
          // eslint-disable-next-line no-console
          console.log(error)
          this.showAlertDialog([
            'Error inesperado con la api',
            'Error al intentar recuperar su contraseña',
            'danger',
          ])
        }
      }
    },
  },
}
</script>

<style scoped>
.avatar-login {
  width: 200px;
  height: 200px;
  margin-bottom: 100px;
}

.lostPassword {
  font-size: 15px;
  color: blue;
  text-decoration: underline;
  margin-bottom: 50px;
  margin-top: 30px;
  cursor: pointer;
}

.lostPassword:hover {
  color: rgb(2, 2, 90);
}

@media screen and (max-width: 480px) {
  .title {
    font-size: x-large;
  }
}
</style>
