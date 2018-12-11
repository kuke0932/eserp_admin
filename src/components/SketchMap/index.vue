<template>
  <div id="sketchMap">
    <div class="driver mainDriver" v-bind:class="mainDriverSelected ? 'matSelected' : ''" @click.stop="toggleMainDriver">
      <div class="coil mainDriverCoil" v-bind:class="mainDriverCoilSelected ? 'CoilSelected' : ''" @click.stop="toggleMainDriverCoil">主驾丝圈</div>
      <span>主驾</span>
    </div>

    <div class="driver copilot" v-bind:class="copilotSelected ? 'matSelected' : ''" @click.stop="toggleCopilot">
      <div class="coil copilotCoil" v-bind:class="copilotCoil ? 'CoilSelected' : ''" @click.stop="toggleCopilotCoil">副驾丝圈</div>
      <span>副驾</span>
    </div>

    <div class="backRow" v-bind:class="backRow ? 'matSelected' : ''" @click.stop="toggleBackRow">
      <div class="semiCircle"></div>
      <div class="backRowCoil backRowLeftCoil" v-bind:class="backRowLeftCoil ? 'CoilSelected' : ''" @click.stop="toggleBackRowLeftCoil">后排左丝圈</div>
      <div class="backRowCoil backRowRightCoil" v-bind:class="backRowRightCoil ? 'CoilSelected' : ''" @click.stop="toggleBackRowRightCoil">后排右丝圈</div>
      <span>后排</span>
    </div>

    <div class="backRow7" v-bind:class="backRow7 ? 'matSelected' : ''" @click.stop="toggleBackRow7">
      <div class="backRow7Coil" v-bind:class="backRow7Coil ? 'CoilSelected' : ''" @click.stop="toggleBackRow7Coil">丝圈</div>
      <span>后排7座</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sketch-map',
    props: {
      produceType: {
        type: String,
        required: true
      },
      readonly: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      mainDriverSelected() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      mainDriverCoilSelected() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      copilotSelected() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      copilotCoil() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      backRow() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      backRowLeftCoil() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      backRowRightCoil() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      backRow7() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      backRow7Coil() {
        this.$nextTick(() => {
          this.newProduceType()
        })
      },
      produceType() {
        this.init()
      }
    },
    data() {
      return {
        arrayProductType: [],
        mainDriverSelected: false,
        mainDriverCoilSelected: false,
        copilotSelected: false,
        copilotCoil: false,
        backRow: false,
        backRowLeftCoil: false,
        backRowRightCoil: false,
        backRow7: false,
        backRow7Coil: false,
        mainDriverNum: 0,
        mainDriverCoilNum: 0,
        copilotNum: 0,
        copilotCoilNum: 0,
        backRowNum: 0,
        backRowLeftCoilNum: 0,
        backRowRightCoilNum: 0,
        backRow7Num: 0,
        backRow7CoilNum: 0
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.produceType.length !== 5) {
          return
        }
        this.arrayProductType = this.produceType.split('')
        // 主驾
        if (this.arrayProductType[0] === '0') {
          this.mainDriverSelected = false
          this.mainDriverCoilSelected = false
          this.mainDriverNum = 0
          this.mainDriverCoilNum = 0
        }
        if (this.arrayProductType[0] === '1') {
          this.mainDriverSelected = true
          this.mainDriverCoilSelected = false
          this.mainDriverNum = 1
          this.mainDriverCoilNum = 0
        }
        if (this.arrayProductType[0] === '2') {
          this.mainDriverSelected = false
          this.mainDriverCoilSelected = true
          this.mainDriverNum = 0
          this.mainDriverCoilNum = 2
        }
        if (this.arrayProductType[0] === '3') {
          this.mainDriverSelected = true
          this.mainDriverCoilSelected = true
          this.mainDriverNum = 1
          this.mainDriverCoilNum = 2
        }
        // 副驾
        if (this.arrayProductType[1] === '0') {
          this.copilotSelected = false
          this.copilotCoil = false
          this.copilotNum = 0
          this.copilotCoilNum = 0
        }
        if (this.arrayProductType[1] === '1') {
          this.copilotSelected = true
          this.copilotCoil = false
          this.copilotNum = 1
          this.copilotCoilNum = 0
        }
        if (this.arrayProductType[1] === '2') {
          this.copilotSelected = false
          this.copilotCoil = true
          this.copilotNum = 0
          this.copilotCoilNum = 2
        }
        if (this.arrayProductType[1] === '3') {
          this.copilotSelected = true
          this.copilotCoil = true
          this.copilotNum = 1
          this.copilotCoilNum = 2
        }
        // 后排左
        if (this.arrayProductType[2] === '0') {
          this.backRow = false
          this.backRowLeftCoil = false
          this.backRowNum = 0
          this.backRowLeftCoilNum = 0
        }
        if (this.arrayProductType[2] === '1') {
          this.backRow = true
          this.backRowLeftCoil = false
          this.backRowNum = 1
          this.backRowLeftCoilNum = 0
        }
        if (this.arrayProductType[2] === '2') {
          this.backRow = false
          this.backRowLeftCoil = true
          this.backRowNum = 0
          this.backRowLeftCoilNum = 2
        }
        if (this.arrayProductType[2] === '3') {
          this.backRow = true
          this.backRowLeftCoil = true
          this.backRowNum = 1
          this.backRowLeftCoilNum = 2
        }
        // 后排右
        if (this.arrayProductType[3] === '0') {
          this.backRow = false
          this.backRowRightCoil = false
          this.backRowNum = 0
          this.backRowRightCoilNum = 0
        }
        if (this.arrayProductType[3] === '1') {
          this.backRow = true
          this.backRowRightCoil = false
          this.backRowNum = 1
          this.backRowRightCoilNum = 0
        }
        if (this.arrayProductType[3] === '2') {
          this.backRow = false
          this.backRowRightCoil = true
          this.backRowNum = 0
          this.backRowRightCoilNum = 2
        }
        if (this.arrayProductType[3] === '3') {
          this.backRow = true
          this.backRowRightCoil = true
          this.backRowNum = 1
          this.backRowRightCoilNum = 2
        }
        // 后排7座
        if (this.arrayProductType[4] === '0') {
          this.backRow7 = false
          this.backRow7Coil = false
          this.backRow7Num = 0
          this.backRow7CoilNum = 0
        }
        if (this.arrayProductType[4] === '1') {
          this.backRow7 = true
          this.backRow7Coil = false
          this.backRow7Num = 1
          this.backRow7CoilNum = 0
        }
        if (this.arrayProductType[4] === '2') {
          this.backRow7 = false
          this.backRow7Coil = true
          this.backRow7Num = 0
          this.backRow7CoilNum = 2
        }
        if (this.arrayProductType[4] === '3') {
          this.backRow7 = true
          this.backRow7Coil = true
          this.backRow7Num = 1
          this.backRow7CoilNum = 2
        }
      },
      newProduceType() {
        const str1 = (this.mainDriverNum + this.mainDriverCoilNum).toString()
        const str2 = (this.copilotNum + this.copilotCoilNum).toString()
        const str3 = (this.backRowNum + this.backRowLeftCoilNum).toString()
        const str4 = (this.backRowNum + this.backRowRightCoilNum).toString()
        const str5 = (this.backRow7Num + this.backRow7CoilNum).toString()
        const str = str1 + str2 + str3 + str4 + str5
        if (this.readonly === false) {
          this.$emit('update:produceType', str)
        }
      },
      toggleMainDriver() {
        if (this.readonly === false) {
          this.mainDriverSelected = !this.mainDriverSelected
          if (this.mainDriverSelected) {
            this.mainDriverNum = 1
          } else {
            this.mainDriverNum = 0
          }
        }
      },
      toggleMainDriverCoil() {
        if (this.readonly === false) {
          this.mainDriverCoilSelected = !this.mainDriverCoilSelected
          if (this.mainDriverCoilSelected) {
            this.mainDriverCoilNum = 2
          } else {
            this.mainDriverCoilNum = 0
          }
        }
      },
      toggleCopilot() {
        if (this.readonly === false) {
          this.copilotSelected = !this.copilotSelected
          if (this.copilotSelected) {
            this.copilotNum = 1
          } else {
            this.copilotNum = 0
          }
        }
      },
      toggleCopilotCoil() {
        if (this.readonly === false) {
          this.copilotCoil = !this.copilotCoil
          if (this.copilotCoil) {
            this.copilotCoilNum = 2
          } else {
            this.copilotCoilNum = 0
          }
        }
      },
      toggleBackRow() {
        if (this.readonly === false) {
          this.backRow = !this.backRow
          if (this.backRow) {
            this.backRowNum = 1
          } else {
            this.backRowNum = 0
          }
        }
      },
      toggleBackRowLeftCoil() {
        if (this.readonly === false) {
          this.backRowLeftCoil = !this.backRowLeftCoil
          if (this.backRowLeftCoil) {
            this.backRowLeftCoilNum = 2
          } else {
            this.backRowLeftCoilNum = 0
          }
        }
      },
      toggleBackRowRightCoil() {
        if (this.readonly === false) {
          this.backRowRightCoil = !this.backRowRightCoil
          if (this.backRowRightCoil) {
            this.backRowRightCoilNum = 2
          } else {
            this.backRowRightCoilNum = 0
          }
        }
      },
      toggleBackRow7() {
        if (this.readonly === false) {
          this.backRow7 = !this.backRow7
          if (this.backRow7) {
            this.backRow7Num = 1
          } else {
            this.backRow7Num = 0
          }
        }
      },
      toggleBackRow7Coil() {
        if (this.readonly === false) {
          this.backRow7Coil = !this.backRow7Coil
          if (this.backRow7Coil) {
            this.backRow7CoilNum = 2
          } else {
            this.backRow7CoilNum = 0
          }
        }
      }
    }
  }
</script>

<style scoped>
  #sketchMap{
    width: 280px;
    height: 345px;
    border: 1px solid #bcbcbc;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .driver{
    width: 119px;
    height: 100px;
    line-height: 60px;
    font-size: 14px;
    color: #6b6b6b;
    text-align: center;
    float: left;
    background: #dddddd;
    margin-top: 10px;
    overflow: hidden;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .mainDriver{
    margin-left: 15px;
    margin-right: 5px;
  }

  .copilot{
    margin-left: 5px;
    margin-right: 15px;
  }
  .coil{
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #6b6b6b;
    background: #bcbcbc;
    margin: 10px auto 0;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  /*后排*/
  .backRow{
    width: 248px;
    height: 100px;
    background: #dddddd;
    float: left;
    line-height: 38px;
    font-size: 14px;
    color: #6b6b6b;
    text-align: center;
    margin: 10px 15px 0;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    overflow: hidden;
  }
  .semiCircle{
    margin: 0 auto;
    width: 30px;
    height: 15px;
    background: #fff;
    -webkit-border-radius: 0 0 15px 15px;
    -moz-border-radius: 0 0 15px 15px;
    border-radius: 0 0 15px 15px;
  }
  .backRowCoil{
    width: 91px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #6b6b6b;
    float: left;
    background: #bcbcbc;
    margin-top: 0px;
  }
  .backRowLeftCoil{
    margin-left: 19px;
    margin-right: 14px;
  }
  .backRowRightCoil{
    margin-left: 14px;
    margin-right: 14px;
  }
/*后排七座*/
  .backRow7{
    width: 248px;
    height: 100px;
    background: #dddddd;
    float: left;
    line-height: 60px;
    font-size: 14px;
    color: #6b6b6b;
    text-align: center;
    margin: 10px 15px 0;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    overflow: hidden;
  }
  .backRow7Coil{
    width: 228px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #6b6b6b;
    margin: 10px 10px 0;
    background: #bcbcbc;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .matSelected{
    background: #22885a;
    color: #fff;
  }
  .CoilSelected{
    background: #42b983;
    color: #fff;
  }
</style>
