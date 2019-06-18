<template>
  <div id="ModalReserva">
  <transition name="modal-fade-custom">
    <div class="modal-backdrop-custom">
      <div class="modal-custom" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <div class="modal-header-custom" id="modalTitle">
          <div style="width: 100%;" name="header">
            <div id="header-title">
              <h3 > Nueva Reserva </h3>
            </div>
            <div style="float: right">
              <button type="button" class="btn-close" @click="close" aria-label="Close modal"> x </button>
            </div>
          </div>
        </div>
        <section class="modal-body-custom" id="modalDescription">
          <div name="body">
            <div class="form-group">
              <label>Nombre del representante <small style="color: red">*</small></label>
              <input class="form-control" v-model="name" id="name">
              <small style="display:block; color:red;">{{ ayudaNombre }}</small>
              <label>Tipo de reserva (Particular, Empresa)</label>
              <input class="form-control" v-model="tipo" id="tipo">
              <div class="row">
                <div v-for="(selection, index) in selected" v-bind:key="index" class="col">
                  <label>Fecha inicio</label>
                  <input class="form-control" v-model="selection.start" disabled>
                  <label>Fecha fin</label>
                  <input class="form-control" v-model="selection.end" disabled>
                  <label>* {{ dias[index] }} dia(s)</label><br/>
                  <label> Valor unitario </label>
                  <input name="precio" class="form-control" v-bind:value="preciosPorDia[index]" v-on:change="updatePrecio">
                  <small name="errorHelp" style="display:block; color:red;"></small>
                  <label>Valor de la reserva</label>
                  <input name="subtotal" class="form-control" v-bind:value="subtotales[index]" disabled>
                </div>
              </div>
            </div>
            <h5> Precio total: $<span id="total">{{ setPrecios }}</span></h5>
            <small style="display:block; color:red;">{{ ayudaTotal }}</small>
          </div>
        </section>
        <footer class="modal-footer-custom">
          <div name="footer">
            <button type="button" class="btn-green" @click="confirm" aria-label="Confirmar"> Confirmar </button>
            <button type="button" class="btn-red" @click="close" aria-label="Close modal"> Cancelar </button>
          </div>
        </footer>
      </div>
    </div>
  </transition>
  </div>
</template>

<script>
  export default {
    name: 'ModalReserva',
    props: [ 'selected', 'habitaciones' ], //Array de rangos de fecha
    data: function (){
      return {
        name: '',
        tipo: '',
        ayudaNombre: '',
        ayudaTotal: '',
        preciosPorDia: [],
        subtotales: [],
        total: 0,
        dias: [],
      }
    },
    methods: {
      /*isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
          evt.preventDefault();
          return false;
        } else {
          return true;
        }
      },*/
      generarCodigo( largo ) {
        var result = 'R-';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (let i = 0; i < largo; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      },
      confirm() {
        this.ayudaNombre = '';
        this.ayudaTotal = '';
        let yes = confirm("Esta seguro de efectuar la(s) reserva(s)?");
        if(!yes){
          return;
        }
        if(this.name === ''){
          this.ayudaNombre = '* Ingrese el nombre del reservante';
          return;
        }
        if(document.getElementById("total").innerHTML === ''){
          this.ayudaTotal = '* Por favor corrija los campos de precio erroneos';
          return;
        }
        let codigo_reserva = this.generarCodigo(6);
        let reservas = [];
        for(let i = 0; i < this.selected.length; i++){
          let reserva = {
            codigo: codigo_reserva,
            nombre: this.name,
            inicio: this.selected[i].start.value.split("T")[0] + " 00:00:00.000000",
            fin: this.selected[i].end.value.split("T")[0] + " 00:00:00.000000",
            habitacion: {
              id : this.selected[i].resource
            },
            tipo_Reserva: this.selected[i].tipo || '',
            fecha_reserva: new Date().toJSON().slice(0,10) + " 00:00:00.000000",
            valor: this.subtotales[i],
            valor_final: 1
          };
          console.log("Insertando: "+ reserva.toString());
          reservas.push(reserva);
        }
        this.$emit('confirm', reservas);
      },
      lookupPrecio(room_id){
        for(let i = 0; i < this.habitaciones.length; i++){
          if(this.habitaciones[i].id === room_id){
            return this.habitaciones[i].tipo.valor;
          }
        }
      },
      updatePrecio(){
        let precios = document.getElementsByName("precio");
        let errors = document.getElementsByName("errorHelp");
        for(var x = 0; x < errors.length; x++){
          errors[x].innerHTML = ''
        }
        this.subtotales = [];
        let total = 0;
        for(let i = 0; i < precios.length; i++){
          if(isNaN(parseInt(precios[i].value))){
            console.log("oops " + i);
            errors[i].innerHTML = "* Ingrese un número positivo";
            document.getElementById("total").innerHTML = '';
            return;
          }
          let subtotal = parseInt(precios[i].value) * this.dias[i];
          this.subtotales.push(subtotal);
          total += subtotal;
        }
        document.getElementById("total").innerHTML = total.toString();
      },
      close() {
        this.$emit('close');
      },
    },
    computed: {
      setPrecios(){
        let total = 0;
        for(let i = 0; i < this.selected.length; i++){
          let precio = this.lookupPrecio(this.selected[i].resource);
          const diff = Math.abs(Date.parse(this.selected[i].end) - Date.parse(this.selected[i].start));
          const dias = Math.ceil(diff / (1000 * 3600 * 24));
          this.dias.push(dias);
          this.preciosPorDia.push(precio);
          this.subtotales.push(precio*dias);
          total += this.subtotales[i];
        }
        return total;
      },
    }
  }
</script>

<style>
  .modal-backdrop-custom {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-custom {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header-custom,
  .modal-footer-custom {
    padding: 15px;
    display: flex;
  }

  .modal-header-custom {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer-custom {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body-custom {
    position: relative;
    padding: 20px 20px 0px 20px;
  }

  #header-title{
    float: left;
    padding: 20px 0px 10px 30px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 10px;
    float: right;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
    margin: 10px;
  }

  .btn-green {
    color: white;
    width: 100px;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
    cursor: pointer;
  }
  .btn-red {
    color: white;
    width: 100px;
    background: #af3638;
    border: 1px solid #2d2b2d;
    border-radius: 2px;
    cursor: pointer;
  }
</style>
