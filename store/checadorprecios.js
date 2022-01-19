if (!localStorage.getItem('spastore_checador_sucursal'))
  localStorage.setItem('spastore_checador_sucursal', 'ZR')

export const state = () => ({
  sucursal: localStorage.getItem('spastore_checador_sucursal'),
  article: sessionStorage.getItem('spastore_checador_article_data')
    ? JSON.parse(sessionStorage.getItem('spastore_checador_article_data'))
    : {
        data: [
          {
            Articulo: '',
            Nombre: '',
            Descripcion: '',
            Precio1IVAUV: '0.0',
            Precio2IVAUV: null,
          },
        ],
      },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_checador_sucursal', sucursal)
  },
  setArticle(state, article) {
    state.article = article
    sessionStorage.setItem(
      'spastore_checador_article_data',
      JSON.stringify(article)
    )
  },
}

export const actions = {
  async updateArticle({ commit }, [sucursal, barCode]) {
    const dataArticle = {
      Articulo: '',
      Nombre: 'Articulo no encontrado',
      Descripcion: 'Intente nuevamente',
      Precio1IVAUV: '0.0',
      Precio2IVAUV: null,
    }
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/' +
        barCode +
        '/precio?sucursal=' +
        sucursal
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setArticle', { data: response.data.data })
      } else commit('setArticle', { data: [dataArticle] })

      return response.data
    } catch (error) {
      commit('setArticle', { data: [dataArticle] })
      if (error.response) {
        return error.response.data
      }
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
