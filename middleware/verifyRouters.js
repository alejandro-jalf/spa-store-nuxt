export default function verifyRouters({ store, redirect, route, from }) {
  const login = store.state.user.login
  const user = store.state.user.user
  const sesionInstancia = store.state.user.sesionInstancia
  const listTabs = store.state.general.listTabs.reduce((acumTab, tab) => {
    const childrens = [...tab.childrens]
    if (childrens.length > 0) {
      childrens.forEach((children) => acumTab.push(children))
    } else acumTab.push(tab)
    return acumTab
  }, [])

  if (!login && route.path.toLowerCase() !== '/login') redirect('/login')

  if (login) {
    const tabPrincipal = user.principal
    const listTabPermission = user.access_to_user
      ? user.access_to_user.trim().split(',')
      : []

    if (route.name === null) {
      const tabRefactor = route.path.replace('/', '')
      store.commit('general/showAlertDialog', [
        `La pestaña "${tabRefactor}" no existe, ha sido redireccionado a la pestaña de inicio`,
        'Error en la navegacion',
      ])

      if (tabPrincipal) {
        const tabFinded = listTabs.find((tab) => tab.nickname === tabPrincipal)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.nickname)
          store.commit('user/setSesionInstancia', tabFinded.nickname)
          if (route.path.toLowerCase() !== tabFinded.path.toLowerCase())
            redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'Inicio')
      store.commit('user/setSesionInstancia', 'Inicio')
      redirect('/')
      return
    }

    if (
      route.path.toLowerCase() === '/login' &&
      from.path.toLowerCase() !== '/login'
    ) {
      redirect(from.path)
    } else if (route.path.toLowerCase() === '/login') {
      if (tabPrincipal) {
        const tabFinded = listTabs.find((tab) => tab.nickname === tabPrincipal)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.nickname)
          store.commit('user/setSesionInstancia', tabFinded.nickname)
          redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'Inicio')
      store.commit('user/setSesionInstancia', 'Inicio')
      redirect('/')
      return
    }

    const findedTab = listTabPermission.find((tab) => {
      return tab.trim().toLowerCase() === route.name.trim().toLowerCase()
    })

    if (route.path !== '/' && !findedTab) {
      if (tabPrincipal) {
        const tabFinded = listTabs.find((tab) => tab.nickname === tabPrincipal)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.nickname)
          store.commit('user/setSesionInstancia', tabFinded.nickname)
          redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'Inicio')
      store.commit('user/setSesionInstancia', 'Inicio')
      redirect('/')
      return
    }

    if (route.path === '/') {
      if (sesionInstancia === 'null') {
        if (tabPrincipal) {
          const tabFinded = listTabs.find(
            (tab) => tab.nickname === tabPrincipal
          )
          if (
            tabFinded &&
            route.path.toLowerCase() !== tabFinded.path.toLowerCase()
          ) {
            store.commit('general/setTabActual', tabFinded.nickname)
            store.commit('user/setSesionInstancia', tabFinded.nickname)
            redirect(tabFinded.path)
            return
          }
        }
        store.commit('user/setSesionInstancia', 'Inicio')
      }
    }

    const findTabOfList = listTabs.find(
      (tab) => tab.name.trim().toLowerCase() === route.name.trim().toLowerCase()
    )

    const named = !findTabOfList
      ? route.name.charAt(0).toUpperCase() + route.name.slice(1)
      : findTabOfList.nickname

    store.commit('general/setTabActual', named)
    store.commit('user/setSesionInstancia', named)
  }
}
