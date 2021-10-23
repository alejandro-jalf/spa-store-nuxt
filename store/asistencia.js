if (!localStorage.getItem('spastore_asistencias_sucursal'))
  localStorage.setItem('spastore_asistencias_sucursal', 'ZR')
if (!localStorage.getItem('spastore_asistencias_dateInit'))
  localStorage.setItem('spastore_asistencias_dateInit', '00/00/0000')
if (!localStorage.getItem('spastore_asistencias_dateEnd'))
  localStorage.setItem('spastore_asistencias_dateEnd', '00/00/0000')

export const state = () => ({
  // data: localStorage.getItem('spastore_asistencias_data')
  //   ? JSON.parse(localStorage.getItem('spastore_asistencias_data'))
  //   : { data: [] },
  data: {
    data: [
      {
        nombre: 'BRIGIDA MOGO NUÑES',
        asistencias: [
          {
            fecha: '18/10/2021',
            entrada: '07:23:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '19/10/2021',
            entrada: '07:43:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '20/10/2021',
            entrada: '07:13:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '21/10/2021',
            entrada: '07:00:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '22/10/2021',
            entrada: '07:56:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
        ],
      },
      {
        nombre: 'EDUARDO PACHECO REYES',
        asistencias: [
          {
            fecha: '18/10/2021',
            entrada: '07:23:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '19/10/2021',
            entrada: '07:43:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '20/10/2021',
            entrada: '07:13:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
          {
            fecha: '21/10/2021',
            entrada: '07:00:49',
            scomida: '',
            ecomida: '',
            salida: '16:03:36',
          },
        ],
      },
    ],
  },
  sucursal: localStorage.getItem('spastore_asistencias_sucursal'),
  dateInit: localStorage.getItem('spastore_asistencias_dateInit'),
  dateEnd: localStorage.getItem('spastore_asistencias_dateEnd'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    localStorage.setItem('spastore_asistencias_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_asistencias_sucursal', sucursal)
  },
  setDateInit(state, dateInit) {
    state.dateInit = dateInit
    localStorage.setItem('spastore_asistencias_dateInit', dateInit)
  },
  setDateEnd(state, dateEnd) {
    state.dateEnd = dateEnd
    localStorage.setItem('spastore_asistencias_dateEnd', dateEnd)
  },
}

export const actions = {
  async changeData({ commit }, [dateStart, dateEnd, sucursal]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/asitencias/' +
        sucursal +
        '?fechaIni=' +
        dateStart +
        '&fechaFin=' +
        dateEnd
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.response.success) {
        commit('setData', { data: response.data.response.data })
      }

      return response.data.response
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
