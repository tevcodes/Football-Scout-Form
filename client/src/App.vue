<script setup>
import RegistrationForm from './components/RegistrationForm.vue';
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>⚽ Kasi Scouting</h1>
      <p>Summer Trials Registration</p>
    </div>
    <RegistrationForm />
  </div>
</template>

<style>
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

.header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #1a1a1a;
  margin: 0;
}

p {
  color: #666;
  margin-top: 5px;
}
</style>