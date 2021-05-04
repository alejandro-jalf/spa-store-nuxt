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
    <b-form-checkbox v-model="userActual.activo_user" switch class="mb-2">
      {{ status_user }}
    </b-form-checkbox>

    <div class="float-right mt-5">
      <b-button variant="primary" @click="saveChanges()">
        Guardar Cambios
      </b-button>
      <b-button variant="secondary" @click="back()">Regresar</b-button>
    </div>
  </b-card>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    loadUsers: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      userActual: {},
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
    }
  },
  computed: {
    usuarioActual() {
      const user = this.$store.state.user.userActualView
      return user.correo_user || 'No seleccionado'
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
  },
  mounted() {
    const user = this.$store.state.user.userActualView
    this.userActual = user ? { ...user } : {}
    const access = this.userActual.access_to_user.split(',')
    this.tabsAccess = access.reduce((acumAccess, item) => {
      acumAccess.push(item.trim())
      return acumAccess
    }, [])
  },
  methods: {
    ...mapMutations({
      setUserViewed: 'user/setUserViewed',
      showAlertDialog: 'general/showAlertDialog',
      setLoading: 'general/setLoading',
    }),
    back() {
      this.setUserViewed(false)
    },
    async saveChanges() {
      try {
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
          this.setUserViewed(false)
          this.loadUsers()
        } else {
          this.showAlertDialog([
            response.data.message,
            'Error al actualizar',
            'warning',
          ])
        }
        this.setLoading(false)
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
</style>
