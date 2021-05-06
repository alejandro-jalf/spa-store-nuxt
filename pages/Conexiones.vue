<template>
  <div>
    <float-button :click="loadConexiones"></float-button>
    <b-list-group class="mt-5">
      <div v-if="!thereAreConections">
        <conexiones-item-skeleton
          v-for="skeleto in conexionesSkeleton"
          :key="skeleto + 'skeleto'"
        ></conexiones-item-skeleton>
      </div>
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
  data() {
    return {
      conexionesSkeleton: [0, 1, 2, 3, 4],
    }
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
