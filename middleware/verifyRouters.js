export default function verifyRouters({ store, redirect, route, from }) {
  const login = store.state.user.login
  const user = store.state.user.user

  if (!login && route.path.toLowerCase() !== '/login') redirect('/login')

  if (login) {
    const listTabPermission = user.access_to_user.trim().split(',')
    if (
      route.path.toLowerCase() === '/login' &&
      from.path.toLowerCase() !== '/login'
    ) {
      redirect(from.path)
    } else if (route.path.toLowerCase() === '/login') {
      store.state.general.tabActual = 'Inicio'
      redirect('/')
      return
    }

    const findedTab = listTabPermission.find((tab) => {
      return tab.trim().toLowerCase() === route.name.trim().toLowerCase()
    })

    if (route.path !== '/' && !findedTab) {
      store.state.general.tabActual = 'Inicio'
      redirect('/')
      return
    }

    const findTabOfList = store.state.general.listTabs.find(
      (tab) => tab.name.trim().toLowerCase() === route.name.trim().toLowerCase()
    )

    const named = !findTabOfList
      ? route.name.charAt(0).toUpperCase() + route.name.slice(1)
      : findTabOfList.nickname

    store.commit('general/setTabActual', named)
  }
}
