<template>
  <div id="nav">
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
              <router-link to="/rack" class="nav-link">Rack</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style>
#navbar{
  width: 100%;
  position: sticky;
}

#buscar{
  margin-left: 5%;
}

#titulo{
  margin-right: 100px;
}

</style>
