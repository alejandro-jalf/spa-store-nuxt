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

    <div class="titleScan">Pase el escaner y espere hasta oir el pitido</div>
    <div v-if="dataUser.tipo_user === 'manager'" id="scanner">
      <b-button
        v-if="scannerVisible"
        class="mt-2 mb-2"
        variant="danger"
        @click="stopScanner"
      >
        Detener
      </b-button>
      <div id="container-escaner" class="text-center">
        <div id="lector">
          <div v-if="scannerVisible" id="laserImage"></div>
        </div>
        <div v-if="!scannerVisible" id="imageCodigo"></div>
        <div v-if="!scannerVisible" id="escaner">
          <div class="laser"></div>
        </div>
        <button
          v-if="!scannerVisible"
          id="btn-scanear"
          class="btn btn-outline-danger"
          @click="activateScanner"
        >
          Escanear
        </button>
        <canvas id="canvas-scan"></canvas>
      </div>
    </div>
    <div v-else id="scanner">
      <div id="container-escaner" class="text-center">
        <div id="lector">
          <div id="laserImage"></div>
        </div>
        <div id="imageCodigo"></div>
        <div id="escaner">
          <div class="laser"></div>
        </div>
      </div>
    </div>

    <b-card
      v-if="!scannerVisible"
      no-body
      class="containerCard mt-3"
      :class="variantTheme"
    >
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
        ER: 'SPAENRIQUEZ',
        BO: 'SPABODEGA',
      },
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'SPAZARAGOZA' },
        { value: 'VC', text: 'SPACENTRO' },
        { value: 'OU', text: 'SPAOLUTA' },
        { value: 'JL', text: 'SPAJALTIPAN' },
        { value: 'ER', text: 'SPAENRIQUEZ' },
        { value: 'BO', text: 'SPABODEGA' },
      ],
      sound: null,
      barCode: '',
      utils,
      scannerVisible: false,
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
    activateScanner() {
      this.scannerVisible = true
      // objectQuagga.initQuagga()
      this.initLector()
    },
    stopScanner() {
      Quagga.stop()
      this.scannerVisible = false
    },
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
      const stopScanner = this.stopScanner
      // const lector = document.getElementById('lector')
      // console.log(lector.clientWidth, lector.clientHeight)
      Quagga.init(
        {
          inputStream: {
            constraints: {
              width: 300,
              height: 300,
              // width: lector.clientWidth,
              // height: lector.clientHeight,
              // width: 1920,
              // height: 1080,
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
            patchSize: 'x-large', // x-small, small, medium, large, x-large
          },
        },
        function (err) {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err)
            stopScanner()
            return
          }
          Quagga.start()
        }
      )
      Quagga.onDetected((data) => {
        // eslint-disable-next-line no-console
        console.log(data.codeResult.code)
        this.sound.play()
        // app.codigoActual = data.codeResult.code;
        // app.setDatosActuales(data.codeResult.code);
        Quagga.stop()
        window.navigator.vibrate(500)
        // app.setScannerVisible(false);
      })

      Quagga.onProcessed(function (result) {
        // console.log(
        //   document.getElementById('canvas-scan').getContext('2d').overlay
        // )
        const drawingCtx = document
          .getElementById('canvas-scan')
          .getContext('2d')
        // const drawingCtx = Quagga.canvas.ctx.overlay
        const drawingCanvas = Quagga.canvas.dom.overlay
        if (result) {
          // console.log(
          //   drawingCanvas,
          //   parseInt(drawingCanvas.getAttribute('width')),
          //   parseInt(drawingCanvas.getAttribute('height')),
          //   drawingCtx
          // )
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              drawingCanvas.getAttribute('width'),
              drawingCanvas.getAttribute('height')
            )
            // console.log(
            //   parseInt(drawingCanvas.getAttribute('width')),
            //   parseInt(drawingCanvas.getAttribute('height')),
            //   drawingCtx
            // )
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
.titleScan {
  text-align: center;
  font-size: 20px;
  margin-bottom: 15px;
  font-family: Arial, Helvetica, sans-serif;
  font-style: italic;
}

canvas {
  position: absolute;
  width: 200px;
  height: 200px;
  left: 0px;
  top: 0px;
}

#scanner {
  width: 300px;
  height: 300px;
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

#imageCodigo {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('../assets/codigo1.jpg');
  background-size: 100% 100%;
  border-radius: 3%;
  z-index: 2;
}

#btn-scanear {
  position: absolute;
  top: 41%;
  left: 30%;
  z-index: 4;
  background: rgb(253, 207, 0);
  padding: 5%;
  color: #ffffff;
  border: 2px solid #fffbc1;
  box-shadow: 0px 0px 3px 5px #ffee00;
}

#btn-scanear:hover {
  color: #000000;
  box-shadow: 0px 0px 9px 5px #ff0000;
}

#lector {
  position: absolute;
  max-width: 300px;
  max-height: 300px;
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

#lector video {
  max-width: 300px;
  max-height: 300px;
  width: 100%;
  height: 100%;
}

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

@media screen and (max-width: 900px) {
  #container-escaner,
  #lector {
    width: 200px;
    height: 200px;
  }
  #escaner {
    width: 200px;
    height: 200px;
  }
}

@media screen and (max-width: 767px) {
  #container-escaner,
  #lector {
    width: 250px;
    height: 250px;
  }
  #escaner {
    width: 250px;
    height: 250px;
  }
  #container-escaner {
    margin: auto;
  }
  #btn-scanear {
    left: 34%;
  }
}
</style>
