<template>
  <div>
    <div class="card-search">
      <div class="suc-db">
        <span class="mr-5">Sucursal: {{ sucursal }}</span>
        <span class="mr-5">/</span>
        <span id="label-db">Base de Datos: {{ dataBase }}</span>
      </div>
      <b-button
        variant="secondary"
        class="float-right"
        @click="setShowSearch(false)"
      >
        <b-icon icon="x" />
        Cerrar
      </b-button>
      <b-form inline class="mt-1">
        <span id="input-tipo" class="input-sel">
          <div class="label">Tipo de Movimiento</div>
          <b-form-select
            ref="selectType"
            v-model="optionType"
            :options="documents"
            class="w-100"
          />
          <div class="description">Seleccione</div>
        </span>
        <span class="input-sel">
          <div class="label">Documento</div>
          <b-form-input
            ref="inputDocS"
            v-model="document"
            class="w-100"
            placeholder="Documento"
            @focus="$refs.inputDocS.select()"
          />
          <div class="description">
            Puede usar los ** para mejorar la busqueda
          </div>
        </span>
        <span class="input-sel">
          <div class="label">Referencia</div>
          <b-form-input
            ref="inputRefS"
            v-model="referencia"
            class="w-100"
            placeholder="Referencia"
            @focus="$refs.inputRefS.select()"
          />
          <div class="description">
            Puede usar los ** para mejorar la busqueda
          </div>
        </span>
        <span id="input-article" class="input-sel">
          <div class="label">Articulo</div>
          <b-form-input
            ref="inputArtS"
            v-model="articulo"
            class="w-100"
            placeholder="Articulo"
            @focus="$refs.inputArtS.select()"
          />
          <div class="description">Codigo de Articulo 0000000</div>
        </span>
        <span id="input-order" class="input-sel">
          <div class="label">Ordenar</div>
          <b-form-select
            v-model="selectOrder"
            :options="optionsOrder"
            class="w-100"
          />
          <div class="description">Seleccione</div>
        </span>
        <b-button variant="success" class="btn-consult" @click="searchDocs">
          <b-icon icon="search" />
          Consultar
        </b-button>
      </b-form>
      <b-table
        id="tableSearchDocument"
        responsive
        striped
        hover
        :fields="fields"
        :items="dataRefactor"
        head-variant="dark"
        class="mt-3"
      >
        <template #cell(Hora)="row">
          {{ utils.toHour(row.item.Hora) }}
        </template>
        <template #cell(Fecha)="row">
          {{ utils.toDate(row.item.Fecha) }}
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import utils from '../modules/utils'

export default {
  props: {
    sucursal: {
      type: String,
      required: true,
    },
    dataBase: {
      type: String,
      required: true,
    },
    documents: {
      type: Array,
      required: true,
    },
    recDocument: {
      type: String,
      required: false,
      default: '',
    },
    recReferencia: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      utils,
      optionType: 'C',
      document: '',
      referencia: '',
      articulo: '',
      fields: [
        'Documento',
        'Referencia',
        { key: 'DescripcionAlmacen', label: 'Almacen' },
        'Caja',
        'Observaciones',
        'Fecha',
        'Hora',
        { key: 'TipoDocumento', label: 'Tipo' },
        'Estatus',
        'Articulos',
      ],
      selectOrder: 'DESC',
      optionsOrder: [
        { value: 'ASC', text: 'De Antiguo a Reciente' },
        { value: 'DESC', text: 'De Reciente a Antiguo' },
      ],
    }
  },
  computed: {
    dataRefactor() {
      return this.$store.state.documentoswin.documents.data
    },
  },
  mounted() {
    this.document = this.recDocument
    this.referencia = this.recReferencia
    this.$refs.selectType.focus()
    console.log(this.recDocument, ' <===> ', this.recReferencia)
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setShowSearch: 'documentoswin/setShowSearch',
    }),
    ...mapActions({
      loadDocuments: 'documentoswin/loadDocuments',
    }),
    async searchDocs() {
      this.setLoading(true)
      const response = await this.loadDocuments([
        this.sucursal,
        this.dataBase,
        this.optionType,
        this.document,
        this.referencia,
        this.articulo,
        this.selectOrder,
      ])
      if (!response.success) this.showAlertDialog([response.message])
      else if (response.articles === 0)
        this.showAlertDialog(['No se encontro el documento'])
      this.setLoading(false)
    },
  },
}
</script>
<style scoped>
.card-search {
  overflow-y: auto;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 600px;
  color: black;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
}

.docref {
  background: rgb(97, 255, 77);
  width: 100%;
  margin-bottom: 15px;
  margin-right: 5px;
}

.input-sel {
  margin-left: 10px;
  width: calc(25% - 45px);
}

.suc-db {
  display: inline-block;
  background: rgb(235, 235, 235);
  border: 1px solid rgb(211, 211, 211);
  padding: 10px;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 17px;
  border-radius: 5px;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.description {
  color: rgb(129, 129, 129);
  font-style: italic;
}

.btn-consult {
  margin-left: 10px;
  width: 120px;
  margin-top: 5px;
}

@media screen and (max-width: 1470px) {
  .input-sel {
    width: calc(33% - 10px);
    margin-bottom: 15px;
  }

  .btn-consult {
    width: 140px;
    margin-top: 0px;
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 1028px) {
  #input-tipo {
    margin-bottom: 40px;
  }
}

@media screen and (max-width: 829px) {
  #input-tipo,
  #input-order {
    margin-bottom: 0px;
  }
  .input-sel {
    width: calc(50% - 10px);
    margin-bottom: 5px;
  }

  .btn-consult {
    margin-top: 15px;
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 709px) {
  #input-tipo,
  #input-article {
    margin-bottom: 30px;
  }

  #label-db {
    display: block;
  }
}

@media screen and (max-width: 580px) {
  #input-tipo,
  #input-order,
  #input-article {
    margin-bottom: 0px;
  }

  .input-sel {
    width: calc(100% - 10px);
    margin-bottom: 5px;
  }
}

@media screen and (max-width: 476px) {
  .btn-consult {
    width: 100%;
  }
}
</style>
