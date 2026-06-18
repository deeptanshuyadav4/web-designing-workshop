// ============================================================
// oop.js — OOP Demo using ES6 Classes
// Demonstrates: class, constructor, extends, super,
//               method overriding, encapsulation (#private)
// ============================================================

// ══════════════════════════════════════════
// BASE CLASS: Member
// ══════════════════════════════════════════
class Member {
  // Private field — encapsulation: cannot be accessed outside the class
  #joinDate;

  constructor(name, age, plan) {
    // 'this' refers to the new object being created
    this.name  = name;
    this.age   = age;
    this.plan  = plan;
    this.#joinDate = new Date().toLocaleDateString("en-IN");
  }

  // Public method — returns basic member info string
  getInfo() {
    return `Member: ${this.name} | Age: ${this.age} | Plan: ${this.plan}`;
  }

  // Method returning plan-specific details using if-else
  getPlanDetails() {
    if (this.plan === "Basic") {
      return "Gym floor access + 2 group classes/week";
    } else if (this.plan === "Pro") {
      return "Unlimited classes + 1 PT session/month";
    } else {
      return "All Pro benefits + priority booking + guest passes";
    }
  }

  // Getter for private field — the ONLY way to read #joinDate
  getJoinDate() {
    return this.#joinDate;
  }

  // toString override — used when object is converted to string
  toString() {
    return `[Member: ${this.name}, ${this.plan}]`;
  }
}

// ══════════════════════════════════════════
// SUBCLASS: PremiumMember extends Member
// Inheritance: gets all Member properties + methods
// ══════════════════════════════════════════
class PremiumMember extends Member {
  constructor(name, age, ptSessions, nutritionPlan) {
    // super() calls the parent (Member) constructor
    super(name, age, "Pro");
    // Additional properties specific to PremiumMember
    this.ptSessions    = ptSessions;
    this.nutritionPlan = nutritionPlan;
  }

  // METHOD OVERRIDING — replaces Member's getInfo()
  getInfo() {
    // super.getInfo() calls the parent version first
    return `${super.getInfo()} | PT Sessions: ${this.ptSessions}/month | Nutrition: ${this.nutritionPlan}`;
  }

  // New method unique to PremiumMember
  bookPT() {
    if (this.ptSessions > 0) {
      this.ptSessions--;
      return `✅ PT session booked! ${this.ptSessions} session(s) remaining.`;
    }
    return "❌ No PT sessions remaining this month.";
  }
}

// ══════════════════════════════════════════
// SUBCLASS: EliteMember extends PremiumMember
// Multi-level inheritance chain
// ══════════════════════════════════════════
class EliteMember extends PremiumMember {
  constructor(name, age, dedicatedTrainer) {
    // Call PremiumMember constructor
    super(name, age, 4, "Custom Meal Plan");
    this.plan             = "Elite";
    this.guestPasses      = 2;
    this.dedicatedTrainer = dedicatedTrainer;
  }

  // METHOD OVERRIDING again — replaces PremiumMember's getInfo()
  getInfo() {
    return `${super.getInfo()} | Trainer: ${this.dedicatedTrainer} | Guest Passes: ${this.guestPasses}`;
  }

  useGuestPass() {
    if (this.guestPasses > 0) {
      this.guestPasses--;
      return `🎟 Guest pass used! ${this.guestPasses} pass(es) left this month.`;
    }
    return "❌ No guest passes remaining.";
  }
}

// ══════════════════════════════════════════
// CREATE OBJECTS (instances) from each class
// ══════════════════════════════════════════
const basicMember   = new Member("Arjun Mehta",  28, "Basic");
const premiumMember = new PremiumMember("Priya Patel", 22, 2, "Vegetarian Plan");
const eliteMember   = new EliteMember("Rahul Sharma", 24, "Coach Verma");

// ══════════════════════════════════════════
// RENDER results to the DOM
// ══════════════════════════════════════════
function renderCard(title, color, obj, extraLines = []) {
  const base = `
    <div class="obj-card" style="border-color:${color};">
      <div class="label" style="color:${color};">${title}</div>
      <p>Name: <span class="val">${obj.name}</span></p>
      <p>Age: <span class="val">${obj.age}</span></p>
      <p>Plan: <span class="val">${obj.plan}</span></p>
      <p>Joined: <span class="val">${obj.getJoinDate()}</span></p>
      <p>Plan Details: <span class="val" style="font-size:0.8rem;">${obj.getPlanDetails()}</span></p>
      ${extraLines.map(l => `<p>${l}</p>`).join("")}
      <div class="method-result">getInfo() → ${obj.getInfo()}</div>
      <div class="method-result" style="border-color:#636e72; margin-top:4px;">
        instanceof Member → ${obj instanceof Member} &nbsp;|&nbsp;
        typeof → ${typeof obj}
      </div>
    </div>`;
  return base;
}

const output = document.getElementById("oop-output");

output.innerHTML = `
  <!-- Grid: 3 object cards -->
  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin-bottom:24px;">

    <!-- Basic Member object -->
    <div class="card" style="padding:16px;">
      <h3 style="margin-bottom:12px;">new Member(…)</h3>
      ${renderCard("basicMember", "var(--primary)", basicMember)}
    </div>

    <!-- PremiumMember object -->
    <div class="card" style="padding:16px;">
      <h3 style="margin-bottom:12px;">new PremiumMember(…)</h3>
      ${renderCard("premiumMember", "#74b9ff", premiumMember, [
        `PT Sessions: <span class="val">${premiumMember.ptSessions}</span>`,
        `Nutrition: <span class="val">${premiumMember.nutritionPlan}</span>`,
      ])}
      <div class="method-result" style="margin-top:8px; border-color:#74b9ff;">
        bookPT() → ${premiumMember.bookPT()}
      </div>
    </div>

    <!-- EliteMember object -->
    <div class="card" style="padding:16px;">
      <h3 style="margin-bottom:12px;">new EliteMember(…)</h3>
      ${renderCard("eliteMember", "#fdcb6e", eliteMember, [
        `Trainer: <span class="val">${eliteMember.dedicatedTrainer}</span>`,
        `Guest Passes: <span class="val">${eliteMember.guestPasses}</span>`,
      ])}
      <div class="method-result" style="margin-top:8px; border-color:#fdcb6e;">
        useGuestPass() → ${eliteMember.useGuestPass()}
      </div>
    </div>

  </div>

  <!-- instanceof checks -->
  <div class="card">
    <h3>instanceof — Inheritance Chain Verification</h3>
    <div style="font-family:monospace; font-size:0.85rem; line-height:2;">
      <p style="color:var(--muted);">
        <span style="color:#a5d6ff;">eliteMember</span> instanceof EliteMember →
        <span style="color:#00b894; font-weight:700;">${eliteMember instanceof EliteMember}</span>
      </p>
      <p style="color:var(--muted);">
        <span style="color:#a5d6ff;">eliteMember</span> instanceof PremiumMember →
        <span style="color:#00b894; font-weight:700;">${eliteMember instanceof PremiumMember}</span>
      </p>
      <p style="color:var(--muted);">
        <span style="color:#a5d6ff;">eliteMember</span> instanceof Member →
        <span style="color:#00b894; font-weight:700;">${eliteMember instanceof Member}</span>
        &nbsp;<em style="color:var(--muted); font-size:0.78rem;">(true because of multi-level inheritance)</em>
      </p>
      <p style="color:var(--muted);">
        <span style="color:#a5d6ff;">basicMember</span> instanceof EliteMember →
        <span style="color:#e74c3c; font-weight:700;">${basicMember instanceof EliteMember}</span>
      </p>
    </div>
  </div>

  <!-- Encapsulation demo -->
  <div class="card" style="margin-top:20px;">
    <h3>Encapsulation — Private Field #joinDate</h3>
    <p style="color:var(--muted); font-size:0.88rem; margin-bottom:10px;">
      The <code>#joinDate</code> field is private — direct access throws a SyntaxError.
      It can only be read through the public <code>getJoinDate()</code> method.
    </p>
    <div style="font-family:monospace; font-size:0.85rem; line-height:2;">
      <p style="color:var(--muted);">
        basicMember.getJoinDate() →
        <span style="color:#00b894; font-weight:700;">"${basicMember.getJoinDate()}"</span>
        &nbsp;✅ allowed via getter
      </p>
      <p style="color:var(--muted);">
        basicMember.#joinDate →
        <span style="color:#e74c3c; font-weight:700;">SyntaxError</span>
        &nbsp;❌ private field, inaccessible outside class
      </p>
    </div>
  </div>
`;
