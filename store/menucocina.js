if (!localStorage.getItem('spastore_menucocina_listAnt'))
  localStorage.setItem('spastore_menucocina_listAnt', '')
if (!localStorage.getItem('spastore_menucocina_comidas'))
  localStorage.setItem('spastore_menucocina_comidas', '')
if (!localStorage.getItem('spastore_menucocina_sizeLetterAntojitos'))
  localStorage.setItem('spastore_menucocina_sizeLetterAntojitos', '48')
if (!localStorage.getItem('spastore_menucocina_interAntojitos'))
  localStorage.setItem('spastore_menucocina_interAntojitos', '80')
if (!localStorage.getItem('spastore_menucocina_sizeLetterMenu'))
  localStorage.setItem('spastore_menucocina_sizeLetterMenu', '42')
if (!localStorage.getItem('spastore_menucocina_interMenu'))
  localStorage.setItem('spastore_menucocina_interMenu', '80')
if (!localStorage.getItem('spastore_menucocina_sizeLetterDate'))
  localStorage.setItem('spastore_menucocina_sizeLetterDate', '54')
if (!localStorage.getItem('spastore_menucocina_collapseAnto'))
  localStorage.setItem('spastore_menucocina_collapseAnto', 'false')
if (!localStorage.getItem('spastore_menucocina_collapseMenu'))
  localStorage.setItem('spastore_menucocina_collapseMenu', 'false')
if (!localStorage.getItem('spastore_menucocina_horarioAnto'))
  localStorage.setItem('spastore_menucocina_horarioAnto', 'false')
if (!localStorage.getItem('spastore_menucocina_horarioMenu'))
  localStorage.setItem('spastore_menucocina_horarioMenu', 'false')
if (!localStorage.getItem('spastore_menucocina_hourStartAnto'))
  localStorage.setItem('spastore_menucocina_hourStartAnto', '')
if (!localStorage.getItem('spastore_menucocina_hourEndAnto'))
  localStorage.setItem('spastore_menucocina_hourEndAnto', '')
if (!localStorage.getItem('spastore_menucocina_hourStartMenu'))
  localStorage.setItem('spastore_menucocina_hourStartMenu', '')
if (!localStorage.getItem('spastore_menucocina_hourEndMenu'))
  localStorage.setItem('spastore_menucocina_hourEndMenu', '')

export const state = () => ({
  listAntojitos: localStorage.getItem('spastore_menucocina_listAnt').split(','),
  listComidas: localStorage.getItem('spastore_menucocina_comidas').split(','),
  sizeLetterAntojitos: localStorage.getItem(
    'spastore_menucocina_sizeLetterAntojitos'
  ),
  interlineadoAntojitos: localStorage.getItem(
    'spastore_menucocina_interAntojitos'
  ),
  sizeLetterMenu: localStorage.getItem('spastore_menucocina_sizeLetterMenu'),
  interlineadoMenu: localStorage.getItem('spastore_menucocina_interMenu'),
  sizeLetterDate: localStorage.getItem('spastore_menucocina_sizeLetterDate'),
  collapseAnto: localStorage.getItem('spastore_menucocina_collapseAnto'),
  collapseMenu: localStorage.getItem('spastore_menucocina_collapseMenu'),
  horarioAnto: localStorage.getItem('spastore_menucocina_horarioAnto'),
  horarioMenu: localStorage.getItem('spastore_menucocina_horarioMenu'),
  hourStartAnto: localStorage.getItem('spastore_menucocina_hourStartAnto'),
  hourEndAnto: localStorage.getItem('spastore_menucocina_hourEndAnto'),
  hourStartMenu: localStorage.getItem('spastore_menucocina_hourStartMenu'),
  hourEndMenu: localStorage.getItem('spastore_menucocina_hourEndMenu'),
  dateSelected: '',
})

export const mutations = {
  setSizeLetterAntojitos(state, size) {
    state.sizeLetterAntojitos = size
    localStorage.setItem('spastore_menucocina_sizeLetterAntojitos', size)
  },
  setInterlineadoAntojitos(state, inter) {
    state.interlineadoAntojitos = inter
    localStorage.setItem('spastore_menucocina_interAntojitos', inter)
  },
  setSizeLetterMenu(state, size) {
    state.sizeLetterMenu = size
    localStorage.setItem('spastore_menucocina_sizeLetterMenu', size)
  },
  setInterlineadoMenu(state, inter) {
    state.interlineadoMenu = inter
    localStorage.setItem('spastore_menucocina_interMenu', inter)
  },
  setSizeLetterDate(state, size) {
    state.sizeLetterDate = size
    localStorage.setItem('spastore_menucocina_sizeLetterDate', size)
  },
  setCollapseAnto(state, visible) {
    state.collapseAnto = visible
    localStorage.setItem('spastore_menucocina_collapseAnto', visible)
  },
  setCollapseMenu(state, visible) {
    state.collapseMenu = visible
    localStorage.setItem('spastore_menucocina_collapseMenu', visible)
  },
  setHorarioAnto(state, activo) {
    state.horarioAnto = activo
    localStorage.setItem('spastore_menucocina_horarioAnto', activo)
  },
  setHorarioMenu(state, activo) {
    state.horarioMenu = activo
    localStorage.setItem('spastore_menucocina_horarioMenu', activo)
  },
  setHourStartAnto(state, hora) {
    state.hourStartAnto = hora
    localStorage.setItem('spastore_menucocina_hourStartAnto', hora)
  },
  setHourEndAnto(state, hora) {
    state.hourEndAnto = hora
    localStorage.setItem('spastore_menucocina_hourEndAnto', hora)
  },
  setHourStartMenu(state, hora) {
    state.hourStartMenu = hora
    localStorage.setItem('spastore_menucocina_hourStartMenu', hora)
  },
  setHourEndMenu(state, hora) {
    state.hourEndMenu = hora
    localStorage.setItem('spastore_menucocina_hourEndMenu', hora)
  },
  setAntojito(state, antojito) {
    state.listAntojitos.push(antojito)
    const stringAntojitos = state.listAntojitos.toString()
    localStorage.setItem('spastore_menucocina_listAnt', stringAntojitos)
  },
  setMenu(state, menu) {
    state.listComidas.push(menu)
    const stringComidas = state.listComidas.toString()
    localStorage.setItem('spastore_menucocina_comidas', stringComidas)
  },
  removeAntojito(state, antojito) {
    const listRefactor = state.listAntojitos.filter((ant) => ant !== antojito)
    state.listAntojitos = listRefactor
    const stringAntojitos = state.listAntojitos.toString()
    localStorage.setItem('spastore_menucocina_listAnt', stringAntojitos)
  },
  removeMenu(state, menu) {
    const listRefactor = state.listComidas.filter((men) => men !== menu)
    state.listComidas = listRefactor
    const stringComidas = state.listComidas.toString()
    localStorage.setItem('spastore_menucocina_comidas', stringComidas)
  },
  setDateSelected(state, date) {
    state.dateSelected = date
  },
}
