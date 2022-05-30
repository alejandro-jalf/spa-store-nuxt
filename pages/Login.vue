<template>
  <div class="text-center">
    <h1 class="text-center mt-2 mb-5 title">{{ textTitle }}</h1>

    <b-form class="text-left form-design">
      <img src="../assets/cesta.png" class="logoSpa" />
      <div v-if="!recoveryPassword">
        <b-form-group
          id="input-group-1"
          label="Correo Electronico"
          label-for="input-1"
        >
          <b-input-group>
            <template #prepend>
              <b-icon icon="person-fill" class="prepend-form" />
            </template>
            <b-form-input
              id="input-1"
              v-model="form.email"
              type="email"
              placeholder="Ingrese su correo electronico"
              required
              @keyup.enter="focusPassword()"
            ></b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Contraseña:"
          label-for="input-2"
        >
          <b-input-group>
            <template #prepend>
              <b-icon icon="lock-fill" class="prepend-form" />
            </template>
            <b-form-input
              id="input-2"
              ref="password"
              v-model="form.password"
              :type="form.typePassword"
              placeholder="Contraseña"
              required
              @keyup.enter="iniciaSesion()"
            ></b-form-input>
          </b-input-group>
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
          :block="true"
          @click="iniciaSesion()"
        >
          Iniciar Sesion
        </b-button>
        <div class="lostPassword" @click="recoveryPassword = true">
          Olvide mi contraseña
        </div>
      </div>

      <div v-else>
        <div class="back-recovery" @click="recoveryPassword = false">
          <b-icon icon="arrow-left" />
          Regresar
        </div>
        <b-form-group
          id="groupREcovery"
          label="Correo electronico:"
          label-for="inputEmailRecovery"
          description="Escriba el correo con el que entrar normalmente a la aplicacion"
        >
          <b-input-group>
            <template #prepend>
              <b-icon icon="person-fill" class="prepend-form" />
            </template>
            <b-form-input
              id="inputEmailRecovery"
              v-model="form.emailRecovery"
              type="email"
              placeholder="alguien@dominio.subdominio"
              @keyup.enter="recovery()"
            ></b-form-input>
          </b-input-group>
        </b-form-group>

        <div class="text-right mt-5 mb-5">
          <b-button variant="primary" :block="true" @click="recovery()">
            Recuperar
          </b-button>
        </div>
      </div>
    </b-form>
    <div class="bottom-component"></div>
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
    width() {
      return this.$store.state.general.widthWindow
    },
    blockButton() {
      return this.width <= 500
    },
    textTitle() {
      return this.recoveryPassword ? 'Recuperando contraseña' : 'Login'
    },
  },
  mounted() {
    this.setTabActual('Login')
  },
  methods: {
    focusPassword() {
      this.$refs.password.focus()
    },
    ...mapActions({
      initSesion: 'user/initSesion',
    }),
    ...mapMutations({
      setTabActual: 'general/setTabActual',
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
          this.showAlertDialog([
            error.response.data.message,
            'Error al intentar recuperar su cuenta',
            'danger',
          ])
        } else {
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
.title {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-style: italic;
}

.form-design {
  position: relative;
  margin: auto;
  max-width: 700px;
  color: #000;
  background: #fff;
  border-radius: 8px;
  box-shadow: 4px 4px 8px 1px rgba(1, 88, 155, 0.478);
  padding: 8% 5% 4% 5%;
  margin-bottom: 5%;
}

.back-recovery {
  font-weight: 600;
  font-size: 17px;
  position: absolute;
  top: 30px;
  left: 5%;
  cursor: pointer;
}

.back-recovery:hover {
  color: rgb(3, 1, 169);
  text-decoration: underline;
}

.logoSpa {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
  margin-left: calc(50% - 100px);
}

.prepend-form {
  border-radius: 8px 0px 0px 8px;
  background: rgba(0, 136, 255, 0.451);
  height: 38px;
  width: 35px;
  padding: 5px 2px;
  border: 1px solid rgb(199, 199, 199);
}

.lostPassword {
  margin-left: 40%;
  margin-top: 28px;
  font-size: 15px;
  color: rgb(33, 3, 157);
  cursor: pointer;
}

.lostPassword:hover {
  text-decoration: underline;
  color: rgb(5, 5, 5);
}

.bottom-component {
  margin-bottom: 250px;
}

@media screen and (max-width: 480px) {
  .title {
    font-size: x-large;
  }
}
</style>
