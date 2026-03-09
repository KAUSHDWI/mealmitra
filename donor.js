/* ===================================================
   donor.js — Donor Dashboard Logic
   =================================================== */

/* ---- SAMPLE DATA ---- */
const donorListings = [
    { id: 1, name: 'Chicken Biryani', category: 'Cooked Meals', qty: 80, unit: 'Servings', status: 'available', location: 'Andheri West, Mumbai', expiry: Date.now() + 2 * 3600000, donor: 'Ravi\'s Restaurant' },
    { id: 2, name: 'Fresh Salad Bowls', category: 'Cooked Meals', qty: 40, unit: 'Servings', status: 'available', location: 'Andheri West, Mumbai', expiry: Date.now() + 45 * 60000, donor: 'Ravi\'s Restaurant' },
    { id: 3, name: 'Assorted Pastries', category: 'Bakery Items', qty: 60, unit: 'Pieces', status: 'accepted', location: 'Andheri West, Mumbai', expiry: Date.now() + 3 * 3600000, donor: 'Ravi\'s Restaurant' },
    { id: 4, name: 'Dal Tadka & Rice', category: 'Cooked Meals', qty: 100, unit: 'Servings', status: 'delivered', location: 'Andheri West, Mumbai', expiry: Date.now() - 10000, donor: 'Ravi\'s Restaurant' },
    { id: 5, name: 'Fruit Platter', category: 'Fruits', qty: 25, unit: 'Kg', status: 'expired', location: 'Andheri West, Mumbai', expiry: Date.now() - 3600000, donor: 'Ravi\'s Restaurant' },
    { id: 6, name: 'Samosas & Chutney', category: 'Snacks', qty: 120, unit: 'Pieces', status: 'available', location: 'Andheri West, Mumbai', expiry: Date.now() + 1.5 * 3600000, donor: 'Ravi\'s Restaurant' },
];

const historyData = [
    { id: 1, name: 'Biryani', qty: '80 srv', ngo: 'HelpHand NGO', date: '2026-02-24', status: 'delivered', meals: 80 },
    { id: 2, name: 'Veg Curry', qty: '50 srv', ngo: 'Asha Foundation', date: '2026-02-22', status: 'delivered', meals: 50 },
    { id: 3, name: 'Bread Loaves', qty: '30 pcs', ngo: 'CareFirst NGO', date: '2026-02-21', status: 'delivered', meals: 30 },
    { id: 4, name: 'Soup Pots', qty: '20 L', ngo: 'MealBridge', date: '2026-02-20', status: 'delivered', meals: 60 },
    { id: 5, name: 'Cookies', qty: '100 pcs', ngo: '—', date: '2026-02-19', status: 'expired', meals: 0 },
    { id: 6, name: 'Fruit Mix', qty: '15 kg', ngo: 'HelpHand NGO', date: '2026-02-18', status: 'delivered', meals: 90 },
];

const activityItems = [
    { icon: '✅', text: 'HelpHand NGO accepted your Biryani listing', time: '5m ago' },
    { icon: '🚚', text: 'Samosas delivery completed by Arjun Patel', time: '1h ago' },
    { icon: '⚠️', text: 'Fruit Platter listing expired without pickup', time: '3h ago' },
    { icon: '🔔', text: 'New listing: Assorted Pastries went live', time: '5h ago' },
    { icon: '✅', text: 'CareFirst NGO confirmed pickup of Soup', time: 'Yesterday' },
];

/* ---- SECTION SWITCHING ---- */
const sectionMap = {
    'overview': 's-overview',
    'add-food': 's-add-food',
    'my-listings': 's-my-listings',
    'history': 's-history',
    'impact': 's-impact',
    'profile': 's-profile',
};
const titleMap = {
    'overview': '📊 Overview',
    'add-food': '➕ Add Food Listing',
    'my-listings': '📋 My Listings',
    'history': '📜 Donation History',
    'impact': '🌱 My Impact',
    'profile': '👤 Profile Settings',
};

function showSection(key) {
    Object.values(sectionMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(sectionMap[key]);
    if (target) target.classList.remove('hidden');
    const title = document.getElementById('pageTitle');
    if (title) title.textContent = titleMap[key] || key;

    document.querySelectorAll('.nav-item').forEach((item, i) => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const idx = Object.keys(sectionMap).indexOf(key);
    if (navItems[idx]) navItems[idx].classList.add('active');

    if (key === 'my-listings') renderListings(donorListings);
    if (key === 'history') renderHistory();
}

/* ---- RENDER LISTINGS ---- */
function renderListings(data) {
    const grid = document.getElementById('donorListingsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!data.length) {
        grid.innerHTML = '<div class="empty-state"><p>🔍 No listings match your filter.</p></div>';
        return;
    }
    data.forEach(item => {
        const isUrgent = item.status === 'available' && (item.expiry - Date.now()) < 3600000 && item.expiry > Date.now();
        const timeLeft = item.expiry - Date.now();
        const card = document.createElement('div');
        card.className = 'food-card';
        card.dataset.name = item.name;
        card.dataset.status = item.status;
        card.dataset.category = item.category;
        card.innerHTML = `
      <div class="food-card-img">
        ${foodEmoji(item.category)}
        ${isUrgent ? '<span class="urgent-flag">⚡ URGENT</span>' : ''}
      </div>
      <div class="food-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <h4 class="food-card-title">${item.name}</h4>
          <span class="badge badge-${item.status}">${capitalize(item.status)}</span>
        </div>
        <div class="food-card-meta">
          <span class="meta-item">📦 ${item.qty} ${item.unit}</span>
          <span class="meta-item">📍 ${item.location.split(',')[0]}</span>
          <span class="meta-item">🏷️ ${item.category}</span>
        </div>
        ${item.status === 'available' ? `
        <div class="countdown">
          <p>⏱️ <span class="countdown-timer" data-expiry="${item.expiry}">Calculating…</span></p>
        </div>` : ''}
      </div>
      <div class="food-card-footer">
        <button class="btn btn-outline btn-sm" onclick="editListing(${item.id})" id="edit-${item.id}">✏️ Edit</button>
        ${item.status === 'available' ? `<button class="btn btn-danger btn-sm" onclick="deleteListing(${item.id})" id="delete-${item.id}">🗑️ Remove</button>` : ''}
        ${item.status === 'delivered' ? `<button class="btn btn-primary btn-sm" onclick="showToast('Certificate downloaded!','success')" id="cert-${item.id}">🏅 Certificate</button>` : ''}
      </div>`;
        grid.appendChild(card);
    });
    // Start countdowns
    document.querySelectorAll('.countdown-timer').forEach(el => {
        startCountdown(el, parseInt(el.dataset.expiry));
    });
}

function foodEmoji(cat) {
    const map = { 'Cooked Meals': '🍛', 'Bakery Items': '🧁', 'Fruits': '🍎', 'Raw Vegetables': '🥦', 'Dairy Products': '🥛', 'Snacks': '🥨', 'Beverages': '🥤', 'Packaged Food': '📦' };
    return `<span style="font-size:3rem;">${map[cat] || '🍽️'}</span>`;
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

/* ---- FILTER LISTINGS ---- */
function filterListings() {
    const q = (document.getElementById('listingSearch')?.value || '').toLowerCase();
    const status = document.getElementById('statusFilter')?.value || '';
    const cat = document.getElementById('categoryFilter')?.value || '';
    const cards = document.querySelectorAll('#donorListingsGrid .food-card');
    cards.forEach(card => {
        const nameMatch = !q || card.dataset.name?.toLowerCase().includes(q);
        const statMatch = !status || card.dataset.status === status;
        const catMatch = !cat || card.dataset.category === cat;
        card.style.display = (nameMatch && statMatch && catMatch) ? '' : 'none';
    });
}

/* ---- RENDER HISTORY ---- */
function renderHistory() {
    const tbody = document.getElementById('historyBody');
    if (!tbody) return;
    tbody.innerHTML = historyData.map((h, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${h.name}</strong></td>
      <td>${h.qty}</td>
      <td>${h.ngo}</td>
      <td>${h.date}</td>
      <td><span class="badge badge-${h.status}">${capitalize(h.status)}</span></td>
      <td>${h.meals ? h.meals + ' meals' : '—'}</td>
    </tr>`).join('');
}

/* ---- RENDER ACTIVITY ---- */
function renderActivity() {
    const list = document.getElementById('activityList');
    if (!list) return;
    list.innerHTML = activityItems.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-text"><strong>${a.text}</strong></div>
      <span class="activity-time">${a.time}</span>
    </div>`).join('');
}

/* ---- ADD FOOD FORM ---- */
function handleAddFood(e) {
    e.preventDefault();
    const btn = document.getElementById('addFoodBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Publishing…';
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = '🚀 Publish Listing';
        openModal('successModal');
        const form = document.getElementById('addFoodForm');
        if (form) form.reset();
    }, 1400);
}
function resetFoodForm() {
    const form = document.getElementById('addFoodForm');
    if (form) form.reset();
    showToast('Form cleared.', 'info');
}
function editListing(id) { showToast(`Opening editor for listing #${id}…`, 'info'); }
function deleteListing(id) {
    if (!confirm(`Remove listing #${id}? This cannot be undone.`)) return;
    showToast('Listing removed.', 'warning');
}

/* ---- CHART (donor line) ---- */
function initDonorChart() {
    const ctx = document.getElementById('donorLineChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{
                label: 'Donations',
                data: [5, 8, 6, 12, 9, 7],
                backgroundColor: 'rgba(46,139,87,0.1)',
                borderColor: '#2E8B57',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2E8B57',
                pointRadius: 5,
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } }
    });
}

/* ---- DATE ---- */
function setDate() {
    const el = document.getElementById('currentDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---- SET DATETIME DEFAULT ---- */
function setDateTimeDefaults() {
    const pickupInput = document.getElementById('pickupTime');
    const expiryInput = document.getElementById('expiryTime');
    const now = new Date();
    const fmt = d => d.toISOString().slice(0, 16);
    if (pickupInput) pickupInput.value = fmt(now);
    if (expiryInput) { const e = new Date(now); e.setHours(e.getHours() + 4); expiryInput.value = fmt(e); }
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
    setDate();
    renderActivity();
    setDateTimeDefaults();
    setTimeout(initDonorChart, 100);
});
