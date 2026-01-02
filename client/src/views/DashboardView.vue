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

// Modal State
const showModal = ref(false);
const selectedPlayer = ref(null);

// 1. Fetch Data
onMounted(async () => {
    try {
        if (!auth.currentUser) {
            router.push('/login');
            return;
        }

        const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        players.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        loading.value = false;
    }
});

// 2. Filter Logic (Strict Match)
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

// 3. Helper: Calculate Age Safely
const getAge = (dobString) => {
    if (!dobString) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// 4. Helper: Format Date nicely
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

// 5. Action: Open Modal
const openProfile = (player) => {
    selectedPlayer.value = player;
    showModal.value = true;
};

// 6. Action: Logout
const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
};
</script>

<template>
    <div class="min-h-screen bg-brand-bg font-body p-8">
        
        <header class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-heading font-bold text-brand-text">SCOUTING DASHBOARD</h2>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 hidden md:block">{{ auth.currentUser?.email }}</span>
                <button @click="handleLogout" class="text-sm font-bold text-brand-red hover:underline">Logout</button>
            </div>
        </header>

        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
                v-for="tab in ['ALL', 'GK', 'DEF', 'MID', 'FWD']" 
                :key="tab"
                @click="activeTab = tab"
                :class="activeTab === tab ? 'bg-brand-text text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
                class="px-6 py-2 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap"
            >
                {{ tab === 'ALL' ? 'All Players' : tab }}
            </button>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-brand-border overflow-hidden">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Identity</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Age / Pos</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Team</th>
                        <th class="px-6 py-3 text-right"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="player in filteredPlayers" :key="player.id" class="hover:bg-gray-50 group transition-colors">
                        
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-4">
                                <div class="relative h-12 w-12 flex-shrink-0">
                                    <img v-if="player.photoUrl" :src="player.photoUrl" class="h-12 w-12 rounded-full object-cover border border-gray-200" />
                                    <div v-else class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                                        {{ player.fullName?.charAt(0).toUpperCase() }}
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900">{{ player.fullName }}</div>
                                    <div class="text-xs text-gray-500">Reg: {{ formatDate(player.createdAt) }}</div>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            <div class="flex flex-col items-start">
                                <span class="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700 mb-1">
                                    {{ player.position }}
                                </span>
                                <span class="text-sm text-gray-500">
                                    {{ getAge(player.dob) }} years old
                                </span>
                            </div>
                        </td>

                        <td class="px-6 py-4 text-sm text-gray-600">
                            {{ player.currentTeam || 'Free Agent' }}
                        </td>

                        <td class="px-6 py-4 text-right">
                            <button 
                                @click="openProfile(player)"
                                class="text-sm font-bold text-gray-400 hover:text-brand-red transition-colors"
                            >
                                VIEW PROFILE →
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div @click="showModal = false" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
            
            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                
                <div class="bg-brand-red h-32 relative">
                    <button @click="showModal = false" class="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold">×</button>
                </div>

                <div class="relative px-6 -mt-16 mb-4 flex justify-between items-end">
                    <div class="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                        <img v-if="selectedPlayer.photoUrl" :src="selectedPlayer.photoUrl" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center text-4xl">
                            {{ selectedPlayer.fullName?.charAt(0) }}
                        </div>
                    </div>
                    <div class="mb-2">
                        <span class="bg-brand-text text-white px-3 py-1 rounded-full text-xs font-heading tracking-widest">
                            {{ selectedPlayer.position }}
                        </span>
                    </div>
                </div>

                <div class="px-6 pb-8 space-y-4">
                    <div>
                        <h3 class="text-2xl font-heading font-bold text-gray-900 leading-tight">
                            {{ selectedPlayer.fullName }}
                        </h3>
                        <p class="text-gray-500">{{ selectedPlayer.currentTeam || 'Free Agent' }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                        <div>
                            <p class="text-xs text-gray-400 uppercase font-bold">Age</p>
                            <p class="font-bold text-gray-800">{{ getAge(selectedPlayer.dob) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 uppercase font-bold">DOB</p>
                            <p class="font-bold text-gray-800">{{ formatDate(selectedPlayer.dob) }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 uppercase font-bold">Phone</p>
                            <p class="font-bold text-gray-800">{{ selectedPlayer.phone }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 uppercase font-bold">Status</p>
                            <p class="text-green-600 font-bold text-sm flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-600"></span> Active
                            </p>
                        </div>
                    </div>

                    <button class="w-full bg-brand-text text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg">
                        CONTACT PLAYER
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>