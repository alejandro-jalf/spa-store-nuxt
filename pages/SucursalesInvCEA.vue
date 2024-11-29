<template>
  <div>
    <h2 class="text-center my-4">Sucursales</h2>
    <b-card title="Agregando Sucursal" class="text-dark">
      <b-form inline class="mt-1">
        <span id="spanCodigo" class="input-sel">
          <div class="label">Codigo</div>
          <b-form-input
            ref="inputCodigo"
            v-model="Codigo"
            class="w-100 caja"
            placeholder="Codigo"
            type="text"
            @focus="$refs.inputCodigo.select()"
            @keyup.enter="$refs.inputdescuento.focus()"
            @keyup.esc="clean"
          />
          <div class="description">2 Caracteres</div>
        </span>
        <span class="input-sel">
          <div class="label">Descripcion</div>
          <b-form-input
            ref="inputdescuento"
            v-model="descuento"
            class="w-100 caja"
            placeholder="Descuento"
            type="number"
            @focus="$refs.inputdescuento.select()"
            @keyup.esc="clean"
          />
          <div class="description">50 Caracteres Maximo</div>
        </span>
        <span class="input-sel">
          <div class="label">Estado</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
        </span>
        <span class="input-sel">
          <div class="label">Ciudad</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
        </span>
        <span class="input-sel">
          <div class="label">Calle</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
        </span>
        <span class="input-sel">
          <div class="label">Numero</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
        </span>
        <span class="input-sel">
          <div class="label">CP</div>
          <b-form-input
            ref="inputResultado"
            v-model="result"
            class="w-100 resultado"
            placeholder="Resultado"
            readonly
            @focus="$refs.inputResultado.select()"
            @keyup.esc="clean"
          />
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
      utils,
      Codigo: '',
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
.input-sel {
  margin-left: 10px;
  width: calc(33% - 30px);
}

#spanCodigo {
  width: 110px;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 16px;
}

.description {
  font-style: italic;
  color: rgb(127, 127, 127);
}
</style>
