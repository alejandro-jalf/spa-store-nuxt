<template>
  <div>
    <h1>Menu de la cocina</h1>

    <menu-cocina-form
      :list-antojitos="listAntojitos"
      :list-comidas="listComidas"
      :horario-anto="horarioAnto"
      :horario-menu="horarioMenu"
    ></menu-cocina-form>

    <b-button
      class="mb-3 mt-3"
      :variant="isDarkTheme"
      :block="blockButton"
      @click="drawFondo()"
    >
      <b-icon-image-fill></b-icon-image-fill>
      Visualizar
    </b-button>
    <b-form-input
      v-if="width > 767"
      id="inputSizeImg"
      v-model="publicidad.sizeImage"
      type="range"
      :max="publicidad.maxInputRangeImage"
      @change="changeSizeImage"
    ></b-form-input>
    <br v-if="!blockButton" />
    <canvas id="canvas" width="1080" height="1330"></canvas>
    <div class="container-img">
      <a
        v-if="publicidad.imagePainted"
        id="descarga"
        class="btn btn-dark"
        :href="publicidad.href"
        download="Menu del dia.jpg"
      >
        <b-icon-download></b-icon-download>
        Descargar
      </a>
      <img
        v-if="publicidad.href === ''"
        id="imageDefault"
        class="imgVi"
        src="../assets/Menu1080x1330.jpg"
      />
      <img v-else id="imgVi" :src="publicidad.href" alt="Datos" />
    </div>
    <img
      id="fondoCanvas"
      src="../assets/Menu1080x1330.jpg"
      width="30"
      height="30"
      alt=""
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconDownload, BIconImageFill } from 'bootstrap-vue'
import MenuCocinaForm from '../components/MenuCocinaForm.vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconDownload,
    BIconImageFill,
    MenuCocinaForm,
  },
  data() {
    return {
      publicidad: {
        imagePainted: false,
        href: '',
        sizeImage: 1080,
        maxInputRangeImage: 1080,
      },
    }
  },
  computed: {
    sizeDate() {
      return this.$store.state.menucocina.sizeLetterDate
    },
    date() {
      return this.$store.state.menucocina.dateSelected
    },
    horarioAnto() {
      return typeof this.$store.state.menucocina.horarioAnto === 'string'
        ? this.$store.state.menucocina.horarioAnto === 'true'
        : this.$store.state.menucocina.horarioAnto
    },
    horarioMenu() {
      return typeof this.$store.state.menucocina.horarioMenu === 'string'
        ? this.$store.state.menucocina.horarioMenu === 'true'
        : this.$store.state.menucocina.horarioMenu
    },
    width() {
      return this.$store.state.general.widthWindow
    },
    listAntojitos() {
      return this.$store.state.menucocina.listAntojitos
    },
    listComidas() {
      return this.$store.state.menucocina.listComidas
    },
    blockButton() {
      return this.$store.state.general.widthWindow <= 500
    },
    isDarkTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'outline-info'
        return 'info'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'outline-info'
      else return 'info'
    },
  },
  mounted() {
    const imageDefault = document.querySelector('#imageDefault')
    const imageRender = document.querySelector('#imgVi')
    const containerMain = window.document.querySelector('.container')
    const setMaxResize = () => {
      if (containerMain.clientWidth - 30 <= 1080)
        this.publicidad.maxInputRangeImage = containerMain.clientWidth - 30
      else this.publicidad.maxInputRangeImage = 1080
      if (imageDefault || imageRender) {
        const sizeImage = imageDefault
          ? imageDefault.clientWidth
          : imageRender.clientWidth
        this.publicidad.sizeImage = sizeImage
      }
    }
    setMaxResize()
    window.addEventListener('resize', () => {
      if (imageDefault || imageRender) {
        setMaxResize()
        const sizeContainer = containerMain.clientWidth - 30
        if (window.innerWidth < 768) {
          if (imageDefault) imageDefault.style.width = '100%'
          if (imageRender) imageRender.style.width = '100%'
        } else {
          if (imageDefault && imageDefault.clientWidth > sizeContainer)
            imageDefault.style.width = sizeContainer + 'px'
          if (imageRender && imageRender.clientWidth > sizeContainer)
            imageRender.style.width = sizeContainer + 'px'
        }
      }
    })
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
    }),
    drawRectRounded(ctx, x, y, width, height, radius, color) {
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y + radius)
      ctx.lineTo(x, y + height - radius)
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height)
      ctx.lineTo(x + width - radius, y + height)
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width,
        y + height - radius
      )
      ctx.lineTo(x + width, y + radius)
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y)
      ctx.lineTo(x + radius, y)
      ctx.quadraticCurveTo(x, y, x, y + radius)
      ctx.stroke()
      ctx.fill()
    },
    changeSizeImage(value) {
      if (document.getElementById('imageDefault'))
        document.getElementById('imageDefault').style.width = value + 'px'
      if (document.getElementById('imgVi'))
        document.getElementById('imgVi').style.width = value + 'px'
    },
    createImage() {
      const canvas = document.getElementById('canvas')
      let dato = canvas.toDataURL('image/jpg')
      dato = dato.replace('image/jpeg', 'image/octet-stream')
      this.publicidad.href = dato
    },
    drawFondo() {
      this.setLoading(true)
      setTimeout(() => {
        this.setLoading(false)
      }, 1000)
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      const imageObj = document.getElementById('fondoCanvas')
      const imageObj2 = new Image()

      const date = this.date.split('-')
      const fecha = `${date[2]}/${utils._arrayMonths[parseInt(date[1]) - 1]}/${
        date[0]
      }`

      imageObj2.src = imageObj.src
      context.drawImage(imageObj2, 0, 0, 1080, 1330)
      context.fillStyle = 'black'
      context.font = 'bold ' + this.sizeDate + 'px arial'
      context.fillText(fecha, 670, 190)
      this.drawAntojitos(context)
      this.drawComidas(context)
      if (this.horarioAnto) this.drawHorarioAntojitos(context)
      if (this.horarioMenu) this.drawHorarioMenu(context)
      this.publicidad.imagePainted = true
      this.createImage()
    },
    drawHorarioAntojitos(context) {
      this.drawRectRounded(
        context,
        831,
        270,
        183,
        65,
        5,
        'rgb(255, 255, 255, 0.9)'
      )
      context.fillStyle = 'black'
      context.font = 'bold 28px arial'
      context.fillText(
        'De ' + utils.refactorHora(this.$store.state.menucocina.hourStartAnto),
        840,
        298
      )
      context.fillText(
        'A   ' + utils.refactorHora(this.$store.state.menucocina.hourEndAnto),
        840,
        330
      )
    },
    drawHorarioMenu(context) {
      this.drawRectRounded(
        context,
        831,
        728,
        183,
        65,
        5,
        'rgb(255, 255, 255, 0.9)'
      )
      context.fillStyle = 'black'
      context.font = 'bold 28px arial'
      context.fillText(
        'De ' + utils.refactorHora(this.$store.state.menucocina.hourStartMenu),
        840,
        756
      )
      context.fillText(
        'A   ' + utils.refactorHora(this.$store.state.menucocina.hourEndMenu),
        840,
        788
      )
    },
    drawAntojitos(context) {
      let contadorVueltas = 0
      const lengthList = this.listAntojitos.length
      if (lengthList > 1) {
        const posYCircle = parseInt(
          document.getElementById('inputSizeAnt').value / 3
        )
        this.listAntojitos.forEach((antojito, index) => {
          context.beginPath()
          context.font =
            document.getElementById('inputSizeAnt').value + 'px arial'
          if (index > 0 && index % 2 === 0) contadorVueltas++
          const posY =
            410 +
            contadorVueltas * document.getElementById('inputInterAnt').value
          if (index % 2 === 0) {
            context.fillStyle = 'black'
            context.fillText(antojito, 100, posY)
            context.fillStyle = 'orange'
            context.arc(80, posY - posYCircle, 12, 0, 2 * Math.PI)
          } else {
            context.fillStyle = 'black'
            context.fillText(antojito, 620, posY)
            context.fillStyle = 'orange'
            context.arc(600, posY - posYCircle, 12, 0, 2 * Math.PI)
          }
          context.fill()
        })
      }
    },
    drawComidas(context) {
      let contadorVueltas = 0
      const lengthList = this.listComidas.length
      if (lengthList > 1) {
        const posYCircle = parseInt(
          document.getElementById('inputSizeMenu').value / 3
        )
        this.listComidas.forEach((antojito, index) => {
          context.beginPath()
          context.font =
            document.getElementById('inputSizeMenu').value + 'px arial'
          if (index > 0 && index % 2 === 0) contadorVueltas++
          const posY =
            870 +
            contadorVueltas * document.getElementById('inputInterMenu').value
          if (index % 2 === 0) {
            context.fillStyle = 'black'
            context.fillText(antojito, 100, posY)
            context.fillStyle = '#dfb600'
            context.arc(80, posY - posYCircle, 12, 0, 2 * Math.PI)
          } else {
            context.fillStyle = 'black'
            context.fillText(antojito, 620, posY)
            context.fillStyle = '#dfb600'
            context.arc(600, posY - posYCircle, 12, 0, 2 * Math.PI)
          }
          context.fill()
        })
      }
    },
  },
}
</script>

<style scoped>
#canvas {
  position: fixed;
  left: 100%;
  top: 100px;
  background: rgb(255, 255, 255);
}

#imgVi,
.imgVi {
  background: #fff;
  width: 100%;
}

#fondoCanvas {
  position: fixed;
  left: 100%;
}

.container-img {
  position: relative;
  max-width: 1080px; /*540px;*/
  max-height: 1330px; /*960px;*/
  width: 100%;
  margin-bottom: 20px;
}

#descarga {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
