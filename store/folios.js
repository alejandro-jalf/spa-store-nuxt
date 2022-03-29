if (!localStorage.getItem('spastore_folios_sucursal'))
  localStorage.setItem('spastore_folios_sucursal', 'ZR')
if (!localStorage.getItem('spastore_folios_promedio'))
  localStorage.setItem('spastore_folios_promedio', '200')

export const state = () => ({
  sucursal: localStorage.getItem('spastore_folios_sucursal'),
  promMensual: localStorage.getItem('spastore_folios_promedio'),
  folio: sessionStorage.getItem('spastore_folios_data')
    ? JSON.parse(sessionStorage.getItem('spastore_folios_data'))
    : {
        data: [
          {
            Tienda: 0,
            Serie: '',
            FolioInicial: 1,
            FolioFinal: 0,
            FolioDisponible: 0,
            INCREMENTODEFOLIO: 0,
            FOLIOFINC: 0,
          },
        ],
      },
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_folios_sucursal', sucursal)
  },
  setPromedioMensual(state, promMensual) {
    state.promMensual = promMensual
    localStorage.setItem('spastore_folios_promedio', promMensual)
  },
  setDataFolio(state, folio) {
    state.folio = folio
    sessionStorage.setItem('spastore_folios_data', JSON.stringify(folio))
  },
}

export const actions = {
  async updateDataFolio({ commit }, [sucursal, promedio]) {
    const dataFolios = {
      Tienda: 0,
      Serie: '',
      FolioInicial: 1,
      FolioFinal: 0,
      FolioDisponible: 0,
      INCREMENTODEFOLIO: 0,
      FOLIOFINC: 0,
    }
    try {
      const url =
        process.env.spastore_url_backend +
        `api/v1/general/folios/${sucursal}?promMensual=${promedio}`
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setDataFolio', { data: response.data.data })
      } else commit('setDataFolio', { data: [dataFolios] })

      return response.data
    } catch (error) {
      commit('setDataFolio', { data: [dataFolios] })
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
