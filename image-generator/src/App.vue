<template>
  <v-app>
    <v-navigation-drawer color="grey-darken-2" v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-email"
          title="upload"
          value="upload"
          @click="goToRoute('upload')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-supervisor-circle"
          title="load"
          value="load"
          @click="goToRoute('load')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="grey-lighten-2">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <v-navigation-drawer
      color="grey-darken-2"
      permanent
      location="right"
    ></v-navigation-drawer> -->
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';

export default {
  name: 'App',
  data: () => ({
    drawer: true,
  }),
  methods: {

    // async preImages() {
    //   let images = await axios.get('/api/persistenceCheck/tensorPictures');
    //   console.log(images.data);
    // },
    goToRoute(name) {
      this.$router.push({ name: name });
    },
  },
  mounted() {
    //// axios.get('api/testRoute'); //Test connection with backend, console should respond!
     //console.log(this.getSomethin());
  },
  // getSomethin() {
  //   return 'hei';
  // },
};
</script>

<style>
.v-navigation-drawer a {
  text-decoration: none;
}
</style>
