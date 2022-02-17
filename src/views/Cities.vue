<template>
<div class="cities">
<div class="virsus">
    <h1 id="title">{{country}}</h1>
    <button type="button" id="add" @click="showModal">+</button>
    <Modal
      v-show="isModalVisible"
      @close="closeModal"
      prop_title="Pridėti miestą"
      prop_type="city"
      :prop_post_url="countryLink"
    />
  </div>
<cities-list :prop_country="countryLink"/>
</div>
</template>
<script>
//import axios from "axios";
import Modal from "@/components/Modal.vue";
import CitiesList from "@/components/CitiesList.vue";
export default {
  name: "Cities",
  components: {
    CitiesList,
    Modal,
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
  props:
  {
    countryLink: {
      type: String,
      default: "",
      require: true,
    },
    country: {
      type: String,
      default: "Miestai",
      require: true,
    }
  }

};
</script>
<style scoped>
h1#title {
  font-family: Oswald;
  font-style: normal;
  font-weight: normal;
  font-size: 64px;
  line-height: 95px;
  letter-spacing: 0.016em;
  text-transform: uppercase;
  color: #5c5c5c;
  margin: 7vh 1vw 3vh -6vw;
  display: inline-block;
  vertical-align: middle;
  
}
button#add {
  height: 44px;
  width: 44px;
  font-size: 32px;
  font-family: "Playfair Display", serif;
  line-height: 44px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  vertical-align: middle;
  border: none;
  border-radius: 100%;
  color: rgba(0, 0, 0, 0.3);
  margin: 7vh 0 3vh 0;
  
}
#add:hover {
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
.virsus {
  width: 50%;
  /* background-color: aqua; */
}
</style>

