<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div> {{ prop_title }} </div>
        <button class="close-btn" @click="close();resetInput();">
          &#10005;
        </button>
      </div>
      <div class="modal-body">
          <div class="form__div">
            <input type="text" v-model="item.name" class="form__input" />
            <label for="" class="form__label">Pavadinimas</label>
          </div>
          <div class="form__div">
            <input type="text" v-model="item.area" class="form__input" />
            <label for="" class="form__label">Užimamas plotas</label>
          </div>
          <div class="form__div">
            <input type="text" v-model="item.population" class="form__input" />
            <label for="" class="form__label">Gyventojų skaičius</label>
          </div>
          <div class="form__div" v-if="(prop_type === 'country')">
            <input type="text" v-model="item.phone_code" class="form__input" />
            <label for="" class="form__label">Šalies tel. kodas</label>
          </div>
          <div class="form__div" v-if="(prop_type === 'city')">
            <input type="text" v-model="item.postal_code" class="form__input" />
            <label for="" class="form__label">Miesto pašto kodas</label>
          </div>
        </div>
      <div class="modal-footer">
        <button type="button" class="submit" @click="close(); saveItem(); resetInput(); refreshList();" >
          saugoti
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Modal",
  data() {
    return {
      item: {},
    };
  },
  props: {
    prop_title: {
      type: String,
      default: "",
    },
    prop_post_url: {
      type: String,
      default: "",
    },
    prop_put_url: {
      type: String,
      default: "",
    },
    prop_type: {
      type:String,
      default:"",
      require: true
    }
  },
  methods: {
    close: function () {
      this.$emit("close");
    },
    refreshList: function () {
      this.$emit("refList");
    },
    saveItem: function () {
      if(this.prop_type ==="country"){
        const country = {
        data: {
          attributes: {
            name: this.item.name,
            area: this.item.area,
            population: this.item.population,
            phone_code: this.item.phone_code,
            },
          },
        };
        this.sendRequest(this.prop_put_url, this.prop_post_url, country)
        }
      if(this.prop_type ==="city"){
        const city = {
        data: {
          attributes: {
            name: this.item.name,
            area: this.item.area,
            population: this.item.population,
            postal_code: this.item.postal_code,
          },
        },
      };
      this.sendRequest(this.prop_put_url, this.prop_post_url, city)
      }
    },
    sendRequest(put_url, post_url, item){
      const headers = {
        "Content-type": "application/json",
      };
      if (!put_url) {      
        axios.post(
        post_url,
        item,
        { headers }
        ).then(response => { 
           console.log(response);
            alert("Elementas sėkmingai pridėtas");
        })
        .catch(error => {
            alert("Įvyko klaida:" + error.response.status);
        });
      } else {
        axios.put(put_url, item, { headers }
        ).then(response => { 
           console.log(response);
            alert("Elementas sėkmingai atnaujintas");
        })
        .catch(error => {
            alert("Įvyko klaida: " + error.response.status);
        });
      }
    },
    async getItem(url) {
      if (url) {
        try {
          var response = await axios.get(url);
          this.item = response.data.data.attributes;
        } catch (error) {
          // console.log(error);
        }
      }
    },
    resetInput: function () {
      this.item = {};
    },
  },
  created() {},
  computed: {},
  mounted() {},
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #ffffff;
  width: 466px;
  height: 446px;
  position: fixed;
  top: auto;
  left: auto;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  /* padding: 1rem 1rem; */
}

.modal-header {
  padding: 1.5rem 1.5rem 0 2rem;
  display: flex;
  position: relative;
  color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  font-family: Oswald;
  font-size: 25px;
  text-transform: uppercase;
  border:none;
}

.modal-footer {
  /* padding: 15px; */
  padding: 0 2rem 2rem 1rem;
  display: flex;
  position: relative;
  color: rgba(0, 0, 0, 0.5);
  justify-content: right;
  border:none;
}

.modal-body {
  position: relative;
  padding: 20px 0px;
}

.close-btn {
  width: 14px;
  opacity: 20%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px 20px;
}
.close-btn:hover {
  opacity: 50%;
}
.submit {
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  font-family: Oswald;
  font-size: 18px;
  text-transform: uppercase;
  width: 92px;
  height: 40px;
  border: none;
  /* margin: 0px 0px 31px 17px ; */
}
.submit:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
.form__div {
  position: relative;
  height: 42px;
  margin: 1rem 2rem;
}
.form__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 42px;
  font-size: 1rem;
  border: 1px solid #dadce0;
  border-radius: 0.5rem;
  outline: none;
  padding: 1rem;
  background: none;
  z-index: 1;
}
.form__label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  padding: 0 0.25rem;
  background-color: #fff;
  color: #80868b;
  font-size: 1rem;
  transition: 0.3s;
}
.form__input + .form__label {
  top: -0.5rem;
  left: 2rem;

  font-size: 0.75rem;
  font-weight: 500;
  z-index: 10;
}
</style>
