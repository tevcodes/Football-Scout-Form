<script setup>
import logo from './assets/monkaeLogo.png-removebg-preview.png';
</script>

<template>
<div class="min-h-screen bg-brand-bg font-body">
 
  <nav class="bg-white border-b border-brand-border h-20 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
    <div class="flex items-center gap-3">
       <img 
    :src="logo" 
    alt="Monkae Footy Tools" 
    class="h-30 w-auto object-contain" 
  />
      </div>

      <div class="flex items-center gap-6">
        <router-link to="/" class="font-semibold text-brand-text hover:text-brand-red transition-colors">
          Player Registration
        </router-link>

        <router-link 
          to="/login" 
          class="font-heading bg-brand-text text-bg-brand-dark px-6 py-2 rounded-full text-sm hover:bg-brand-red transition-all transform hover:-translate-y-1 shadow-md"
        >
          SCOUT ACCESS
        </router-link>
      </div>
  </nav>

  <main class="max-w-5xl mx-auto py-10 px-6">
      <router-view></router-view>
    </main>
</div>
</template>

