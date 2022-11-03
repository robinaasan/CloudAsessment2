<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card height="400px"
        ><input type="file" @change="handleFileUpload" /><v-btn
          @click="uploadFile()"
          >Upload</v-btn
        >
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card height="400px"></v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import * as Formdata from 'form-data';

export default {
  name: 'upload',
  data() {
    return {
      selectedFile: {},
    };
  },
  methods: {
    handleFileUpload(e) {
      const selectedFile = e.target.files[0];
      this.selectedFile = selectedFile;
    },
    async uploadFile() {
      if (Object.keys(this.selectedFile).length === 0) return;
      const form = new Formdata();
      form.append('file', this.selectedFile);
      console.log(this.selectedFile);
      let result = await axios.post(`api/testRoute/picture`, form, {
        headers: {
          //'Content-Type': 'multipart/form-data',
          'Content-Type': 'multipart/form-data',
        },
        //Upload to server
      });
      console.log(result);
    },
  },
};
</script>
