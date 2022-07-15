if (!localStorage.getItem('spastore_ofertas_sucursal'))
  localStorage.setItem('spastore_ofertas_sucursal', 'ZR')
if (!localStorage.getItem('spastore_ofertas_show_details'))
  localStorage.setItem('spastore_ofertas_show_details', false)
if (!localStorage.getItem('spastore_ofertas_show_verify'))
  localStorage.setItem('spastore_ofertas_show_verify', false)
if (!localStorage.getItem('spastore_ofertas_only_icons'))
  localStorage.setItem('spastore_ofertas_only_icons', false)

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
  },
  // new
  listaOfertas: localStorage.getItem('spastore_ofertas_maestros')
    ? JSON.parse(localStorage.getItem('spastore_ofertas_maestros'))
    : { data: [] },
  sucursal: localStorage.getItem('spastore_ofertas_sucursal'),
  listaArticulos: localStorage.getItem('spastore_ofertas_articulos')
    ? JSON.parse(localStorage.getItem('spastore_ofertas_articulos'))
    : { data: [] },
  detallesValidacion: {
    show:
      typeof localStorage.getItem('spastore_ofertas_show_details') === 'boolean'
        ? localStorage.getItem('spastore_ofertas_show_details')
        : localStorage.getItem('spastore_ofertas_show_details') === 'true',
    articles: localStorage.getItem('spastore_ofertas_articles_details')
      ? JSON.parse(localStorage.getItem('spastore_ofertas_articles_details'))
      : { data: [] },
  },
  detallesVerify: {
    show:
      typeof localStorage.getItem('spastore_ofertas_show_verify') === 'boolean'
        ? localStorage.getItem('spastore_ofertas_show_verify')
        : localStorage.getItem('spastore_ofertas_show_verify') === 'true',
    articles: localStorage.getItem('spastore_ofertas_articles_verify')
      ? JSON.parse(localStorage.getItem('spastore_ofertas_articles_verify'))
      : { data: [] },
  },
  onlyIcons:
    typeof localStorage.getItem('spastore_ofertas_only_icons') === 'boolean'
      ? localStorage.getItem('spastore_ofertas_only_icons')
      : localStorage.getItem('spastore_ofertas_only_icons') === 'true',
})

export const mutations = {
  setListasOfertas(state, listaOfertas) {
    state.listaOfertas = listaOfertas
    localStorage.setItem(
      'spastore_ofertas_maestros',
      JSON.stringify(listaOfertas)
    )
  },
  setListaArticulos(state, listaArticulos) {
    // eslint-disable-next-line no-console
    console.log(listaArticulos)
    state.listaArticulos = listaArticulos
    localStorage.setItem(
      'spastore_ofertas_articulos',
      JSON.stringify(listaArticulos)
    )
  },
  setSucursal(state, sucursal) {
    state.sucursal = sucursal
    localStorage.setItem('spastore_ofertas_sucursal', sucursal)
  },
  setShowDetails(state, show) {
    state.detallesValidacion.show = show
    localStorage.setItem('spastore_ofertas_show_details', show)
  },
  setShowVerify(state, show) {
    state.detallesVerify.show = show
    localStorage.setItem('spastore_ofertas_show_verify', show)
  },
  setArticlesDetails(state, articles) {
    state.detallesValidacion.articles = articles
    localStorage.setItem(
      'spastore_ofertas_articles_details',
      JSON.stringify(articles)
    )
  },
  setArticlesVerify(state, articles) {
    state.detallesVerify.articles = articles
    localStorage.setItem(
      'spastore_ofertas_articles_verify',
      JSON.stringify(articles)
    )
  },
  setOnlyIcons(state, onlyIcons) {
    state.onlyIcons = onlyIcons
    localStorage.setItem('spastore_ofertas_only_icons', onlyIcons)
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
  async changeListaOfertas({ commit }, [sucursal, limit = 100]) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/ofertas/' +
        sucursal +
        '/maestros?limit=' +
        limit
      const response = await this.$axios({
        url,
        method: 'get',
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
  async createMasterOffer({ commit }, bodyOffer) {
    try {
      const url = process.env.spastore_url_backend + 'api/v1/ofertas/maestros'
      const response = await this.$axios({
        url,
        method: 'post',
        data: bodyOffer,
      })

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
  async changeListaArticulos({ commit }, uuidmaster) {
    try {
      const url =
        process.env.spastore_url_backend +
        'api/v1/ofertas/articulos/' +
        uuidmaster
      const response = await this.$axios({
        url,
        method: 'get',
      })

      if (response.data.success) {
        commit('setListaArticulos', { data: response.data.data })
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
