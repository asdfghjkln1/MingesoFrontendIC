<template>
  <div id="ModalReserva">
  <transition name="modal-fade-custom">
    <div class="modal-backdrop-custom">
      <div class="modal-custom" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <div class="modal-header-custom" id="modalTitle">
          <div name="header">
            <h3> Nueva Reserva <span><button type="button" class="btn-close" @click="close" aria-label="Close modal"> x </button></span> </h3>
          </div>
        </div>
        <section class="modal-body-custom" id="modalDescription">
          <div name="body">
            <div class="form-group">
              <label>Nombre del representante</label>
              <input class="form-control" v-model="name" id="name">
              <label>Tipo de reserva (Particular, Empresa)</label>
              <input class="form-control" v-model="tipo" id="tipo">
              <label>Fecha inicio</label>
              <input class="form-control" v-model="start" disabled>
              <label>Fecha fin</label>
              <input class="form-control" v-model="end" disabled>
              <label>Valor de la reserva (modificable para administrador)</label>
              <input class="form-control" v-model="total" disabled>
            </div>
            <br>
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
    props: [ 'start' , 'end' , 'resource', 'total' ],
    data: function (){
      return {
        name: '',
        tipo: ''
      }
    },
    methods: {
      confirm() {
        if(this.name === '' || this.tipo === ''){
          return false;
        }
        let codigo_reserva = "ABC"; //hay que autogenerar un codigo
        let reserva = {
          id: '',
          codigo: codigo_reserva,
          start: this.start,
          end: this.end,
          tipo: this.tipo,
          text: this.name,
          resource: this.resource,
          fecha: Date.now(),
          total: this.total
        };
        this.$emit('confirm', reserva);
      },
      close() {
        this.$emit('close');
      },
    },
  };
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

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
    margin: 0px 0px 10px 50px;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>
