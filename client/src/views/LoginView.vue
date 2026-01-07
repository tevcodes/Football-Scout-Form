<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
    isLoading.value = true;
    errorMsg.value = '';

    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/dashboard');
    } catch (error) {
        console.error(error);
        switch(error.code) {
            case 'auth/invalid-email':
                errorMsg.value = "Invalid email address.";
                break;
            case 'auth/user-not-found':
                errorMsg.value = "No account found with this email.";
                break;
            case 'auth/wrong-password':
                errorMsg.value = "Incorrect password.";
                break;
            default:
                errorMsg.value = "Access Denied. Please check your credentials.";
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#f4f7f6] flex items-center justify-center p-6 relative font-sans">
    
    <div class="absolute top-0 left-0 w-full h-64 bg-[#192730] z-0"></div>

    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-[#e0e0e0]">
      
      <div class="h-3 w-full bg-[#f08377]"></div>

      <div class="p-10">
        
        <div class="text-center mb-10">
          <h1 class="text-3xl font-extrabold text-[#192730] tracking-tight">SCOUT PORTAL</h1>
          <p class="text-sm text-gray-400 mt-2 font-medium tracking-wide">AUTHORIZED PERSONNEL ONLY</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div class="space-y-2">
            <label class="block text-xs font-bold text-[#192730] uppercase tracking-widest ml-1">Email Address</label>
            <div class="relative">
              <input 
                v-model="email" 
                type="email" 
                required
                class="w-full bg-[#f4f7f6] border border-[#e0e0e0] rounded-xl px-5 py-4 text-[#333333] font-medium focus:outline-none focus:bg-white focus:border-[#f08377] focus:ring-4 focus:ring-[#f08377]/20 transition-all duration-300 placeholder-gray-400"
                placeholder="scout@club.com"
              />
            </div>
          </div>

          <div class="space-y-2">
             <div class="flex justify-between items-center ml-1">
                <label class="block text-xs font-bold text-[#192730] uppercase tracking-widest">Password</label>
            </div>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full bg-[#f4f7f6] border border-[#e0e0e0] rounded-xl px-5 py-4 text-[#333333] font-medium focus:outline-none focus:bg-white focus:border-[#f08377] focus:ring-4 focus:ring-[#f08377]/20 transition-all duration-300 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <div v-if="errorMsg" class="animate-pulse bg-red-50 text-red-600 text-sm p-4 rounded-xl text-center font-bold border border-red-100 flex items-center justify-center gap-2 shadow-sm">
            <span class="text-lg">⚠️</span> {{ errorMsg }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-[#f08377] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#f08377]/30 hover:bg-[#192730] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
          >
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isLoading ? 'VERIFYING...' : 'ACCESS DASHBOARD' }}
          </button>

        </form>

        <div class="mt-8 pt-6 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-400">
            Need credentials? <a href="#" class="text-[#f08377] font-bold hover:text-[#192730] transition-colors underline decoration-2 underline-offset-2">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 text-[#192730]/40 text-xs font-semibold tracking-wider">
      MONKAE FOOTY DATABASE &copy; {{ new Date().getFullYear() }}
    </div>

  </div>
</template>