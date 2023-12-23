if (!localStorage.getItem('spastore_cot_mayori_sucursal'))
  localStorage.setItem('spastore_cot_mayori_sucursal', 'ZR')

export const state = () => ({
  documento: localStorage.getItem('spastore_cot_mayori_data')
    ? JSON.parse(localStorage.getItem('spastore_cot_mayori_data'))
    : { consecutivo: '', data: [] },
  comparativa: localStorage.getItem('spastore_cot_mayori_comparativa')
    ? JSON.parse(localStorage.getItem('spastore_cot_mayori_comparativa'))
    : {
        documento: '',
        excel: '',
        data: [],
      },
  excel: localStorage.getItem('spastore_cot_mayori_excel')
    ? JSON.parse(localStorage.getItem('spastore_cot_mayori_excel'))
    : {
        name: '',
        data: [],
      },
  sucursal: localStorage.getItem('spastore_cot_mayori_sucursal'),
  title: localStorage.getItem('spastore_cot_mayori_title'),
})

export const mutations = {
  setDocumento(state, documento) {
    state.documento = documento
    localStorage.setItem('spastore_cot_mayori_data', JSON.stringify(documento))
  },
  setComparativa(state, comparativa) {
    state.comparativa = comparativa
    localStorage.setItem(
      'spastore_cot_mayori_comparativa',
      JSON.stringify(comparativa)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_cot_mayori_sucursal', sucursal)
  },
  setTitle(state, title) {
    state.title = title
    localStorage.setItem('spastore_cot_mayori_title', title)
  },
  setExcel(state, excel) {
    state.excel = excel
    localStorage.setItem('spastore_cot_mayori_excel', JSON.stringify(excel))
  },
}

export const actions = {
  async changeDataDocument({ commit }, [sucursal, type, documento]) {
    try {
      const source = type === 'C' ? 'compra/' : 'orden/'
      const url =
        process.env.spastore_url_backend +
        'api/v1/mayoristas/' +
        sucursal +
        '/' +
        source +
        documento

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        response.data.consecutivo = documento
        commit('setDocumento', response.data)
      }

      return response.data
    } catch (error) {
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async updateCosto({ commit }, [sucursal, documento, body]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/mayoristas/' +
        sucursal +
        '/orden/' +
        documento

      const response = await this.$axios({
        url,
        method: 'put',
        data: body,
      })

      return response.data
    } catch (error) {
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async updateCostoMasivo({ commit }, [sucursal, documento, data]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/mayoristas/' +
        sucursal +
        '/orden/' +
        documento +
        '/masivo'

      const response = await this.$axios({
        url,
        method: 'put',
        data: { data },
      })

      return response.data
    } catch (error) {
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
