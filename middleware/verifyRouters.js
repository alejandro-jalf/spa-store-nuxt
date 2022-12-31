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
  // const tabsRef = store.state.general.listTabs.reduce((acumTab, tab, pos) => {
  //   if (tab.childrens.length === 0) {
  //     const newTab = { ...tab }
  //     newTab.nameComplete = tab.nickname
  //     acumTab.push(newTab)
  //   } else {
  //     tab.childrens.forEach((child) => {
  //       const newTab = { ...child }
  //       newTab.nameComplete = tab.nickname + '/' + child.nickname
  //       acumTab.push(tab.nickname + '/' + child.nickname)
  //     })
  //   }
  //   return acumTab
  // }, [])

  if (!login && route.path.toLowerCase() !== '/login') redirect('/login')

  if (login) {
    const tabPrincipal = store.state.general.listTabs.reduce((tabPrin, tab) => {
      if (tab.childrens.length === 0) {
        if (tab.nickname === user.principal) tabPrin = tab.path
      } else {
        tab.childrens.forEach((child) => {
          if (tab.nickname + '/' + child.nickname === user.principal)
            tabPrin = child.path
        })
      }
      return tabPrin
    }, '')
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
        console.log('Finded 1:', tabFinded)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.name)
          store.commit('user/setSesionInstancia', tabFinded.name)
          if (route.path.toLowerCase() !== tabFinded.path.toLowerCase())
            redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'index')
      store.commit('user/setSesionInstancia', 'index')
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
        console.log('Finded 2:', tabFinded)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.name)
          store.commit('user/setSesionInstancia', tabFinded.name)
          redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'index')
      store.commit('user/setSesionInstancia', 'index')
      redirect('/')
      return
    }

    const findedTab = listTabPermission.find((tab) => {
      return tab.trim().toLowerCase() === route.name.trim().toLowerCase()
    })

    if (route.path !== '/' && !findedTab) {
      if (tabPrincipal) {
        const tabFinded = listTabs.find((tab) => tab.nickname === tabPrincipal)
        console.log('Finded 3:', tabFinded)
        if (tabFinded) {
          store.commit('general/setTabActual', tabFinded.name)
          store.commit('user/setSesionInstancia', tabFinded.name)
          redirect(tabFinded.path)
          return
        }
      }
      store.commit('general/setTabActual', 'index')
      store.commit('user/setSesionInstancia', 'index')
      redirect('/')
      return
    }

    if (route.path === '/') {
      if (sesionInstancia === 'null') {
        if (tabPrincipal) {
          const tabFinded = listTabs.find(
            (tab) => tab.nickname === tabPrincipal
          )
          console.log('Finded 4:', tabFinded)
          if (
            tabFinded &&
            route.path.toLowerCase() !== tabFinded.path.toLowerCase()
          ) {
            store.commit('general/setTabActual', tabFinded.name)
            store.commit('user/setSesionInstancia', tabFinded.name)
            redirect(tabFinded.path)
            return
          }
        }
        store.commit('user/setSesionInstancia', 'index')
      }
    }

    const findTabOfList = listTabs.find(
      (tab) => tab.name.trim().toLowerCase() === route.name.trim().toLowerCase()
    )

    const named = !findTabOfList ? route.name.toLowerCase() : findTabOfList.name

    store.commit('general/setTabActual', named)
    store.commit('user/setSesionInstancia', named)
  }
}
