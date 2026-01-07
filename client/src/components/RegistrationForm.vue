<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMaxDateForAge } from '../utils/validators';

const MAX_VIDEO_SIZE_MB = 20;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB *1024 * 1024;

const form = ref({
  fullName: '',
  dob: '',
  position: 'CM',
  phone: '',
  currentTeam: '',
  photoUrl: '',
  videoUrl: ''
});

// File State
const photoFile = ref(null);
const videoFile = ref(null);
const photoPreviewUrl = ref(null);

// UI State
const isSubmitting = ref(false);
const statusMessage = ref('');
const isSuccess = ref(false);

const maxDate = computed(() => getMaxDateForAge(16));

const handlePhotoChange = (event) => {
  const selected = event.target.files[0];
  if (!selected) return;

  if (!selected.type.includes('image')) {
    alert('Please select an image file (JPG or PNG)');
    return;
  }

  photoFile.value = selected;
  photoPreviewUrl.value = URL.createObjectURL(selected);
};

const handleVideoChange = (event) => {
  const selected = event.target.files[0];
  if (!selected) return;

  if (selected.size > MAX_VIDEO_SIZE_BYTES) {
    alert(`Video is too large! Limit is ${MAX_VIDEO_SIZE_MB}MB. Please trim to ~30 seconds.`);
    event.target.value = '';
    return;
  }

  videoFile.value = selected;
};

const submitForm = async () => {
  isSubmitting.value = true;
  statusMessage.value = '';
  isSuccess.value = false;

  try {
    let finalPhotoUrl = '';
    let finalVideoUrl = '';

    if (photoFile.value) {
      statusMessage.value = "Uploading photo...";
      const photoRef = storageRef(storage, `players/${Date.now()}-photo-${photoFile.value.name}`);
      const snap = await uploadBytes(photoRef, photoFile.value);
      finalPhotoUrl = await getDownloadURL(snap.ref);
    }

    if (videoFile.value) {
      statusMessage.value = "Uploading video clip (this may take a moment)...";
      const videoRef = storageRef(storage, `videos/${Date.now()}-video-${videoFile.value.name}`);
      const snap = await uploadBytes(videoRef, videoFile.value);
      finalVideoUrl = await getDownloadURL(snap.ref);
    }

    statusMessage.value = "Creating profile...";

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 2);

    const payload = {
      ...form.value,
      photoUrl: finalPhotoUrl,
      videoUrl: finalVideoUrl,
      currentTeam: form.value.currentTeam || 'Free Agent',
      expiresAt: expirationDate.toISOString() 
    };

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/register`;
    const response = await axios.post(apiUrl, payload);

    isSuccess.value = true;
    statusMessage.value = `✅ Registration Complete! Ref ID: ${response.data.id}`;

    form.value = { fullName: '', dob: '', position: 'CM', phone: '', currentTeam: '', photoUrl: '', videoUrl: '' };
    photoFile.value = null;
    videoFile.value = null;
    photoPreviewUrl.value = null;

  } catch (error) {
    console.error(error);
    isSuccess.value = false;
    statusMessage.value = `❌ Error: ${error.response?.data?.error || error.message}`;
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
      
      <div class="flex flex-col items-center mb-4">
        <div class="w-24 h-24 rounded-full bg-gray-100 border-2 border-brand-border overflow-hidden mb-3 relative flex items-center justify-center shadow-inner">
          <img v-if="photoPreviewUrl" :src="photoPreviewUrl" class="w-full h-full object-cover" />
          <span v-else class="text-3xl text-gray-300">📷</span>
        </div>
        <label class="cursor-pointer bg-white border border-brand-border text-brand-text px-4 py-2 rounded-lg text-xs font-heading font-bold hover:bg-gray-50 transition shadow-sm">
          UPLOAD HEADSHOT
          <input type="file" @change="handlePhotoChange" accept="image/*" class="hidden" />
        </label>
      </div>

      <div class="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
        <label class="block text-sm font-bold text-gray-700 mb-2">
          Action Clip (Max 30s)
        </label>
        
        <div v-if="videoFile" class="flex items-center justify-center gap-2 text-green-600 font-bold text-sm mb-2">
          <span>✅ Clip Selected</span>
          <button @click="videoFile = null" type="button" class="text-red-500 text-xs underline">(Remove)</button>
        </div>

        <label class="cursor-pointer inline-block bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition">
          {{ videoFile ? 'CHANGE VIDEO' : 'SELECT VIDEO (MAX 20MB)' }}
          <input type="file" @change="handleVideoChange" accept="video/mp4,video/quicktime" class="hidden" />
        </label>
        <p class="text-[10px] text-gray-400 mt-2">
          Strict Limit: 20MB. Please trim video to 30s or less.
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
        <input v-model="form.fullName" type="text" class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all" placeholder="e.g. Percy Tau" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
        <input v-model="form.dob" type="date" :max="maxDate" class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Position</label>
        <select v-model="form.position" class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all cursor-pointer">
          <option value="GK">Goalkeeper (GK)</option>
          <option value="DEF">Defender (DEF)</option>
          <option value="CM">Midfielder (CM)</option>
          <option value="ST">Striker (ST)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
        <input v-model="form.phone" type="tel" class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all" placeholder="072 123 4567" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Current Team (Optional)</label>
        <input v-model="form.currentTeam" type="text" class="w-full bg-white border-2 border-brand-border rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100 transition-all" placeholder="e.g. Sundowns Academy" />
      </div>

      <button type="submit" :disabled="isSubmitting" class="w-full mt-6 bg-brand-red text-white font-heading font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-red-400 transition-all disabled:opacity-50">
        {{ isSubmitting ? 'UPLOADING...' : 'JOIN THE DATABASE' }}
      </button>

      <p v-if="statusMessage" :class="isSuccess ? 'text-green-600' : 'text-red-500'" class="text-center font-bold mt-4 animate-pulse">
        {{ statusMessage }}
      </p>

    </form>
  </div>
</template>
