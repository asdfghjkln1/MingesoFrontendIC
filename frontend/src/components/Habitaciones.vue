<template>
    <div id="habitaciones-edit" class="habitaciones-container">
        <div class="row">
            <table class="table table-striped table-dark">
                <tr>
                    <th><h1 class="titulo">Editor de habitaciones</h1></th>
                </tr>
                <tbody>
                    <tr>
                        <td colspan="1"> Id de habitación </td>
                        <td colspan="1"> Numero</td>
                        <td colspan="1"> Tipo </td>
                        <td colspan="1"> </td>
                    </tr>
                    <tr v-for="habitacion in habitaciones">
                        
                        <td colspan="1"> {{habitacion.id}} </td>
                        <td colspan="1">{{habitacion.number}}</td>
                        <td colspan="1">{{habitacion.tipo.tipo}} </td>
                        <td colspan="1"> <b-button variant="outline-primary">Editar</b-button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    const url = "http://localhost:8090/mingesoback";
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
    name: 'Habitaciones',
    data() {
        return {
            habitaciones: [],
        }
    },
    created() {
        this.getHabitaciones();
    },
    methods: {
        getHabitaciones() {
            axiosInst.get(url + '/habitaciones').then(
                response => {
                    if(response.status = 200){
                        console.log("Habitaciones obtenidas");
                        this.habitaciones=response.data;
                    }
                    else{
                        console.log("ERROR STATUS != 200");
                    }

                }
            ).catch(error => {
                console.log("Ha ocurrido un error");
                console.log(error.toString())
            })
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #titulo{
    padding: 10px 5px 5px 30px;
  }
  .container{
    padding: 50px;
  }

  th sort-by {
    padding-right: 18px;
    position: relative;
  }
  sort-by:before,
  sort-by:after {
    border: 4px solid transparent;
    content: "";
    display: block;
    height: 0;
    right: 5px;
    top: 50%;
    position: absolute;
    width: 0;
  }
  sort-by:before {
    border-bottom-color: #666;
    margin-top: -9px;
  }
  sort-by:after {
    border-top-color: #666;
    margin-top: 1px;
  }

</style>