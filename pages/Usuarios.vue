<template>
  <div id="containerUsuarios" class="pt-5">
    <float-button
      v-if="userViewed === 0"
      :click-float="toggleShowOptions"
      :icon-float="iconFloatUser"
      font-scale="1.5"
    ></float-button>

    <transition name="fade">
      <div v-if="showOptions">
        <b-avatar
          class="floatAdd"
          variant="success"
          size="45px"
          :button="true"
          @click="newUser()"
        >
          <b-icon-plus font-scale="2"></b-icon-plus>
        </b-avatar>
        <b-avatar
          class="floatRefresh"
          variant="info"
          size="45px"
          :button="true"
          @click="loadUsers()"
        >
          <b-icon-arrow-clockwise font-scale="2"></b-icon-arrow-clockwise>
        </b-avatar>
      </div>
    </transition>

    <div v-if="userViewed === 0" @click="blurButton()">
      <b-table
        v-if="width > 767"
        hover
        head-variant="dark"
        outlined
        responsive
        :items="usersList"
        :fields="fields"
        :class="variantItem"
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

      <div v-else class="mt-3">
        <b-alert
          v-if="Object.values(usersList).length === 0"
          show
          variant="warning"
        >
          {{ messageListUsers }}
        </b-alert>
        <b-card
          v-for="(user, indexUser) in usersList"
          :key="indexUser"
          no-body
          class="containerCard"
        >
          <b-card-body class="bodyCardUser">
            <div class="lineBorder"></div>
            <div>
              <div class="leftCard">
                <b-avatar
                  :variant="variantCard(user.Status)"
                  class="avatarUser"
                ></b-avatar>
                {{ user.Status }}
              </div>
              <div class="rightCard">
                <div class="listDataCardUSer font-weight-bold">
                  {{ user.Correo }}
                </div>
                <div class="listDataCardUSer">{{ user.Nombre }}</div>
                <div class="listDataCardUSer privilegiosUser">
                  {{ user.Privilegios }}
                </div>
                <b-dropdown id="dropdown-1" text="Pestañas" variant="info">
                  <b-dropdown-item
                    v-for="(acess, indexAccessCard) in user.Accesos"
                    :key="indexAccessCard"
                    disabled
                  >
                    {{ acess.trim() }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
            <div class="actionsUser">
              <b-button variant="warning" @click="viewUser(user)">
                <b-icon-pencil-square></b-icon-pencil-square>
              </b-button>
              <b-button
                :variant="activo_user(user.Status)"
                @click="showAlertDialogOpt(user)"
              >
                <b-icon-toggle-on
                  v-if="user.Status === 'Activo'"
                ></b-icon-toggle-on>
                <b-icon-toggle-off v-else></b-icon-toggle-off>
              </b-button>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>

    <usuarios-view v-else class="mt-5" :load-users="loadUsers"></usuarios-view>

    <div style="margin-top: 90px"></div>

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
import {
  BIconToggleOff,
  BIconToggleOn,
  BIconPencilSquare,
  BIconArrowClockwise,
  BIconPlus,
} from 'bootstrap-vue'
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
    BIconArrowClockwise,
    BIconPlus,
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
      width: 0,
      showOptions: false,
      messageListUsers: 'Lista de usuarios no ha sido cargada',
    }
  },
  computed: {
    variantItem() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeItemList'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeItemList'
      else return ''
    },
    iconFloatUser() {
      return this.showOptions ? 'x' : 'person-lines-fill'
    },
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

    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
    })
  },
  methods: {
    blurButton() {
      this.showOptions = false
    },
    closeOptions() {
      this.showOptions = false
    },
    toggleShowOptions() {
      this.showOptions = !this.showOptions
    },
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
      changeUSer: 'user/changeUSer',
      setUserViewed: 'user/setUserViewed',
    }),
    variantCard(status) {
      return status === 'Activo' ? 'info' : 'danger'
    },
    activo_user(activo) {
      return activo === 'Activo' ? 'success' : 'danger'
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
      this.closeOptions()
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
      this.closeOptions()
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
          this.messageListUsers = 'Lista de usuarios vacia'
        } else {
          this.messageListUsers = 'Fallos al cargar lista de usuarios'
        }
        this.setLoading(false)
      } catch (error) {
        this.messageListUsers = 'Fallos al cargar lista de usuarios'
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
.containerCard {
  margin-bottom: 10px;
  box-shadow: 2px 2px 2px #e6e6e6;
}

.bodyCardUser {
  position: relative;
  padding: 15px 20px;
}

.lineBorder {
  position: absolute;
  width: 5px;
  display: block;
  height: 96%;
  top: 2%;
  left: 5px;
  border-radius: 2px;
  background: rgb(50, 0, 83);
}

.leftCard {
  text-align: center;
  display: inline-block;
  width: 25%;
}

.avatarUser {
  width: 100px;
  height: 100px;
}

.rightCard {
  display: inline-block;
  width: 74%;
}

.listDataCardUSer {
  margin-bottom: 5px;
}

.privilegiosUser {
  font-style: italic;
  text-decoration: underline;
}

.actionsUser {
  text-align: right;
  margin-top: 10px;
}

.floatAdd,
.floatRefresh {
  position: fixed;
  bottom: 95px;
  right: 23px;
  z-index: 5;
  box-shadow: 1px 2px 5px 1px rgb(114, 114, 114);
}

.floatRefresh {
  bottom: 150px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 574px) {
  .bodyCardUser {
    padding: 15px 12px;
  }
}

@media screen and (max-width: 500px) {
  .avatarUser {
    width: 50px;
    height: 50px;
  }
  .leftCard {
    text-align: left;
    width: 100%;
  }
  .rightCard {
    width: 100%;
  }
  .actionsUser {
    margin-top: -38px;
  }
  .bodyCardUser {
    padding-left: 20px;
  }
}

@media screen and (max-width: 350px) {
  .bodyCardUser {
    padding-left: 12px;
  }
  .lineBorder {
    width: 4px;
    left: 2px;
    height: 90%;
    top: 5%;
  }
}
</style>
