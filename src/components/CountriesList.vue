<template>
  <div class="component">
    <Modal
      ref="modalItem"
      v-show="isModalVisible"
      @refList="getCountries()"
      @close="closeModal();getCountries();"
      :prop_put_url="selectedUrl"
      prop_title="Redaguoti šalį"
      prop_type="country"
    />
    <div class="search">
      <input type="text" class="item" 
      v-model="search"
      @keyup="searchItem(search);getCountries();"
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
          <th class="clickable" @click="order()" v-bind:class="[sortDirection]">pavadinimas </th>
          <th>užimamas plotas</th>
          <th>gyventojų skaičius</th>
          <th>šalies tel. kodas</th>
          <th>veiksmai</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="country in countries" :key="country.id">
          <td>
            <router-link
              :to="{
                name: 'Cities',
                params: {countryLink: country.relationships.cities.links.related,
                  country: country.attributes.name},
              }"
            >
              {{ country.attributes.name }}
            </router-link>
          </td>
          <td>{{ country.attributes.area }}</td>
          <td>{{ country.attributes.population }}</td>
          <td>{{ country.attributes.phone_code }}</td>
          <td>
            <img
              class="icons"
              @click="selectUrl(country);deleteCountry(country.attributes.name);"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAB20lEQVQ4jaWUsY7TQBCG/5l1gqG4GJ3lS4prEB1ICCgQV/E6MVKuOFqkFQ8QCYnYpqPnJXgBGh4AiQLFRJziFBzKKZ6h2Qs52xuhY6qZnfm/+ddamdARRVE8EpHXAM67+gAOAbxJ0/RLsxF0Tdd1/ZiZ343H409d/TzPX4jIEwAtIAGAtZaTJHkJ4I47fwpgCeCrx+E9AHcBfHb1xWKxmFlrJQCAOI6PVfU+Eb11Ax89oM5Q1dM4jo8BfAsAwBhDIrJM09TnaG/MZrOlMYYA9w2Z+TuAgyzL3t8ESES/HKO1Kb2Bu2sabmx6dpXneX62IzopiuL5Tv2qSwN4no2LhzuiRET+umB+4BNdc6iqv6fT6W2Xq7WWmwJrLYuju9kLLxBA2ev1hi5fDQaDgyYwSZIBM68AIAzDERGVXiARbYGqugrDMGoC67qOAKzczBCAHwigdEMgokpEWsAgCCIRqVw5rOvaDxSRuYiM3PaKmVtAEYmIqHJLR8aY+V6HRHR05VBVW0Bm3jpU1SNm3uuwBLC9chdQVSNmrhx8uF6vf3iBk8lkDSB08IqI9gJV9ZbTbMP7sPv9/nyz2Zw74cIYo87VT2NM6dO1IsuyD/8z23JIRJf/+tchosvm2R9Uks8uyRCjMgAAAABJRU5ErkJggg=="/>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAARUlEQVRIie3WsQ0AIAwDQQch1s4Y3pUmzGBEJAq7f13KAL+OZJJMtZtqUFVLbQBg3ESGDBkyZMiQIUNdk7+giNgdhzzbAU22CLtvvhtHAAAAAElFTkSuQmCC">
            <img
              class="icons"
              @click="selectUrl(country);showModal();modalItem(selectedUrl);"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABfUlEQVQ4jdXRv2sTcRzG8fcnSm+4gEi/hwjB2Uksgf4F/UFBCy6HCIKaKYmDS3AqZM+eKwRaEBzMKEIp2bpqwME/wTpcDkWMGA8vj4uBJLY0SZf2mb7D93nxgQcuemyRUqvVupGm6UMz++153utSqfRjYbDZbBaBA+AL4APyPK84QnMLYB3g2DlXHAwGdwDSNH00+jMzOMIkfQBu93q9nUKhkAK/JC3NBY5d9i4Igi1JD8zsZZIkXeCmmb2ZGRzHnHNPwzDMgiDoAEfALWCrXC7HM4FRFK0Ah8BhHMfPwjDM2u32lSRJ9oBVSZuVSqU73jl15SiKViR1gE4cx4/r9fqfMWxb0ka1Wn0/3TsRXBQ7ETwP9h94XgymRpH0ClgGrjvnrv3D9oH7wNpZ2MSFjUbD933/u5lVJT0HjoEYuAesT695Wq6OHvl8/q4ky+Vyb4fDIZJ2gW/zYBMgUAQsy7LPgIBPwJN5sAlQ0lczewF0+/3+x1qt9nMe6PLkLyv558lWb6dBAAAAAElFTkSuQmCC"/>
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
<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.js"></script>
<script>
import axios from "axios";
import Modal from "./Modal.vue";
import _ from 'lodash';
export default {
  name: "CountriesList",
  components: {
    Modal,
  },
  data() {
    return {
      isModalVisible: false,
      countries: [],
      urls:[],
      search: "",
      selectedUrl: null,
      defaultLink: "https://akademija.teltonika.lt/countries_api/api/countries",
      link: "https://akademija.teltonika.lt/countries_api/api/countries",
      toggle:false,
      sortDirection: "",
      startDate:"",
      endDate:"",
    };
  },
  methods: {
    filtering: function(){
      if(this.startDate || this.endDate){
        this.link = this.defaultLink + "?start_date=" + 
        this.startDate + "?end_date=" + this.endDate;
        this.getCountries(); 
        alert("Duomenų filtravimas atliktas");
      } else {
        alert("Duomenų filtravimas nepavyko");
      }
    },
    pagination: function(url){
      if(url != null){
        this.link = url;
        this.getCountries();
        this.sortDirection = '';
      }
    },
    modalItem(url) {
      this.$refs.modalItem.getItem(url);
    },
    selectUrl: function (item) {
      this.selectedUrl = this.defaultLink + "/" + item.id;
    },
    searchItem: function (item) {
      this.link = this.defaultLink + "?search=" + item;
      this.sortDirection = '';
    },
    async getCountries() {
      try {
        var response = await axios.get(this.link);
        this.countries = response.data.data;
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
    async deleteCountry(pavadinimas) {
      await axios.delete(this.selectedUrl);
      this.getCountries();
      alert('Šalis "' + pavadinimas + '"sėkmingai pašalinta');
    },

    order: function() {
      if(!this.sortDirection || this.sortDirection == 'desc'){
        this.countries.sort((a, b) => a.attributes.name.toLowerCase().localeCompare(b.attributes.name.toLowerCase()));
        this.sortDirection = 'asc';
      } else {
        this.countries.sort((a, b) => b.attributes.name.toLowerCase().localeCompare(a.attributes.name.toLowerCase()));
       this.sortDirection = 'desc';
      }
    }
  },
  created() {
    this.getCountries();
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
  color:#5C5C5C;
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
  min-width: 11px;
  height: 15px;
  background-color: #ffffff;
  border: none;
  color: #5C5C5C;
  border-radius: 20%;
  padding: 1px;
  margin: 1px;
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
a {
  text-decoration: none;
  color:#5C5C5C;
}
a:hover {
  font-weight: bold;
}
.pages {
  width:100%;
}
</style>
