<template>
  <v-container style="height: 100%">
    <v-row justify="center">
      <v-col cols="6">
        <v-card height="400" color="#16697A">
          <v-container>
            <v-row class="fill-height">
              <v-col cols="12">
                <h3>Upload pictures</h3>
                <v-card
                  class="d-flex justify-center align-center"
                  height="100%"
                >
                  <v-file-input
                    chips
                    label="Upload images"
                    accept="image/jpeg, image/bmp"
                    @change="handleFileUpload"
                  ></v-file-input>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row class="fill-height">
              <v-col cols="12">
                <h3>Shoose pictures</h3>

                <v-card
                  class="d-flex justify-center align-center"
                  height="100%"
                >
                  <KeepAlive>
                    <pickPicturesVue
                      @getAllOptionsS3="getAllOptionsS3"
                      @newSelectedPicture="newSelectedPicture"
                      :picturesToChooseFrom="picturesToChooseFrom"
                  /></KeepAlive>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-container class="d-flex justify-center align-center">
            <v-btn @click="uploadFile()" color="#FFA62B" rounded="pill"
              >Upload</v-btn
            >
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="#EDE7E3" min-height="400px">
          <h3 class="d-flex justify-center">Output image</h3>
          <v-divider />
          <v-card-text v-if="resultImage">
            <v-row>
              <v-col class="d-flex child-flex container" cols="12">
                <v-img
                  :src="resultImage"
                  class="image-class d-flex child-flex container heightt"
                ></v-img> </v-col></v-row
          ></v-card-text>

          <v-container
            style="height: 100%"
            v-else-if="!resultImage && loadingImage"
          >
            <v-row class="fill-height" align-content="center" justify="center">
              <v-col class="text-subtitle-1 text-center" cols="12">
                Getting your files
              </v-col>
              <v-col cols="6">
                <v-progress-linear
                  color="#FFA62B"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
              </v-col>
            </v-row>
          </v-container>
          <v-container style="height: 100%" v-else-if="someErrorOccuredMessage">
            <v-row class="fill-height" align-content="center" justify="center">
              <v-col class="text-subtitle-1 text-center" cols="12">
                Some error message
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
//import * as Formdata from 'form-data';
import { default as FormData } from 'form-data';
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
      resultImage: '',
      showtooltip: false,
      loadingImage: false,
      someErrorOccuredMessage: '',
    };
  },
  methods: {
    handleFileUpload(e) {
      const selectedFile = e.target.files;
      this.selectedFile = selectedFile;
    },
    async uploadFile() {
      if (
        this.selectedFile.length === 0 ||
        this.selectedPictureFormChooseFrom === null
      ) {
        this.showtooltip = true;
        return;
      }
      this.loadingImage = true;
      this.someErrorOccuredMessage = '';
      let bucketString = JSON.stringify(
        this.selectedPictureFormChooseFrom.bucketObject
      );
      const form = new FormData();
      form.append('file1', this.selectedFile[0]);
      form.append('bucket', bucketString);
      try {
        let result = await axios.post(`/api/tensorCompute/`, form, {
          headers: {
            //'Content-Type': 'multipart/form-data',
            'Content-Type': 'multipart/form-data',
          },
          //Upload to server
        });
        this.resultImage = `data:image/jpeg;base64,${result.data}`;
      } catch (err) {
        this.someErrorOccuredMessage = 'An error occured sry...';
      }
    },
    async getAllOptionsS3() {
      try {
        let options = await axios.get('/api/persistenceCheck');
        this.picturesToChooseFrom = options.data; //object with link and object
      } catch (err) {
        console.log(err);
      }
    },
    newSelectedPicture(chosen) {
      this.selectedPictureFormChooseFrom = chosen.selected; //link
    },
  },
};
</script>

<style></style>
