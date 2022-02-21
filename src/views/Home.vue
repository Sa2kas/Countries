<template>
  <div class="home">
    <Modal
        v-show="isModalVisible"
        @close="closeModal"
        prop_title="Pridėti šalį"
        prop_type="country"
        prop_post_url="https://akademija.teltonika.lt/countries_api/api/countries"
      />
    <div class="title">
      <p class="name">šalys</p>
      <button class="add" @click="showModal">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAXklEQVQ4jWNgIACmTp0qS0gNAwMDAxMhBYyMjAupYhADAwMjtQwiCowaREeDGKdNm7aCgYFBGI8aYwYGhrO4JP//////79+/SQRtmjZt2n5iXDT4wmjUIOoY9JoYgwDQhRDfo3sNJgAAAABJRU5ErkJggg==">
      </button>
    </div>
    <countries-list />
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import CountriesList from "@/components/CountriesList.vue";

export default {
  name: "Home",
  components: {
    CountriesList,
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
};
</script>

<style scoped>

.home {
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
