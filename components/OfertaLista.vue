<template>
  <div>
    <b-card
      border-variant="primary"
      header-bg-variant="primary"
      header-text-variant="white"
      :header="'Oferta abierta: ' + uuid"
      :title="tipoOferta + ' Del ' + fechaInico + ' al ' + fechaFin"
    >
      <b-card-text class="font-weight-bold mt-3 mb-1">
        Elija un articulo
      </b-card-text>
      <divider></divider>
      <b-form inline class="mt-2">
        <b-form-input
          id="codigo-articulo"
          placeholder="Codigo de articulo"
        ></b-form-input>
        <b-form-input
          id="codigo-barras"
          placeholder="Codigo de barras"
        ></b-form-input>
        <b-form-input
          id="nombre-articulo"
          placeholder="Nombre articulo"
        ></b-form-input>
      </b-form>
      <b-card-text class="font-weight-bold mb-1">
        Datos de la oferta para el articulo: 0090098
      </b-card-text>
      <divider class="mb-2"></divider>
      <b-form inline class="mt-2 mb-2">
        <b-form-input
          id="input-costo"
          placeholder="Costo"
          class="input-resp-dt-ofe"
          readonly
        ></b-form-input>
        <b-form-input
          id="input-precio"
          placeholder="Precio"
          class="input-resp-dt-ofe"
          readonly
        ></b-form-input>
        <b-form-input
          id="input-margen"
          placeholder="Margen"
          class="input-resp-dt-ofe"
          readonly
        ></b-form-input>
        <b-form-input
          id="input-oferta"
          placeholder="Precio de oferta"
          class="input-resp-dt-ofe"
        ></b-form-input>
        <b-form-input
          id="input-utilidad"
          placeholder="Utilidad"
          class="input-resp-dt-ofe"
          readonly
        ></b-form-input>
      </b-form>
      <b-button variant="success" class="mb-3">
        <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
        Agregar a la lista
      </b-button>
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
          <template #cell(Acciones)="row">
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
      <div class="text-right mt-3 buttons-end">
        <b-button variant="danger">
          <b-icon-trash-fill></b-icon-trash-fill>
          Cancelar oferta
        </b-button>
        <b-button variant="primary">
          <b-icon-cloud-upload-fill></b-icon-cloud-upload-fill>
          Guardar y enviar
        </b-button>
        <b-button variant="info" @click="$bvToast.show('example-toast')">
          <b-icon-question-circle-fill></b-icon-question-circle-fill>
        </b-button>
        <b-toast
          id="example-toast"
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
    </b-card>
  </div>
</template>

<script>
import {
  BIconPencilSquare,
  BIconTrash,
  BIconPlusCircleFill,
  BIconTrashFill,
  BIconCloudUploadFill,
  BIconQuestionCircleFill,
} from 'bootstrap-vue'
import Divider from './Divider'

export default {
  components: {
    BIconPencilSquare,
    BIconTrash,
    Divider,
    BIconPlusCircleFill,
    BIconTrashFill,
    BIconCloudUploadFill,
    BIconQuestionCircleFill,
  },
  data() {
    return {
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
    }
  },
  computed: {
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
      return this.$store.state.ofertas.ofertaActual.fechaInico
    },
    fechaFin() {
      return this.$store.state.ofertas.ofertaActual.fechaFin
    },
    descripcion() {
      return this.$store.state.ofertas.ofertaActual.descripcion
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
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
