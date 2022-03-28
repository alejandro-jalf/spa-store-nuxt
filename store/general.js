if (!localStorage.getItem('spastore_theme_color'))
  localStorage.setItem('spastore_theme_color', 'light')

if (!localStorage.getItem('spastore_atajo_theme'))
  localStorage.setItem('spastore_atajo_theme', 'false')

if (!localStorage.getItem('spastore_barra_inferior'))
  localStorage.setItem('spastore_barra_inferior', 'false')

if (!localStorage.getItem('spastore_barra_move_touch'))
  localStorage.setItem('spastore_barra_move_touch', 'true')

export const state = () => ({
  scrollScreenY: 0,
  alert: {
    show: false,
    title: 'Arvertencia',
    message: 'Error en la solicitud',
    headerBackground: 'warning',
    headerTexColor: 'light',
  },
  alertOption: {
    show: false,
    title: 'Realizando Accion',
    message: '¿Realizar esta accion?',
    headerBg: 'primary',
    headerText: 'light',
    clickCancel: () => {},
    clickAcept: () => {},
  },
  loading: 0,
  listTabs: [
    {
      path: '/',
      name: 'index',
      nickname: 'Inicio',
      icon: 'house-door-fill',
    },
    {
      path: '/ofertas',
      name: 'ofertas',
      nickname: 'Ofertas',
      icon: 'percent',
    },
    {
      path: '/validaofertas',
      name: 'validaofertas',
      nickname: 'Verificador Ofertas',
      icon: 'binoculars',
    },
    {
      path: '/ventav',
      name: 'ventav',
      nickname: 'Ventas',
      icon: 'shop',
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      nickname: 'Usuarios',
      icon: 'people-fill',
    },
    {
      path: '/asistencias',
      name: 'asistencias',
      nickname: 'Asistencias',
      icon: 'ui-checks',
    },
    {
      path: '/conexiones',
      name: 'conexiones',
      nickname: 'Conexiones',
      icon: 'cloud-check-fill',
    },
    {
      path: '/consolidaciones',
      name: 'consolidaciones',
      nickname: 'Consolidaciones',
      icon: 'arrow-left-right',
    },
    {
      path: '/existenciasarticulo',
      name: 'existenciasarticulo',
      nickname: 'Existencias Articulos',
      icon: 'collection',
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      nickname: 'Monitor Pedidos',
      icon: 'display',
    },
    {
      path: '/valuacioninventario',
      name: 'ValuacionInventario',
      nickname: 'Valuacion Inventario',
      icon: 'patch-check',
    },
    {
      path: '/stocks',
      name: 'stocks',
      nickname: 'Stocks',
      icon: 'cart-check-fill',
    },
    {
      path: '/folios',
      name: 'folios',
      nickname: 'Folios',
      icon: 'card-heading',
    },
    {
      path: '/checadorprecios',
      name: 'checadorprecios',
      nickname: 'Checador Precios',
      icon: 'upc-scan',
    },
    {
      path: '/codificadorarticulos',
      name: 'codificadorarticulos',
      nickname: 'Codificador Articulos',
      icon: 'code',
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      nickname: 'Proveedores',
      icon: 'box-seam',
    },
    {
      path: '/menucocina',
      name: 'menucocina',
      nickname: 'Menu Cocina',
      icon: 'layout-text-sidebar-reverse',
    },
    {
      path: '/cocina',
      name: 'cocina',
      nickname: 'Cocina',
      icon: 'file-earmark-easel-fill',
    },
  ],
  tabActual: 'Inicio',
  themePreferences: localStorage.getItem('spastore_theme_color'),
  atajoTheme: localStorage.getItem('spastore_atajo_theme'),
  barraInferior: localStorage.getItem('spastore_barra_inferior'),
  moveTouch:
    typeof localStorage.getItem('spastore_barra_move_touch') === 'boolean'
      ? localStorage.getItem('spastore_barra_move_touch')
      : localStorage.getItem('spastore_barra_move_touch') === 'true',
  widthWindow: 0,
  themesComponents: localStorage.getItem('spastore_themes_components')
    ? JSON.parse(localStorage.getItem('spastore_themes_components'))
    : {
        themeTableBody: '',
        themeTableHeader: '',
        themeItemList: '',
        themeCardBody: 'containerCard',
        themeCardHeader: '',
        themeBgCardHeader: '',
        themeCard2Body: '',
        themeInputBackground: 'backgroundInput',
        themeMenuBackground: '',
        themeNav: 'info',
        themeNavBottom: 'bg-info',
        themeVariantButton: 'outline-dark',
        themeVariantButton2: 'outline-dark',
        themeButtonClose: 'info',
        themeItemList2: 'light',
        themeTextSlider: 'dark',
        themeVariantAlert: 'info',
        themeButtonClean: 'warning',
        themeButtonSuccess: 'success',
        themeButtonLight: 'light',
        themeButtonPrimary: 'primary',
        themeHR: '',
        backgroundVariantBody: 'light',
      },
})

export const mutations = {
  changeScrollScreenY: (state, scrollScreenY) => {
    state.scrollScreenY = scrollScreenY
  },
  showAlertDialogOption: (
    state,
    [
      message = null,
      title = 'Realizando Accion',
      clickAcept = () => {},
      background = 'primary',
      textColor = 'white',
      clickCancel,
    ]
  ) => {
    if (message === null) return true
    state.alertOption.show = true
    state.alertOption.message = message
    state.alertOption.title = title
    state.alertOption.headerBg = background
    state.alertOption.headerTexColor = textColor
    state.alertOption.clickAcept = clickAcept
    state.alertOption.clickCancel = clickCancel
  },
  hideAlertDialogOption(state) {
    state.alertOption.show = false
  },
  showAlertDialog: (
    state,
    [
      message = null,
      title = 'Advertencia',
      background = 'warning',
      textColor = 'light',
    ]
  ) => {
    if (message === null) return true
    state.alert.show = true
    state.alert.message = message
    state.alert.title = title
    state.alert.headerBackground = background
    state.alert.headerTexColor = textColor
  },
  hideAlertDialog(state) {
    state.alert.show = false
  },
  setLoading(state, value) {
    if (value) state.loading++
    else if (state.loading <= 0) state.loading = 0
    else state.loading--
  },
  setTabActual(state, nameTab) {
    state.tabActual = nameTab
  },
  setThemesComponents(state, themes) {
    state.themesComponents = themes
    localStorage.setItem('spastore_themes_components', JSON.stringify(themes))
  },
  setThemePreferences(state, theme) {
    if (theme !== state.themePreferences) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
        .matches

      if (state.themePreferences === 'dark')
        document.documentElement.classList.remove('dark-mode')
      if (state.themePreferences === 'sepia')
        document.documentElement.classList.remove('sepia-mode')
      if (state.themePreferences === 'system' && systemDark)
        document.documentElement.classList.remove('dark-mode')

      state.themePreferences = theme
      localStorage.setItem('spastore_theme_color', theme)
      if (theme === 'dark') document.documentElement.classList.add('dark-mode')
      if (theme === 'sepia')
        document.documentElement.classList.add('sepia-mode')
      if (theme === 'system' && systemDark)
        document.documentElement.classList.add('dark-mode')
    }
  },
  setAtajoTheme(state, atajo) {
    state.atajoTheme = atajo
    localStorage.setItem('spastore_atajo_theme', atajo)
  },
  setBarraInferior(state, visible) {
    state.barraInferior = visible
    localStorage.setItem('spastore_barra_inferior', visible)
  },
  setMoveTouch(state, move) {
    state.moveTouch = move
    localStorage.setItem('spastore_barra_move_touch', move)
  },
  setWidthWindow(state, width) {
    state.widthWindow = width
  },
}

export const actions = {
  changeThemePreferences({ commit }, themes) {
    commit('setThemePreferences', themes)

    const filterOption = (
      theme = 'system',
      optionLight = 'Light',
      optionDark = 'dark',
      optionSepia = 'sepia'
    ) => {
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
        if (systemDark) return optionDark
        return optionLight
      } else if (theme === 'dark') return optionDark
      else if (theme === 'sepia') return optionSepia
      return optionLight
    }

    const themesComponents = {
      themeTableBody: filterOption(
        themes,
        '',
        'darkThemeTableBody',
        'sepiaThemeItemList'
      ),
      themeTableHeader: '',
      themeCardBody: filterOption(
        themes,
        'containerCard',
        'darkBodyCard containerCarDark',
        'sepiaBodyCard containerCard'
      ),
      themeCardHeader: filterOption(
        themes,
        '',
        'darkBodyCard',
        'sepiaBodyCard'
      ),
      themeBgCardHeader: filterOption(themes, 'info', 'dark', 'info'),
      themeCard2Body: filterOption(
        themes,
        'containerCard',
        'darkBodyCard container-gen-dark',
        'sepiaBodyCard'
      ),
      themeItemList: filterOption(
        themes,
        '',
        'darkThemeItemList',
        'sepiaThemeItemList'
      ),
      themeInputBackground: filterOption(
        themes,
        'backgroundInput',
        'backgroundInputDark',
        ''
      ),
      themeMenuBackground: filterOption(
        themes,
        '',
        'menuDark',
        'sepiaBodyCard'
      ),
      themeNav: filterOption(themes, 'info', 'dark', 'info'),
      themeNavBottom: filterOption(themes, 'bg-info', 'bg-dark', 'bg-info'),
      themeVariantButton: filterOption(
        themes,
        'outline-dark',
        'outline-light',
        'outline-dark'
      ),
      themeVariantButton2: filterOption(themes, 'info', 'outline-info', 'info'),
      themeButtonClose: filterOption(themes, 'info', 'outline-info', 'info'),
      themeItemList2: filterOption(themes, 'light', 'dark', 'light'),
      themeTextSlider: filterOption(themes, 'dark', 'light', 'dark'),
      themeVariantAlert: filterOption(themes, 'info', 'info', 'dark'),
      themeButtonClean: filterOption(
        themes,
        'warning',
        'outline-warning',
        'warning'
      ),
      themeButtonSuccess: filterOption(
        themes,
        'success',
        'outline-success',
        'success'
      ),
      themeButtonLight: filterOption(themes, 'light', 'outline-light', 'light'),
      themeButtonPrimary: filterOption(
        themes,
        'primary',
        'outline-primary',
        'primary'
      ),
      themeHR: filterOption(themes, '', 'bg-white', ''),
      backgroundVariantBody: filterOption(themes),
    }
    commit('setThemesComponents', themesComponents)
  },
}
