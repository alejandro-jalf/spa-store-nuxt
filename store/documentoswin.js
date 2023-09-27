if (!localStorage.getItem('spastore_docwin_sucursal'))
  localStorage.setItem('spastore_docwin_sucursal', 'ZR')

export const state = () => ({
  data: sessionStorage.getItem('spastore_docwin_data')
    ? JSON.parse(sessionStorage.getItem('spastore_docwin_data'))
    : { articles: 0, dataDoc: {}, data: [] },
  documents: sessionStorage.getItem('spastore_docwin_documents')
    ? JSON.parse(sessionStorage.getItem('spastore_docwin_documents'))
    : { count: 0, data: [] },
  dataBases: localStorage.getItem('spastore_docwin_db')
    ? JSON.parse(localStorage.getItem('spastore_docwin_db'))
    : { ZR: [], VC: [], ER: [], OU: [], Sy: [], JL: [], BO: [], SC: [] },
  sucursal: localStorage.getItem('spastore_docwin_sucursal'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_docwin_data', JSON.stringify(data))
  },
  setDocuments(state, documents) {
    state.documents = documents
    sessionStorage.setItem(
      'spastore_docwin_documents',
      JSON.stringify(documents)
    )
  },
  setDataBases(state, dataBases) {
    state.dataBases = dataBases
    localStorage.setItem('spastore_docwin_db', JSON.stringify(dataBases))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_docwin_sucursal', sucursal)
  },
}

export const actions = {
  async changeData(
    { commit },
    [sucursal, documento = '', database = '', from]
  ) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/movimientos/' +
        `${sucursal}/${from}/${documento}?database=${database}`

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) commit('setData', response.data)

      return response.data
    } catch (error) {
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
  async loadDocuments(
    { commit },
    [
      sucursal,
      database = '',
      typeDoc = '',
      likeDoc = '',
      likeRef = '',
      order = 'DESC',
    ]
  ) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/movimientos/' +
        sucursal +
        '?database' +
        database +
        '&typeDoc=' +
        typeDoc +
        '&likeDoc=' +
        likeDoc +
        '&likeRef=' +
        likeRef +
        '&order=' +
        order
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) commit('setDocuments', response.data)

      return response.data
    } catch (error) {
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
