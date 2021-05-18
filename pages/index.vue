<template>
  <div class="container">
    <div>
      <h1 class="mt-4 text-center title">Super Promociones de Acayucan</h1>
      <div class="text-center mb-3">
        <img src="../assets/cesta.png" alt="" width="250px" />
      </div>
      <b-card
        header-bg-variant="info"
        header-text-variant="white"
        border-variant="info"
        class="mb-5"
      >
        <template #header>
          <b-icon icon="gear-fill"></b-icon>
          Configuraciones
        </template>
        <div class="font-weight-bold">Pagina inicial:</div>
        <hr class="m-0 mb-2" />
        <div class="titleConf">
          La opcion seleccionada es la que se abrira al iniciar la aplicación
        </div>
        <b-button
          v-for="(tab, indexTab) in listAccess"
          :key="indexTab"
          variant="outline-info"
          class="buttonSelect text-left"
          :pressed="activo(tab)"
          :block="blockButton"
          @click="setActivo(tab)"
        >
          <b-icon :icon="iconActivo(tab)" scale="0.7"></b-icon>
          {{ tab }}
        </b-button>

        <b-button
          variant="success"
          class="float-right mt-5"
          :block="blockButton"
          @click="showAlertDialogOpt()"
        >
          <b-icon icon="shield-fill-check"></b-icon>
          Guardar Cambios
        </b-button>
      </b-card>
    </div>
    <alert-option
      :alert-title="dataAlertOptions.title"
      :alert-message="dataAlertOptions.message"
      :alert-show="dataAlertOptions.show"
      :click-cancel="hideAlertDialogOpt"
      :click-acept="savePrincipal"
    ></alert-option>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import AlertOption from '../components/AlertOption'

export default {
  components: {
    AlertOption,
  },
  data() {
    return {
      user: this.$store.state.user.user.correo_user,
      principal: 'ventav',
      width: 0,
      dataAlertOptions: {
        show: false,
        title: 'Modificando la pantalla principal',
        message:
          '¿Quieres establecer a _ como pantalla principal al iniciar la aplicacion web?',
      },
      listTabs: this.$store.state.general.listTabs,
    }
  },
  computed: {
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
  },
  mounted() {
    this.width = window.innerWidth
    const that = this

    const user = { ...that.$store.state.user.user }
    this.principal = user.principal

    window.addEventListener('resize', () => {
      that.width = window.innerWidth
    })
  },
  methods: {
    showAlertDialogOpt() {
      this.dataAlertOptions.show = true
      this.dataAlertOptions.message = `¿Quieres establecer a "${this.principal}" como pantalla principal al iniciar la aplicacion web?`
    },
    hideAlertDialogOpt() {
      this.dataAlertOptions.show = false
    },
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setUser: 'user/setUser',
    }),
    activo(tab) {
      return tab === this.principal
    },
    iconActivo(tab) {
      return tab !== this.principal ? 'square' : 'check-square-fill'
    },
    setActivo(tab) {
      this.principal = tab
    },
    async savePrincipal() {
      try {
        this.hideAlertDialogOpt()
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

@media screen and (max-width: 768px) {
  .title {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
