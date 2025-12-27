<script setup>

import axios from 'axios';
import { ref, computed, } from 'vue';
import { getMaxDateForAge } from '../utils/validators';

const maxDate = computed(() => getMaxDateForAge(16));

// Data State
const form = ref({
    fullName: '',
    dob: '',
    position: 'CM',
    phone: '',
    currentTeam: ''
});

const statusMessage = ref('');
const isSubmitting = ref(false);
const isSuccess = ref(false);

// Logic
const submitForm = async () => {
    isSubmitting.value = true;
    statusMessage.value = '';
    isSuccess.value = false;

    try {
        const apiUrl = "http://127.0.0.1:5001/football-form-4aa20/us-central1/api/register";

        // Send data to Node.js Backend
        const response = await axios.post(apiUrl, form.value);

        // Handle Success
        isSuccess.value = true;
        statusMessage.value = `✅ Registration Complete! Ref ID: ${response.data.id}`;

        // Reset Form
        form.value = { fullName: '', dob: '', position: 'CM', phone: ''};
    } catch (error) {
        console.error(error);
        isSuccess.value = false;

        statusMessage.value = `❌ Error: ${error.response?.data?.error || error.message}`;
    } finally {
        isSubmitting.value = false;
    }
};

const maxDate = computed(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 16);
  return today.toISOString().split('T')[0];
});

</script>

<template>
    <div class="card">
        <form @submit.prevent="submitForm">

        <div class="form-group">
        <label>Full Name</label>
        <input v-model="form.fullName" type="text" placeholder="e.g. Percy Tau" required />
      </div>

      <div class="form-group">
        <label>Date of Birth (Must be 16+)</label>
        <input v-model="form.dob" type="date" :max="maxDate" required />
      </div>

      <div class="form-group">
       <label>Current Team / Academy</label>
       <input v-model="form.currentTeam" type="text" placeholder="e.g. Kaizer Chiefs U17 or Free Agent" />
</div>

      <div class="form-group">
        <label>Playing Position</label>
        <select v-model="form.position">
          <option value="GK">Goalkeeper (GK)</option>
          <option value="DEF">Defender (RB/LB/CB)</option>
          <option value="CM">Midfielder (CM/CAM/CDM)</option>
          <option value="W">Winger (LW/RW)</option>
          <option value="ST">Striker (ST)</option>
        </select>
      </div>

      <div class="form-group">
        <label>WhatsApp Number</label>
        <input v-model="form.phone" type="tel" placeholder="072 123 4567" required />
      </div>

      <button :disabled="isSubmitting" type="submit" class="btn-submit">
        {{ isSubmitting ? 'Registering...' : 'Sign Up for Trials' }}
      </button>

      <div v-if="statusMessage" :class="['message', isSuccess ? 'success' : 'error']">
        {{ statusMessage }}
      </div>
        </form>
    </div>
</template>
<style scoped>
.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box; /* Fixes padding issues */
}

input:focus, select:focus {
  border-color: #4CAF50;
  outline: none;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #10B981; /* Green */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover {
  background-color: #059669;
}

.btn-submit:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.success { background-color: #D1FAE5; color: #065F46; }
.error { background-color: #FEE2E2; color: #991B1B; }
</style>