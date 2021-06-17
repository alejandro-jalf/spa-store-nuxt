<template>
  <div>
    <h1>Menu de la cocina</h1>

    <label for="fecha">Fecha:</label>
    <b-form-datepicker
      id="fecha"
      v-model="publicidad.date"
      class="mb-2"
      :class="backgroundInputTheme"
    ></b-form-datepicker>

    <div class="mt-2 mb-1">Antojitos:</div>
    <b-form inline>
      <b-form-input
        id="inputSizeAnt"
        v-model="publicidad.sizeAntojitos"
        placeholder="Tamaño fuente"
        class="inputFirt inputsPar"
        :class="backgroundInputTheme"
      ></b-form-input>
      <b-form-input
        id="inputInterAnt"
        v-model="publicidad.interlineadoAnto"
        placeholder="Interlineado"
        class="inputsPar"
        :class="backgroundInputTheme"
      ></b-form-input>
    </b-form>
    <b-input-group class="mt-3" prepend="Antojito">
      <template #append>
        <b-button variant="success" @click="addAntojito">Agregar</b-button>
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

    <div class="mt-2 mb-1">Menu del dia:</div>
    <b-form inline>
      <b-form-input
        id="inputSizeMenu"
        v-model="publicidad.sizeMenu"
        placeholder="Tamaño fuente"
        class="inputFirt inputsPar"
        :class="backgroundInputTheme"
      ></b-form-input>
      <b-form-input
        id="inputInterMenu"
        v-model="publicidad.interlineadoMenu"
        placeholder="Interlineado"
        class="inputsPar"
        :class="backgroundInputTheme"
      ></b-form-input>
    </b-form>

    <b-input-group class="mt-3" prepend="Comida">
      <template #append>
        <b-button variant="success" @click="addAntojito">Agregar</b-button>
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
    <b-button
      class="mb-3"
      variant="outline-info"
      :block="blockButton"
      @click="drawFondo()"
    >
      Visualizar
    </b-button>
    <br v-if="!blockButton" />
    <a
      v-if="publicidad.imagePainted"
      id="descarga"
      class="btn btn-outline-success mt-0 mb-2"
      :class="{ 'btn-block': blockButton }"
      :href="publicidad.href"
      download="Menu del dia.jpg"
    >
      Descargar imagen
    </a>
    <br />
    <canvas id="canvas" width="1080" height="1330"></canvas>
    <img
      id="fondoCanvas"
      src="../assets/Menu1080x1330.jpg"
      width="30"
      height="30"
      alt=""
    />
    <img
      v-if="publicidad.href === ''"
      class="imgVi"
      src="../assets/Menu1080x1330.jpg"
    />
    <img v-else id="imgVi" :src="publicidad.href" alt="Datos" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { BIconXCircleFill } from 'bootstrap-vue'
import utils from '../modules/utils'

export default {
  components: {
    BIconXCircleFill,
  },
  data() {
    return {
      publicidad: {
        sizeAntojitos: 48,
        interlineadoAnto: 80,
        antojito: '',
        sizeDate: 52,
        sizeMenu: 42,
        interlineadoMenu: 80,
        menu: '',
        imagePainted: false,
        href: '',
        date: '',
      },
    }
  },
  computed: {
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
  },
  mounted() {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const imageObj = document.getElementById('fondoCanvas')
    const imageObj2 = new Image()

    const date = new Date()
    this.publicidad.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`

    imageObj2.src = imageObj.src
    context.drawImage(imageObj2, 0, 0, 1080, 1330)
  },
  methods: {
    ...mapMutations({
      setLoading: 'general/setLoading',
      setAntojito: 'menucocina/setAntojito',
      setMenu: 'menucocina/setMenu',
      removeAntojito: 'menucocina/removeAntojito',
      removeMenu: 'menucocina/removeMenu',
    }),
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
      context.fillText(fecha, 550, 190)
      this.drawAntojitos(context)
      this.drawComidas(context)
      this.publicidad.imagePainted = true
      this.createImage()
    },
    drawAntojitos(context) {
      let contadorVueltas = 0
      const lengthList = this.listAntojitos.length
      if (lengthList > 1) {
        const posYCircle = parseInt(this.publicidad.sizeAntojitos / 3)
        this.listAntojitos.forEach((antojito, index) => {
          context.beginPath()
          context.font = this.publicidad.sizeAntojitos + 'px arial'
          if (index > 0 && index % 2 === 0) contadorVueltas++
          const posY = 410 + contadorVueltas * this.publicidad.interlineadoAnto
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
        const posYCircle = parseInt(this.publicidad.sizeMenu / 3)
        this.listComidas.forEach((antojito, index) => {
          context.beginPath()
          context.font = this.publicidad.sizeMenu + 'px arial'
          if (index > 0 && index % 2 === 0) contadorVueltas++
          const posY = 870 + contadorVueltas * this.publicidad.interlineadoMenu
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
  background: #fff;
}

#imgVi,
.imgVi {
  background: #fff;
  max-width: 1080px; /*540px;*/
  max-height: 1330px; /*960px;*/
  width: 98%;
  margin-bottom: 20px;
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
</style>
