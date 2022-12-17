<template>
  <span class="container-simbologia">
    <div class="title-container bg-white">Colores</div>
    <span
      v-if="showWarning"
      class="container-color"
      @click="
        showMessage(contentMessageWarning, titleMessageWarning, 'warning')
      "
    >
      <div class="bg-warning shape-color">
        <b-icon icon="question" class="icon-hand" />
      </div>
      {{ titleWarning }}
    </span>
    <span
      v-if="showDanger"
      class="container-color"
      @click="showMessage(contentMessageDanger, titleMessageDanger, 'danger')"
    >
      <div class="bg-danger shape-color">
        <b-icon icon="question" class="icon-hand text-light" />
      </div>
      {{ titleDanger }}
    </span>
    <span
      v-if="showInfo"
      class="container-color"
      @click="showMessage(contentMessageInfo, titleMessageInfo, 'info')"
    >
      <div class="bg-info shape-color">
        <b-icon icon="question" class="icon-hand text-light" />
      </div>
      {{ titleInfo }}
    </span>
    <span
      v-if="showDark"
      class="container-color"
      @click="showMessage(contentMessageDark, titleMessageDark, 'dark')"
    >
      <div class="bg-dark shape-color">
        <b-icon icon="question" class="icon-hand text-light" />
      </div>
      {{ titleDark }}
    </span>
    <span
      v-if="showSecondary"
      class="container-color"
      @click="
        showMessage(contentMessageSecondary, titleMessageSecondary, 'secondary')
      "
    >
      <div class="bg-secondary shape-color">
        <b-icon icon="question" class="icon-hand text-light" />
      </div>
      {{ titleSecondary }}
    </span>
    <span
      v-if="showWhite"
      class="container-color"
      @click="showMessage(contentMessageWhite, titleMessageWhite, 'white')"
    >
      <div class="bg-white shape-color">
        <b-icon icon="question" class="icon-hand" />
      </div>
      {{ titleWhite }}
    </span>
    <span
      v-if="showSuccess"
      class="container-color"
      @click="
        showMessage(contentMessageSuccess, titleMessageSuccess, 'success')
      "
    >
      <div class="bg-success shape-color">
        <b-icon icon="question" class="icon-hand text-light" />
      </div>
      {{ titleSuccess }}
    </span>
  </span>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    titleMessageWarning: {
      required: false,
      type: String,
      default: 'Color Amarillo',
    },
    titleMessageInfo: {
      required: false,
      type: String,
      default: 'Color Azul',
    },
    titleMessageDark: {
      required: false,
      type: String,
      default: 'Color Oscuro',
    },
    titleMessageSecondary: {
      required: false,
      type: String,
      default: 'Color Grisaceo',
    },
    titleMessageDanger: {
      required: false,
      type: String,
      default: 'Color Rojo',
    },
    titleMessageWhite: {
      required: false,
      type: String,
      default: 'Color Blanco',
    },
    titleMessageSuccess: {
      required: false,
      type: String,
      default: 'Color Verde',
    },
    contentMessageWarning: {
      required: false,
      type: String,
      default: 'Color Amarillo',
    },
    contentMessageInfo: {
      required: false,
      type: String,
      default: 'Color Azul',
    },
    contentMessageDark: {
      required: false,
      type: String,
      default: 'Color Oscuro',
    },
    contentMessageSecondary: {
      required: false,
      type: String,
      default: 'Color Grisaceo',
    },
    contentMessageDanger: {
      required: false,
      type: String,
      default: 'Color Rojo',
    },
    contentMessageWhite: {
      required: false,
      type: String,
      default: 'Color Blanco',
    },
    contentMessageSuccess: {
      required: false,
      type: String,
      default: 'Color Verde',
    },
    titleWarning: {
      required: false,
      type: String,
      default: 'No ay detalles',
    },
    titleInfo: {
      required: false,
      type: String,
      default: 'Encontrado',
    },
    titleDark: {
      required: false,
      type: String,
      default: 'Encontrado',
    },
    titleSecondary: {
      required: false,
      type: String,
      default: 'Encontrado',
    },
    titleDanger: {
      required: false,
      type: String,
      default: 'Sin Conexion',
    },
    titleWhite: {
      required: false,
      type: String,
      default: 'Encontrado',
    },
    titleSuccess: {
      required: false,
      type: String,
      default: 'Encontrado',
    },
    showWarning: {
      required: false,
      type: Boolean,
      default: false,
    },
    showInfo: {
      required: false,
      type: Boolean,
      default: false,
    },
    showDark: {
      required: false,
      type: Boolean,
      default: false,
    },
    showSecondary: {
      required: false,
      type: Boolean,
      default: false,
    },
    showDanger: {
      required: false,
      type: Boolean,
      default: false,
    },
    showWhite: {
      required: false,
      type: Boolean,
      default: false,
    },
    showSuccess: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations({
      showAlertDialog: 'general/showAlertDialog',
    }),
    showMessage(message, title, type = 'info') {
      this.showAlertDialog([message, title, type])
    },
  },
}
</script>

<style scoped>
.container-simbologia {
  display: inline-block;
  position: relative;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #c3c3c3;
}

.title-container {
  position: absolute;
  top: -15px;
  left: 5px;
  font-size: 14px;
  padding: 0px 5px;
  border-radius: 3px;
  color: #000;
}

.container-color {
  position: relative;
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.shape-color {
  text-align: center;
  display: block;
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  margin-right: 3px;
  color: #000;
}

.icon-hand {
  margin-bottom: 2px;
}
</style>
