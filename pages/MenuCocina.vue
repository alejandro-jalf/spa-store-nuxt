<template>
  <div>
    <h1>Menu de la cocina</h1>
    <b-form-group id="grLt" label="Tamaño de fuente" label-for="inpLetra">
      <b-form-input
        id="inpLetra"
        v-model="publicidad.sizeLetter"
        type="number"
      ></b-form-input>
    </b-form-group>
    <b-form-group id="grIn" label="Interlineado" label-for="inpInt">
      <b-form-input
        id="inpInt"
        v-model="publicidad.interlineado"
        type="number"
      ></b-form-input>
    </b-form-group>
    <b-form-group id="grLA" label="Antojitos" label-for="inpAnt">
      <b-input-group class="mt-3">
        <template #append>
          <b-button variant="success" @click="addAntojito">Agregar</b-button>
        </template>
        <b-form-input
          id="inpAnt"
          v-model="publicidad.antijito"
          type="text"
          trim
          @keyup.enter="addAntojito"
        ></b-form-input>
      </b-input-group>
    </b-form-group>
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
    <b-button class="mb-3" variant="outline-info" @click="drawFondo">
      Visualizar
    </b-button>
    <b-button class="mb-3" variant="outline-danger" @click="createImage">
      Crear imagen
    </b-button>
    <a id="descarga" href="http://" download="Menu del dia.jpg">
      Descargar imagen
    </a>
    <br />
    <canvas id="canvas" width="540" height="960"></canvas>
    <img
      id="fondoCanvas"
      src="../assets/menu.jpg"
      width="30"
      height="30"
      alt=""
    />
  </div>
</template>

<script>
import { BIconXCircleFill } from 'bootstrap-vue'

export default {
  components: {
    BIconXCircleFill,
  },
  data() {
    return {
      publicidad: {
        sizeLetter: 28,
        interlineado: 40,
        antijito: '',
      },
      listAntojitos: [
        'Empanadas',
        'Tostadas',
        'Entomatadas',
        'Tacos dorados',
        'Garnachas',
        'Platanos fritos',
      ],
      listComidas: [
        'Pollo en barbacoa',
        'Milanesa pollo emp.',
        'Chiles rellenos',
        'Calabacitas c/elote',
        'Arroz',
        'Salchicha enchip',
        'Menudencia',
      ],
    }
  },
  mounted() {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const imageObj = document.getElementById('fondoCanvas')
    const imageObj2 = new Image()

    imageObj2.src = imageObj.src
    context.drawImage(imageObj2, 0, 0, 540, 960)
  },
  methods: {
    createImage() {
      const descarga = document.getElementById('descarga')
      const canvas = document.getElementById('canvas')
      let dato = canvas.toDataURL('image/jpg')
      dato = dato.replace('image/jpeg', 'image/octet-stream')
      descarga.setAttribute('href', dato)
      // document.location.href = dato
      // window.open(dato, 'Menu del dia', 'width=300, height=200')
    },
    removeAntojito(antojitoRecived) {
      const listRefactor = this.listAntojitos.filter(
        (ant) => ant !== antojitoRecived
      )
      this.listAntojitos = listRefactor
    },
    addAntojito() {
      if (this.publicidad.antijito === '') return true
      const antojito = this.publicidad.antijito
      const antojitoFinded = this.listAntojitos.find(
        (ant) => ant.trim().toLowerCase() === antojito.toLowerCase()
      )
      if (antojitoFinded) return true
      this.listAntojitos.push(antojito)
      this.publicidad.antijito = ''
    },
    drawFondo() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      const imageObj = document.getElementById('fondoCanvas')
      const imageObj2 = new Image()

      imageObj2.src = imageObj.src
      context.drawImage(imageObj2, 0, 0, 540, 960)
      this.drawAntojitos(context)
    },
    drawAntojitos(context) {
      let contadorVueltas = 0
      const lengthList = this.listAntojitos.length
      if (lengthList > 1) {
        const posYCircle = parseInt(this.publicidad.sizeLetter / 3)
        this.listAntojitos.forEach((antojito, index) => {
          context.beginPath()
          context.font = this.publicidad.sizeLetter + 'px arial'
          if (index > 0 && index % 2 === 0) contadorVueltas++
          const posY = 320 + contadorVueltas * this.publicidad.interlineado
          if (index % 2 === 0) {
            context.fillStyle = 'black'
            context.fillText(antojito, 50, posY)
            context.fillStyle = 'orange'
            context.arc(40, posY - posYCircle, 5, 0, 2 * Math.PI)
          } else {
            context.fillStyle = 'black'
            context.fillText(antojito, 310, posY)
            context.fillStyle = 'orange'
            context.arc(300, posY - posYCircle, 5, 0, 2 * Math.PI)
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
  background: #fff;
}

.chipProduct {
  margin-left: 5px;
  margin-top: 5px;
  padding: 7px;
  font-size: 15px;
}

.close-chip {
  cursor: pointer;
}

.close-chip:hover {
  color: rgb(119, 119, 119);
}

.container-products {
  padding: 10px 15px 15px 10px;
  width: 100%;
  min-height: 50px;
  height: min-content;
  border-radius: 5px;
  border: 1px solid rgb(163, 163, 163);
  margin-bottom: 20px;
}
</style>
