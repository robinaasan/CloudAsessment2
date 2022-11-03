<template>
  <v-layout style="z-index: 0">
    <v-app-bar color="grey-lighten-2"></v-app-bar>
    <v-navigation-drawer color="grey-darken-2" permanent></v-navigation-drawer>
    <v-navigation-drawer
      color="grey-darken-2"
      permanent
      location="right"
    ></v-navigation-drawer>
    <v-main>
      <v-row justify="center">
        <v-col cols="6">
          <v-card height="400px"
            >Drop image here: <input multiple type="file"
          /></v-card>
        </v-col>
        <v-col cols="6">
          <v-card height="400px"><img :src="pic" /></v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import axios from "axios";

export default {
  name: "App",

  data: () => ({
    pic: "",
  }),
  methods: {
    async getPic() {
      let str = "data:image/jpeg;base64,";
      let pi = await axios.get("api/tensorCompute"); //Test connection with backend, console should respond!
      console.log(pi.data);
      str += pi.data;
      this.pic = str;
    },

    async preImages() {
      let images = await axios.get("/api/persistenceCheck/tensorPictures");
      console.log(images.data);
    },
  },
  mounted() {
    this.getPic();
    //this.preImages();
  },
};
</script>
