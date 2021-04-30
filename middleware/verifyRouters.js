export default function verifyRouters({ store, redirect, route, from }) {
  // eslint-disable-next-line no-console
  // console.log('Rutas de middleware', route, store.state.user, from)

  const login = store.state.user.login
  const user = store.state.user.user
  const listTabPermission = user.access_to_user.trim().split(',')

  if (!login && route.path.toLowerCase() !== '/login') redirect('/login')

  if (login) {
    if (
      route.path.toLowerCase() === '/login' &&
      from.path.toLowerCase() !== '/login'
    )
      redirect(from.path)
    else if (route.path.toLowerCase() === '/login') {
      redirect('/')
      return
    }

    const findedTab = listTabPermission.find((tab) => {
      return tab.trim().toLowerCase() === route.name.trim().toLowerCase()
    })

    if (route.path !== '/' && !findedTab) redirect('/')
  }
}
