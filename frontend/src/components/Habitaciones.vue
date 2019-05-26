<template>
    <div id="habitaciones-edit" class="habitaciones-container">
        <div class="row">
            <table class="table table-striped">
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
                        <td><b-button variant="outline-primary" v-b-modal.modal-edit-habitacion @click="showModal(habitacion)">Editar</b-button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <b-modal id="modal-edit-habitacion"
            ref="modal"
            :title="'Editar habitacion: ' +this.habitacionAux.number"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Tipo"
                    >
                    <b-form-select v-model="tipo" :options="opciones"></b-form-select>
                </b-form-group>
            </form>
        </b-modal>
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
            tipo: null,
            habitacionAux: '',
            opciones: [],
        }
    },
    created() {
        this.getHabitaciones();
        this.getTipo();
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
                console.log(error.toString());
            })
        },
        getTipo(){
            axiosInst.get(url + '/tipos').then(
                response => {
                    if(response.status = 200){
                        console.log("Tipos obtenidos");
                        this.opciones=response.data.map(tipo => ({value: tipo, text: tipo.tipo}));
                    }
                    else{
                        console.log("ERROR STATUS != 200");
                    }
                }
            ).catch(error => {
                console.log("Ha ocurrido un error");
                console.log(error.toString());
            })
        },
        showModal(habitacion){
            console.log("It's work!!!");
            this.habitacionAux = habitacion;

        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nameState = valid ? 'valid' : 'invalid'
            return valid
        },
        resetModal() {
            this.tipo = ''
            this.tipoState = null
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            console.log(this.tipo);
            console.log(this.opciones);
            axiosInst.put(url+'/habitacion/'+this.habitacionAux.id, this.tipo)
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                //agregar el post
                return
            }
            this.$nextTick(() => {
                this.$refs.modal.hide()
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