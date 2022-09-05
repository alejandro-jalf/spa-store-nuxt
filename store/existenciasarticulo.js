if (!localStorage.getItem('spastore_articulos_count'))
  localStorage.setItem('spastore_articulos_count', '0')

if (!localStorage.getItem('spastore_articulos_details'))
  localStorage.setItem('spastore_articulos_details', '{}')

export const state = () => ({
  articulosFinded: localStorage.getItem('spastore_articulos_count'),
  listArticulos: JSON.parse(
    localStorage.getItem('spastore_articulos_existencias')
  ) || { data: [], count: 0 },
  details: JSON.parse(localStorage.getItem('spastore_articulos_details')),
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
  setArticuloDetails(state, details) {
    state.details = details
    localStorage.setItem('spastore_articulos_details', JSON.stringify(details))
  },
}

export const actions = {
  async getListArticulos({ commit }, articulo) {
    try {
      const response = await this.$axios({
        url:
          process.env.spastore_url_backend +
          'api/v1/articulos/' +
          articulo +
          '/existencias',
        method: 'get',
      })

      if (response.data.success) {
        commit('setListArticulos', response.data)
        commit('setArticulosFinded', response.data.count)
        return response.data
      }

      commit('setListArticulos', { data: [], count: 0 })
      commit('setArticulosFinded', 0)
      return { data: [], count: 0 }
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return { data: [], count: 0 }
    }
  },
  async getDetailsArticulo({ commit }, articulo) {
    try {
      const response = await this.$axios({
        url:
          process.env.spastore_url_backend +
          'api/v1/articulos/' +
          articulo +
          '/existencias/detalles',
        method: 'get',
      })

      if (response.data.success) {
        commit('setArticuloDetails', response.data.data)
        return response.data.data
      }

      commit('setArticuloDetails', {})
      return {}
    } catch (error) {
      if (error.response) {
        commit('setArticuloDetails', {})
        return {}
      }
      return {}
    }
  },
}
