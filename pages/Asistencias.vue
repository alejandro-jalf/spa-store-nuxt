<template>
  <div class="pt-3">
    <div id="input-Sucursal" class="inputs">
      <b-input-group prepend="Sucursal">
        <b-form-select v-model="selected" :options="options"></b-form-select>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Fecha inicio">
        <b-form-datepicker
          id="date-init"
          v-model="dateInit"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <div class="inputs">
      <b-input-group prepend="Fecha final">
        <b-form-datepicker
          id="date-end"
          v-model="dateEnd"
          label-no-date-selected="Fecha no seleccionada"
        ></b-form-datepicker>
      </b-input-group>
    </div>
    <b-table-simple
      hover
      small
      caption-top
      responsive
      class="mt-2"
      :class="variantThemeTableBody"
    >
      <!-- <caption>
        Agrupacion por nombre:
      </caption> -->
      <!-- <colgroup><col><col></colgroup>
      <colgroup><col><col><col></colgroup>
      <colgroup><col><col></colgroup> -->
      <b-thead head-variant="dark">
        <!-- <b-tr>
          <b-th colspan="2">Region</b-th>
          <b-th colspan="3">Clothes</b-th>
          <b-th colspan="2">Accessories</b-th>
        </b-tr> -->
        <b-tr>
          <b-th>Nombre</b-th>
          <b-th>Fecha</b-th>
          <b-th>Asist.</b-th>
          <b-th>Entrada</b-th>
          <b-th>S. Comida</b-th>
          <b-th>E. Comida</b-th>
          <b-th>Salida</b-th>
          <b-th>Trabajo</b-th>
          <b-th>Comida</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr>
          <b-td rowspan="5">BRIGIDA MOGO NUÑES</b-td>
          <b-th class="text-right">Dias Asists.</b-th>
          <b-th variant="secondary">5</b-th>
          <b-td></b-td>
          <b-td></b-td>
          <b-th>Hrs Total</b-th>
          <b-th colspan="2" variant="secondary"> 24 Hrs 21 Min </b-th>
        </b-tr>
        <b-tr>
          <b-th>18/10/2021</b-th>
          <b-td>SI</b-td>
          <b-td>'07:23:49</b-td>
          <b-td></b-td>
          <b-td></b-td>
          <b-td>16:03:36</b-td>
          <b-th>8 Hrs 35 Min</b-th>
          <b-td></b-td>
        </b-tr>
      </b-tbody>
      <!-- <b-tfoot>
        <b-tr>
          <b-td colspan="7" variant="secondary" class="text-right">
            Total Rows: <b>5</b>
          </b-td>
        </b-tr>
      </b-tfoot> -->
    </b-table-simple>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: 'Seleccione una sucursal' },
        { value: 'ZR', text: 'Zaragoza' },
        { value: 'VC', text: 'Victoria' },
        { value: 'OU', text: 'Oluta' },
        { value: 'JL', text: 'Jaltipan' },
        { value: 'BO', text: 'Bodega' },
        { value: 'HU', text: 'Huamuchil', disabled: true },
      ],
      dateInit: '',
      dateEnd: '',
    }
  },
  computed: {
    variantThemeTableBody() {
      return this.$store.state.general.themesComponents.themeTableBody
    },
    dataRefactor() {
      const datos = []
      let position = 0
      this.$store.state.asistencia.data.data.forEach((dato) => {
        position = 0
        dato.asistencias.forEach((dia) => {
          position++
        })
        datos.push({
          position,
        })
      })
      return datos
    },
  },
}
</script>

<style scoped>
.inputs {
  width: 33%;
  margin-bottom: 10px;
  display: inline-block;
}

@media screen and (max-width: 1200px) {
  .inputs {
    width: 49%;
  }

  #input-Sucursal {
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  .inputs {
    width: 100%;
  }
}
</style>
