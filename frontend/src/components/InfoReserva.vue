<template>
  <div id="info-reserva" class="reserva-container">
    <div class="container">
      <div class="info-container">
        <table class="table table-striped">
          <tr>
            <th><h1 class="titulo">Información de la Reserva</h1></th>
          </tr>
          <tbody>
          <tr>
            <td colspan="1"> Código de reserva </td>
            <td colspan="3"> {{ codigo }}</td>
          </tr>
          <template v-for="reserva in reservas">
            <tr>
              <td colspan="1"> ID reserva </td>
              <td colspan="3"> {{ reserva.id }}</td>
            </tr>
            <tr>
              <td colspan="1"> Nombre </td>
              <td colspan="3"> {{ reserva.text }}</td>
            </tr>
            <tr>
              <td colspan="1"> Tipo habitación </td>
              <td colspan="3"> {{ reserva.tipo_reserva }}</td>
            </tr>
            <tr>
              <td colspan="1"> Inicio reserva </td>
              <td colspan="1"> {{ reserva.start }}</td>
              <td colspan="1"> Fin reserva </td>
              <td colspan="1"> {{ reserva.end }}</td>
            </tr>
            <tr>
              <td colspan="1"> Subtotal reserva </td>
              <td colspan="3"> {{ reserva.total }}</td>
            </tr>
            <tr></tr>
          </template>
          </tbody>
        </table>
        <table>
          <tr> <th> <strong>Total reserva</strong> </th> </tr>
          <tr>
            <th> ID reserva </th>
            <th> Subtotal </th>
          </tr>
          <tbody>
          <tr v-for="reserva in reservas">
            <td>{{ reserva.id }}</td>
            <td>{{ reserva.precio }} </td>
          </tr>
          <tr>
            <td></td>
            <td id="total"></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  const url = 'http://157.230.138.200:8090/mingesoback/';
  //const url = 'http://127.0.0.1:3000/';

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const axiosInst = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: headers
  });

export default {
  props: ['codigo'],
  data () {
    return {
      reservas: []
    }
  },
  methods: {
    calcularTotal(){
      let total = 0;
      for (reserva in this.reservas){
        total += reserva.precio;
      }
      document.getElementById("total").innerHTML = total.toString()
    },
    getReservas(){
      axiosInst.get('/reservas/codigo/' + this.codigo).then(
        response => {
          if(response.status = 200){
            console.log("Insertado exitósamente")
            this.reservas = response.data;
            this.calcularTotal();
          }
          else{
            console.log("ERROR STATUS != 200");
          }
        }).catch(error => {
        console.log("Ha ocurrido un error");
        console.log(error.toString())
      })
    },
  },
  mounted: function(){
    this.getReservas();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .titulo{
    padding: 10px 5px 5px 30px;
  }

  .form-container{
    background-color: #2c3e50;
    padding: 10px;
    -webkit-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    -moz-box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
    box-shadow: 0px 10px 15px 0px rgba(128,128,128,1);
  }

  #enviar{
    margin-top: 20px;
    width: 50%
  }

  form *{
    width: 80%;
  }

  .container{
    padding: 50px;
  }

  label{
    left: 0;
    max-width: 50%;
    font-size: 24px;
    color: white;
  }

h1{
  font-size: 48px;
  padding: 5px;
}

</style>
