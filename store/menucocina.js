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
}
