<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta: ' + uuid"
      :title="tipoOferta + ' Del ' + fechaInico + ' al ' + fechaFin"
    >
      <b-alert variant="warning" :show="!ofertaEditable">
        Oferta no editable
      </b-alert>
      <div :show="ofertaEditable">
        <b-card-text class="font-weight-bold mt-3 mb-1">
          Elija un articulo
        </b-card-text>
        <divider></divider>
        <b-form inline class="mt-2">
          <b-form-input
            id="codigo-articulo"
            v-model="formArticulo.articulo"
            placeholder="Codigo de articulo"
            @keyup.enter="getArticuloByArticulo"
          ></b-form-input>
          <b-form-input
            id="codigo-barras"
            v-model="formArticulo.codigobarras"
            placeholder="Codigo de barras"
          ></b-form-input>
          <b-form-input
            id="nombre-articulo"
            v-model="formArticulo.nombre"
            placeholder="Nombre articulo"
          ></b-form-input>
        </b-form>
        <message-text
          message="No se encontro el articulo"
          :show-message="showError"
          color-text="text-danger"
          class="mb-2"
        ></message-text>
        <b-card-text class="font-weight-bold mb-1">
          Datos de la oferta para el articulo: 0090098
        </b-card-text>
        <divider class="mb-2"></divider>
        <b-form inline class="mt-2 mb-2">
          <b-form-input
            id="input-costo"
            v-model="formArticulo.costo"
            placeholder="Costo"
            class="input-resp-dt-ofe"
            readonly
          ></b-form-input>
          <b-form-input
            id="input-precio"
            v-model="formArticulo.precio"
            placeholder="Precio"
            class="input-resp-dt-ofe"
            readonly
          ></b-form-input>
          <b-form-input
            id="input-margen"
            v-model="formArticulo.margen"
            placeholder="Margen"
            class="input-resp-dt-ofe"
            readonly
          ></b-form-input>
          <b-form-input
            id="input-oferta"
            v-model="formArticulo.oferta"
            placeholder="Precio de oferta"
            class="input-resp-dt-ofe"
            @keyup="calcUtilidad"
          ></b-form-input>
          <b-form-input
            id="input-utilidad"
            v-model="formArticulo.utilidad"
            placeholder="Utilidad"
            class="input-resp-dt-ofe"
            :state="state_utulidad"
            readonly
          ></b-form-input>
        </b-form>
        <b-button variant="success" class="mb-3">
          <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
          Agregar a la lista
        </b-button>
      </div>
      <b-card-text class="font-weight-bold mb-1">
        Articulos incluidos
      </b-card-text>
      <divider class="mb-2"></divider>
      <div class="container-table">
        <b-table
          hover
          head-variant="dark"
          fixed
          outlined
          :items="listaProductos"
          :fields="fields"
          class="table-productos"
        >
          <template #cell(Acciones)="row" :show="ofertaEditable">
            <b-button
              variant="warning"
              size="sm"
              class="mb-1"
              @click="row.toggleDetails"
            >
              <b-icon-pencil-square></b-icon-pencil-square>
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              class="mb-1"
              @click="row.toggleDetails"
            >
              <b-icon-trash></b-icon-trash>
            </b-button>
          </template>
        </b-table>
      </div>
      <div v-if="ofertaEditable" class="text-right mt-3 buttons-end">
        <b-button variant="danger" @click="cancelarOferta">
          <b-icon-trash-fill></b-icon-trash-fill>
          Cancelar oferta
        </b-button>
        <b-button variant="primary">
          <b-icon-cloud-upload-fill></b-icon-cloud-upload-fill>
          Guardar y enviar
        </b-button>
        <b-button variant="info" @click="$bvToast.show('toast-create-ofer')">
          <b-icon-question-circle-fill></b-icon-question-circle-fill>
        </b-button>
        <b-toast
          id="toast-create-ofer"
          title="Ayuda"
          static
          no-auto-hide
          class="toast-buttons text-justify"
          variant="info"
          solid
        >
          Al dar click en "Cancelar oferta" se eliminara toda la oferta junto
          con todos los articulos registrados.
          <br />
          <br />
          Al dar click en "Guardar y enviar" la oferta sera almacenada y enviada
          para su programacion
        </b-toast>
      </div>
      <div v-if="!ofertaEditable" class="text-right mt-3 buttons-end">
        <b-button variant="secondary" @click="setProgramandoLista(false)">
          <b-icon-file-earmark-excel-fill></b-icon-file-earmark-excel-fill>
          Cerrar
        </b-button>
        <b-button variant="primary">
          <b-icon-folder-symlink-fill></b-icon-folder-symlink-fill>
          Guardar cambios
        </b-button>
        <b-button variant="info" @click="$bvToast.show('toast-view-ofert')">
          <b-icon-question-circle-fill></b-icon-question-circle-fill>
        </b-button>
        <b-toast
          id="toast-view-ofert"
          title="Ayuda"
          static
          no-auto-hide
          class="toast-buttons text-justify"
          variant="info"
          solid
        >
          Al dar click en "Cerrar" solamente se cerrar la oferta, esto no afecta
          en nada a los datos ya registrado.
          <br />
          <br />
          <div>
            Al dar click en "Guardar cambios" Se guardara los ajustes que se le
            haya realizado a algun producto y en automatico se enviaran los
            datos.
          </div>
        </b-toast>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  BIconPencilSquare,
  BIconTrash,
  BIconPlusCircleFill,
  BIconTrashFill,
  BIconCloudUploadFill,
  BIconQuestionCircleFill,
  BIconFileEarmarkExcelFill,
  BIconFolderSymlinkFill,
} from 'bootstrap-vue'
import utils from '../modules/utils'
import Divider from './Divider'
import MessageText from './MessageText'

export default {
  components: {
    BIconPencilSquare,
    BIconTrash,
    Divider,
    BIconPlusCircleFill,
    BIconTrashFill,
    BIconCloudUploadFill,
    BIconQuestionCircleFill,
    BIconFileEarmarkExcelFill,
    BIconFolderSymlinkFill,
    MessageText,
  },
  data() {
    return {
      formArticulo: {
        articulo: '',
        codigobarras: '',
        nombre: '',
        precio: '',
        costo: '',
        margen: '',
        oferta: '0.00',
        utilidad: '',
      },
      showError: false,
      state_utulidad: false,
      fields: [
        'Articulo',
        'Nombre',
        'Costo',
        'Precio',
        'Utilidad',
        'Precio_Oferta',
        'Margen',
        'Acciones',
      ],
      articulos: [
        {
          articulo: '0102126',
          codigobarras: '7501003337887',
          nombre: 'Ablandador Carnes MC 155gr',
          precio: '16.000000',
          costo: '12.713600',
        },
        {
          articulo: '0102134',
          codigobarras: '7501003300843',
          nombre: 'Te Manzanilla MC C/25',
          precio: '17.000000',
          costo: '13.560000',
        },
        {
          articulo: '0102137',
          codigobarras: '7501005151955',
          nombre: 'Mayo. Hellmanns 190gr',
          precio: '10.000000',
          costo: '8.330000',
        },
        {
          articulo: '0102159',
          codigobarras: '041351914639',
          nombre: 'Pimienta negra mol tones 511g',
          precio: '218.000000',
          costo: '186.088661',
        },
        {
          articulo: '0102160',
          codigobarras: '041351913878',
          nombre: 'Ablandador Carnes Tones 1.175KG',
          precio: '138.000000',
          costo: '54.659518',
        },
        {
          articulo: '0102161',
          codigobarras: '041351914899',
          nombre: 'Sazonador Carnes Tones 681gr',
          precio: '195.000000',
          costo: '159.964464',
        },
        {
          articulo: '0102340',
          codigobarras: '7501017043262',
          nombre: 'Mayo. La Costeña 330gr',
          precio: '22.000000',
          costo: '20.400000',
        },
        {
          articulo: '0102343',
          codigobarras: '7506192505802',
          nombre: 'Ade. Riko Pollo 33gr',
          precio: '4.500000',
          costo: '3.250000',
        },
        {
          articulo: '0102346',
          codigobarras: '7501003308696',
          nombre: 'Mayo. MC Habanero SQ 345gr',
          precio: '23.000000',
          costo: '19.480000',
        },
        {
          articulo: '0102350',
          codigobarras: '7501058628503',
          nombre: 'Salsa Soya Maggi 140ml',
          precio: '17.000000',
          costo: '14.330000',
        },
        {
          articulo: '0102372',
          codigobarras: '7501003312808',
          nombre: 'Te Manzanilla MC C/200',
          precio: '118.000000',
          costo: '90.700000',
        },
        {
          articulo: '0102377',
          codigobarras: '7501005100854',
          nombre: 'Sazonador Costilla Knorr 10g',
          precio: '24.000000',
          costo: '12.900000',
        },
        {
          articulo: '0102391',
          codigobarras: '7501052470016',
          nombre: 'Ade. Ensalada Est. Cesar CJ 237ml',
          precio: '21.000000',
          costo: '17.460000',
        },
        {
          articulo: '0102394',
          codigobarras: '7501003314918',
          nombre: 'Te Jengibre/Limon Mc Cormick 35gr c/25',
          precio: '40.000000',
          costo: '32.500000',
        },
        {
          articulo: '0102433',
          codigobarras: '7501017035168',
          nombre: 'Mayo. La Costeña 1.8kg',
          precio: '98.500000',
          costo: '98.000000',
        },
        {
          articulo: '0102436',
          codigobarras: '086141002615',
          nombre: 'Te de Manzanilla Anis La Pastora 24gr',
          precio: '25.000000',
          costo: '21.000000',
        },
        {
          articulo: '0102441',
          codigobarras: '7500533001602',
          nombre: 'Paprika Est. Esp Tones 405gr',
          precio: '130.000000',
          costo: '109.040000',
        },
        {
          articulo: '0102446',
          codigobarras: '7501791601313',
          nombre: 'Sal con Ajo Great Value 125gr',
          precio: '20.000000',
          costo: '15.900000',
        },
        {
          articulo: '0103001',
          codigobarras: '7501000913343',
          nombre: 'Pap. Gerber E2 Pera 100gr',
          precio: '8.500000',
          costo: '7.080000',
        },
      ],
    }
  },
  computed: {
    ofertaEditable() {
      return this.$store.state.ofertas.ofertaEditable
    },
    listaProductos() {
      return this.$store.state.ofertas.ofertaActual.listaProductos
    },
    uuid() {
      return this.$store.state.ofertas.ofertaActual.uuid
    },
    tipoOferta() {
      return this.$store.state.ofertas.ofertaActual.tipoOferta
    },
    fechaInico() {
      return utils.parseFecha(this.$store.state.ofertas.ofertaActual.fechaInico)
    },
    fechaFin() {
      return utils.parseFecha(this.$store.state.ofertas.ofertaActual.fechaFin)
    },
    descripcion() {
      return this.$store.state.ofertas.ofertaActual.descripcion
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
  },
  methods: {
    calcUtilidad() {
      const porcentaje = utils.parseToPorcent(
        utils.roundTo(1 - this.formArticulo.costo / this.formArticulo.oferta)
      )
      this.formArticulo.utilidad = `${porcentaje}%`
      if (porcentaje < 9) {
        this.state_utulidad = false
      } else {
        this.state_utulidad = true
      }
    },
    ...mapMutations({
      setProgramandoLista: 'ofertas/setProgramandoLista',
    }),
    cancelarOferta() {
      this.setProgramandoLista(false)
    },
    getArticuloByArticulo() {
      const articulofinded = this.articulos.find((element) => {
        return element.articulo === this.formArticulo.articulo
      })
      if (articulofinded === undefined) {
        this.showError = true
        this.formArticulo = {
          articulo: '',
          codigobarras: '',
          nombre: '',
          precio: '',
          costo: '',
          margen: '',
          oferta: '0.00',
          utilidad: '',
        }
        return true
      }
      this.showError = false
      this.formArticulo.articulo = articulofinded.articulo
      this.formArticulo.codigobarras = articulofinded.codigobarras
      this.formArticulo.nombre = articulofinded.nombre
      this.formArticulo.costo = utils.roundTo(articulofinded.costo)
      this.formArticulo.precio = utils.roundTo(articulofinded.precio)
      this.formArticulo.margen = `${utils.parseToPorcent(
        utils.roundTo(1 - articulofinded.costo / articulofinded.precio)
      )}%`
    },
  },
}
</script>

<style scoped>
.container-table {
  overflow: auto;
}

.table-productos {
  min-width: 1000px;
}

#codigo-articulo,
#codigo-barras {
  width: 25%;
  margin-right: 2%;
  margin-bottom: 2%;
}

#nombre-articulo {
  width: 46%;
  margin-bottom: 2%;
}

.input-resp-dt-ofe {
  width: calc(20% - 5px);
  margin-bottom: 5px;
  margin-right: 5px;
}

.buttons-end {
  position: relative;
}

.toast-buttons {
  position: absolute;
  bottom: 0px;
  right: 0px;
}

@media screen and (max-width: 767px) {
  #codigo-articulo,
  #codigo-barras,
  #nombre-articulo {
    width: 100%;
    margin-right: 0px;
  }

  .input-resp-dt-ofe {
    width: 100%;
    margin-right: 0px;
  }
}
</style>
