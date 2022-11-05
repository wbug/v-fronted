<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWeb3 msg="Welcome to Web3 App"/>
</template>

<script>
import HelloWeb3 from './components/HelloWeb3.vue'
export default {
  name: 'App',
  components: {
    HelloWeb3
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
