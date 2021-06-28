<template>
  <div>
    <label for="fecha">Fecha:</label>
    <b-form inline>
      <b-form-datepicker
        id="fecha"
        ref="fechaMenu"
        class="fechaDate"
        :value="date"
        :class="backgroundInputTheme"
        :today-button="true"
        label-no-date-selected="Seleccione una fecha"
        label-today-button="Fecha actual"
        label-help="Use las teclas del cursor para navegar entre el calendario"
        @context="changeDateSelected"
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
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  BIconXCircleFill,
  BIconPlusCircleFill,
  BIconJournalMedical,
  BIconCardList,
  BIconArrowDownCircleFill,
  BIconArrowUpCircleFill,
} from 'bootstrap-vue'

export default {
  components: {
    BIconXCircleFill,
    BIconPlusCircleFill,
    BIconJournalMedical,
    BIconCardList,
    BIconArrowDownCircleFill,
    BIconArrowUpCircleFill,
  },
  props: {
    listAntojitos: {
      type: Array,
      required: true,
    },
    listComidas: {
      type: Array,
      required: true,
    },
    horarioAnto: {
      type: Boolean,
      required: true,
    },
    horarioMenu: {
      type: Boolean,
      required: true,
    },
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
    date() {
      return this.$store.state.menucocina.dateSelected
    },
    width() {
      return this.$store.state.general.widthWindow
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
    // this.setDateSelected(dateToday)
    // document.querySelector('#fecha').value =
    // this.$refs.fechaMenu.$attrs.value = dateToday
    // eslint-disable-next-line no-console
    // console.log(dateToday)
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
  },
  methods: {
    ...mapMutations({
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
      setDateSelected: 'menucocina/setDateSelected',
    }),
    completeDateHour(number) {
      if (!number) return number
      const numberString = number.toString()
      if (numberString.length < 2) return '0' + number
      return number
    },
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
    changeDateSelected(evt) {
      this.setDateSelected(evt.activeYMD)
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
