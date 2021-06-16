if (!localStorage.getItem('spastore_menucocina_listAnt'))
  localStorage.setItem('spastore_menucocina_listAnt', '')
if (!localStorage.getItem('spastore_menucocina_comidas'))
  localStorage.setItem('spastore_menucocina_comidas', '')

export const state = () => ({
  listAntojitos: localStorage.getItem('spastore_menucocina_listAnt').split(','),
  listComidas: localStorage.getItem('spastore_menucocina_comidas').split(','),
})

export const mutations = {
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
