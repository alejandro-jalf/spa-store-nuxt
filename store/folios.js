if (!localStorage.getItem('spastore_folios_sucursal'))
  localStorage.setItem('spastore_folios_sucursal', 'ZR')

export const state = () => ({
  sucursal: localStorage.getItem('spastore_folios_sucursal'),
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
  setDataFolio(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_folios_data', JSON.stringify(data))
  },
}

export const actions = {
  async updateDataFolio({ commit }, [sucursal, promedio]) {
    const dataArticle = {
      Tienda: 0,
      Serie: 0,
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
      } else commit('setDataFolio', { data: [dataArticle] })

      return response.data
    } catch (error) {
      commit('setDataFolio', { data: [dataArticle] })
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
