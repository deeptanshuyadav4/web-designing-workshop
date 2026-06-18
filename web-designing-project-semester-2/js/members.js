// ============================================================
// members.js — Membership Manager
// Demonstrates: Array & Object operations, DOM manipulation,
//               Event handling, theme toggle
// ============================================================

// ── Data: array of member objects ──
let members = [
  { id: 1, name: "Rahul Sharma",  age: 24, plan: "Pro"   },
  { id: 2, name: "Priya Patel",   age: 22, plan: "Elite" },
  { id: 3, name: "Arjun Mehta",   age: 28, plan: "Basic" },
  { id: 4, name: "Sneha Gupta",   age: 26, plan: "Pro"   },
  { id: 5, name: "Vikram Singh",  age: 32, plan: "Basic" },
];

let nextId = 6;          // auto-increment id counter
let isDark = true;       // tracks current theme

// ── Event listener: live search as user types ──
document.getElementById("search-name")
  .addEventListener("input", renderTable);

// ── Initial render on page load ──
renderTable();

// ============================================================
// renderTable — reads current filter/search state and
//               re-renders the <tbody> using forEach
// ============================================================
function renderTable() {
  const searchVal  = document.getElementById("search-name").value.trim().toLowerCase();
  const filterPlan = document.getElementById("filter-plan").value;

  // 1. filter() — returns new array matching search + plan
  let visible = members.filter(m => {
    const matchesName = m.name.toLowerCase().includes(searchVal);
    const matchesPlan = (filterPlan === "All") || (m.plan === filterPlan);
    return matchesName && matchesPlan;
  });

  const tbody = document.getElementById("members-body");
  const emptyMsg = document.getElementById("empty-msg");

  if (visible.length === 0) {
    tbody.innerHTML = "";
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    // 2. forEach — iterate to build table rows (DOM manipulation)
    let rows = "";
    visible.forEach((m, index) => {
      rows += `
        <tr>
          <td style="color:var(--muted);">${index + 1}</td>
          <td style="color:var(--text); font-weight:600;">${m.name}</td>
          <td>${m.age}</td>
          <td><span class="badge badge-${m.plan.toLowerCase()}">${m.plan}</span></td>
          <td>
            <button class="remove-btn" onclick="removeMember(${m.id})">Remove</button>
          </td>
        </tr>`;
    });
    tbody.innerHTML = rows;
  }

  // Update count label
  document.getElementById("count-label").textContent =
    `Showing ${visible.length} of ${members.length} members`;

  updateStats();
}

// ============================================================
// addMember — push() a new object onto the array
// ============================================================
function addMember() {
  const nameInput = document.getElementById("m-name");
  const ageInput  = document.getElementById("m-age");
  const planInput = document.getElementById("m-plan");

  const name = nameInput.value.trim();
  const age  = parseInt(ageInput.value);
  const plan = planInput.value;

  // Validation using if-else
  if (!name) {
    alert("Please enter a member name.");
    nameInput.focus();
    return;
  }
  if (!age || age < 10 || age > 80) {
    alert("Please enter a valid age (10–80).");
    ageInput.focus();
    return;
  }

  // push() — add new object to the array
  members.push({ id: nextId++, name, age, plan });

  // Clear inputs
  nameInput.value = "";
  ageInput.value  = "";

  // Re-render DOM to show updated list
  renderTable();
}

// ============================================================
// removeMember — filter() to remove by id
// ============================================================
function removeMember(id) {
  // filter() creates a NEW array excluding the removed member
  members = members.filter(m => m.id !== id);
  renderTable();
}

// ============================================================
// sortBy — sort() array by name or age, then re-render
// ============================================================
function sortBy(field) {
  if (field === "name") {
    // localeCompare for alphabetical sort
    members.sort((a, b) => a.name.localeCompare(b.name));
  } else if (field === "age") {
    // Numeric sort ascending
    members.sort((a, b) => a.age - b.age);
  }
  renderTable();
}

// ============================================================
// clearAll — empty the array, re-render
// ============================================================
function clearAll() {
  if (!confirm("Remove all members? This cannot be undone.")) return;
  members = [];   // reset array to empty
  renderTable();
}

// ============================================================
// updateStats — map() / reduce to compute stat chips
// ============================================================
function updateStats() {
  document.getElementById("stat-total").textContent = members.length;

  // map() each plan count
  const planCounts = { Basic: 0, Pro: 0, Elite: 0 };
  members.forEach(m => planCounts[m.plan]++);

  document.getElementById("stat-basic").textContent = planCounts.Basic;
  document.getElementById("stat-pro").textContent   = planCounts.Pro;
  document.getElementById("stat-elite").textContent = planCounts.Elite;

  // Average age using reduce()
  if (members.length > 0) {
    const totalAge = members.reduce((sum, m) => sum + m.age, 0);
    document.getElementById("stat-avg-age").textContent =
      (totalAge / members.length).toFixed(1);
  } else {
    document.getElementById("stat-avg-age").textContent = "—";
  }
}

// ============================================================
// toggleTheme — DOM manipulation: add/remove class on <body>
//               Event: onclick from the toggle button
// ============================================================
function toggleTheme() {
  isDark = !isDark;
  const btn = document.getElementById("theme-btn");

  if (isDark) {
    document.body.classList.remove("light-theme");
    btn.textContent = "🌙 Dark Mode";
  } else {
    document.body.classList.add("light-theme");
    btn.textContent = "☀️ Light Mode";
  }
}
