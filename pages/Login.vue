<template>
  <div class="text-center">
    <h1 class="text-center mt-2 mb-5">Iniciando Sesion</h1>
    <b-avatar class="avatar-login"></b-avatar>

    <b-form class="text-left mb-5">
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
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Contraseña:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          :type="form.typePassword"
          placeholder="Contraseña"
          required
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

      <b-button type="button" variant="primary" @click="iniciaSesion()">
        Iniciar Sesion
      </b-button>
    </b-form>
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
      },
      login: this.$store.state.user.login,
    }
  },
  computed: {},
  mounted() {
    if (this.login) this.$router.push({ name: 'About' })
    // eslint-disable-next-line no-console
    console.log(
      'Variables de entorno: ',
      this.$config,
      this.$config.spastore_token1
    )
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onReset(event) {
      event.preventDefault()
      this.form.email = ''
      this.form.password = ''
    },
    ...mapActions({
      initSesion: 'user/initSesion',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
    }),
    async iniciaSesion() {
      this.setLoading(true)
      const response = await this.initSesion([
        this.form.email,
        this.form.password,
      ])
      // eslint-disable-next-line no-console
      console.log(response)
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
        this.$router.push({ name: 'About' })
      }
      this.setLoading(false)
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
</style>
