<template>
    <div id="habitaciones-edit" class="habitaciones-container">
      <div class="row" style="margin-bottom: 5%">
      <h1 class="titulo">Editor de habitaciones</h1>
      <b-button variant="outline-primary" style="display: inline-block; margin-left: 50%" v-b-modal.modal-new-habitacion v-if="isAdmin">Agregar habitación</b-button>
      </div>
        <div class="row table-responsive">
            <table class="table table-bordered table-striped table-highlight">
              <thead  style="background-color: white">
                    <tr>
                        <td colspan="1"><strong>Id de habitación</strong> </td>
                        <td colspan="1"><strong> Numero</strong></td>
                        <td colspan="1"><strong>Tipo</strong> </td>
                        <td colspan="1" v-if="isAdmin"><strong>Acciones</strong></td>
                    </tr>
              </thead>
              <tbody>
                    <tr v-for="habitacion in habitaciones">
                        <td colspan="1"> {{habitacion.id}} </td>
                        <td colspan="1">{{habitacion.number}}</td>
                        <td colspan="1">{{habitacion.tipo.tipo}} </td>
                        <td v-if="isProfileLoaded"><b-button v-if="isAdmin" variant="outline-primary" v-b-modal.modal-edit-habitacion @click="showModal(habitacion)">Editar</b-button> <b-button v-if="isAdmin" variant="outline-danger" @click="deleteHabitacion(habitacion)">Eliminar</b-button></td>
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
        <b-modal id="modal-new-habitacion"
            ref="new"
            :title="'Crear habitacion'"
            @show="resetModal"
            @hidden="resetModal"
            @ok="newHabitacion"
            >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label="Número Habitación">
                    <b-form-input
                      id="number"
                      type="text"
                      v-model="newNumber"
                      required
                      placeholder="Ej: 250"
                    ></b-form-input>
                </b-form-group>
                <b-form-group label="Tipo Habitación">
                    <b-form-select
                      id="tipo"
                      v-model="newTipo"
                      :options="opciones"
                      required
                    ></b-form-select>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from 'axios';
    const url = 'http://157.230.138.200:8090/mingesoback';
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };
    const axiosInst = axios.create({
        baseURL: url,
        timeout: 10000,
        headers: headers
    });

    import { mapGetters, mapState} from "vuex";

export default {
    name: 'Habitaciones',
    data() {
        return {
            habitaciones: [],
            tipo: null,
            habitacionAux: '',
            opciones: [],
            habitacionNueva: '',
            newTipo: null,
            newNumber: null
        }
    },
    created() {
      this.getHabitaciones();
      this.getTipo();
    },
    computed: {
      ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded', 'isAdmin']),
    },
    methods: {
        getHabitaciones() {
            axiosInst.get(url + '/habitaciones').then(
                response => {
                    if(response.status = 200){
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
            axiosInst.put(url+'/habitacion/'+this.habitacionAux.id, this.tipo).then(
                response => {
                    console.log(response);
                    if(response.status = 200){
                        this.getHabitaciones();
                    }
                }
            )
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
        },
        newHabitacion: async function(bvModalEvt){
            await axiosInst.post(url + "/habitacion/" + this.newNumber + "/" + this.newTipo.id);
            await this.getHabitaciones();
            this.$refs.modal.hide();
        },
        deleteHabitacion: async function(habitacion){
            let yep = confirm("Seguro que desea eliminar la habitación "+ habitacion.number);
            if(!yep){
              return;
            }
            await axiosInst.post(url + "/habitacion/" + habitacion.id);
            axiosInst.get(url + '/habitaciones').then(
              response => {
                if(response.status = 200){
                  this.habitaciones=response.data;
                  for(let i = 0; i < response.data.length; i ++){
                    if(response.data[i].id === habitacion.id){
                      alert("No puede eliminar una habitación con reservas asignadas!. Cancele las reservas e intente de nuevo.");
                    }
                  }
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
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .titulo{
    padding: 10px 5px 5px 15px;
    float: left;
    overflow: hidden;
    white-space: nowrap;
  }
  .habitaciones-container{
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
