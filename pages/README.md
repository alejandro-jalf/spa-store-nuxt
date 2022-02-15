# PAGES

**Crear una nueva pagina**
Para crear una nueva pagina simplemente crea un archivo con la extension .vue, posteriormente ir al archivo de la siguiente ruta 'store/general.js', en ese archivo se debe modificar en los states la item llamado 'listTabs', se debe agregar un nuevo objeto con las siguientes items

```` javascript
  {
    path: '/nombrearchivo',  // Nombre del archivo creado, se recomienda sea en minusculas e incluir la diagonal
    name: 'nombrearchivo', // igual al anterior, solo que omitiendo la diagonal
    nickname: 'Nombre Visual', // Este nombre que coloque aqui es libre y es lo que vera cada usuario visualmente
    icon: 'house-door-fill', // nombre del icono que pondra para este nuevo archivo, es tomado directamente de los iconos de bootstrapVue
  }
````

This directory contains your Application Views and Routes.
The framework reads all the `*.vue` files inside this directory and creates the router of your application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/routing).
