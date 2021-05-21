<template>
  <b-card
    border-variant="primary"
    header-bg-variant="primary"
    header-text-variant="white"
    :header="'Usuario: ' + usuarioActual"
    title="Datos del usuario"
    class="mb-4"
  >
    <b-form-group id="gpCorr" label="Correo electronico:" label-for="ipCorreo">
      <b-form-input
        id="ipCorreo"
        v-model="userActual.correo_user"
        type="email"
        placeholder="Direccion de correo"
        required
      ></b-form-input>
    </b-form-group>

    <div class="mt-2 mb-1">Nombre Completo:</div>
    <b-form inline>
      <b-form-input
        id="inputName"
        v-model="userActual.nombre_user"
        placeholder="Nombre(s)"
        class="name-complete"
      ></b-form-input>
      <b-form-input
        id="inputAp"
        v-model="userActual.apellido_p_user"
        placeholder="Apellido paterno"
        class="name-complete"
      ></b-form-input>
      <b-form-input
        id="inputAm"
        v-model="userActual.apellido_m_user"
        placeholder="Apellido materno"
        class="name-complete"
      ></b-form-input>
    </b-form>

    <b-form-group id="gpDir" label="Direccion:" label-for="inputDireccion">
      <b-form-input
        id="inputDireccion"
        v-model="userActual.direccion_user"
        type="email"
        placeholder="Calle, Colonia, Municipio"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-group id="gpSucursal" label="Sucursal:" label-for="inSucursal">
      <b-form-select
        id="inSucursal"
        v-model="userActual.sucursal_user"
        :options="sucursales"
        required
      ></b-form-select>
    </b-form-group>

    <div v-if="userViewed === 2">
      <b-form-group id="gpPass" label="Contraseña" label-for="ipPass">
        <b-form-input
          id="ipPass"
          v-model="userActual.password_user"
          :state="validation"
          type="password"
          placeholder="Ingrese su contraseña"
          required
        ></b-form-input>
        <b-form-invalid-feedback :state="validation">
          Debe ser mayor de 6 caracteres y debe tener al menos una letra y un
          numero
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation">
          Formato correcto de contraseña
        </b-form-valid-feedback>
      </b-form-group>

      <b-form-group id="rGpP" label="Repita su contraseña" label-for="rIpPass">
        <b-form-input
          id="rIpPass"
          v-model="userActual.password_user_repeat"
          :state="validationRepeatPassword"
          type="password"
          placeholder="Repita su contraseña"
          required
        ></b-form-input>
        <b-form-invalid-feedback :state="validationRepeatPassword">
          Las contraseñas no coinciden
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validationRepeatPassword">
          Contraseñas iguales
        </b-form-valid-feedback>
      </b-form-group>
    </div>

    <div v-b-toggle.dataExtra class="extras">
      <b-icon-arrow-down-circle-fill
        v-if="iconCollapse"
      ></b-icon-arrow-down-circle-fill>
      <b-icon-arrow-up-circle-fill v-else></b-icon-arrow-up-circle-fill>
      Datos extras
    </div>

    <b-collapse id="dataExtra">
      <b-form-group id="gpPriv" label="Privilegios:" label-for="inpPrivilegios">
        <b-form-select
          id="inpPrivilegios"
          v-model="userActual.tipo_user"
          :options="privilegios"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="gpAccess" label="Permisos para:" label-for="inpAccess">
        <b-form-select
          id="inpAccess"
          v-model="tabsAccess"
          :options="listTabs"
          multiple
          required
        ></b-form-select>
      </b-form-group>
      <div class="mt-3">
        Pestañas seleccionadas:
        <b-badge
          v-for="(tabAccess, indexTabAccess) in tabsAccess"
          :key="indexTabAccess"
          pill
          variant="primary"
          class="mr-1"
        >
          {{ tabAccess }}
        </b-badge>
      </div>

      <div class="mt-4 mb-1">Estatus del usuario:</div>
      <b-form-checkbox
        v-model="userActual.activo_user"
        :disabled="userViewed === 2"
        switch
        class="mb-2"
      >
        {{ status_user }}
      </b-form-checkbox>
    </b-collapse>

    <div class="containerButtons">
      <b-button variant="secondary" :block="blockButton" @click="back()">
        Regresar
      </b-button>
      <b-button
        v-if="userViewed === 2"
        variant="success"
        :block="blockButton"
        @click="createUser()"
      >
        Registrar
      </b-button>
      <b-button
        v-else
        variant="primary"
        :block="blockButton"
        @click="saveChanges()"
      >
        Guardar Cambios
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { BIconArrowDownCircleFill, BIconArrowUpCircleFill } from 'bootstrap-vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    BIconArrowDownCircleFill,
    BIconArrowUpCircleFill,
  },
  props: {
    loadUsers: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      userActual: {
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
      },
      sucursales: [
        'Zaragoza',
        'Victoria',
        'Oluta',
        'Jaltipan',
        'Bodega',
        'Oficina',
      ],
      privilegios: ['invited', 'executive', 'manager'],
      tabsAccess: [],
      tabsAvailable: [
        'index',
        'conexiones',
        'about',
        'ofertas',
        'ventav',
        'usuarios',
        'existenciasArticulos',
      ],
      iconCollapse: true,
      width: 0,
    }
  },
  computed: {
    blockButton() {
      return this.width <= 575
    },
    userViewed() {
      return this.$store.state.user.userViewed
    },
    usuarioActual() {
      const user = this.$store.state.user.userActualView
      if (this.userViewed === 1) return user.correo_user || 'No seleccionado'
      return user.correo_user || 'Nuevo usuario'
    },
    status_user() {
      return this.userActual.activo_user ? 'Activo' : 'Inactivo'
    },
    listTabs() {
      const list = this.$store.state.general.listTabs.reduce(
        (acumList, item) => {
          acumList.push(item.name)
          return acumList
        },
        []
      )
      return list
    },
    validation() {
      if (this.userActual.password_user.trim().length < 6) return false

      const expresionLetters = new RegExp('[a-z]|[A-Z]')
      const expresionNumbers = new RegExp('\\d+')

      return (
        expresionLetters.test(this.userActual.password_user) &&
        expresionNumbers.test(this.userActual.password_user)
      )
    },
    validationRepeatPassword() {
      return (
        this.userActual.password_user.trim() ===
        this.userActual.password_user_repeat.trim()
      )
    },
  },
  mounted() {
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
    })

    const user = this.$store.state.user.userActualView
    this.userActual = user ? { ...user } : {}

    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId === 'dataExtra') {
        if (!isJustShown) this.iconCollapse = true
        else this.iconCollapse = false
      }
    })

    if (this.userActual.access_to_user.trim().length === 0) this.tabsAccess = []
    else {
      const access = this.userActual.access_to_user.split(',')
      this.tabsAccess = access.reduce((acumAccess, item) => {
        acumAccess.push(item.trim())
        return acumAccess
      }, [])
    }
  },
  methods: {
    ...mapMutations({
      setUserViewed: 'user/setUserViewed',
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
    back() {
      this.setUserViewed(0)
    },
    validateData() {
      if (this.userActual.nombre_user.trim() === '') {
        this.showAlertDialog(['Nombre no puede quedar vacio'])
        return false
      }
      if (this.userActual.apellido_p_user.trim() === '') {
        this.showAlertDialog(['Apellido paterno no puede quedar vacio'])
        return false
      }
      if (this.userActual.apellido_m_user.trim() === '') {
        this.showAlertDialog(['Apellido materno no puede quedar vacio'])
        return false
      }
      if (this.userActual.direccion_user.trim() === '') {
        this.showAlertDialog(['Direccion no puede quedar vacio'])
        return false
      }
      if (this.userActual.correo_user.trim() === '') {
        this.showAlertDialog(['Correo no puede quedar vacio'])
        return false
      }

      if (this.$store.state.user.userViewed === 2) {
        if (this.userActual.password_user.trim() === '') {
          this.showAlertDialog(['La contraseña no puede quedar vacia'])
          return false
        }
        if (this.userActual.password_user_repeat.trim() === '') {
          this.showAlertDialog(['Debe repetir su contraseña'])
          return false
        }
        if (
          this.userActual.password_user.trim() !==
          this.userActual.password_user_repeat.trim()
        ) {
          this.showAlertDialog(['Las contraseñas no coinciden'])
          return false
        }
        if (!this.validation) {
          this.showAlertDialog([
            'Contraseña insegura, verifique el formato correcto',
          ])
          return false
        }
      }

      if (this.tabsAccess.length === 0) {
        this.showAlertDialog(['Debe darle acceso a por lo menos una pestaña'])
        return false
      }
      return true
    },
    async createUser() {
      try {
        if (this.validateData()) {
          this.setLoading(true)
          const response = await this.$axios({
            url: process.env.spastore_base_url + 'api/v1/usuarios',
            method: 'post',
            headers: {
              'access-token': process.env.spastore_token,
            },
            data: {
              nombre_user: this.userActual.nombre_user.trim(),
              apellido_p_user: this.userActual.apellido_p_user.trim(),
              apellido_m_user: this.userActual.apellido_m_user.trim(),
              direccion_user: this.userActual.direccion_user.trim(),
              sucursal_user: this.userActual.sucursal_user,
              correo_user: this.userActual.correo_user.trim(),
              password_user: this.userActual.password_user.trim(),
              tipo_user: this.userActual.tipo_user,
              access_to_user: this.tabsAccess.toString(),
            },
          })

          if (response.data.success) {
            this.showAlertDialog([
              response.data.message,
              'Exito en el registro',
              'success',
            ])
            this.setUserViewed(0)
            this.loadUsers()
          } else {
            this.showAlertDialog([
              response.data.message,
              'Error al intentar realizar el registro',
              'warning',
            ])
          }
          this.setLoading(false)
        }
      } catch (error) {
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response) {
          // eslint-disable-next-line no-console
          console.log(error.response)
          this.showAlertDialog([
            error.response.data.message,
            'Error al intentar realizar el registro',
            'danger',
          ])
        }
      }
    },
    async saveChanges() {
      try {
        if (this.validateData()) {
          this.setLoading(true)
          const response = await this.$axios({
            url:
              process.env.spastore_base_url +
              'api/v1/usuarios/' +
              this.$store.state.user.userActualView.correo_user,
            method: 'put',
            headers: {
              'access-token': process.env.spastore_token,
            },
            data: {
              nombre_user: this.userActual.nombre_user.trim(),
              apellido_p_user: this.userActual.apellido_p_user.trim(),
              apellido_m_user: this.userActual.apellido_m_user.trim(),
              direccion_user: this.userActual.direccion_user.trim(),
              sucursal_user: this.userActual.sucursal_user,
              correo_user: this.userActual.correo_user.trim(),
              tipo_user: this.userActual.tipo_user,
              access_to_user: this.tabsAccess.toString(),
              activo_user: this.userActual.activo_user,
            },
          })

          if (response.data.success) {
            this.showAlertDialog([
              response.data.message,
              'Exito en la actualizacion',
              'success',
            ])
            this.setUserViewed(0)
            this.loadUsers()
          } else {
            this.showAlertDialog([
              response.data.message,
              'Error al actualizar',
              'warning',
            ])
          }
          this.setLoading(false)
        }
      } catch (error) {
        this.setLoading(false)
        // eslint-disable-next-line no-console
        console.log(error)
        if (error.response) {
          // eslint-disable-next-line no-console
          console.log(error.response)
          this.showAlertDialog([
            error.response.data.message,
            'Error al actualizar',
            'danger',
          ])
        }
      }
    },
  },
}
</script>

<style scoped>
.name-complete {
  width: 32%;
  margin-left: 1%;
}

#inputName {
  width: 34%;
  margin-left: 0px;
}

.containerButtons {
  margin-top: 20px;
}

.extras {
  border-bottom: 1px solid rgb(138, 138, 138);
  padding-bottom: 5px;
}

@media screen and (max-width: 575px) {
  .name-complete {
    width: 100%;
    margin-left: 0px;
    margin-bottom: 10px;
  }

  #inputName {
    width: 100%;
    margin-left: 0px;
  }
  .btnOptions {
    width: 100%;
  }
}

@media screen and (min-width: 576px) {
  .containerButtons {
    float: right;
  }
}
</style>
