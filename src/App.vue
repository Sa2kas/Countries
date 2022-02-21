<template>
  <div id="app">
    <div id="header">
      <img src="./assets/Teltonika.png" alt="Teltonika" id="name">
    </div>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  justify-content: center;
  align-content: center;
}
#header { 
  position: relative;
  height: 71px;
  left: 0px;
  top: 0px;
  background: #0053a6;
}
#name {
  position: relative;
  width: 142.77px;
  height: 28px;
  margin-top:20px;
  margin-left: min(367px, 19vw);
  float: left;
}
</style>
