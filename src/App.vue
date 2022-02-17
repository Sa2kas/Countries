<template>
  <div id="app">
    <div id="header">
      <img id="logo" src="./assets/Teltonika.png" alt="Teltonika" />
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
}

#header {
  height: 71px;
  background-color: #0054a6;
  width: auto;
  text-align: left;
}
#logo {
  height: 28px;
  margin-top: 1.25rem;
  margin-left: 13vw;
}
</style>
