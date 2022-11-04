<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card height="400px"
        ><h2>Upload pictures</h2>
        <input multiple type="file" @change="handleFileUpload" /><v-btn
          @click="uploadFile()"
          >Upload</v-btn
        >
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card height="400px">
        <h2>Shoose pictures</h2>
      </v-card>
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
      selectedFile: [],
    };
  },
  methods: {
    handleFileUpload(e) {
      const selectedFile = e.target.files;
      this.selectedFile = selectedFile;
    },
    async uploadFile() {
      if (this.selectedFile.length === 0) return;
      const form = new Formdata();
      form.append('file1', this.selectedFile[0]);
      form.append('file2', this.selectedFile[1]);
      console.log(this.selectedFile);
      let result = await axios.post(`/api/tensorCompute`, form, {
        headers: {
          //'Content-Type': 'multipart/form-data',
          'Content-Type': 'multipart/form-data',
        },
        //Upload to server
      });
      console.log(result);
    },
    async getAllOptionsS3() {
      try {
        let options = await axios.get(`/api/getOptions`);
        console.log(options);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getAllOptionsS3();
  },
};
</script>
