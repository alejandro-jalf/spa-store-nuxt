if (!localStorage.getItem('spa_store_pedidos_sucursal'))
  localStorage.setItem('spa_store_pedidos_sucursal', 'ZR')
if (!localStorage.getItem('spa_store_pedidos_num_pedido'))
  localStorage.setItem('spa_store_pedidos_num_pedido', 0)
if (!localStorage.getItem('spa_store_pedidos_view_details'))
  localStorage.setItem('spa_store_pedidos_view_details', false)

export const state = () => ({
  sucursal: localStorage.getItem('spa_store_pedidos_sucursal'),
  pedido: localStorage.getItem('spa_store_pedidos_num_pedido'),
  viewDetails: localStorage.getItem('spa_store_pedidos_view_details'),
  dataPedidos: localStorage.getItem('spa_store_pedidos_data_pedidos')
    ? JSON.parse(localStorage.getItem('spa_store_pedidos_data_pedidos'))
    : { data: [] },
  dataArticulos: localStorage.getItem('spa_store_pedidos_data_articulos')
    ? JSON.parse(localStorage.getItem('spa_store_pedidos_data_articulos'))
    : { data: [] },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spa_store_pedidos_sucursal', sucursal)
  },
  setPedido(state, pedido) {
    state.pedido = pedido
    localStorage.setItem('spa_store_pedidos_num_pedido', pedido)
  },
  showDetails(state, viewDetails) {
    state.viewDetails = viewDetails
    localStorage.setItem('spa_store_pedidos_view_details', viewDetails)
  },
  changeDataPedidos(state, data) {
    state.dataPedidos = data
    localStorage.setItem('spa_store_pedidos_data_pedidos', JSON.stringify(data))
  },
  changeDataArticulos(state, data) {
    state.dataArticulos = data
    localStorage.setItem(
      'spa_store_pedidos_data_articulos',
      JSON.stringify(data)
    )
  },
}

export const actions = {
  async updateDataPedidos(
    { commit },
    [database, source, sucursal, isBodega = false]
  ) {
    try {
      const base = database === undefined ? '' : `database=${database}&`
      const origin = source === undefined ? '' : `source=${source}`
      const from = isBodega ? '' : `/${sucursal}`
      const url =
        process.env.spastore_url_backend +
        `api/v1/pedidos/maestros${from}?${base}${origin}`
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('changeDataPedidos', { data: response.data.data })
      } else commit('changeDataPedidos', { data: [] })

      return response.data
    } catch (error) {
      commit('changeDataPedidos', { data: [] })
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async updateDataArticulos(
    { commit },
    [database, source, sucursal, folio, busqueda, filter]
  ) {
    try {
      const from =
        filter === 'articulos'
          ? `/articulos/${busqueda}`
          : filter === 'nombre'
          ? `/nombres/${busqueda}`
          : filter === 'dias'
          ? `/dias/${busqueda}`
          : ''
      const url =
        process.env.spastore_url_backend +
        `api/v1/pedidos/detalles/${sucursal}/${folio}${from}?database=${database}&source=${source}`
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('changeDataArticulos', { data: response.data.data })
      } else commit('changeDataArticulos', { data: [] })

      return response.data
    } catch (error) {
      commit('changeDataArticulos', { data: [] })
      if (error.response) return error.response.data
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
}
