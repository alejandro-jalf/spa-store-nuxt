if (!localStorage.getItem('spastore_ventasxarticulo_sucursal'))
  localStorage.setItem('spastore_ventasxarticulo_sucursal', 'ALL')
if (!localStorage.getItem('spastore_ventasxarticulo_dateInit'))
  localStorage.setItem('spastore_ventasxarticulo_dateInit', '00/00/0000')
if (!localStorage.getItem('spastore_ventasxarticulo_dateEnd'))
  localStorage.setItem('spastore_ventasxarticulo_dateEnd', '00/00/0000')
if (!localStorage.getItem('spastore_ventasxarticulo_tipo'))
  localStorage.setItem('spastore_ventasxarticulo_tipo', 'line')

export const state = () => ({
  data: sessionStorage.getItem('spastore_ventasxarticulo_data')
    ? JSON.parse(sessionStorage.getItem('spastore_ventasxarticulo_data'))
    : { data: [], Sucursal: 'null', Totales: {}, Existencias: {} },
  sucursal: localStorage.getItem('spastore_ventasxarticulo_sucursal'),
  dateInit: localStorage.getItem('spastore_ventasxarticulo_dateInit'),
  dateInitM: localStorage.getItem('spastore_ventasxarticulo_dateInitM') || null,
  dateEnd: localStorage.getItem('spastore_ventasxarticulo_dateEnd'),
  dateEndM: localStorage.getItem('spastore_ventasxarticulo_dateEndM') || null,
  tipo: localStorage.getItem('spastore_ventasxarticulo_tipo'),
  articles: (
    localStorage.getItem('spastore_ventasxarticulo_articles') || ''
  ).split(','),
  sucursales: (
    localStorage.getItem('spastore_ventasxarticulo_sucursales') ||
    'ZR,VZ,ER,OU,JL,SY,SC'
  ).split(','),
  showGraph: true,
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem(
      'spastore_ventasxarticulo_data',
      JSON.stringify(data)
    )
  },
  cleanData(state) {
    state.data = { data: [], Sucursal: 'null', Totales: {} }
    sessionStorage.removeItem('spastore_ventasxarticulo_data')
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_ventasxarticulo_sucursal', sucursal)
  },
  setDateInit(state, dateInit) {
    state.dateInit = dateInit
    localStorage.setItem('spastore_ventasxarticulo_dateInit', dateInit)
  },
  setDateInitM(state, dateInitM) {
    state.dateInitM = dateInitM
    localStorage.setItem('spastore_ventasxarticulo_dateInitM', dateInitM)
  },
  setDateEnd(state, dateEnd) {
    state.dateEnd = dateEnd
    localStorage.setItem('spastore_ventasxarticulo_dateEnd', dateEnd)
  },
  setDateEndM(state, dateEndM) {
    state.dateEndM = dateEndM
    localStorage.setItem('spastore_ventasxarticulo_dateEndM', dateEndM)
  },
  setTipoGrafico(state, tipo) {
    state.tipo = tipo
    localStorage.setItem('spastore_ventasxarticulo_tipo', tipo)
  },
  setArticles(state, articles) {
    state.articles = articles
    localStorage.setItem(
      'spastore_ventasxarticulo_articles',
      articles.toString()
    )
  },
  setSucursales(state, sucursales) {
    state.sucursales = sucursales
    localStorage.setItem(
      'spastore_ventasxarticulo_sucursales',
      sucursales.toString()
    )
  },
  setShowGraph(state, showGraph) {
    state.showGraph = showGraph
  },
}

export const actions = {
  async changeData(
    { commit },
    [sucursal, dateStart, dateEnd, dateStartLetra, dateEndLetra, articulos]
  ) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/ventas/' +
        sucursal +
        '/articulos?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd
      const response = await this.$axios({
        url,
        method: 'post',
        data: { articulos },
      })

      if (response.data.success) {
        commit('setData', response.data)
        commit('setDateInit', dateStartLetra)
        commit('setDateEnd', dateEndLetra)
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
}
