<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase'; 
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const router = useRouter();
const players = ref([]);
const loading = ref(true);
const activeTab = ref('ALL');

// Fetch Data when page loads
onMounted(async () => {
    try {
        // Security Check
        if (!auth.currentUser) {
            router.push('/login');
            return;
        }

        console.log("Fetching data...");

        // Get Players from firestore
        const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        // Map the raw data
        players.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching players:", error);
        alert("Error loading data. Check console.");
    } finally {
        loading.value = false;
    }
});

// Filter Logic for Tabs
const filteredPlayers = computed(() => {
    if (activeTab.value === 'ALL') return players.value;

    return players.value.filter(player => {

      const pos = player.position || '';
      
    if (activeTab.value === 'GK') return pos === 'GK';
    if (activeTab.value === 'DEF') return pos === 'DEF' || ['RB','LB','CB'].includes(pos);
    if (activeTab.value === 'MID') return pos === 'CM' || ['CAM','CDM','LM','RM'].includes(pos);
    if (activeTab.value === 'FWD') return pos === 'ST' || ['W','LW','RW','CF'].includes(pos);
    return false;
    });
});

// Logout Function
const handleLogout = async () => {
    await signOut(auth);
    router.push('/login')
};
</script>

<template>
    <div class="dashboard">
        <header class="dash-header">
            <h2>Monkae Scout Dashboard</h2>
            <div class="user-info">
                <span class="user-email">{{  auth.currentUser?.email }}</span>
                <button @click="handleLogout">Logout</button>
            </div>
        </header>

    <div class="tabs">
      <button :class="{ active: activeTab === 'ALL' }" @click="activeTab = 'ALL'">All Players</button>
      <button :class="{ active: activeTab === 'GK' }" @click="activeTab = 'GK'">Goalkeepers</button>
      <button :class="{ active: activeTab === 'DEF' }" @click="activeTab = 'DEF'">Defenders</button>
      <button :class="{ active: activeTab === 'MID' }" @click="activeTab = 'MID'">Midfielders</button>
      <button :class="{ active: activeTab === 'FWD' }" @click="activeTab = 'FWD'">Forwards</button>
    </div>

    <div v-if="loading" class="loading">
     <div class="spinner"></div>Loading Scouting Database...
    </div>

    <div v-else class="table-container">
     <table class="player-table">
        <thead>
         <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Current Team</th>
          <th>Age (DOB)</th>
          <th>Phone</th>
          <th>Registered</th>
         </tr>
        </thead>
        <tbody>
           <tr v-for="player in filteredPlayers" :key="player.id">
           <td class="name-col">{{ player.fullName }}</td>
            <td><span class="badge">{{ player.position }}</span></td>
            <td class="team-col">{{ player.currentTeam || 'Free Agent' }}</td>
            <td>{{ player.dob }}</td>
            <td>
              <a :href="'https://wa.me/27' + player.phone.replace(/^0/, '')" target="_blank" class="whatsapp-link">
                {{ player.phone }} ↗
              </a>
            </td>
            <td>{{ new Date(player.createdAt).toLocaleDateString() }}</td>
           </tr>

           <tr v-if="filteredPlayers.length === 0">
            <td colspan="6" class="empty-state">No players found in this category.</td>
          </tr>
        </tbody>
     </table>
    </div>
    </div>
</template>

<style scoped>
/* Main Layout */
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  min-height: 80vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', sans-serif;
}

/* Header */
.dash-header {
  background: #111827; /* Dark Grey */
  color: white;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-email { margin-right: 15px; color: #9CA3AF; font-size: 0.9rem; }
.btn-logout {
  background: #DC2626;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-logout:hover { background: #B91C1C; }

/* Tabs */
.tabs {
  display: flex;
  background: #F3F4F6;
  border-bottom: 1px solid #E5E7EB;
}
.tabs button {
  flex: 1;
  padding: 15px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  color: #6B7280;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}
.tabs button:hover { background: #E5E7EB; }
.tabs button.active {
  color: #2563EB; /* Blue */
  border-bottom-color: #2563EB;
  background: white;
}

/* Table */
.table-container { padding: 0; overflow-x: auto; }
.player-table { width: 100%; border-collapse: collapse; }

.player-table th {
  text-align: left;
  padding: 16px;
  background: #F9FAFB;
  color: #374151;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #E5E7EB;
}

.player-table td {
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
  color: #1F2937;
}

.name-col { font-weight: bold; color: #111827; }
.team-col { color: #4B5563; }

.badge {
  background: #DBEAFE;
  color: #1E40AF;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.whatsapp-link {
  color: #059669; /* Green */
  text-decoration: none;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}
.whatsapp-link:hover { background: #ECFDF5; }

.loading { padding: 50px; text-align: center; color: #6B7280; }
.empty-state { text-align: center; padding: 40px; color: #9CA3AF; font-style: italic; }
</style>