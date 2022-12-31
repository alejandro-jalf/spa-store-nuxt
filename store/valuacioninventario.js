if (!localStorage.getItem('spastore_valuacion_inv_sucursal'))
  localStorage.setItem('spastore_valuacion_inv_sucursal', 'ZR')
if (!localStorage.getItem('spastore_valuacion_inv_sucursaldata'))
  localStorage.setItem('spastore_valuacion_inv_sucursaldata', 'ZR')
if (!localStorage.getItem('spastore_valuacion_inv_tienda'))
  localStorage.setItem('spastore_valuacion_inv_tienda', '1')
if (!localStorage.getItem('spastore_valuacion_inv_almacen'))
  localStorage.setItem('spastore_valuacion_inv_almacen', '2')
if (!localStorage.getItem('spastore_valuacion_inv_horaConsulta'))
  localStorage.setItem('spastore_valuacion_inv_horaConsulta', '')

export const state = () => ({
  data: localStorage.getItem('spastore_valuacion_inv_data')
    ? JSON.parse(localStorage.getItem('spastore_valuacion_inv_data'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_valuacion_inv_sucursal'),
  sucursalData: localStorage.getItem('spastore_valuacion_inv_sucursaldata'),
  tienda: localStorage.getItem('spastore_valuacion_inv_tienda'),
  almacen: localStorage.getItem('spastore_valuacion_inv_almacen'),
  horaConsulta: localStorage.getItem('spastore_valuacion_inv_horaConsulta'),
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
  setSucursalData(state, sucursalData) {
    state.sucursalData = sucursalData
    localStorage.setItem('spastore_valuacion_inv_sucursaldata', sucursalData)
  },
  setTienda(state, tienda) {
    state.tienda = tienda
    localStorage.setItem('spastore_valuacion_inv_tienda', tienda)
  },
  setAlmacen(state, almacen) {
    state.almacen = almacen
    localStorage.setItem('spastore_valuacion_inv_almacen', almacen)
  },
  setHoraConsulta(state, horaConsulta) {
    state.horaConsulta = horaConsulta
    localStorage.setItem('spastore_valuacion_inv_horaConsulta', horaConsulta)
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

      if (response.data.success) {
        commit('setData', { data: response.data.data })
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
