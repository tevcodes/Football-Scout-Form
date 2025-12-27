<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { auth } from '../firebase';
  

    const email = ref('');
    const password = ref('');
    const errorMsg = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      errorMsg.value = '';

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);

        console.log("Login Successful!");
        alert("Welcome back, Scout!");
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
            errorMsg.value = "Login failed. Please try again."
        }
      }
    }

    
</script>

<template>
  <div class="login-container">
    <div class="card">
      <h2>🔐 Scout Login</h2>
      <form @submit.prevent="handleLogin">
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="scout@kasi.com" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>

        <button type="submit" class="btn-submit">Login</button>
        
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh; /* Centers it vertically */
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #2563EB; /* Blue for Login */
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #1D4ED8;
}

.error-msg {
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>