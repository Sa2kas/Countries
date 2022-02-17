import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

//import { ClientTable } from "vue-tables-2";
import "bootstrap/dist/css/bootstrap.min.css";
import VueAxios from "vue-axios";
import axios from "axios";

//Vue.use(ClientTable);
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
