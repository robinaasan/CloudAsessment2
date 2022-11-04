<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card height="400px"
        ><h2>Upload pictures</h2>
        <input type="file" @change="handleFileUpload" /><v-btn
          @click="uploadFile()"
          >Upload</v-btn
        >
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card height="400px">
        <h2>Shoose pictures</h2>
        <pickPicturesVue
          @getAllOptionsS3="getAllOptionsS3"
          @newSelectedPicture="newSelectedPicture"
          :picturesToChooseFrom="picturesToChooseFrom"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import * as Formdata from 'form-data';
import pickPicturesVue from '../components/pickPictures.vue';

export default {
  name: 'upload',
  components: {
    pickPicturesVue,
  },
  data() {
    return {
      selectedFile: [],
      picturesToChooseFrom: [],
      selectedPictureFormChooseFrom: null,
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
      form.append('file2', this.selectedPictureFormChooseFrom);
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
        let options = await axios.get('/api/persistenceCheck/tensorPictures');
        // console.log(options);
        // if (options.data.length != 0) {
        //   options.data.forEach((element) => {
        //     console.log(element);
        //   });
        // }
        // picsBase64.forEach((element) => {
        //   this.picturesToChooseFrom.push(this.encodePicture(element));
        // });
        this.picturesToChooseFrom = options.data;
        console.log(this.picturesToChooseFrom[0]);
      } catch (err) {
        console.log(err);
      }
    },
    newSelectedPicture(index) {
      this.selectedPictureFormChooseFrom =
        this.picturesToChooseFrom[index.selected];
      console.log(selected);
    },
    // encodePicture(element) {
    //   let str = `data:image/jpeg;base64,${element}`;
    //   return str;
    // },
  },

  mounted() {
    //this.getAllOptionsS3();
  },
};
</script>
