<template>
  <div id="app">
    <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></head>
    <nav class="navbar navbar-dark bg-dark">
      <nav id="navbar" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a id="titulo" class="navbar-brand" href="/">Plataforma Integración continua</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#items" aria-controls="items" aria-expanded="true" aria-label="Abrir navegación">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-collapse collapse show" id="items">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="/productos">Listado Productos <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/producto/agregar">Agregar un Producto</a>
            </li>
          </ul>
          <form id="buscar" class="form-inline">
            <input class="form-control mr-sm-2" type="search" placeholder="ID del producto..." aria-label="Buscar un producto">
            <button class="btn btn-outline-info my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    </nav>
    <router-view/>
  </div>
</template>

<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#navbar{
  width: 100%
}

#buscar{
  margin-left: 5%;
}

#titulo{
  margin-right: 100px;
}

</style>
