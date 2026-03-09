/* ===================================================
   ngo.js — NGO Dashboard Logic
   =================================================== */

const ngoFoodData = [
    { id: 1, name: 'Chicken Biryani', category: 'Cooked Meals', qty: 80, unit: 'Servings', donor: "Ravi's Restaurant", location: 'Whitefield', expiry: Date.now() + 2 * 3600000, status: 'available' },
    { id: 2, name: 'Fresh Salads', category: 'Cooked Meals', qty: 40, unit: 'Servings', donor: 'Grand Buffet', location: 'Koramangala', expiry: Date.now() + 35 * 60000, status: 'urgent' },
    { id: 3, name: 'Assorted Pastries', category: 'Bakery', qty: 60, unit: 'Pieces', donor: "Baker's Delight", location: 'Indiranagar', expiry: Date.now() + 3 * 3600000, status: 'available' },
    { id: 4, name: 'Dal Tadka & Rice', category: 'Cooked Meals', qty: 100, unit: 'Servings', donor: 'Hotel Srinivas', location: 'HSR Layout', expiry: Date.now() + 50 * 60000, status: 'urgent' },
    { id: 5, name: 'Fruit Platter', category: 'Fruits', qty: 25, unit: 'Kg', donor: 'FreshMart', location: 'JP Nagar', expiry: Date.now() + 4 * 3600000, status: 'available' },
    { id: 6, name: 'Samosas', category: 'Snacks', qty: 120, unit: 'Pieces', donor: 'Snack Express', location: 'Whitefield', expiry: Date.now() + 45 * 60000, status: 'urgent' },
    { id: 7, name: 'Vegetable Soup', category: 'Cooked Meals', qty: 50, unit: 'Liters', donor: 'Cafe Greens', location: 'Koramangala', expiry: Date.now() + 1.5 * 3600000, status: 'available' },
    { id: 8, name: 'Bread & Butter', category: 'Bakery', qty: 80, unit: 'Pieces', donor: 'ITC Hotel', location: 'Indiranagar', expiry: Date.now() + 5 * 3600000, status: 'available' },
];

const acceptedPickups = [
    { id: 1, food: 'Biryani', donor: "Ravi's Restaurant", qty: '80 srv', time: 'Today 6:00 PM', volunteer: 'Arjun Patel', status: 'in-transit' },
    { id: 2, food: 'Sandwiches', donor: 'Cafe Fresh', qty: '50 pcs', time: 'Today 4:00 PM', volunteer: 'Sonal Mehta', status: 'picked-up' },
    { id: 3, food: 'Rice & Curry', donor: 'Hotel Grand', qty: '120 srv', time: 'Yesterday', volunteer: 'Rahul Kumar', status: 'delivered' },
];

const ngoAlerts = [
    { icon: '⚡', text: 'Fresh Salads expiring in 35 minutes — Koramangala', time: 'Now' },
    { icon: '⚡', text: 'Dal Tadka & Rice expiring in 50 minutes — HSR Layout', time: 'Just now' },
    { icon: '🍽️', text: 'New listing: Vegetable Soup from Cafe Greens', time: '10m ago' },
    { icon: '✅', text: 'Arjun Patel confirmed pickup of Biryani', time: '25m ago' },
    { icon: '🙋', text: 'New volunteer Priya Das joined your chapter', time: '1h ago' },
];

const volunteersData = [
    { name: 'Arjun Patel', initial: 'A', role: 'Pickup Driver', pickups: 47, rating: '⭐4.9', status: 'available' },
    { name: 'Sonal Mehta', initial: 'S', role: 'Coordinator', pickups: 38, rating: '⭐4.8', status: 'available' },
    { name: 'Rahul Kumar', initial: 'R', role: 'Pickup Driver', pickups: 29, rating: '⭐4.7', status: 'busy' },
    { name: 'Priya Das', initial: 'P', role: 'Volunteer', pickups: 12, rating: '⭐4.6', status: 'available' },
    { name: 'Vikram Singh', initial: 'V', role: 'Pickup Driver', pickups: 55, rating: '⭐5.0', status: 'busy' },
    { name: 'Anita Joshi', initial: 'A', role: 'Coordinator', pickups: 22, rating: '⭐4.8', status: 'available' },
];

let pendingAcceptId = null;

const ngoSections = { 'ngo-overview': 's-ngo-overview', 'available-food': 's-available-food', 'accepted': 's-accepted', 'volunteers': 's-volunteers', 'ngo-impact': 's-ngo-impact', 'ngo-profile': 's-ngo-profile' };
const ngoTitles = { 'ngo-overview': '📊 Overview', 'available-food': '🍽️ Available Food', 'accepted': '✅ Accepted Pickups', 'volunteers': '🙋 Volunteers', 'ngo-impact': '🌱 Impact', 'ngo-profile': '⚙️ Settings' };

function ngoShowSection(key) {
    Object.values(ngoSections).forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
    const target = document.getElementById(ngoSections[key]);
    if (target) target.classList.remove('hidden');
    const title = document.getElementById('ngoPageTitle');
    if (title) title.textContent = ngoTitles[key] || key;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const idx = Object.keys(ngoSections).indexOf(key);
    if (navItems[idx]) navItems[idx].classList.add('active');
    if (key === 'available-food') renderNgoFood(ngoFoodData);
    if (key === 'accepted') renderAccepted();
    if (key === 'volunteers') renderVolunteers();
    if (key === 'ngo-impact') initNgoCharts();
}

const catEmoji = { 'Cooked Meals': '🍛', 'Bakery': '🧁', 'Fruits': '🍎', 'Snacks': '🥨', 'Beverages': '🥤' };

function renderNgoFood(data) {
    const grid = document.getElementById('ngoFoodGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach(item => {
        const urgent = item.status === 'urgent';
        const card = document.createElement('div');
        card.className = 'food-card';
        card.dataset.name = item.name; card.dataset.location = item.location;
        card.dataset.status = item.status; card.dataset.category = item.category;
        card.innerHTML = `
      <div class="food-card-img" style="${urgent ? 'background:linear-gradient(135deg,#fff5f5,#ffe8e8)' : ''}">
        <span style="font-size:3rem;">${catEmoji[item.category] || '🍽️'}</span>
        ${urgent ? '<span class="urgent-flag">⚡ URGENT</span>' : ''}
      </div>
      <div class="food-card-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <h4 class="food-card-title">${item.name}</h4>
          <span class="badge ${urgent ? 'badge-urgent' : 'badge-available'}">${urgent ? 'Urgent' : 'Available'}</span>
        </div>
        <div class="food-card-meta">
          <span class="meta-item">📦 ${item.qty} ${item.unit}</span>
          <span class="meta-item">📍 ${item.location}</span>
          <span class="meta-item">🏢 ${item.donor}</span>
        </div>
        <div class="countdown"><p>⏱️ <span class="countdown-timer" data-expiry="${item.expiry}">…</span></p></div>
      </div>
      <div class="food-card-footer">
        <button class="btn btn-outline btn-sm" onclick="viewFoodDetails(${item.id})" id="view-${item.id}">👁 Details</button>
        <button class="btn ${urgent ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="openAcceptModal(${item.id})" id="accept-${item.id}">✅ Accept</button>
      </div>`;
        grid.appendChild(card);
    });
    document.querySelectorAll('.countdown-timer').forEach(el => startCountdown(el, parseInt(el.dataset.expiry)));
}

function filterNgoFood() {
    const q = (document.getElementById('ngoSearch')?.value || '').toLowerCase();
    const loc = document.getElementById('ngoLocationFilter')?.value || '';
    const status = document.getElementById('ngoStatusFilter')?.value || '';
    const cat = document.getElementById('ngoCategoryFilter')?.value || '';
    document.querySelectorAll('#ngoFoodGrid .food-card').forEach(card => {
        const show = (!q || card.dataset.name?.toLowerCase().includes(q)) && (!loc || card.dataset.location === loc) && (!status || card.dataset.status === status) && (!cat || card.dataset.category === cat);
        card.style.display = show ? '' : 'none';
    });
}

function openAcceptModal(id) {
    pendingAcceptId = id;
    const item = ngoFoodData.find(f => f.id === id);
    if (!item) return;
    const desc = document.getElementById('acceptModalDesc');
    if (desc) desc.innerHTML = `<strong>${item.name}</strong> — ${item.qty} ${item.unit} from <strong>${item.donor}</strong> at <strong>${item.location}</strong>.`;
    openModal('acceptModal');
}
function confirmAccept() {
    closeModal('acceptModal');
    showToast('✅ Pickup accepted! Volunteer notified.', 'success');
    const item = ngoFoodData.find(f => f.id === pendingAcceptId);
    if (item) item.status = 'available';
    setTimeout(() => renderNgoFood(ngoFoodData), 300);
}
function viewFoodDetails(id) {
    const item = ngoFoodData.find(f => f.id === id);
    if (item) showToast(`${item.name} — ${item.qty} ${item.unit} from ${item.donor} at ${item.location}`, 'info');
}

function renderAccepted() {
    const tbody = document.getElementById('acceptedBody');
    if (!tbody) return;
    const sc = { 'in-transit': 'badge-accepted', 'picked-up': 'badge-available', 'delivered': 'badge-delivered' };
    tbody.innerHTML = acceptedPickups.map((p, i) => `
    <tr>
      <td>${i + 1}</td><td><strong>${p.food}</strong></td><td>${p.donor}</td><td>${p.qty}</td>
      <td>${p.time}</td><td>${p.volunteer}</td>
      <td><span class="badge ${sc[p.status] || 'badge-available'}">${p.status.replace('-', ' ')}</span></td>
      <td>${p.status !== 'delivered' ? `<button class="btn btn-primary btn-sm" onclick="markDelivered(${p.id})" id="mkdel-${p.id}">Mark Delivered</button>` : '<span style="color:var(--primary);font-weight:600;">✓ Done</span>'}</td>
    </tr>`).join('');
}
function markDelivered(id) {
    const p = acceptedPickups.find(p => p.id === id);
    if (p) { p.status = 'delivered'; renderAccepted(); showToast('Delivery marked complete! 🎉', 'success'); }
}

function renderVolunteers() {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;
    grid.innerHTML = volunteersData.map(v => `
    <div class="volunteer-card">
      <div class="vol-avatar">${v.initial}</div>
      <h4>${v.name}</h4><p>${v.role}</p><p>${v.rating}</p>
      <div class="vol-stats">
        <span class="vol-stat">📦 ${v.pickups} pickups</span>
        <span class="vol-stat"><span class="vol-status ${v.status === 'available' ? 'vs-available' : 'vs-busy'}"></span>${v.status}</span>
      </div>
    </div>`).join('');
}

let ngoChartsInit = false;
function initNgoCharts() {
    if (ngoChartsInit) return; ngoChartsInit = true;
    const pie = document.getElementById('ngoPieChart');
    if (pie) new Chart(pie, { type: 'doughnut', data: { labels: ['Cooked Meals', 'Bakery', 'Fruits', 'Snacks', 'Other'], datasets: [{ data: [52, 18, 12, 10, 8], backgroundColor: ['#2E8B57', '#FF8C00', '#3daa6e', '#e6ac00', '#52c484'], borderWidth: 0 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '60%' } });
    const bar = document.getElementById('ngoBarChart');
    if (bar) new Chart(bar, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Pickups', data: [8, 12, 7, 15, 10, 18, 9], backgroundColor: 'rgba(46,139,87,0.75)', borderRadius: 8 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });
}

function initNgoLineChart() {
    const ctx = document.getElementById('ngoLineChart');
    if (!ctx) return;
    new Chart(ctx, { type: 'line', data: { labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], datasets: [{ label: 'Pickups', data: [32, 45, 38, 60, 52, 48], backgroundColor: 'rgba(46,139,87,0.1)', borderColor: '#2E8B57', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#2E8B57', pointRadius: 5 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } } });
}

function renderNgoAlerts() {
    const list = document.getElementById('ngoAlertList');
    if (!list) return;
    list.innerHTML = ngoAlerts.map(a => `<div class="activity-item"><div class="activity-icon">${a.icon}</div><div class="activity-text"><strong>${a.text}</strong></div><span class="activity-time">${a.time}</span></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('ngoDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    renderNgoAlerts();
    renderNgoFood(ngoFoodData);
    setTimeout(initNgoLineChart, 100);
});
