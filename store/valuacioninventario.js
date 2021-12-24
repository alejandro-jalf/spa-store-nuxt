if (!localStorage.getItem('spastore_valuacion_inv_sucursal'))
  localStorage.setItem('spastore_valuacion_inv_sucursal', 'ZR')
if (!localStorage.getItem('spastore_valuacion_inv_tienda'))
  localStorage.setItem('spastore_valuacion_inv_tienda', 'ZR')
if (!localStorage.getItem('spastore_valuacion_inv_almacen'))
  localStorage.setItem('spastore_valuacion_inv_almacen', 'ZR')

export const state = () => ({
  data: localStorage.getItem('spastore_valuacion_inv_data')
    ? JSON.parse(localStorage.getItem('spastore_valuacion_inv_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_valuacion_inv_sucursal'),
  tienda: localStorage.getItem('spastore_valuacion_inv_tienda'),
  almacen: localStorage.getItem('spastore_valuacion_inv_almacen'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_valuacion_inv_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_valuacion_inv_sucursal', sucursal)
  },
  setTienda(state, tienda) {
    state.tienda = tienda
    localStorage.setItem('spastore_valuacion_inv_tienda', tienda)
  },
  setAlmacen(state, almacen) {
    state.almacen = almacen
    localStorage.setItem('spastore_valuacion_inv_almacen', almacen)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, tienda, almacen]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/reportes/inventario/cierre/' +
        sucursal +
        '/' +
        tienda +
        '/' +
        almacen
      const response = await this.$axios({
        url,
        method: 'get',
      })

      // eslint-disable-next-line no-console
      console.log(response.data)
      if (response.data.success) {
        commit('setData', { data: response.data })
      }

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
