if (!localStorage.getItem('spastore_theme_color'))
  localStorage.setItem('spastore_theme_color', 'light')

if (!localStorage.getItem('spastore_atajo_theme'))
  localStorage.setItem('spastore_atajo_theme', 'false')

if (!localStorage.getItem('spastore_barra_inferior'))
  localStorage.setItem('spastore_barra_inferior', 'false')

if (!localStorage.getItem('spastore_barra_move_touch'))
  localStorage.setItem('spastore_barra_move_touch', 'true')

export const state = () => ({
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
      path: '/conexiones',
      name: 'conexiones',
      nickname: 'Conexiones',
      icon: 'cloud-check-fill',
    },
    {
      path: '/existenciasarticulo',
      name: 'existenciasarticulo',
      nickname: 'Existencias Articulos',
      icon: 'collection',
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
    ? JSON.stringify(localStorage.getItem('spastore_themes_components'))
    : { themeTableBody: '' },
})

export const mutations = {
  showAlertDialogOption: (
    state,
    [
      message = null,
      title = 'Realizando Accion',
      clickAcept = () => {},
      clickCancel = () => {
        state.alertOption.show = false
      },
      background = 'primary',
      textColor = 'light',
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
