<template>
  <div>
    <float-button :click="loadConexiones"></float-button>
    <b-list-group class="mt-5">
      <conexiones-item-skeleton
        v-if="!thereAreConections"
      ></conexiones-item-skeleton>
      <div v-else>
        <conexiones-item
          v-for="(item, index) of conexiones"
          :key="index"
          :sucursal="item"
        ></conexiones-item>
      </div>
    </b-list-group>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ConexionesItem from '../components/ConexionesItem'
import ConexionesItemSkeleton from '../Components/ConexionesItemSkeleton'
import FloatButton from '../Components/FloatButton'

export default {
  components: {
    ConexionesItem,
    ConexionesItemSkeleton,
    FloatButton,
  },
  computed: {
    conexiones() {
      return this.$store.state.conexiones.conexiones.data
    },
    thereAreConections() {
      return this.$store.state.conexiones.conexiones.data
        ? this.$store.state.conexiones.conexiones.data.length
        : 0
    },
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
      await this.verifyConexiones()
      this.setLoading(false)
    },
  },
}
</script>
