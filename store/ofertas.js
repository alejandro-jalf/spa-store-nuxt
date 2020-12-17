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
  listaOfertas: {
    oferta1: {
      editable: false,
      uuid: 'oferta1',
      tipoOferta: 'Sigma',
      fechaInico: '2020-12-11',
      fechaFin: '2020-12-14',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          sucursal: 'Zaragoza',
          articulo: '0111255',
          nombre: 'Tang Naranja Sobre 15gr',
          costo: '2.71',
          descripcion: 'Tang Naranja Sobre 15gr',
          precio: '3.50',
          utilidad: '10',
          oferta: '3',
          margen: '23',
        },
      ],
    },
    oferta2: {
      editable: true,
      uuid: 'oferta2',
      tipoOferta: 'Sigma',
      fechaInico: '2020-12-10',
      fechaFin: '2020-12-10',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          sucursal: 'Zaragoza',
          articulo: '0111255',
          nombre: 'Tang Naranja Sobre 15gr',
          costo: '2.71',
          descripcion: 'Tang Naranja Sobre 15gr',
          precio: '3.50',
          utilidad: '10',
          oferta: '3',
          margen: '23',
        },
      ],
    },
    oferta3: {
      editable: false,
      uuid: 'oferta3',
      tipoOferta: 'Sigma',
      fechaInico: '2020-11-28',
      fechaFin: '2020-11-28',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          sucursal: 'Zaragoza',
          articulo: '0111255',
          nombre: 'Tang Naranja Sobre 15gr',
          costo: '2.71',
          descripcion: 'Tang Naranja Sobre 15gr',
          precio: '3.50',
          utilidad: '10',
          oferta: '3',
          margen: '23',
        },
      ],
    },
  },
})

export const mutations = {
  addOFerta(state, oferta) {
    state.listaOfertas[`${oferta.uuid}`] = oferta
  },
  setEditandoOferta(state, status) {
    state.editandoOferta = status
  },
  openOferta(state, newOferta) {
    state.ofertaActual = newOferta
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
