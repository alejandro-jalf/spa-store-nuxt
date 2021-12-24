if (!localStorage.getItem('spastore_checador_sucursal'))
  localStorage.setItem('spastore_checador_sucursal', 'ZR')
export const state = () => ({
  sucursal: localStorage.getItem('spastore_checador_sucursal'),
})

export const mutations = {
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_checador_sucursal', sucursal)
  },
}
