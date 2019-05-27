<template>
  <div id="frontpage">
    <h1 class="title">{{ title }} (Cambio de prueba)</h1>
    <h2>  < < {{ subtitle}} > ></h2>
    <ul v-for="author in authors">
      <li><h5>{{ author}} </h5></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      subtitle: 'Mingeso B-2 Grupo 1',
      title: 'Iteración 1: Rack y reserva de habitaciones',
      authors: ['Vicente Rivera', 'Sebastián Salazar', 'Francisco Diaz'],
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#frontpage h1{
  font-size: 48px;
  padding: 5px;
}

.title{
  padding: 10px 5px 5px 30px;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 10px;
}
a {
  color: #42b983;
}
</style>
