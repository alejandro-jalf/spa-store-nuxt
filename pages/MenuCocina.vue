<template>
  <div>
    <h1>Menu de la cocina</h1>

    <label for="fecha">Fecha:</label>
    <b-form inline>
      <b-form-datepicker
        id="fecha"
        v-model="publicidad.date"
        class="fechaDate"
        :class="backgroundInputTheme"
      ></b-form-datepicker>
      <b-form-input
        id="fuenteFecha"
        :value="publicidad.sizeDate"
        placeholder="Tamaño fuente"
        type="number"
        :class="backgroundInputTheme"
        @change="typedSizeDate"
      ></b-form-input>
    </b-form>

    <div
      v-b-toggle.dataCollapseAntojitos
      class="extras mt-2"
      @click="changeCollapseAnto"
    >
      <b-icon-arrow-down-circle-fill
        v-if="iconCollapseAntojitos"
      ></b-icon-arrow-down-circle-fill>
      <b-icon-arrow-up-circle-fill v-else></b-icon-arrow-up-circle-fill>
      Antojitos
    </div>

    <b-collapse id="dataCollapseAntojitos" :visible="visibleAnto">
      <b-form inline>
        <b-form-input
          id="inputSizeAnt"
          placeholder="Tamaño fuente"
          class="inputFirt inputsPar"
          type="number"
          :value="publicidad.sizeAntojitos"
          :class="backgroundInputTheme"
          @change="typedSizeAnto"
        ></b-form-input>
        <b-form-input
          id="inputInterAnt"
          type="number"
          :value="publicidad.interlineadoAnto"
          placeholder="Interlineado"
          class="inputsPar"
          :class="backgroundInputTheme"
          @change="typedInterAnto"
        ></b-form-input>
      </b-form>
      <b-input-group class="mt-3">
        <template #append>
          <b-button variant="success" @click="addAntojito">
            <span v-if="width > 400">Agregar</span>
            <b-icon-plus-circle-fill v-else></b-icon-plus-circle-fill>
          </b-button>
        </template>
        <template #prepend>
          <b-input-group-text>
            <span v-if="width > 400">Antojito</span>
            <b-icon-card-list v-else></b-icon-card-list>
          </b-input-group-text>
        </template>
        <b-form-input
          id="inpAnt"
          v-model="publicidad.antojito"
          type="text"
          trim
          :class="backgroundInputTheme"
          @keyup.enter="addAntojito"
        ></b-form-input>
      </b-input-group>
      <div class="container-products">
        <b-badge
          v-for="(product, indexProAnt) in listAntojitos"
          :key="indexProAnt"
          pill
          class="chipProduct"
          variant="info"
        >
          {{ product }}
          <b-icon-x-circle-fill
            class="close-chip"
            @click="removeAntojito(product)"
          ></b-icon-x-circle-fill>
        </b-badge>
      </div>
      <b-form-checkbox
        id="checkHorarioAnto"
        switch
        :checked="publicidad.horarioAnto"
        name="checkHorarioAnto"
        @change="changeHorarioAnto"
      >
        Establecer horario
      </b-form-checkbox>
      <b-form inline class="mt-2">
        <b-form-timepicker
          id="hourStartAnto"
          :value="publicidad.hourStartAnto"
          locale="en"
          label-close-button="Aceptar"
          label-no-time-selected="Hora inicio"
          :disabled="!horarioAnto"
          class="inputFirt inputsPar"
          :class="backgroundInputTheme"
          @context="chageHourStartAnto"
        ></b-form-timepicker>
        <b-form-timepicker
          id="hourEndAnto"
          :value="publicidad.hourEndAnto"
          locale="en"
          label-close-button="Aceptar"
          label-no-time-selected="Hora termino"
          :disabled="!horarioAnto"
          class="inputsPar"
          :class="backgroundInputTheme"
          @context="chageHourEndAnto"
        ></b-form-timepicker>
      </b-form>
    </b-collapse>

    <div
      v-b-toggle.dataCollapseMenu
      class="extras mt-2"
      @click="changeCollapseMenu"
    >
      <b-icon-arrow-down-circle-fill
        v-if="iconCollapseMenu"
      ></b-icon-arrow-down-circle-fill>
      <b-icon-arrow-up-circle-fill v-else></b-icon-arrow-up-circle-fill>
      Menu del dia
    </div>

    <b-collapse id="dataCollapseMenu" :visible="visibleMenu">
      <b-form inline>
        <b-form-input
          id="inputSizeMenu"
          type="number"
          :value="publicidad.sizeMenu"
          placeholder="Tamaño fuente"
          class="inputFirt inputsPar"
          :class="backgroundInputTheme"
          @change="typedSizeMenu"
        ></b-form-input>
        <b-form-input
          id="inputInterMenu"
          type="number"
          :value="publicidad.interlineadoMenu"
          placeholder="Interlineado"
          class="inputsPar"
          :class="backgroundInputTheme"
          @change="typedInterMenu"
        ></b-form-input>
      </b-form>

      <b-input-group class="mt-3">
        <template #append>
          <b-button variant="success" @click="addMenu">
            <span v-if="width > 400">Agregar</span>
            <b-icon-plus-circle-fill v-else></b-icon-plus-circle-fill>
          </b-button>
        </template>
        <template #prepend>
          <b-input-group-text>
            <span v-if="width > 400">Comida</span>
            <b-icon-journal-medical v-else></b-icon-journal-medical>
          </b-input-group-text>
        </template>
        <b-form-input
          id="inMenu"
          v-model="publicidad.menu"
          type="text"
          trim
          :class="backgroundInputTheme"
          @keyup.enter="addMenu"
        ></b-form-input>
      </b-input-group>
      <div class="container-products">
        <b-badge
          v-for="(comida, indexProCom) in listComidas"
          :key="indexProCom"
          pill
          class="chipProduct"
          variant="info"
        >
          {{ comida }}
          <b-icon-x-circle-fill
            class="close-chip"
            @click="removeMenu(comida)"
          ></b-icon-x-circle-fill>
        </b-badge>
      </div>

      <b-form-checkbox
        id="checkHorarioMenu"
        switch
        name="checkHorarioMenu"
        :checked="publicidad.horarioMenu"
        @change="changeHorarioMenu"
      >
        Establecer horario
      </b-form-checkbox>
      <b-form inline class="mt-2">
        <b-form-timepicker
          id="hourStartMenu"
          v-model="publicidad.hourStartMenu"
          locale="en"
          label-close-button="Aceptar"
          label-no-time-selected="Hora inicio"
          :disabled="!horarioMenu"
          class="inputFirt inputsPar"
          :class="backgroundInputTheme"
          @context="chageHourStartMenu"
        ></b-form-timepicker>
        <b-form-timepicker
          id="hourEndMenu"
          v-model="publicidad.hourEndMenu"
          locale="en"
          label-close-button="Aceptar"
          label-no-time-selected="Hora termino"
          :disabled="!horarioMenu"
          class="inputsPar"
          :class="backgroundInputTheme"
          @context="chageHourEndMenu"
        ></b-form-timepicker>
      </b-form>
    </b-collapse>
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
import {
  BIconXCircleFill,
  BIconDownload,
  BIconImageFill,
  BIconPlusCircleFill,
  BIconJournalMedical,
  BIconCardList,
  BIconArrowDownCircleFill,
  BIconArrowUpCircleFill,
} from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconXCircleFill,
    BIconDownload,
    BIconImageFill,
    BIconPlusCircleFill,
    BIconJournalMedical,
    BIconCardList,
    BIconArrowDownCircleFill,
    BIconArrowUpCircleFill,
  },
  data() {
    return {
      publicidad: {
        sizeAntojitos: this.$store.state.menucocina.sizeLetterAntojitos,
        interlineadoAnto: this.$store.state.menucocina.interlineadoAntojitos,
        antojito: '',
        sizeDate: this.$store.state.menucocina.sizeLetterDate,
        sizeMenu: this.$store.state.menucocina.sizeLetterMenu,
        interlineadoMenu: this.$store.state.menucocina.interlineadoMenu,
        menu: '',
        imagePainted: false,
        href: '',
        date: '',
        sizeImage: 1080,
        maxInputRangeImage: 1080,
        horarioAnto:
          typeof this.$store.state.menucocina.horarioAnto === 'string'
            ? this.$store.state.menucocina.horarioAnto === 'true'
            : this.$store.state.menucocina.horarioAnto,
        horarioMenu:
          typeof this.$store.state.menucocina.horarioMenu === 'string'
            ? this.$store.state.menucocina.horarioMenu === 'true'
            : this.$store.state.menucocina.horarioMenu,
        hourStartAnto: this.$store.state.menucocina.hourStartAnto,
        hourEndAnto: this.$store.state.menucocina.hourEndAnto,
        hourStartMenu: this.$store.state.menucocina.hourStartMenu,
        hourEndMenu: this.$store.state.menucocina.hourEndMenu,
      },
      iconCollapseAntojitos: true,
      iconCollapseMenu: true,
      visibleAnto:
        typeof this.$store.state.menucocina.collapseAnto === 'string'
          ? this.$store.state.menucocina.collapseAnto === 'true'
          : this.$store.state.menucocina.collapseAnto,
      visibleMenu:
        typeof this.$store.state.menucocina.collapseMenu === 'string'
          ? this.$store.state.menucocina.collapseMenu === 'true'
          : this.$store.state.menucocina.collapseMenu,
    }
  },
  computed: {
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
    backgroundInputTheme() {
      if (this.$store.state.general.themePreferences === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return 'backgroundInputDark'
        return 'backgroundInput'
      } else if (this.$store.state.general.themePreferences === 'dark')
        return 'backgroundInputDark'
      else return 'backgroundInput'
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

    const date = new Date()
    this.publicidad.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`

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

    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (collapseId === 'dataCollapseAntojitos') {
        if (!isJustShown) this.iconCollapseAntojitos = true
        else this.iconCollapseAntojitos = false
      }
      if (collapseId === 'dataCollapseMenu') {
        if (!isJustShown) this.iconCollapseMenu = true
        else this.iconCollapseMenu = false
      }
    })

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
      setAntojito: 'menucocina/setAntojito',
      setMenu: 'menucocina/setMenu',
      removeAntojito: 'menucocina/removeAntojito',
      removeMenu: 'menucocina/removeMenu',
      setSizeLetterAntojitos: 'menucocina/setSizeLetterAntojitos',
      setInterlineadoAntojitos: 'menucocina/setInterlineadoAntojitos',
      setSizeLetterMenu: 'menucocina/setSizeLetterMenu',
      setInterlineadoMenu: 'menucocina/setInterlineadoMenu',
      setSizeLetterDate: 'menucocina/setSizeLetterDate',
      setCollapseAnto: 'menucocina/setCollapseAnto',
      setCollapseMenu: 'menucocina/setCollapseMenu',
      setHorarioAnto: 'menucocina/setHorarioAnto',
      setHorarioMenu: 'menucocina/setHorarioMenu',
      setHourStartAnto: 'menucocina/setHourStartAnto',
      setHourEndAnto: 'menucocina/setHourEndAnto',
      setHourStartMenu: 'menucocina/setHourStartMenu',
      setHourEndMenu: 'menucocina/setHourEndMenu',
    }),
    changeCollapseAnto() {
      this.setCollapseAnto(this.iconCollapseAntojitos)
    },
    changeCollapseMenu() {
      this.setCollapseMenu(this.iconCollapseMenu)
    },
    changeHorarioMenu(status) {
      this.setHorarioMenu(status)
    },
    changeHorarioAnto(status) {
      this.setHorarioAnto(status)
    },
    chageHourStartAnto(evt) {
      this.setHourStartAnto(evt.value)
    },
    chageHourEndAnto(evt) {
      this.setHourEndAnto(evt.value)
    },
    chageHourStartMenu(evt) {
      this.setHourStartMenu(evt.value)
    },
    chageHourEndMenu(evt) {
      this.setHourEndMenu(evt.value)
    },
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
    typedSizeAnto(value) {
      if (value !== '') this.setSizeLetterAntojitos(value)
    },
    typedInterAnto(value) {
      if (value !== '') this.setInterlineadoAntojitos(value)
    },
    typedSizeMenu(value) {
      if (value !== '') this.setSizeLetterMenu(value)
    },
    typedInterMenu(value) {
      if (value !== '') this.setInterlineadoMenu(value)
    },
    typedSizeDate(value) {
      if (value !== '') this.setSizeLetterDate(value)
    },
    createImage() {
      const canvas = document.getElementById('canvas')
      let dato = canvas.toDataURL('image/jpg')
      dato = dato.replace('image/jpeg', 'image/octet-stream')
      this.publicidad.href = dato
    },
    addAntojito() {
      if (this.publicidad.antojito === '') return true
      const antojito = this.publicidad.antojito
      const antojitoFinded = this.listAntojitos.find(
        (ant) => ant.trim().toLowerCase() === antojito.toLowerCase()
      )
      if (antojitoFinded) return true
      this.setAntojito(antojito)
      this.publicidad.antojito = ''
    },
    addMenu() {
      if (this.publicidad.menu === '') return true
      const menu = this.publicidad.menu
      const menuFinded = this.listComidas.find(
        (comida) => comida.trim().toLowerCase() === menu.toLowerCase()
      )
      if (menuFinded) return true
      this.setMenu(menu)
      this.publicidad.menu = ''
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

      const date = this.publicidad.date.split('-')
      const fecha = `${date[2]}/${utils._arrayMonths[parseInt(date[1])]}/${
        date[0]
      }`

      imageObj2.src = imageObj.src
      context.drawImage(imageObj2, 0, 0, 1080, 1330)
      context.fillStyle = 'black'
      context.font = 'bold ' + this.publicidad.sizeDate + 'px arial'
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
        'De ' + utils.refactorHora(this.publicidad.hourStartAnto),
        840,
        298
      )
      context.fillText(
        'A   ' + utils.refactorHora(this.publicidad.hourEndAnto),
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
        'De ' + utils.refactorHora(this.publicidad.hourStartMenu),
        840,
        756
      )
      context.fillText(
        'A   ' + utils.refactorHora(this.publicidad.hourEndMenu),
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
.fechaDate,
#fuenteFecha {
  width: 49%;
  margin-left: 1%;
}

.extras {
  border-bottom: 1px solid rgb(138, 138, 138);
  padding-bottom: 5px;
  margin-bottom: 10px;
}

#dataCollapseMenu,
#dataCollapseAntojitos {
  width: 98%;
  margin-left: 2%;
}

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

.chipProduct {
  margin-left: 5px;
  margin-top: 5px;
  padding: 7px;
  font-size: 15px;
}

.inputsPar {
  width: 49%;
  margin-left: 1%;
}

.inputFirt {
  margin-left: 0px;
  width: 50%;
}

.close-chip {
  cursor: pointer;
}

.close-chip:hover {
  color: rgb(119, 119, 119);
}

.container-products {
  margin-top: 10px;
  padding: 10px 15px 15px 10px;
  width: 100%;
  min-height: 50px;
  height: min-content;
  border-radius: 5px;
  border: 1px solid rgb(163, 163, 163);
  margin-bottom: 20px;
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

@media screen and (max-width: 767px) {
  .fechaDate,
  #fuenteFecha {
    width: 100%;
    margin-left: 0px;
  }
  #fuenteFecha {
    margin-top: 10px;
  }
}
</style>
