<script setup>

</script>

<template>
<div class="container">
  <div class="header">
    <h1>⚽ Kasi Scouting</h1>

    <nav>
      <router-link to="/">Register Player</router-link>
      <router-link to="/login">Scout Login</router-link>
    </nav>
  </div>

  <router-view></router-view>
</div>
</template>

<style>
  nav {
  margin-top: 10px;
  text-align: center;
}
nav a {
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
  margin: 0 10px;
}
nav a:hover {
  text-decoration: underline;
}
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
}

.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
}
</style>