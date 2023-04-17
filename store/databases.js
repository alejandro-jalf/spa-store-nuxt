if (!sessionStorage.getItem('spastore_datab_sucursal'))
  sessionStorage.setItem('spastore_datab_sucursal', 'ZR')
if (!sessionStorage.getItem('spastore_datab_tipo'))
  sessionStorage.setItem('spastore_datab_tipo', 'bar')

export const state = () => ({
  data: sessionStorage.getItem('spastore_datab_data')
    ? JSON.parse(sessionStorage.getItem('spastore_datab_data'))
    : {
        data: [
          { suc: 'ZR', data: [], count: 0 },
          { suc: 'VC', data: [], count: 0 },
          { suc: 'ER', data: [], count: 0 },
          { suc: 'OU', data: [], count: 0 },
          { suc: 'SY', data: [], count: 0 },
          { suc: 'JL', data: [], count: 0 },
          { suc: 'BO', data: [], count: 0 },
          { suc: 'SC', data: [], count: 0 },
          { suc: 'TF', data: [], count: 0 },
          { suc: 'TY', data: [], count: 0 },
        ],
      },
  sucursal: sessionStorage.getItem('spastore_datab_sucursal'),
  tipo: sessionStorage.getItem('spastore_datab_tipo'),
  showGraph: true,
})

export const mutations = {
  setData(state, data) {
    state.data = data
    sessionStorage.setItem('spastore_datab_data', JSON.stringify(data))
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    sessionStorage.setItem('spastore_datab_sucursal', sucursal)
  },
  setShowGraph(state, showGraph) {
    state.showGraph = showGraph
  },
  setTipoGrafico(state, tipo) {
    state.tipo = tipo
    sessionStorage.setItem('spastore_datab_tipo', tipo)
  },
}

export const actions = {
  async changeData({ commit }, [sucursal]) {
    try {
      const url = `${process.env.spastore_url_backend}api/v1/general/databases/${sucursal}/information`

      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        const data = sessionStorage.getItem('spastore_datab_data')
          ? JSON.parse(sessionStorage.getItem('spastore_datab_data'))
          : {
              data: [
                { suc: 'ZR', data: [], count: 0 },
                { suc: 'VC', data: [], count: 0 },
                { suc: 'ER', data: [], count: 0 },
                { suc: 'OU', data: [], count: 0 },
                { suc: 'SY', data: [], count: 0 },
                { suc: 'JL', data: [], count: 0 },
                { suc: 'BO', data: [], count: 0 },
                { suc: 'SC', data: [], count: 0 },
                { suc: 'TF', data: [], count: 0 },
                { suc: 'TY', data: [], count: 0 },
              ],
            }

        const sucFindIndex = data.data.findIndex(
          (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
        )
        data.data[sucFindIndex].data = response.data.data
        data.data[sucFindIndex].detailsHD = response.data.detailsHD
        data.data[sucFindIndex].count = response.data.data.length
        commit('setData', data)
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
  async reduceLogDataBase({ commit }, [sucursal, dataBase, nameLog]) {
    const data = JSON.parse(sessionStorage.getItem('spastore_datab_data'))
    const sucFindIndex = data.data.findIndex(
      (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
    )
    const dbFindIndex = data.data[sucFindIndex].data.findIndex(
      (db) => db.DataBaseName === dataBase
    )
    try {
      const url = `${process.env.spastore_url_backend}api/v1/general/logs/${sucursal}/reduce`

      const response = await this.$axios({
        url,
        method: 'put',
        data: { dataBase, nameLog },
      })

      data.data[sucFindIndex].data[dbFindIndex].resultReduceLog = response.data
      commit('setData', data)

      return response.data
    } catch (error) {
      if (error.response) {
        data.data[sucFindIndex].data[dbFindIndex].resultReduceLog =
          error.response.data
        commit('setData', data)
        return error.response.data
      }
      data.data[sucFindIndex].data[dbFindIndex].resultReduceLog = error
      commit('setData', data)
      return {
        success: false,
        message: 'Error con el servidor',
        error,
      }
    }
  },
  async uploadBackup({ commit }, [sucursal, source, database, nameBackup]) {
    try {
      const urlGenerate = `${process.env.spastore_url_backend}api/v1/general/backup/${sucursal}`
      const urlZip = `${process.env.spastore_url_backend}api/v1/general/backup/${sucursal}/zip`
      const urlUpload = `${process.env.spastore_url_backend}api/v1/general/backup/${sucursal}/upload`
      let data = JSON.parse(sessionStorage.getItem('spastore_datab_data'))
      const sucFindIndex = data.data.findIndex(
        (suc) => suc.suc.toUpperCase() === sucursal.toUpperCase()
      )
      const dbFindIndex = data.data[sucFindIndex].data.findIndex(
        (db) => db.DataBaseName === database
      )

      data.data[sucFindIndex].data[dbFindIndex].IsSupporting = true
      data.data[sucFindIndex].data[dbFindIndex].message = 'Generando Backup'
      data.data[sucFindIndex].data[dbFindIndex].progress = 5
      commit('setData', data)

      const response = await this.$axios({
        method: 'post',
        timeout: 30000,
        url: urlGenerate,
        data: { source, name: nameBackup, dataBase: database },
      })

      data = JSON.parse(sessionStorage.getItem('spastore_datab_data'))
      if (response.data.success) {
        data.data[sucFindIndex].data[dbFindIndex].message = 'Comprimiendo'
        data.data[sucFindIndex].data[dbFindIndex].progress = 20
        data.data[sucFindIndex].data[dbFindIndex].resultBackup = response.data
        commit('setData', data)
      } else {
        data.data[sucFindIndex].data[dbFindIndex].message = ''
        data.data[sucFindIndex].data[dbFindIndex].progress = 0
        data.data[sucFindIndex].data[dbFindIndex].resultBackup = response.data
        data.data[sucFindIndex].data[dbFindIndex].IsSupporting = false
        commit('setData', data)
        return response.data
      }

      const responsez = await this.$axios({
        method: 'post',
        timeout: 600000,
        url: urlZip,
        data: { source: `${source}\\${nameBackup}` },
      })

      data = JSON.parse(sessionStorage.getItem('spastore_datab_data'))
      if (responsez.data.success) {
        data.data[sucFindIndex].data[dbFindIndex].message = 'Subiendo a Drive'
        data.data[sucFindIndex].data[dbFindIndex].progress = 60
        data.data[sucFindIndex].data[dbFindIndex].resultZip = responsez.data
        commit('setData', data)
      } else {
        data.data[sucFindIndex].data[dbFindIndex].message = ''
        data.data[sucFindIndex].data[dbFindIndex].progress = 0
        data.data[sucFindIndex].data[dbFindIndex].resultZip = responsez.data
        data.data[sucFindIndex].data[dbFindIndex].IsSupporting = false
        commit('setData', data)
        return responsez.data
      }

      const responseU = await this.$axios({
        method: 'post',
        timeout: 600000,
        url: urlUpload,
        data: { source, nameFile: nameBackup },
      })

      data = JSON.parse(sessionStorage.getItem('spastore_datab_data'))
      if (responseU.data.success) {
        data.data[sucFindIndex].data[dbFindIndex].message = 'Respaldo Generado'
        data.data[sucFindIndex].data[dbFindIndex].progress = 100
      } else {
        data.data[sucFindIndex].data[dbFindIndex].message = ''
        data.data[sucFindIndex].data[dbFindIndex].progress = 0
      }
      data.data[sucFindIndex].data[dbFindIndex].IsSupporting = false
      data.data[sucFindIndex].data[dbFindIndex].resultUpload = responseU.data
      commit('setData', data)

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
