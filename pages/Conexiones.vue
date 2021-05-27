<template>
  <div id="containerConexiones">
    <float-button :click-float="loadConexiones"></float-button>
    <b-list-group class="mt-5">
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
  data() {
    return {
      paddingInitial: 0,
    }
  },
  computed: {
    conexiones() {
      return this.$store.state.conexiones.conexiones.data
    },
    thereAreConections() {
      return !!this.$store.state.conexiones.conexiones.data
    },
  },
  mounted() {
    const heightBody = window.document.body.clientHeight
    let heightWindow = window.innerHeight
    let padding = heightWindow - heightBody
    this.paddingInitial = padding
    const heightInitial = heightWindow
    const containerConexiones = document.querySelector('#containerConexiones')

    containerConexiones.style.paddingBottom = padding + 'px'
    window.addEventListener('resize', () => {
      heightWindow = window.innerHeight
      padding = this.paddingInitial - (heightInitial - heightWindow)

      containerConexiones.style.paddingBottom = padding + 'px'
    })
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
      const heightBody = window.document.body.clientHeight
      const heightWindow = window.innerHeight
      const padding = this.paddingInitial + (heightWindow - heightBody)
      const containerConexiones = document.querySelector('#containerConexiones')
      containerConexiones.style.paddingBottom = padding + 'px'
    },
  },
}
</script>
