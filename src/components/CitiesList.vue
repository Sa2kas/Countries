<template>
  <div class="component">
    <Modal
      ref="modalItem"
      v-show="isModalVisible"
      @refList="getCities()"
      @close="closeModal();getCities();"
      :prop_put_url="selectedUrl"
      prop_title="Redaguoti miestą"
      prop_type="city"
    />
    <div class="search">
      <input type="text" class="item" 
      v-model="search"
      @keyup="searchIt(search); getCities();"
      placeholder="">
      <button class="toggle" @click="toggle = !toggle">
        data filter 
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeTAAAAwklEQVQokd2QMYrCQABFn2g1MIWlhZCQtDax8QR2lrIHcJIQ7MOgpeAREg3ewNJjyDbZA0xgTxASphysBLfYSrbZ1/7/+PDhn6C1HiulNr/lSqmN1noMMAJo2/YcRdE6z/ND13Wrsiw/AbIsm0spb57nTeq6XgIfIwDn3N4Ys/B9f2qtvadpegEIgkAJIQbGmG/n3A5g8Dodx/ExDMNcSjkE6PveNU1zKopi++z8EACSJJkJIa4A1tp1VVVfbx309zwApM5ACwBUGmgAAAAASUVORK5CYII=">
      </button>
    </div>
    <div class="filter" v-show="toggle">
      <label for="startDate" class="filterLabel">Pradžios data</label>
      <input type="date" v-model="startDate" id="startDate" class="filterItem">
      <label for="endDate" class="filterLabel">Pabaigos data</label>
      <input type="date" v-model="endDate" id="endDate" min="this.startDate" class="filterItem">
      <button class="filterButton" @click="filtering">Filtruoti</button>
    </div>
    <div class="table">
      <table>
      <thead>
        <tr>
          <th @click="order()" v-bind:class="[sortDirection]">pavadinimas </th>
          <th>užimamas plotas</th>
          <th>gyventojų skaičius</th>
          <th>miesto pašto kodas</th>
          <th>veiksmai</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="city in cities" :key="city.id">
          <td>{{ city.attributes.name }}</td>
          <td>{{ city.attributes.area }}</td>
          <td>{{ city.attributes.population }}</td>
          <td>{{ city.attributes.postal_code }}</td>
          <td>
            <img class="icons"
              @click="selectUrl(city);deleteCity(city.attributes.name);"
              src="https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/20/000000/external-trash-user-interface-kmg-design-detailed-outline-kmg-design.png"
            />
            <img src="https://img.icons8.com/ios/26/000000/vertical-line.png" />
            <img class="icons"
              @click="selectUrl(city);showModal();modalItem(selectedUrl);"
              src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/24/000000/external-pencil-interface-kiranshastry-lineal-kiranshastry.png"
            />
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="pages">
      <button class="page" v-for="url in urls" :key="url.label" 
        @click="pagination(url.url)" 
        v-html="url.label"
        :disabled="url.url === null" 
        :class="{'active': url.active ===true}"      
        >
          {{url.label}}
        </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Modal from "./Modal.vue";
export default {
  name: "CitiesList",
  components: {
    Modal,
  },
  data() {
    return {
      isModalVisible: false,
      cities: [],
      urls:[],
      search: "",
      selectedUrl: null,
      link: this.prop_country.toString(),
      sortDirection: '',
      toggle:false,
      startDate:"",
      endDate:"",
    };
  },
  props: {
    prop_country: {
      type: String,
      default: "",
      require: true,
    },
  },
  methods: {
    filtering: function(){
      if(this.startDate || this.endDate){
        this.link = this.prop_country + "?start_date=" + 
        this.startDate + "?end_date=" + this.endDate;
        this.getCities(); 
        alert("Duomenų filtravimas atliktas");
        } else {
        alert("Duomenų filtravimas nepavyko");
      }
    },
    pagination: function(url){
      if(url != null){
        this.link = url;
        this.getCities();
        this.sortDirection='';
      }
    },
    modalItem(url) {
      this.$refs.modalItem.getItem(url);
    },
    selectUrl: function (item) {
      this.selectedUrl = this.prop_country + "/" + item.id;
    },
    searchIt: function (item) {      
      this.link = this.prop_country + "?search=" + item;
      this.sortDirection = '';
    },
    async getCities() {
      try {
        var response = await axios.get(this.link);
        this.cities = response.data.data;
        this.urls = response.data.meta.links;
      } catch (error) {
        // console.log(error);
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async deleteCity(pavadinimas) {
      await axios.delete(this.selectedUrl);
      this.getCities();
      alert('Šalis "' + pavadinimas + '"sėkmingai pašalinta');
    },

    order: function() {
     if(!this.sortDirection || this.sortDirection == 'desc'){
        this.cities.sort((a, b) => a.attributes.name.toLowerCase().localeCompare(b.attributes.name.toLowerCase()));
        this.sortDirection = 'asc';
      } else {
        this.cities.sort((a, b) => b.attributes.name.toLowerCase().localeCompare(a.attributes.name.toLowerCase()));
       this.sortDirection = 'desc';
      }
    }
  },
  created() {
    this.getCities();
  },
  computed: {

  },
};
</script>
<style scoped>
.asc:after{
  content: "\2303";
}

.desc:after{
  content: "\2304";
}
td#country:hover {
  background-color: aqua;
  cursor: pointer;
}
td {
  border: 1px solid rgba(92, 92, 92, 0.2);
  text-align: left;
  padding: 5px 10px;
  background: #ffffff;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  width: fit-content;
}
tr {
  text-align: left;
  background: #ffffff;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
}
th {
  border: 1px solid rgba(92, 92, 92, 0.2);
  padding: 10px;
  background: #ffffff;
  text-transform: uppercase;
  font-family: "Oswald";
}
table {
  border-collapse: collapse;
  border: hidden;
  box-shadow: 0 0 0 10px #ffffff, 0 0 10px 10px rgba(0, 0, 0, 0.1);
  width: calc(100% - 20px);
  margin-left: 10px;
  min-width: fit-content;
}
div.table {
  margin-top: 6px;
  margin-bottom: 36px;
  width: min(1185px, 61.719vw);
  justify-content: center;
  align-content: center;
}
 

.page.active{
  background-color: #5C5C5C;
  color:white;
}
.page{
  background-color: #ffffff;
  border: none;
  color: #5C5C5C;
  border-radius: 20%;
}
.page:disabled {
  color: rgba(92, 92, 92, 0.5);
}





.filter{
  margin: 0.5rem;
  background-color: #ffffff;
}
.filterItem{
  color: #5C5C5C;
  margin: 0.5rem;
  min-width: 20px;
  max-width: 17vw;
  font-size: 14px;
}
.filterLabel{
  color: #5C5C5C;
  margin: 1rem 0.4rem;
}
.filterButton{
  background-color: #ffffff;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 5%;
  font-size: 18px;
  color: #5C5C5C;
  font-family: "Oswald";
  letter-spacing: 0.02em;
  padding-bottom: 0.5vh;
  height: 25px;
}


.search {
  margin-top: 29px; 
  /* background-color: brown; */
  text-align: left;
  padding-bottom: 20px;
  width: min(1185px, 61.719vw);
}
.item {
  display:inline-block;
  width: min(1000px, calc(100% - 189px)); /* 161px+24px+4px*/
  height: 49px;
  background: #FFFFFF;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border:none;
  margin-right: 24px; 
  margin-bottom: 6px; /* .search padding bottom 20px. viso 26px */
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAB8klEQVQ4jaXTv4sTQRQH8O+bTQJTXJo7PBBSGou0VtqJhXCwsuBzM41yXHedQTsLtU4dFARz2ji7HKgLxpPj/otAsDB2NpYaV7OZZ2ECYTcJyfmthp3Zz7z5Rcil2Wxecc4diMhVpVRFRATACMCpiDyP43iY/2c+NGsws1ZKdZxzNQBtAGdxHP8BAN/3t7TWeyLyEMD7KIqeApClIDNrACdKqTfW2s6y2ZnZI6I2EW1ba+8tQxGG4cswDA9XLSU3vsPMrUV9arpntVWV5aO1bhHRvjFmpwA65w7wb8/WTrfbTQEcOefuFEAA1wCcbQICABF9FJHrBVBE1Ow0N0mlUhkCqC2q8FxJ07QEYFwAiei37/tbm4Ke510C8LUAAjjVWu9tCjrnbonISQEUkWci8oCZvXWxIAi2RSRI0/S4AE7fZkJEa10dZvZKpdJrpdSTJElG+f7ZW6YwDI8A/NBat6b3bGFlU+y7tfbuojE032bm+0S0LyKvlFK90Wj0pVqtlrIsuywiPhHdds61ieiQiB5Za3urQACAMWYnyzIGcIOILgIQIhqKyCcRieI4/mWM2Z1MJh8WoQVw3QRBcKFcLvcAPI6iKJl9X/tk8xkMBj/r9fpbz/NeNBqNb/1+//N/gcvQcy95PsaY3SzL3o3H45t/Ab0x204YRhoxAAAAAElFTkSuQmCC")
    no-repeat 98%;

  background-size: 2.5vh;
  font-size: 16px;
}
.item:focus {
  outline:none;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
.toggle {
  color: #969696;
  width: 161px; /* turėtų būti 8.385vw */
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border:none;
  vertical-align: middle;
  font-family: Oswald;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.016em;
  text-transform: uppercase;
  
}
.filter {
  width: min(1185px, 61.719vw);
  /* background-color: mediumpurple; */
  height: 50px;
  padding: 20px 0px;
}
button:hover {
cursor: pointer;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
.icons:hover {
  cursor: pointer;
}
</style>