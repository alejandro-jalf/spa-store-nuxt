import utils from '../modules/utils'
if (!localStorage.getItem('spastore_art_vig_sucursal'))
  localStorage.setItem('spastore_art_vig_sucursal', 'ZR')

const getLocalVariables = () => {
  let divisiones = 0
  try {
    divisiones = parseInt(localStorage.getItem('spastore_art_vig_div'))
  } catch (error) {}

  const data = []
  for (let division = 0; division < divisiones; division++) {
    data.push(
      ...localStorage.getItem(`spastore_art_vig_div_${division}`).split(',')
    )
  }

  const response = localStorage.getItem('spastore_art_vig_data')
    ? JSON.parse(localStorage.getItem('spastore_art_vig_data'))
    : { data: [], count: [] }

  response.data = data
  return response
}

export const state = () => ({
  data: getLocalVariables(),
  dateConsult: localStorage.getItem('spastore_art_vig_date_consult')
    ? localStorage.getItem('spastore_art_vig_date_consult')
    : '00/00/000 a las 00:00 am',
  divisiones: localStorage.getItem('spastore_art_vig_div')
    ? localStorage.getItem('spastore_art_vig_div')
    : '0',
  sucursal: localStorage.getItem('spastore_art_vig_sucursal'),
  sucursalConsult: localStorage.getItem('spastore_art_vig_suc_consult'),
})

export const mutations = {
  setData(state, data) {
    state.data = data
    const newData = { ...data }
    newData.data = []
    localStorage.setItem('spastore_art_vig_data', JSON.stringify(newData))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_art_vig_sucursal', sucursal)
  },
  setDivisiones(state, divisiones) {
    state.divisiones = divisiones
    localStorage.setItem('spastore_art_vig_div', divisiones)
  },
  setDateConsult(state, DateConsult) {
    state.dateConsult = DateConsult
    localStorage.setItem('spastore_art_vig_date_consult', DateConsult)
  },
  setSucursalConsult(state, sucursalConsult) {
    state.sucursalConsult = sucursalConsult
    localStorage.setItem('spastore_art_vig_suc_consult', sucursalConsult)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal, dateConsult, FechaDesde]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/articulos/vigentes/' +
        sucursal +
        '?FechaDesde=' +
        FechaDesde

      const response = await this.$axios({
        url,
        method: 'get',
      })

      const deleteLocalVariables = () => {
        let divisiones = 0
        try {
          divisiones = parseInt(localStorage.getItem('spastore_art_vig_div'))
        } catch (error) {}
        for (let division = 0; division < divisiones; division++)
          localStorage.removeItem(`spastore_art_vig_div_${division}`)
      }

      const createLocalVariables = (arrays = []) => {
        arrays.forEach((array, index) => {
          localStorage.setItem(
            `spastore_art_vig_div_${index}`,
            Array.toString(array)
          )
        })
      }

      if (response.data.success) {
        deleteLocalVariables()
        const arraySplited = utils.splitArray(response.data.data, 2500)
        createLocalVariables(arraySplited)
        commit('setData', response.data)
        commit('setDivisiones', arraySplited.length)
        commit('setDateConsult', dateConsult)
        commit('setSucursalConsult', sucursal)
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
