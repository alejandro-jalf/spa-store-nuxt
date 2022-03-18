<template>
  <div>
    <h2 class="my-3">Codificador de articulos</h2>
    <b-input-group
      v-if="dataUser.tipo_user === 'manager'"
      prepend="Sucursal"
      class="mb-3"
    >
      <b-form-select
        :value="suc"
        :options="options"
        @change="selectSucursal"
      ></b-form-select>
    </b-input-group>

    <div class="container-indicator-scan">
      <div class="titleScan">Pase el escaner y espere hasta oir el pitido</div>
      <div id="scanner">
        <div id="container-escaner" class="text-center">
          <div id="lector">
            <div id="laserImage"></div>
          </div>
          <div id="codeSend">{{ barcode }}</div>
          <div id="imageCodigo"></div>
          <div id="escaner">
            <div class="laser"></div>
          </div>
        </div>
      </div>
    </div>

    <b-card
      class="containerCard p-1 pb-4 mt-5"
      :class="variantTheme"
      :title="article.Articulo"
      :sub-title="article.Nombre"
    >
      <div class="mt-3">
        <span class="font-weight-bold">Codigo de barras:</span>
        {{ article.CodigoBarras }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Descripcion:</span>
        {{ article.Descripcion }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Relacion:</span>
        {{ article.Relacion }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Existencia UV:</span>
        {{
          utils.aplyFormatNumeric(
            utils.roundTo(article.ExistenciaActualRegular)
          )
        }}
        <Divider />
      </div>
      <div class="mt-3">
        <span class="font-weight-bold">Existencia UC:</span>
        {{ utils.aplyFormatNumeric(utils.roundTo(article.ExistenciaActualUC)) }}
        <Divider />
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import utils from '../modules/utils'
import Divider from '../components/Divider'

export default {
  components: {
    Divider,
  },
  data() {
    return {
      options: [],
      selected: null,
      utils,
    }
  },
  computed: {
    barcode() {
      const code = this.$store.state.codificadorarticulos.barCode
      const codeSend = this.$store.state.codificadorarticulos.codeSend
      return code.trim() === '' ? codeSend : code
    },
    suc() {
      return this.$store.state.codificadorarticulos.sucursal
    },
    dataUser() {
      return this.$store.state.user.user
    },
    article() {
      return this.$store.state.codificadorarticulos.article.data[0]
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
  },
  mounted() {
    if (this.dataUser.tipo_user !== 'manager') {
      const sucursal = this.utils.getSucursalByName(this.dataUser.sucursal_user)
      this.setSucursal(sucursal)
    }
    this.setDataForCompany()
  },
  methods: {
    ...mapMutations({
      setSucursal: 'codificadorarticulos/setSucursal',
    }),
    selectSucursal(sucursal) {
      this.selected = sucursal
      this.setSucursal(sucursal)
    },
    setDataForCompany() {
      const sucSplited = this.dataUser.sucursal_user.split(' ')
      this.company =
        sucSplited[0].trim().toUpperCase() === 'CAASA' ? 'CAASA' : 'SPA'
      if (this.company === 'SPA') {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'ZR', text: 'Zaragoza' },
          { value: 'VC', text: 'Victoria' },
          { value: 'OU', text: 'Oluta' },
          { value: 'JL', text: 'Jaltipan' },
          { value: 'BO', text: 'Bodega' },
        ]
      } else {
        this.options = [
          { value: null, text: 'Seleccione una sucursal' },
          { value: 'SU', text: 'Super' },
          { value: 'MA', text: 'Mayoreo' },
          { value: 'RE', text: 'Reparto' },
          { value: 'EN', text: 'Enriquez' },
          { value: 'SA', text: 'Sayula' },
          { value: 'SB', text: 'Sayula Bodega' },
        ]
      }
      const sucFinded = this.options.find((suc) => suc.value === this.selected)
      if (!sucFinded) this.selected = null
    },
  },
}
</script>

<style scoped>
.container-indicator-scan {
  text-align: center;
}

.titleScan {
  font-size: 20px;
  margin-bottom: 15px;
  font-family: Arial, Helvetica, sans-serif;
  font-style: italic;
}

#scanner {
  width: 200px;
  height: 200px;
  border-radius: 3%;
  margin-bottom: 30px;
  margin: auto;
}

#container-escaner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3%;
}

#codeSend {
  position: absolute;
  left: 0px;
  bottom: 32px;
  width: 100%;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  color: black;
  z-index: 3;
}

#imageCodigo {
  position: absolute;
  color: black;
  width: 100%;
  height: 100%;
  background-image: url('../assets/codigo1.jpg');
  background-size: 100% 100%;
  border-radius: 3%;
  z-index: 2;
}

#lector {
  position: absolute;
  max-width: 200px;
  max-height: 200px;
  width: 100%;
  height: 100%;
  border-radius: 3%;
  left: 0px;
  top: 0px;
  background: #464545;
}

#escaner {
  background: rgba(255, 0, 0, 0.507);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  border-radius: 3%;
  border: 3px solid #505050;
}

.laser,
#laserImage {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  background: rgb(255, 195, 195);
  height: 4px;
  box-shadow: 0px 0px 9px 5px #ff0000;
}

#laserImage {
  z-index: 3;
  box-shadow: 0px 0px 7px 3px #ff0000;
  height: 1px;
  top: 50%;
  width: 96%;
  left: 2%;
}
</style>
