if (!localStorage.getItem('spastore_articulos_existencias'))
  localStorage.setItem('spastore_articulos_existencias', '{data:[]}')

if (!localStorage.getItem('spastore_articulos_count'))
  localStorage.setItem('spastore_articulos_count', '0')

export const state = () => ({
  articulosFinded: localStorage.getItem('spastore_articulos_count') || 0,
  listArticulos: JSON.parse(
    localStorage.getItem('spastore_articulos_existencias')
  ) || { data: [] },
})

export const mutations = {
  setListArticulos(state, list) {
    state.listArticulos = list
    localStorage.setItem('spastore_articulos_existencias', JSON.stringify(list))
  },
  setArticulosFinded(state, finded) {
    state.articulosFinded = finded
    localStorage.setItem('spastore_articulos_count', finded)
  },
}

export const actions = {
  async getListArticulos({ commit }, articulo) {
    try {
      const response = await this.$axios({
        url: process.env.spastore_url_existencia_articulos + '=' + articulo,
        method: 'get',
      })

      if (response.data.success) {
        // eslint-disable-next-line no-console
        console.log(response.data)
        commit('setListArticulos', response.data)
        commit('setArticulosFinded', response.data.count)
        return response.data
      }
      return { data: [], count: 0 }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      if (error.response) {
        // eslint-disable-next-line no-console
        console.log(error.response)
        return error.response.data
      }
      return { data: [], count: 0 }
    }
  },
}
