<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container-prin">
    <b-card class="h-100">
      <h4 class="text-dark text-center font-weight-bold">{{ title }}</h4>
      <div class="container-scroll">
        <div class="container-stepps" role="tablist">
          <div
            v-for="(help, index) in steppers"
            :key="index"
            class="container-title"
          >
            <b-avatar
              variant="info"
              :text="(index + 1).toString()"
              class="ns"
            />
            <span class="text-dark">
              <span v-if="index < steppers.length - 1" class="line-vertical" />
              <span v-b-toggle="'accordion-' + index" class="ns title">
                {{ help.title }}
              </span>
            </span>
            <b-collapse
              :id="'accordion-' + index"
              accordion="my-accordion"
              role="tabpanel"
              :visible="index === 0"
            >
              <b-card class="card-step">
                <img
                  :src="utils.getImgUrl(help.image)"
                  alt="Ayuda"
                  class="image-help"
                  :width="defaultWidth(help.sizeImage)"
                />
                <div
                  class="text-dark text-left"
                  v-html="$md.render(help.content)"
                />
              </b-card>
            </b-collapse>
          </div>
        </div>
      </div>
      <b-button variant="dark" class="mt-2" @click="closeStepper">
        Cerrar
      </b-button>
    </b-card>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  name: 'Stepper',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Preguntas frecuentes',
    },
    steppers: {
      type: Array,
      required: true,
    },
    closeStepper: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      utils,
    }
  },
  methods: {
    defaultWidth(size) {
      return size || 300
    },
  },
}
</script>

<style scoped>
.ns {
  user-select: none;
}

.container-scroll {
  position: relative;
  height: 92%;
  overflow: auto;
  border-bottom: 1px solid rgb(0, 214, 242);
}

.container-prin {
  position: fixed;
  z-index: 9;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(1, 38, 48, 0.343);
  padding: 3%;
}

.container-title {
  position: relative;
  margin-bottom: 20px;
}

.title {
  cursor: pointer;
  font-weight: bold;
}

.title:hover {
  border-radius: 5px;
  box-shadow: 0px 0px 3px 3px rgba(0, 121, 154, 0.1);
}

.line-vertical {
  position: absolute;
  z-index: 0;
  left: 19px;
  top: 43px;
  width: 3px;
  height: 14px;
  background: rgb(191, 191, 191);
}

.card-step {
  width: calc(100% - 90px);
  margin-left: 45px;
  text-align: center;
  background: rgb(243, 243, 243);
}

.image-help {
  border-radius: 5px;
  border: 1px solid #fff;
  box-shadow: 1px 1px 2px 2px rgb(202, 202, 202);
  margin-bottom: 15px;
}
</style>
