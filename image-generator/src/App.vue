<template>
  <v-app>
    <v-navigation-drawer color="#82C0CC" v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-progress-upload"
          title="upload"
          value="upload"
          @click="goToRoute('upload')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cloud-download"
          title="load"
          value="load"
          @click="goToRoute('load')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="#EDE7E3">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: true,
  }),
  methods: {
    goToRoute(name) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style>
.v-navigation-drawer a {
  text-decoration: none;
}
</style>
