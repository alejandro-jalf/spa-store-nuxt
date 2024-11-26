<template>
  <div>
    <h2 class="text-center my-4">Calculadora de Descuentos</h2>
    <b-card
      title="Calculando"
      sub-title="(ESC) para limpiar o reiniciar"
      class="text-dark pb-3"
    >
      <b-form inline class="mt-1">
        <span class="input-sel">
          <div class="label">Importe Por Articulo</div>
          <b-form-input
            ref="inputimporte"
            v-model="importe"
            class="w-100 caja"
            placeholder="Importe"
            type="number"
            @focus="$refs.inputimporte.select()"
            @keyup.enter="$refs.inputdescuento.focus()"
            @keyup.esc="clean"
          />
          <div class="description">Importe Total del Articulo</div>
        </span>
        <span class="input-sel">
          <div class="label">Descuento Por Articulo</div>
          <b-form-input
            ref="inputdescuento"
            v-model="descuento"
            class="w-100 caja"
            placeholder="Descuento"
            type="number"
            @focus="$refs.inputdescuento.select()"
            @keyup.esc="clean"
          />
          <div class="description">Valor en Pesos</div>
        </span>
        <span class="input-sel">
          <div class="label">Resultado</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
          <div class="description">Valor en Porcentaje</div>
        </span>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import utils from '../modules/utils'

export default {
  data() {
    return {
      descuento: 0.0,
      importe: 0.0,
    }
  },
  computed: {
    result() {
      const desc =
        this.descuento === '' || isNaN(this.descuento) ? 0 : this.descuento
      const imp = this.importe === '' || isNaN(this.importe) ? 0 : this.importe

      const res = imp === 0 ? 0 : (desc / imp) * 100
      return utils.roundTo(isNaN(res) ? 0 : res, 3, true) + ' %'
    },
  },
  mounted() {},
  methods: {
    clean() {
      this.descuento = 0
      this.importe = 0
      this.$refs.inputimporte.focus()
      this.$refs.inputimporte.select()
    },
  },
}
</script>

<style scoped>
.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.input-sel {
  margin-left: 10px;
  width: calc(33% - 30px);
}

.caja {
  height: 60px;
  font-size: 19px;
}

.resultado {
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  background: #242424;
  color: #85ff63;
}
</style>
