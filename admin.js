/* ===================================================
   admin.js — Admin Dashboard Logic
   =================================================== */

/* ---- DATA ---- */
const donorsData = [
    { id: 1, name: "Ravi's Restaurant", city: 'Mumbai', donations: 47, meals: 1420, last: 'Today', status: 'active' },
    { id: 2, name: 'Grand Palace Hotel', city: 'Delhi', donations: 82, meals: 3100, last: 'Yesterday', status: 'active' },
    { id: 3, name: 'IIT Canteen', city: 'Bengaluru', donations: 35, meals: 890, last: '2 days ago', status: 'active' },
    { id: 4, name: 'Zomato Events', city: 'Hyderabad', donations: 61, meals: 2200, last: 'Today', status: 'active' },
    { id: 5, name: 'Apollo Cafeteria', city: 'Chennai', donations: 28, meals: 740, last: '3 days ago', status: 'inactive' },
    { id: 6, name: 'Event Catering Co.', city: 'Kolkata', donations: 54, meals: 1800, last: 'Today', status: 'active' },
];
const ngosData = [
    { id: 1, name: 'HelpHand NGO', city: 'Bengaluru', pickups: 312, volunteers: 42, reg: 'NGO-KA-2021-8823', status: 'verified' },
    { id: 2, name: 'Asha Foundation', city: 'Mumbai', pickups: 256, volunteers: 38, reg: 'NGO-MH-2019-1122', status: 'verified' },
    { id: 3, name: 'CareFirst NGO', city: 'Delhi', pickups: 189, volunteers: 25, reg: 'NGO-DL-2020-3341', status: 'verified' },
    { id: 4, name: 'MealBridge Delhi', city: 'Delhi', pickups: 142, volunteers: 19, reg: 'NGO-DL-2022-5567', status: 'pending' },
    { id: 5, name: 'FeedIndia Trust', city: 'Chennai', pickups: 98, volunteers: 14, reg: 'NGO-TN-2021-7789', status: 'verified' },
];
const allListings = [
    { id: 1, name: 'Chicken Biryani', donor: "Ravi's Restaurant", qty: '80 srv', city: 'Mumbai', posted: 'Today 3PM', expiry: 'Today 7PM', status: 'available' },
    { id: 2, name: 'Dal & Rice', donor: 'IIT Canteen', qty: '120 srv', city: 'Bengaluru', posted: 'Today 1PM', expiry: 'Today 5PM', status: 'accepted' },
    { id: 3, name: 'Pastries', donor: "Baker's Delight", qty: '60 pcs', city: 'Delhi', posted: 'Yesterday', expiry: 'Yesterday', status: 'expired' },
    { id: 4, name: 'Fruit Platter', donor: 'FreshMart', qty: '25 kg', city: 'Hyderabad', posted: 'Today 12PM', expiry: 'Today 8PM', status: 'available' },
    { id: 5, name: 'Veg Soup', donor: 'Cafe Greens', qty: '50 L', city: 'Bengaluru', posted: 'Today 2PM', expiry: 'Today 6PM', status: 'delivered' },
];

/* ---- SECTION SWITCHING ---- */
const adminSections = {
    'admin-overview': 's-admin-overview',
    'admin-analytics': 's-admin-analytics',
    'admin-donors': 's-admin-donors',
    'admin-ngos': 's-admin-ngos',
    'admin-listings': 's-admin-listings',
    'admin-reports': 's-admin-reports',
    'admin-settings': 's-admin-settings',
};
const adminTitles = {
    'admin-overview': '📊 Admin Dashboard',
    'admin-analytics': '📈 Analytics',
    'admin-donors': '🍽️ Manage Donors',
    'admin-ngos': '🤝 Manage NGOs',
    'admin-listings': '📋 All Listings',
    'admin-reports': '📑 Reports',
    'admin-settings': '🔧 System Settings',
};

function adminShowSection(key) {
    Object.values(adminSections).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(adminSections[key]);
    if (target) target.classList.remove('hidden');
    const title = document.getElementById('adminPageTitle');
    if (title) title.textContent = adminTitles[key] || key;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const idx = Object.keys(adminSections).indexOf(key);
    if (navItems[idx]) navItems[idx].classList.add('active');

    if (key === 'admin-donors' && !document.getElementById('donorsBody').innerHTML) renderDonors();
    if (key === 'admin-ngos' && !document.getElementById('ngosBody').innerHTML) renderNGOs();
    if (key === 'admin-listings' && !document.getElementById('allListingsBody').innerHTML) renderListingsTable();
    if (key === 'admin-analytics') initAnalyticsCharts();
}

/* ---- RENDER DONORS TABLE ---- */
function renderDonors() {
    const tbody = document.getElementById('donorsBody');
    if (!tbody) return;
    tbody.innerHTML = donorsData.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${d.name}</strong></td>
      <td>${d.city}</td>
      <td>${d.donations}</td>
      <td>${d.meals.toLocaleString()}</td>
      <td>${d.last}</td>
      <td><span class="badge ${d.status === 'active' ? 'badge-available' : 'badge-expired'}">${d.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="showToast('Viewing ${d.name}…','info')" id="view-donor-${d.id}">View</button>
        <button class="btn btn-primary btn-sm" style="margin-left:6px;" onclick="showToast('${d.name} — action applied!','success')" id="act-donor-${d.id}">
          ${d.status === 'active' ? 'Suspend' : 'Activate'}
        </button>
      </td>
    </tr>`).join('');
}

/* ---- RENDER NGOS TABLE ---- */
function renderNGOs() {
    const tbody = document.getElementById('ngosBody');
    if (!tbody) return;
    tbody.innerHTML = ngosData.map((n, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${n.name}</strong></td>
      <td>${n.city}</td>
      <td>${n.pickups}</td>
      <td>${n.volunteers}</td>
      <td>${n.reg}</td>
      <td><span class="badge ${n.status === 'verified' ? 'badge-available' : 'badge-accepted'}">${n.status}</span></td>
      <td>
        ${n.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="verifyNgo(${n.id})" id="verify-${n.id}">✅ Verify</button>` : `<button class="btn btn-outline btn-sm" onclick="showToast('${n.name} details…','info')" id="view-ngo-${n.id}">View</button>`}
      </td>
    </tr>`).join('');
}
function verifyNgo(id) {
    const n = ngosData.find(x => x.id === id);
    if (n) { n.status = 'verified'; renderNGOs(); showToast(`${n.name} has been verified! ✅`, 'success'); }
}

/* ---- RENDER ALL LISTINGS TABLE ---- */
function renderListingsTable() {
    const tbody = document.getElementById('allListingsBody');
    if (!tbody) return;
    const sc = { available: 'badge-available', accepted: 'badge-accepted', delivered: 'badge-delivered', expired: 'badge-expired' };
    tbody.innerHTML = allListings.map((l, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${l.name}</strong></td>
      <td>${l.donor}</td>
      <td>${l.qty}</td>
      <td>${l.city}</td>
      <td>${l.posted}</td>
      <td>${l.expiry}</td>
      <td><span class="badge ${sc[l.status] || 'badge-available'}">${l.status}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="removeListing(${l.id})" id="rm-lst-${l.id}">🗑️</button>
      </td>
    </tr>`).join('');
}
function removeListing(id) {
    const idx = allListings.findIndex(l => l.id === id);
    if (idx !== -1) { allListings.splice(idx, 1); renderListingsTable(); showToast('Listing removed.', 'warning'); }
}

/* ---- ADMIN CHARTS ---- */
let adminChartsInit = false;
function initAdminCharts() {
    if (adminChartsInit) return;
    adminChartsInit = true;

    /* Line Chart */
    const lineCtx = document.getElementById('adminLineChart');
    if (lineCtx) new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{
                label: 'Meals Rescued',
                data: [3200, 4100, 5800, 7200, 8900, 9400, 10100, 11800, 12600, 13900, 15200, 18400],
                fill: true,
                backgroundColor: 'rgba(46,139,87,0.1)',
                borderColor: '#2E8B57',
                borderWidth: 2.5,
                tension: 0.4,
                pointBackgroundColor: '#2E8B57',
                pointRadius: 4,
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } }
    });

    /* Pie Chart */
    const pieCtx = document.getElementById('adminPieChart');
    if (pieCtx) new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Cooked Meals', 'Bakery Items', 'Fruits & Veg', 'Snacks', 'Packaged', 'Dairy'],
            datasets: [{ data: [42, 18, 15, 12, 8, 5], backgroundColor: ['#2E8B57', '#FF8C00', '#3daa6e', '#e6ac00', '#52c484', '#ffaa33'], borderWidth: 0 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }, cutout: '55%' }
    });

    /* Bar Chart */
    const barCtx = document.getElementById('adminBarChart');
    if (barCtx) new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
            datasets: [{
                label: 'Meals Rescued',
                data: [28400, 22100, 19800, 14600, 12300, 10800, 8400, 6200, 4100, 2800],
                backgroundColor: ['#2E8B57', '#3daa6e', '#52c484', '#68d494', '#FF8C00', '#ffaa33', '#2E8B57', '#3daa6e', '#52c484', '#68d494'],
                borderRadius: 8,
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' } }, x: { grid: { display: false } } } }
    });
}

/* ---- ANALYTICS CHARTS ---- */
let analyticsInit = false;
function initAnalyticsCharts() {
    if (analyticsInit) return;
    analyticsInit = true;
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

    const al = document.getElementById('analyticsLineChart');
    if (al) new Chart(al, { type: 'line', data: { labels: months, datasets: [{ label: 'Active Donors', data: [80, 110, 140, 185, 210, 245, 280, 310, 322, 330, 336, 340], fill: true, backgroundColor: 'rgba(255,140,0,0.1)', borderColor: '#FF8C00', borderWidth: 2.5, tension: 0.4, pointRadius: 4 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });

    const an = document.getElementById('analyticsNgoChart');
    if (an) new Chart(an, { type: 'line', data: { labels: months, datasets: [{ label: 'NGOs', data: [20, 28, 36, 48, 58, 65, 72, 78, 82, 85, 87, 89], fill: true, backgroundColor: 'rgba(46,139,87,0.1)', borderColor: '#2E8B57', borderWidth: 2.5, tension: 0.4, pointRadius: 4 }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });

    const ad = document.getElementById('analyticsDvDChart');
    if (ad) new Chart(ad, { type: 'bar', data: { labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], datasets: [{ label: 'Donations', data: [480, 560, 620, 710, 790, 860], backgroundColor: 'rgba(46,139,87,0.7)', borderRadius: 6 }, { label: 'Delivered', data: [440, 530, 590, 680, 750, 820], backgroundColor: 'rgba(255,140,0,0.7)', borderRadius: 6 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } } });

    const aw = document.getElementById('analyticsWasteChart');
    if (aw) new Chart(aw, { type: 'doughnut', data: { labels: ['Saved from Waste', 'Expired (Unavoidable)'], datasets: [{ data: [94, 6], backgroundColor: ['#2E8B57', '#e74c3c'], borderWidth: 0 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '60%' } });
}

/* ---- TABLE FILTER ---- */
function filterAdminTable(inputId, tbodyId) {
    const q = (document.getElementById(inputId)?.value || '').toLowerCase();
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach(r => { r.style.display = !q || r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
}

/* ---- DATE ---- */
function setAdminDate() {
    const el = document.getElementById('adminDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---- URGENT FLAGS CSS (injected) ---- */
function injectUrgentStyle() {
    const style = document.createElement('style');
    style.textContent = `.urgent-flag { position:absolute; top:10px; right:10px; background:#e74c3c; color:#fff; font-size:0.7rem; font-weight:700; padding:3px 9px; border-radius:9999px; letter-spacing:0.5px; }`;
    document.head.appendChild(style);
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
    setAdminDate();
    injectUrgentStyle();
    setTimeout(initAdminCharts, 150);
});
