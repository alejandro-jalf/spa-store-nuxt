<template>
  <div>
    <float-button :click="loadUsers"></float-button>
    <b-table
      hover
      head-variant="dark"
      fixed
      outlined
      :items="usersList"
      :fields="fields"
      class="table-productos"
    >
      <template #cell(Acciones)="row">
        <b-button
          variant="warning"
          size="sm"
          class="mb-1"
          @click="console.log(row)"
        >
          <b-icon-pencil-square></b-icon-pencil-square>
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          class="mb-1"
          @click="console.log(row.item.articulo)"
        >
          <b-icon-trash></b-icon-trash>
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
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconTrash, BIconPencilSquare } from 'bootstrap-vue'
import FloatButton from '../components/FloatButton'

export default {
  components: {
    FloatButton,
    BIconPencilSquare,
    BIconTrash,
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
    }
  },
  computed: {
    usersList() {
      // eslint-disable-next-line no-console
      console.log(this.listUsers)
      if (this.listUsers.length > 0) {
        const users = this.listUsers.reduce((acumUsers, user) => {
          acumUsers.push({
            Correo: user.correo_user,
            Nombre: `${user.nombre_user} ${user.apellido_p_user} ${user.apellido_m_user}`,
            Accesos: user.access_to_user.split(','),
            Privilegios: user.tipo_user,
            Status: user.activo_user,
          })

          return acumUsers
        }, [])
        return users
      }
      return this.listUsers
    },
  },
  mounted() {
    // localStorage.removeItem('spastore_users_list')
    // eslint-disable-next-line no-console
    console.log(sessionStorage.getItem('spastore_users_list'))
    if (sessionStorage.getItem('spastore_users_list')) {
      const jsonData = JSON.parse(sessionStorage.getItem('spastore_users_list'))
      // eslint-disable-next-line no-console
      console.log(jsonData)
      this.listUsers = jsonData.a
    }
  },
  methods: {
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
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
          // eslint-disable-next-line no-console
          console.log(arrayTemporal)
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
  },
}
</script>

<style scoped>
.table-productos {
  margin-top: 40px;
}
</style>
