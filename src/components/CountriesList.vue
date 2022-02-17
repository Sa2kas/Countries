<template>
  <div class="vidus">
    <Modal
      ref="modalItem"
      v-show="isModalVisible"
      @refList="getCountries()"
      @close="closeModal();getCountries();"
      :prop_put_url="selectedUrl"
      prop_title="Redaguoti šalį"
      prop_type="country"
    />
    <div>
      <input
      type="text"
      class="nosubmit"
      v-model="search"
      @keyup="searchItem(search);getCountries();"
      placeholder=""
    />
    <button class="filter" @click="toggle = !toggle">
      data filter 
      <img class="icons" src="https://img.icons8.com/material-rounded/20/000000/chevron-down.png"/>
    </button>
    </div>

    <div v-show="toggle" class="filtering">
      <label for="startDate" class="filterLabel">Pradžios data</label>
      <input type="date" v-model="startDate" id="startDate" class="filterItem">
      <label for="endDate" class="filterLabel">Pabaigos data</label>
      <input type="date" v-model="endDate" id="endDate" min="this.startDate" class="filterItem">
      <button class="filterButton" @click="filtering">Filtruoti</button>
    </div>

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
              src="https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/20/000000/external-trash-user-interface-kmg-design-detailed-outline-kmg-design.png"
            />
            <img src="https://img.icons8.com/ios/28/000000/vertical-line.png" />
            <img
              class="icons"
              @click="selectUrl(country);showModal();modalItem(selectedUrl);"
              src="https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/24/000000/external-pencil-interface-kiranshastry-lineal-kiranshastry.png"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">      
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
      sortBy: 'attributes.name',
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
        this.countries = _.orderBy(this.countries, 'attributes.name'.toLowerCase(), 'asc');
        this.sortDirection = 'asc';
      } else {
        this.countries = _.orderBy(this.countries, 'attributes.name'.toLowerCase(), 'desc');
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
  margin-left: auto;
  margin-right: auto;
  min-width: 70vw;
  max-width: 1185px;
  border-collapse: collapse;
  border: hidden;
  outline-offset: 15px;
  margin-top: 50px;
  margin-bottom: 50px;
  box-shadow: 0 0 0 1em #ffffff, 0 0 10px 1em rgba(0, 0, 0, 0.1);
}
.nosubmit {
  min-width: 58vw;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  padding: 1.5vh 1vw 1vh 3vw;
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjY2NjY2NjIj48cGF0aCBkPSJNNzIuMjQsMTAuMzJjLTMyLjI2MzQ0LDAgLTU4LjQ4LDI2LjIxNjU2IC01OC40OCw1OC40OGMwLDMyLjI2MzQ0IDI2LjIxNjU2LDU4LjQ4IDU4LjQ4LDU4LjQ4YzEyLjc2NTYzLDAgMjQuNTYzNzUsLTQuMTExODcgMzQuMTg1LC0xMS4wNzI1bDQ1LjI1NzUsNDUuMTVsOS42NzUsLTkuNjc1bC00NC43MiwtNDQuODI3NWM4Ljc4ODEzLC0xMC4yMzkzNyAxNC4wODI1LC0yMy41MjkwNiAxNC4wODI1LC0zOC4wNTVjMCwtMzIuMjYzNDQgLTI2LjIxNjU2LC01OC40OCAtNTguNDgsLTU4LjQ4ek03Mi4yNCwxNy4yYzI4LjU0MTI1LDAgNTEuNiwyMy4wNTg3NSA1MS42LDUxLjZjMCwyOC41NDEyNSAtMjMuMDU4NzUsNTEuNiAtNTEuNiw1MS42Yy0yOC41NDEyNSwwIC01MS42LC0yMy4wNTg3NSAtNTEuNiwtNTEuNmMwLC0yOC41NDEyNSAyMy4wNTg3NSwtNTEuNiA1MS42LC01MS42eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+")
    no-repeat 54vw center;
  background-size: 4%;
  border-radius: 5%;
}
.nosubmit:focus {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  outline:none;
}
.icons {
  opacity: 70%;
  background: none;
  border: none;
}
.icons:hover {
  opacity: 100%;
}
.clickable {
  cursor: pointer;
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
a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  font-size: 14px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: normal;
}
a:hover {
  font-weight: bold;
  color: #2c3e50;
}
.pagination{
  justify-content: center;
  margin-bottom: 10vh;
}
.filter {
  font-family: Oswald;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  height: 41px;
  letter-spacing: 0.016em;
  text-transform: uppercase;
  background-color: #ffffff;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  min-width: 12vw;
  max-width: 160px;
  border-radius: 5%;
  color: #5C5C5C;
  margin: 1vh 0 0 2vw;
  max-width: 161px;
  margin-bottom: -10px;
}
.filter:hover{
box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.filtering{
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
}
.filterButton:hover{
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
