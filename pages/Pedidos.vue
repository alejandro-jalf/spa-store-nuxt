<template>
  <div>
    <h2 class="text-center my-4">
      <b-icon icon="display"></b-icon>
      Monitor de pedidos - {{ sucursal }}
    </h2>
    <PedidosMaestros v-if="!viewDetails" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import PedidosMaestros from '../components/PedidosMaestros'
import utils from '../modules/utils'

export default {
  components: {
    PedidosMaestros,
  },
  data() {
    return {
      sucursal: 'Zaragoza',
      utils,
    }
  },
  computed: {
    dataUser() {
      return this.$store.state.user.user
    },
    viewDetails() {
      const view = this.$store.state.pedidos.viewDetails
      return typeof view === 'string' ? view === 'true' : view
    },
  },
  mounted() {
    this.setDataForUser()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'pedidos/setSucursal',
      showDetails: 'pedidos/showDetails',
    }),
    setDataForUser() {
      const user = this.$store.state.user.user
      let sucursalSplit = []
      let sucursal = ''
      if (user.tipo_user !== 'manager') {
        if (user.sucursal_user === 'Oficina') {
          this.setSucursal('ZR')
          sucursalSplit = ['Zaragoza']
        } else if (user.sucursal_user === 'CAASA OFICINA') {
          this.setSucursal('SU')
          sucursalSplit = ['Super']
        } else {
          this.setSucursal(this.utils.getSucursalByName(user.sucursal_user))
          sucursalSplit = user.sucursal_user.split(' ')
        }
      } else {
        const sucActual = this.$store.state.pedidos.sucursal
        const sucs = this.utils.sucursalesData
        const sucFinded = sucs.find((suc) => suc.alias === sucActual)
        if (!sucFinded) sucursalSplit = ['Zaragoza']
        else if (sucFinded.name === 'Oficina') sucursalSplit = ['Zaragoza']
        else if (sucFinded.name === 'CAASA OFICINA') sucursalSplit = ['Super']
        else sucursalSplit = sucFinded.name.split(' ')
      }
      if (sucursalSplit.length > 1) sucursal = sucursalSplit[1]
      else sucursal = sucursalSplit[0]
      this.sucursal = sucursal
    },
  },
}
</script>
