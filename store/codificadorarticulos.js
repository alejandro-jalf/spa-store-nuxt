if (!localStorage.getItem('spastore_codificador_sucursal'))
  localStorage.setItem('spastore_codificador_sucursal', 'ZR')
if (!localStorage.getItem('spastore_codificador_barcode'))
  localStorage.setItem('spastore_codificador_barcode', '')
if (!localStorage.getItem('spastore_codificador_codesend'))
  localStorage.setItem('spastore_codificador_codesend', '')

export const state = () => ({
  sucursal: localStorage.getItem('spastore_codificador_sucursal'),
  barCode: localStorage.getItem('spastore_codificador_barcode'),
  codeSend: localStorage.getItem('spastore_codificador_codesend'),
  article: sessionStorage.getItem('spastore_codificador_article_data')
    ? JSON.parse(sessionStorage.getItem('spastore_codificador_article_data'))
    : {
        data: [
          {
            Articulo: '0000000',
            Nombre: 'Articulo no encontrado',
            Descripcion: 'No encontrado',
            CodigoBarras: '',
            Relacion: '0PZ/0CJA',
            ExistenciaActualRegular: 0,
          },
        ],
      },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_codificador_sucursal', sucursal)
  },
  setBarCode(state, barCode) {
    state.barCode = barCode
    localStorage.setItem('spastore_codificador_barcode', barCode)
  },
  setCodeSend(state, codeSend) {
    state.codeSend = codeSend
    localStorage.setItem('spastore_codificador_codeSend', codeSend)
  },
  setArticle(state, article) {
    state.article = article
    sessionStorage.setItem(
      'spastore_codificador_article_data',
      JSON.stringify(article)
    )
  },
}

export const actions = {
  async updateArticle({ commit }, [sucursal, barCode]) {
    const dataArticle = {
      Articulo: '0000000',
      Nombre: 'Articulo no encontrado',
      Descripcion: 'No encontrado',
      CodigoBarras: '',
      Relacion: '0PZ/0CJA',
      ExistenciaActualRegular: 0,
    }
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/' +
        barCode +
        '/codificador?sucursal=' +
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
