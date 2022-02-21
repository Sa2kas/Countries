<!-- <template>
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
</template> -->
<template>
  <div class="cities">
    <Modal
      v-show="isModalVisible"
      @close="closeModal"
      prop_title="Pridėti miestą"
      prop_type="city"
      :prop_post_url="countryLink"
    />
    <div class="title">
      <p class="name">{{country}}</p>
      <button class="add" @click="showModal">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAXklEQVQ4jWNgIACmTp0qS0gNAwMDAxMhBYyMjAupYhADAwMjtQwiCowaREeDGKdNm7aCgYFBGI8aYwYGhrO4JP//////79+/SQRtmjZt2n5iXDT4wmjUIOoY9JoYgwDQhRDfo3sNJgAAAABJRU5ErkJggg==">
      </button>
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
.cities {
  padding: 45px min(376px, 19.58vw) 114px min(359px, 18.698vw);
}
.title {
  width: 300px;
  text-align: left;
}
p.name {
  display: inline-block;
  margin: 0;
  text-transform: uppercase;
  font-style: normal;
  font-weight: normal;
  font-size: 64px;
  line-height: 95px;
  letter-spacing: 0.016em;
  text-transform: uppercase;
  font-family: "Oswald";
  color: #5c5c5c;
}
button.add {
  border:none;
  background-color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-left: 5px;
  vertical-align: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 13px;
  color: #969696;
}
button:hover {
cursor: pointer;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>

