<template xmlns:v-for="http://www.w3.org/1999/xhtml">
  <div id="frontpage">
    <h1>{{ title }}</h1>
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
      title: 'Iteración 0: Integración Contínua',
      authors: ['Vicente Rivera', 'Sebastián Salazar', 'Francisco Diaz'],
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#frontpage {
  padding: 50px;
  margin: 5px;
}

#frontpage h1{
  font-size: 48px;
  padding: 5px;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 10px;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
