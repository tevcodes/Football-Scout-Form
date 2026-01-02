<script setup>

import axios from 'axios';
import { ref, computed, } from 'vue';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMaxDateForAge } from '../utils/validators';



const form = ref({
  fullName: '',
  dob: '',
  position: 'CM',
  phone: '',
  currentTeam: '',
  photoUrl: ''
});

const file = ref(null);
const previewUrl = ref(null);

const isSubmitting = ref(false);
const statusMessage = ref('');
const isSuccess = ref(false);

const maxDate = computed(() => getMaxDateForAge(16));

const handleFileChange = (event) => {
  const selected = event.target.files[0];
  if (!selected) return;

  if (!selected.type.includes('image')) {
    alert('Please select an image file (JPG or PNG)');
    return;
  }

  file.value = selected;
  previewUrl.value = URL.createObjectURL(selected);
};

const submitForm = async () => {
  isSubmitting.value = true;
  statusMessage.value = '';
  isSuccess.value = false;

  try {
    let finalPhotoUrl = '';

    if(file.value) {
      statusMessage.value = "Uploading photo...";
      const fileName = `players/${Date.now()}-${file.value.name}`;
      const fileReference = storageRef(storage, fileName);

      const snapshot = await uploadBytes(fileReference, file.value);
      finalPhotoUrl = await getDownloadURL(snapshot.ref);
    }

    statusMessage.value = "Registering player...";
    const payload = {
      ...form.value,
      photoUrl: finalPhotoUrl,
      currentTeam: form.value.currentTeam || 'Free Agent'
    };

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/register`;
    const response = await axios.post(apiUrl, payload);

    isSuccess.value = true;
    statusMessage.value = `✅ Registration Complete! Ref ID: ${response.data.id}`;

    form.value = { fullName: '', dob: '', position: 'CM', phone: '', currentTeam: '', photoUrl: '' };
    file.value = null;
    previewUrl.value = null;

  } catch (error) {
    console.error(error);
    isSuccess.value = false;
    statusMessage.value = `❌ Error: ${error.response?.data?.error || error.message}`
  } finally {
    isSubmitting.value = false;
  }
}

</script>

<template>
   <div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-brand-border">
    
    <h2 class="text-2xl font-heading font-bold text-center text-brand-text mb-6">
      NEW PLAYER PROFILE
    </h2>

    <form @submit.prevent="submitForm" class="space-y-5">
      
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 rounded-full bg-gray-100 border-2 border-brand-border overflow-hidden mb-3 relative flex items-center justify-center shadow-inner">
          <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
          <span v-else class="text-3xl text-gray-300">📷</span>
        </div>
        
        <label class="cursor-pointer bg-white border border-brand-border text-brand-text px-4 py-2 rounded-lg text-xs font-heading font-bold tracking-wide hover:bg-gray-50 transition shadow-sm">
          UPLOAD HEADSHOT
          <input type="file" @change="handleFileChange" accept="image/*" class="hidden" />
        </label>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
        <input 
          v-model="form.fullName" 
          type="text" 
          class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all placeholder-gray-400"
          placeholder="e.g. Percy Tau"
          required 
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Date of Birth (Max Age: 16)</label>
        <input 
          v-model="form.dob" 
          type="date" 
          :max="maxDate"
          class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all"
          required 
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Preferred Position</label>
        <select 
          v-model="form.position" 
          class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all cursor-pointer"
        >
          <option value="GK">Goalkeeper (GK)</option>
          <option value="DEF">Defender (DEF)</option>
          <option value="CM">Midfielder (CM)</option>
          <option value="ST">Striker (ST)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
        <input 
          v-model="form.phone" 
          type="tel" 
          class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all"
          placeholder="072 123 4567"
          required 
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Current Team (Optional)</label>
        <input 
          v-model="form.currentTeam" 
          type="text" 
          class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all"
          placeholder="e.g. Sundowns Academy"
        />
      </div>

      <button 
        type="submit" 
        :disabled="isSubmitting"
        class="w-full mt-6 bg-brand-red text-white font-heading font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-red-400 hover:shadow-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'UPLOADING...' : 'JOIN THE DATABASE' }}
      </button>

      <p v-if="statusMessage" :class="isSuccess ? 'text-green-600' : 'text-red-500'" class="text-center font-bold mt-4 animate-pulse">
        {{ statusMessage }}
      </p>

    </form>
  </div>
</template>
