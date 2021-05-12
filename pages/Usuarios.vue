<template>
  <div>
    <float-button :click="loadUsers"></float-button>
    <b-button
      v-if="userViewed === 0"
      variant="success"
      class="mt-5"
      @click="newUser()"
    >
      <b-icon icon="person-plus-fill"></b-icon>
      Agregar usuario
    </b-button>
    <b-table
      v-if="userViewed === 0"
      hover
      head-variant="dark"
      outlined
      responsive
      :items="usersList"
      :fields="fields"
      class="table-productos"
    >
      <template #cell(Acciones)="row">
        <b-button
          variant="warning"
          size="sm"
          class="mb-1"
          @click="viewUser(row.item)"
        >
          <b-icon-pencil-square></b-icon-pencil-square>
        </b-button>
        <b-button
          :variant="activo_user(row.item.Status)"
          size="sm"
          class="mb-1"
          @click="showAlertDialogOpt(row.item)"
        >
          <b-icon-toggle-on
            v-if="row.item.Status === 'Activo'"
          ></b-icon-toggle-on>
          <b-icon-toggle-off v-else></b-icon-toggle-off>
        </b-button>
      </template>
      <template #cell(Accesos)="row">
        <b-dropdown id="dropdown-1" text="Pestañas" variant="info">
          <b-dropdown-item
            v-for="(acess, indexAccess) in row.item.Accesos"
            :key="indexAccess"
            disabled
          >
            {{ acess.trim() }}
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
    <usuarios-view v-else class="mt-5" :load-users="loadUsers"></usuarios-view>

    <alert-option
      :alert-title="dataAlertOptions.title"
      :alert-message="dataAlertOptions.message"
      :alert-show="dataAlertOptions.show"
      :click-cancel="hideAlertDialogOpt"
      :click-acept="aceptOption"
    ></alert-option>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconToggleOff, BIconToggleOn, BIconPencilSquare } from 'bootstrap-vue'
import FloatButton from '../components/FloatButton'
import UsuariosView from '../components/UsuariosView'
import AlertOption from '../components/AlertOption'

export default {
  components: {
    FloatButton,
    BIconPencilSquare,
    BIconToggleOn,
    BIconToggleOff,
    UsuariosView,
    AlertOption,
  },
  data() {
    return {
      fields: [
        'Correo',
        'Nombre',
        'Accesos',
        'Privilegios',
        'Status',
        'Acciones',
      ],
      listUsers: [],
      dataAlertOptions: {
        show: false,
        title: 'Cambiando status del usuario',
        message: '¿Quiere cambiar el estatus del usuario _ a _',
      },
    }
  },
  computed: {
    usersList() {
      if (this.listUsers.length > 0) {
        const users = this.listUsers.reduce((acumUsers, user) => {
          acumUsers.push({
            Correo: user.correo_user,
            Nombre: `${user.nombre_user} ${user.apellido_p_user} ${user.apellido_m_user}`,
            Accesos: user.access_to_user.split(','),
            Privilegios: user.tipo_user,
            Status: user.activo_user ? 'Activo' : 'Inactivo',
          })

          return acumUsers
        }, [])
        return users
      }
      return this.listUsers
    },
    userViewed() {
      return this.$store.state.user.userViewed
    },
  },
  mounted() {
    if (sessionStorage.getItem('spastore_users_list')) {
      const jsonData = JSON.parse(sessionStorage.getItem('spastore_users_list'))
      this.listUsers = jsonData.a
    }
  },
  methods: {
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
      changeUSer: 'user/changeUSer',
      setUserViewed: 'user/setUserViewed',
    }),
    activo_user(activo) {
      if (activo === 'Activo') return 'success'
      return 'danger'
    },
    viewUser(user) {
      const userFinded = this.listUsers.find(
        (userSearch) => userSearch.correo_user === user.Correo
      )
      const userToSave = userFinded || {}
      this.changeUSer(userToSave)
      this.setUserViewed(1)
    },
    newUser() {
      const userNew = {
        nombre_user: '',
        apellido_p_user: '',
        apellido_m_user: '',
        direccion_user: '',
        sucursal_user: 'Zaragoza',
        correo_user: '',
        tipo_user: 'invited',
        access_to_user: '',
        activo_user: true,
        password_user: '',
        password_user_repeat: '',
      }
      this.changeUSer(userNew)
      this.setUserViewed(2)
    },
    async loadUsers() {
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url: process.env.spastore_base_url + 'api/v1/usuarios',
          method: 'get',
          headers: {
            'access-token': process.env.spastore_token,
          },
        })

        if (response.data.success) {
          this.listUsers = response.data.data
          const arrayTemporal = { a: response.data.data }
          sessionStorage.setItem(
            'spastore_users_list',
            JSON.stringify(arrayTemporal)
          )
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response) {
          // eslint-disable-next-line no-console
          console.log(error.response)
          this.showAlertDialog([error.response.data.error])
        }
      }
    },
    async changeActivoUser(user) {
      try {
        this.setLoading(true)
        const response = await this.$axios({
          url:
            process.env.spastore_base_url +
            'api/v1/usuarios/' +
            user.Correo +
            '/status',
          method: 'put',
          headers: {
            'access-token': process.env.spastore_token,
          },
          data: {
            activo_user: !(user.Status === 'Activo'),
          },
        })

        if (response.data.success) {
          this.showAlertDialog([
            response.data.message,
            'Exito en la actualizacion',
            'success',
          ])
          this.loadUsers()
        }
        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response) {
          // eslint-disable-next-line no-console
          console.log(error.response)
          this.showAlertDialog([error.response.data.error])
        }
      }
    },
    showAlertDialogOpt(user) {
      this.dataAlertOptions.show = true
      const newStatus = user.Status === 'Activo' ? 'Inactivo' : 'Activo'
      this.dataAlertOptions.user = user
      this.dataAlertOptions.message = `¿Quiere cambiar el estatus del usuario "${user.Correo}" a ${newStatus}`
    },
    hideAlertDialogOpt() {
      this.dataAlertOptions.show = false
    },
    aceptOption() {
      this.changeActivoUser(this.dataAlertOptions.user)
      this.dataAlertOptions.show = false
    },
  },
}
</script>

<style scoped>
.table-productos {
  margin-top: 10px;
}
</style>
