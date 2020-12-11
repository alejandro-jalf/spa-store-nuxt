export const state = () => ({
  programandoOferta: false,
  programandoListaOferta: false,
  ofertaEditable: true,
  ofertaActual: {
    uuid: 'oferta1',
    tipoOferta: 'Sigma',
    fechaInico: 'viernes, 11 de diciembre de 2020',
    fechaFin: 'viernes, 11 de diciembre de 2020',
    descripcion: 'Ofertas de sigma',
    listaProductos: [
      {
        Sucursal: 'Zaragoza',
        Articulo: '0111255',
        Nombre: 'Tang Naranja Sobre 15gr',
        Costo: '2.71',
        Descripcion: 'Tang Naranja Sobre 15gr',
        Precio: '3.50',
        Utilidad: '10',
        Precio_Oferta: '3',
        Margen: '23',
      },
    ],
  },
  listaOfertas: {
    oferta1: {
      uuid: 'oferta1',
      tipoOferta: 'Sigma',
      fechaInico: 'viernes, 11 de diciembre de 2020',
      fechaFin: 'viernes, 11 de diciembre de 2020',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          Sucursal: 'Zaragoza',
          Articulo: '0111255',
          Nombre: 'Tang Naranja Sobre 15gr',
          Costo: '2.71',
          Descripcion: 'Tang Naranja Sobre 15gr',
          Precio: '3.50',
          Utilidad: '10',
          Precio_Oferta: '3',
          Margen: '23',
        },
      ],
    },
    oferta2: {
      uuid: 'oferta2',
      tipoOferta: 'Sigma',
      fechaInico: 'viernes, 11 de diciembre de 2020',
      fechaFin: 'viernes, 11 de diciembre de 2020',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          Sucursal: 'Zaragoza',
          Articulo: '0111255',
          Nombre: 'Tang Naranja Sobre 15gr',
          Costo: '2.71',
          Descripcion: 'Tang Naranja Sobre 15gr',
          Precio: '3.50',
          Utilidad: '10',
          Precio_Oferta: '3',
          Margen: '23',
        },
      ],
    },
    oferta3: {
      uuid: 'oferta3',
      tipoOferta: 'Sigma',
      fechaInico: 'viernes, 11 de diciembre de 2020',
      fechaFin: 'viernes, 11 de diciembre de 2020',
      descripcion: 'Ofertas de sigma',
      listaProductos: [
        {
          Sucursal: 'Zaragoza',
          Articulo: '0111255',
          Nombre: 'Tang Naranja Sobre 15gr',
          Costo: '2.71',
          Descripcion: 'Tang Naranja Sobre 15gr',
          Precio: '3.50',
          Utilidad: '10',
          Precio_Oferta: '3',
          Margen: '23',
        },
      ],
    },
  },
})

export const mutations = {
  openOferta(state, newOferta) {
    state.ofertaActual = newOferta
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
}
