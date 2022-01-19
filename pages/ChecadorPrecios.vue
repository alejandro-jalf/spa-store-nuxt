<template>
  <div>
    <div class="header-chec"></div>
    <div v-if="dataUser.tipo_user === 'manager'" class="footerConexiones mt-2">
      <span class="mr-3 mt-2">
        <span class="font-weight-bold">Sucursal: </span>
        {{ sucursal }}
      </span>
      <b-button
        v-if="accessChangeSucursal"
        variant="success"
        @click="alertShow = true"
      >
        Cambiar sucursal
      </b-button>
    </div>

    <b-card no-body class="containerCard" :class="variantTheme">
      <div class="nameArticle">{{ article.Nombre }}</div>
      <div class="precioArticle precioArticle1">
        Precio: ${{ utils.roundTo(article.Precio1IVAUV) }}
      </div>
      <div v-if="precio2 !== null">
        <div class="preciosMore">
          A partir de {{ article.CantidadParaPrecio2 }} pz a:
        </div>
        <div class="precioArticle">
          Precio: ${{ utils.roundTo(article.Precio2IVAUV) }}
        </div>
      </div>
      <div v-if="precio3 !== null">
        <div class="preciosMore">
          A partir de {{ article.CantidadParaPrecio3 }} pz a:
        </div>
        <div class="precioArticle">
          Precio: ${{ utils.roundTo(article.Precio3IVAUV) }}
        </div>
      </div>
      <div class="descriptionArticle">
        {{ article.Descripcion }}
      </div>
    </b-card>

    <!-- <audio id="reproductor" src="./beep6.mp3" controls>
      <p>Tu navegador no implementa el elemento audio</p>
    </audio> -->

    <b-modal
      id="alertSucursal"
      :visible="alertShow"
      title="Cambiando sucursal"
      header-bg-variant="warning"
      header-text-variant="white"
      :centered="true"
    >
      <b-container fluid>
        <b-form-select
          :value="suc"
          :options="options"
          @change="selectSucursal"
        ></b-form-select>
      </b-container>

      <template #modal-footer>
        <div class="w-100">
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="updateSucursal"
          >
            Aceptar
          </b-button>
          <b-button
            variant="secondary"
            size="sm"
            class="float-right mr-2"
            @click="hideAlertDialog"
          >
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Quagga from 'quagga'
// import audio from '@/assets/beep6.mp3'
import utils from '../modules/utils'

export default {
  data() {
    return {
      dataUser: this.$store.state.user.user,
      alertShow: false,
      sucursales: {
        ZR: 'SPAZARAGOZA',
        VC: 'SPACENTRO',
        OU: 'SPAOLUTA',
        JL: 'SPAJALTIPAN',
        BO: 'SPABODEGA',
      },
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPACENTRO' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      sound: null,
      barCode: '',
      utils,
    }
  },
  computed: {
    sucursal() {
      const sucursales = this.sucursales
      return sucursales[`${this.$store.state.checadorprecios.sucursal}`]
    },
    accessChangeSucursal() {
      return this.$store.state.user.user.tipo_user === 'manager'
    },
    suc() {
      return this.$store.state.checadorprecios.sucursal
    },
    variantTheme() {
      return this.$store.state.general.themesComponents.themeCardBody
    },
    article() {
      return this.$store.state.checadorprecios.article.data[0]
    },
    precio2() {
      return this.$store.state.checadorprecios.article.data[0].Precio2IVAUV
    },
    precio3() {
      return this.$store.state.checadorprecios.article.data[0].Precio3IVAUV
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log(
      this.$store.state.general.tabActual.trim() === 'Checador Precios',
      this.dataUser.sucursal_user
    )
    if (this.dataUser.tipo_user !== 'manager')
      this.setSucursal(utils.getSucursalByName(this.dataUser.sucursal_user))
    this.setSucursalForUser()
    this.sound = document.querySelector('#reproductor')
    this.barCode = ''
    // audio.play()
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      showAlertDialog: 'general/showAlertDialog',
      setSucursal: 'checadorprecios/setSucursal',
    }),
    ...mapActions({
      updateArticle: 'checadorprecios/updateArticle',
    }),
    selectSucursal(sucursal) {
      this.selected = sucursal
    },
    updateSucursal() {
      this.hideAlertDialog()
      if (this.selected === null)
        this.showAlertDialog([
          'Falta seleccionar una sucursal',
          'Error al cambiar sucursal',
        ])
      else this.setSucursal(this.selected)
    },
    hideAlertDialog() {
      this.alertShow = false
    },
    setSucursalForUser() {
      if (!this.accessChangeSucursal) {
        const sucursalUser = utils.getSucursalByName(
          this.$store.state.user.user.sucursal_user
        )
        this.setSucursal(sucursalUser)
      }
    },
    initLector() {
      // eslint-disable-next-line no-console
      console.log('entraaaa')
      Quagga.init(
        {
          inputStream: {
            constraints: {
              width: 1920,
              height: 1080,
            },
            name: 'Live',
            type: 'LiveStream',
            facingMode: 'environment',
            target: document.querySelector('#lector'), // Pasar el elemento del DOM
            area: {
              // defines rectangle of the detection/localization area
              top: '30%', // top offset
              right: '0%', // right offset
              left: '0%', // left offset
              bottom: '30%', // bottom offset
            },
          },
          decoder: {
            readers: ['ean_reader'],
          },
          locator: {
            halfSample: true,
            patchSize: 'medium', // x-small, small, medium, large, x-large
          },
        },
        function (err) {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
            return
          }
          // eslint-disable-next-line no-console
          console.log('Iniciado correctamente')
          Quagga.start()
        }
      )
      Quagga.onDetected((data) => {
        this.sound.play()
        // app.codigoActual = data.codeResult.code;
        // app.setDatosActuales(data.codeResult.code);
        Quagga.stop()
        window.navigator.vibrate(500)
        // app.setScannerVisible(false);
      })

      Quagga.onProcessed(function (result) {
        const drawingCtx = Quagga.canvas.ctx.overlay
        const drawingCanvas = Quagga.canvas.dom.overlay
        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute('width')),
              parseInt(drawingCanvas.getAttribute('height'))
            )
            result.boxes
              .filter((box) => box !== result.box)
              .forEach((box) => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: 'green',
                  lineWidth: 2,
                })
              })
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: '#00F',
              lineWidth: 2,
            })
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: 'x', y: 'y' },
              drawingCtx,
              { color: 'red', lineWidth: 3 }
            )
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.preciosMore {
  text-align: center;
  padding-top: 1px;
  font-size: 22px;
  border-top: 1px solid rgb(161, 161, 161);
  width: 90%;
  margin-left: 5%;
}

.header-chec {
  background: rgba(0, 0, 0, 0);
  width: 100%;
  height: 25px;
}

.footerConexiones {
  background: rgba(196, 167, 167, 0.411);
  width: 100%;
  padding: 10px;
  padding-right: 10px;
  margin-bottom: 30px;
}

.nameArticle {
  border-bottom: 1px solid rgb(134, 134, 134);
  padding-bottom: 20px;
  font-size: 18px;
}

.descriptionArticle {
  border-top: 1px solid rgb(134, 134, 134);
  padding-top: 20px;
  font-size: 18px;
}

.precioArticle {
  padding: 20px 0px;
  text-align: center;
  font-size: 35px;
  color: rgb(255, 23, 23);
}

.precioArticle1 {
  padding: 30px 0px;
}
</style>
