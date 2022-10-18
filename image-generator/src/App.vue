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
          <v-card height="400px">Output here</v-card>
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    axios.get('api/testRoute'); //Test connection with backend, console should respond!
  },
};
</script>
