if (!localStorage.getItem('spastore_ofertas_sucursal'))
  localStorage.setItem('spastore_ofertas_sucursal', 'ZR')

export const state = () => ({
  programandoOferta: false,
  editandoOferta: false,
  programandoListaOferta: false,
  ofertaEditable: true,
  formArticulo: {},
  ofertaActual: {
    editable: true,
    uuid: '',
    tipoOferta: '',
    fechaInico: '',
    fechaFin: '',
    descripcion: '',
    listaProductos: [],
  },
  // new
  listaOfertas: localStorage.getItem('spastore_ofertas_articulos')
    ? JSON.parse(localStorage.getItem('spastore_ofertas_articulos'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_ofertas_sucursal'),
})

export const mutations = {
  setListasOfertas(state, listaOfertas) {
    // eslint-disable-next-line no-console
    console.log(listaOfertas)
    state.listaOfertas = listaOfertas
    localStorage.setItem(
      'spastore_ofertas_articulos',
      JSON.stringify(listaOfertas)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_ofertas_sucursal', sucursal)
  },

  // old
  addOFerta(state, oferta) {
    // eslint-disable-next-line no-console
    console.log('Agregando', oferta)
    state.listaOfertas[`${oferta.uuid}`] = oferta
  },
  setEditandoOferta(state, status) {
    state.editandoOferta = status
  },
  openOferta(state, newOferta) {
    state.ofertaActual = newOferta
  },
  cleanOfertaActual(state) {
    state.ofertaActual = {
      editable: true,
      uuid: '',
      tipoOferta: '',
      fechaInico: '',
      fechaFin: '',
      descripcion: '',
      listaProductos: [],
    }
  },
  openOfertaByUuid(state, uuid) {
    state.ofertaActual = state.listaOfertas[`${uuid}`]
  },
  setEditable(state, editable) {
    state.ofertaEditable = editable
  },
  setProgramandoOferta(state, programando) {
    state.programandoOferta = programando
  },
  setProgramandoLista(state, programando) {
    state.programandoListaOferta = programando
  },
  addArticulo(state, articulo) {
    state.ofertaActual.listaProductos.push(articulo)
  },
  deleteArticulo(state, articulo) {
    const filterArticle = state.ofertaActual.listaProductos.filter(
      (article) => article.articulo !== articulo
    )
    state.ofertaActual.listaProductos = filterArticle
  },
  updateDataForm(state, newDataForm) {
    state.ofertaActual.tipoOferta = newDataForm.tipoOferta
    state.ofertaActual.fechaInico = newDataForm.fechaInico
    state.ofertaActual.fechaFin = newDataForm.fechaFin
    state.ofertaActual.descripcion = newDataForm.descripcion
  },
  setArticle(state, articulo) {
    const articleFinded = state.ofertaActual.listaProductos.find(
      (elemento) => elemento.articulo === articulo
    )
    if (articleFinded !== undefined) {
      state.formArticulo = articleFinded
      return true
    }
    state.formArticulo = {
      articulo: '',
      codigobarras: '',
      nombre: '',
      precio: '',
      costo: '',
      margen: '',
      oferta: '',
      utilidad: '',
    }
  },
}

export const actions = {
  async changeListaOfertas({ commit }, sucursal) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/ofertas/' +
        sucursal +
        '/maestros'
      const response = await this.$axios({
        url,
        method: 'get',
        headers: { 'access-token': 'dfa94a69ee28ebdade02657328f187b74db98dd0' },
      })

      if (response.data.success) {
        commit('setListasOfertas', { data: response.data.data })
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
