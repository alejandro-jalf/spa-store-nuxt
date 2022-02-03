<template>
  <div id="containerConexiones">
    <float-button :click-float="loadConexiones"></float-button>
    <b-list-group class="pt-5">
      <conexiones-item-skeleton
        v-if="!thereAreConections"
      ></conexiones-item-skeleton>
      <div v-else>
        <conexiones-item
          v-for="(item, indexCon) of conexiones"
          :key="indexCon"
          :sucursal="item"
        ></conexiones-item>
      </div>
    </b-list-group>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ConexionesItem from '../components/ConexionesItem'
import ConexionesItemSkeleton from '../components/ConexionesItemSkeleton'
import FloatButton from '../components/FloatButton'

export default {
  components: {
    ConexionesItem,
    ConexionesItemSkeleton,
    FloatButton,
  },
  computed: {
    dataUser() {
      return this.$store.state.user.user
    },
    conexiones() {
      return this.$store.state.conexiones.conexiones.data
    },
    thereAreConections() {
      return !!this.$store.state.conexiones.conexiones.data
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.dataUser)
  },
  methods: {
    ...mapActions({
      verifyConexiones: 'conexiones/verifyConexiones',
    }),
    ...mapMutations({
      setLoading: 'general/setLoading',
    }),
    async loadConexiones() {
      this.setLoading(true)
      await this.verifyConexiones([this.dataUser.sucursal_user, this.$store])
      this.setLoading(false)
    },
  },
}
</script>
