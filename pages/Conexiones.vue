<template>
  <div>
    <float-button :click="loadConexiones"></float-button>
    <b-list-group class="mt-5">
      <ConexionesItemSkeleton
        v-for="skeleto in conexionesSkeleton"
        :key="skeleto + 'skeleto'"
      />
      <ConexionesItem
        v-for="(item, index) of conexiones"
        :key="index"
        :sucursal="item"
      />
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
