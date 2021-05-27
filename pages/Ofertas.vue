<template>
  <div>
    <h1 class="text-center">Programacion de ofertas</h1>
    <b-button
      v-if="viewCrearOferta"
      variant="success"
      class="mb-3"
      @click="programarOferta()"
    >
      <b-icon-folder-plus></b-icon-folder-plus>
      Programar nueva oferta
    </b-button>
    <div v-if="viewCrearOferta" id="groupDate">
      <b-button-group>
        <b-button
          :pressed="activeDateM"
          variant="outline-primary"
          @click="setActiveDate('month')"
        >
          {{ textDateM }}
        </b-button>
        <b-button
          :pressed="activeDateY"
          variant="outline-primary"
          @click="setActiveDate('year')"
        >
          {{ textDateY }}
        </b-button>
        <b-button
          :pressed="activeDateA"
          variant="outline-primary"
          @click="setActiveDate('all')"
        >
          Todas
        </b-button>
      </b-button-group>
    </div>
    <oferta-form v-if="programandoOferta" class="pt-2 pb-2 mb-3"></oferta-form>
    <oferta-lista
      v-if="programandoListaOferta"
      class="pb-2 mb-3"
    ></oferta-lista>
    <div v-if="viewCrearOferta" class="container-table-ofe">
      <b-table
        hover
        head-variant="dark"
        fixed
        outlined
        responsive
        :items="listaOfertas"
        :fields="fields"
        :class="variantThemeTableBody"
      >
        <template #cell(Acciones)="row">
          <b-button size="sm" class="mr-2" @click="viewDetails(row.item.uuid)">
            Detalles
          </b-button>
          <b-button
            size="sm"
            class="mr-2 mt-2"
            variant="danger"
            @click="viewDetails(row.item.uuid)"
          >
            Eliminar
          </b-button>
        </template>
        <template #cell(fechaInico)="row">
          {{ utils.parseFecha(row.item.fechaInico) }}
        </template>
        <template #cell(fechaFin)="row">
          {{ utils.parseFecha(row.item.fechaFin) }}
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { BIconFolderPlus } from 'bootstrap-vue'
import OfertaForm from '../components/OfertaForm'
import OfertaLista from '../components/OfertaLista'
import utils from '../modules/utils'

export default {
  components: {
    OfertaForm,
    OfertaLista,
    BIconFolderPlus,
  },
  data() {
    return {
      activeDateY: false,
      activeDateM: true,
      activeDateA: false,
      textDateY: '',
      textDateM: '',
      active: 'month',
      utils,
      fields: [
        'uuid',
        'status',
        'tipoOferta',
        'fechaInico',
        'fechaFin',
        'descripcion',
        'Acciones',
      ],
    }
  },
  computed: {
    variantThemeTableBody() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'darkThemeTableBody'
        return ''
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'darkThemeTableBody'
      else if (this.$store.state.general.themePreferences === 'sepia')
        return 'sepiaThemeItemList'
      else return ''
    },
    listaOfertas() {
      return Object.values(this.$store.state.ofertas.listaOfertas)
    },
    programandoOferta() {
      return this.$store.state.ofertas.programandoOferta
    },
    programandoListaOferta() {
      return this.$store.state.ofertas.programandoListaOferta
    },
    viewCrearOferta() {
      if (
        !this.$store.state.ofertas.programandoOferta &&
        !this.$store.state.ofertas.programandoListaOferta
      ) {
        return true
      }
      return false
    },
  },
  mounted() {
    const date = new Date()
    this.textDateY = date.getFullYear().toString()
    this.textDateM = utils._arrayMonths[date.getMonth()] + '/' + this.textDateY
  },
  methods: {
    setActiveDate(from) {
      this.active = from
      this.activeDateY = false
      this.activeDateA = false
      this.activeDateM = false
      if (this.active === 'month') this.activeDateM = true
      if (this.active === 'year') this.activeDateY = true
      if (this.active === 'all') this.activeDateA = true
    },
    ...mapMutations({
      setProgramandoOferta: 'ofertas/setProgramandoOferta',
      setEditandoOferta: 'ofertas/setEditandoOferta',
      cleanOfertaActual: 'ofertas/cleanOfertaActual',
      openOfertaByUuid: 'ofertas/openOfertaByUuid',
      setEditable: 'ofertas/setEditable',
      setProgramandoLista: 'ofertas/setProgramandoLista',
    }),
    programarOferta() {
      this.setEditandoOferta(false)
      this.setProgramandoOferta(true)
      this.setEditable(true)
      this.cleanOfertaActual()
    },
    viewDetails(uuid) {
      this.setProgramandoLista(true)
      this.setEditable(false)
      this.openOfertaByUuid(uuid)
    },
  },
}
</script>

<style scoped>
.container-table-ofe {
  overflow: auto;
  margin-bottom: 30px;
}

#groupDate {
  float: right;
}

@media screen and (max-width: 480px) {
  #groupDate {
    float: none;
    margin-bottom: 5px;
  }
}
</style>
