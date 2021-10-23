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
            entrada: '2021-10-18 07:23:49.653',
            scomida: '',
            ecomida: '',
            salida: '2021-10-18 16:03:36.367',
          },
          {
            fecha: '19/10/2021',
            entrada: '2021-10-19 07:24:54.450',
            scomida: '',
            ecomida: '',
            salida: '2021-10-19 14:30:14.583',
          },
          {
            fecha: '20/10/2021',
            entrada: '2021-10-20 07:29:04.840',
            scomida: '',
            ecomida: '',
            salida: '2021-10-20 16:04:06.297',
          },
          {
            fecha: '21/10/2021',
            entrada: '2021-10-21 07:35:56.897',
            scomida: '',
            ecomida: '',
            salida: '',
          },
          {
            fecha: '22/10/2021',
            entrada: '2021-10-22 07:36:42.380',
            scomida: '',
            ecomida: '',
            salida: '',
          },
        ],
      },
      {
        nombre: 'EDUARDO PACHECO REYES',
        asistencias: [
          {
            fecha: '18/10/2021',
            entrada: '2021-10-18 07:25:07.917',
            scomida: '2021-10-18 16:13:19.517',
            ecomida: '2021-10-18 19:00:34.250',
            salida: '2021-10-18 21:14:18.997',
          },
          {
            fecha: '19/10/2021',
            entrada: '2021-10-19 07:25:52.383',
            scomida: '2021-10-19 15:15:03.390',
            ecomida: '2021-10-19 18:34:18.433',
            salida: '2021-10-19 21:14:54.773',
          },
          {
            fecha: '20/10/2021',
            entrada: '2021-10-20 07:28:49.370',
            scomida: '2021-10-20 15:29:57.057',
            ecomida: '2021-10-20 18:44:28.430',
            salida: '2021-10-20 21:07:45.630',
          },
          {
            fecha: '21/10/2021',
            entrada: '2021-10-22 07:37:24.800',
            scomida: '2021-10-22 15:06:24.113',
            ecomida: '2021-10-22 18:33:47.137',
            salida: '2021-10-22 21:13:38.517',
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
