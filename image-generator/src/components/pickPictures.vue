<template>
  <v-btn class="btn" @click="getThePictures" elevation="10" color="#FFA62B"
    >Show pictures
    <v-dialog
      activator="parent"
      v-model="dialog"
      scrollable
      width="50%"
      min-width="300px"
    >
      <v-card>
        <v-card-title>
          Pick one picture!
          <v-divider></v-divider>
          <!-- <span class="text-h6">$44.50</span> -->
        </v-card-title>
        <v-card-text style="height: 70%">
          <v-row>
            <v-col
              v-for="(src, index) in picturesToChooseFrom"
              :key="index"
              class="d-flex child-flex container"
              cols="6"
            >
              <v-img
                :src="src.dataTurtleLink"
                @click="choosePicture(index)"
                :lazy-src="`https://picsum.photos/10/6?image=${index * 5 + 10}`"
                cover
                class="bg-grey-lighten-2 image-class"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-icon
                size="x-large"
                :class="chosen === index ? 'overlay' : 'remove'"
                >mdi-check-circle</v-icon
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#82C0CC" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
export default {
  emits: ['getAllOptionsS3', 'newSelectedPicture'],
  props: {
    picturesToChooseFrom: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      dialog: false,
      chosen: null,
    };
  },
  methods: {
    getThePictures() {
      if (this.picturesToChooseFrom.length != 0) return;
      this.$emit('getAllOptionsS3');
    },
    choosePicture(index) {
      this.chosen = index;
      this.$emit('newSelectedPicture', {
        selected: this.picturesToChooseFrom[index],
      });
    },
  },
};
</script>

<style>
.overlay {
  position: absolute !important;
  top: 8;
  right: 10;
  transition: 0.5s ease;
  opacity: 0;
  text-align: center;
}

.remove {
  opacity: 0;
  position: absolute !important;
}

.container .overlay {
  opacity: 1;
  position: absolute !important;
}

.container {
  position: relative;
}

.image-class {
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
</style>
