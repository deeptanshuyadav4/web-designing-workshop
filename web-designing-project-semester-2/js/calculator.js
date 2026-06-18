// ============================================================
// calculator.js — BMI & Fitness Goal Calculator
// Demonstrates: Variables, if-else conditions, for loops
// ============================================================

// ── Workout templates per goal (used by the loop below) ──
const workoutPlans = {
  loss:      ["Treadmill 30 min + Core Circuit",   "Cycling 40 min + Jump Rope",
              "HIIT 30 min + Stretching",           "Swimming 30 min",
              "Kickboxing 45 min",                  "Stair Climber 30 min + Abs",
              "Active Rest: Walk 5 km"],
  muscle:    ["Chest & Triceps (Bench, Dips)",      "Back & Biceps (Rows, Curls)",
              "Legs (Squat, Leg Press, Lunges)",    "Shoulders & Traps (OHP, Shrugs)",
              "Arms & Abs",                         "Full Body Compound Lifts",
              "Active Rest: Light Walk"],
  endurance: ["Long Run 5–8 km",                   "Cycling 60 min (moderate)",
              "Swimming Laps 45 min",               "Rowing Machine 40 min",
              "Interval Run (1 min fast / 1 slow)", "Yoga + Light Jog 30 min",
              "Active Rest: Stretching"],
  maintain:  ["Full Body Circuit Training",         "Yoga & Flexibility 45 min",
              "Cardio Mix (20 min run + 20 cycling)","Strength + Core",
              "Group Fitness Class",                "Outdoor Activity (sport / hike)",
              "Rest & Recovery"],
};

// Day names array — used inside the for loop
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Main calculate function ──
function calculate() {

  // ── 1. VARIABLES: read and parse inputs ──
  const name    = document.getElementById("inp-name").value.trim() || "Friend";
  const height  = parseFloat(document.getElementById("inp-height").value); // cm
  const weight  = parseFloat(document.getElementById("inp-weight").value); // kg
  const age     = parseInt(document.getElementById("inp-age").value);
  const days    = parseInt(document.getElementById("inp-days").value);
  const goal    = document.getElementById("inp-goal").value;

  // Basic validation
  if (!height || !weight || !age || !days || !goal) {
    alert("Please fill in all fields before calculating.");
    return;
  }
  if (days < 1 || days > 7) {
    alert("Workout days must be between 1 and 7.");
    return;
  }

  // ── 2. BMI CALCULATION using variables ──
  const heightM = height / 100;          // convert cm → metres
  const bmi     = weight / (heightM * heightM);  // BMI formula
  const bmiRounded = bmi.toFixed(1);     // round to 1 decimal

  // ── 3. if-else CONDITIONS: classify BMI ──
  let bmiCategory, bmiColor, bmiTagClass, bmiAdvice;

  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor    = "#f39c12";
    bmiTagClass = "tag-underweight";
    bmiAdvice   = "Focus on calorie-dense, nutritious foods and strength training to build mass.";
  } else if (bmi < 25) {
    bmiCategory = "Normal Weight";
    bmiColor    = "#00b894";
    bmiTagClass = "tag-normal";
    bmiAdvice   = "Great job! Maintain your current lifestyle with balanced diet and regular exercise.";
  } else if (bmi < 30) {
    bmiCategory = "Overweight";
    bmiColor    = "#e17055";
    bmiTagClass = "tag-overweight";
    bmiAdvice   = "Incorporate more cardio, reduce refined sugars, and aim for a 500 kcal/day deficit.";
  } else {
    bmiCategory = "Obese";
    bmiColor    = "#e74c3c";
    bmiTagClass = "tag-obese";
    bmiAdvice   = "Consult a doctor before starting. Begin with low-impact cardio and gradual dietary changes.";
  }

  // ── 4. CALORIE CALCULATION using if-else (Mifflin-St Jeor formula) ──
  // BMR = 10×weight + 6.25×height − 5×age + 5  (simplified unisex)
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

  let activityFactor;
  if (days <= 2) {
    activityFactor = 1.375;   // lightly active
  } else if (days <= 4) {
    activityFactor = 1.55;    // moderately active
  } else if (days <= 6) {
    activityFactor = 1.725;   // very active
  } else {
    activityFactor = 1.9;     // extremely active
  }

  const maintenanceCalories = Math.round(bmr * activityFactor);

  // Adjust calorie target based on goal using if-else
  let targetCalories, calorieNote;
  if (goal === "loss") {
    targetCalories = maintenanceCalories - 500;
    calorieNote    = "500 kcal deficit for ~0.5 kg/week weight loss";
  } else if (goal === "muscle") {
    targetCalories = maintenanceCalories + 300;
    calorieNote    = "300 kcal surplus for lean muscle gain";
  } else if (goal === "endurance") {
    targetCalories = maintenanceCalories + 100;
    calorieNote    = "Slight surplus to fuel endurance training";
  } else {
    targetCalories = maintenanceCalories;
    calorieNote    = "Maintenance calories to stay at current weight";
  }

  // ── 5. LOOP: build weekly workout schedule ──
  // For loop iterates from day 0 to (days - 1)
  const plan = workoutPlans[goal];
  let scheduleHTML = '<table style="width:100%; border-collapse:collapse; font-size:0.88rem;">';
  scheduleHTML += '<tr style="background:var(--dark-alt);"><th style="padding:8px; text-align:left; color:var(--primary);">Day</th><th style="padding:8px; text-align:left; color:var(--primary);">Workout</th></tr>';

  for (let i = 0; i < days; i++) {
    // Alternate row background
    const rowBg = (i % 2 === 0) ? "var(--dark)" : "var(--dark-alt)";
    scheduleHTML += `
      <tr style="background:${rowBg};">
        <td style="padding:8px 10px; color:var(--text); font-weight:600;">${dayNames[i]}</td>
        <td style="padding:8px 10px; color:var(--muted);">${plan[i]}</td>
      </tr>`;
  }
  scheduleHTML += '</table>';

  // ── 6. DISPLAY results in the DOM ──
  document.getElementById("bmi-output").innerHTML = `
    <p style="font-size:0.9rem; color:var(--muted); margin-bottom:10px;">Hello, <strong style="color:var(--text);">${name}</strong>!</p>
    <p style="margin-bottom:6px;">
      Your BMI: <span class="highlight">${bmiRounded}</span>
      <span class="tag ${bmiTagClass}">${bmiCategory}</span>
    </p>
    <div style="background:var(--dark); border-radius:6px; height:10px; margin:10px 0; overflow:hidden;">
      <div style="height:100%; width:${Math.min(bmi * 2.5, 100)}%; background:${bmiColor}; border-radius:6px; transition:width 0.5s;"></div>
    </div>
    <p style="font-size:0.85rem; color:var(--muted); line-height:1.6;">${bmiAdvice}</p>
    <p style="font-size:0.78rem; color:var(--muted); margin-top:8px;">
      Scale: &nbsp;
      <span class="tag tag-underweight">&lt;18.5</span>
      <span class="tag tag-normal">18.5–24.9</span>
      <span class="tag tag-overweight">25–29.9</span>
      <span class="tag tag-obese">≥30</span>
    </p>`;

  document.getElementById("calorie-output").innerHTML = `
    <p style="margin-bottom:6px;">
      Maintenance: <span class="highlight">${maintenanceCalories} kcal</span>
    </p>
    <p style="margin-bottom:6px;">
      Your Target: <span class="highlight" style="color:#00b894;">${targetCalories} kcal/day</span>
    </p>
    <p style="font-size:0.82rem; color:var(--muted);">${calorieNote}</p>
    <p style="font-size:0.82rem; color:var(--muted); margin-top:6px;">
      Protein target: <strong style="color:var(--text);">${Math.round(weight * 1.8)}g/day</strong>
      &nbsp;|&nbsp; Water: <strong style="color:var(--text);">${(weight * 0.035).toFixed(1)}L/day</strong>
    </p>`;

  document.getElementById("schedule-output").innerHTML = `
    <p style="font-size:0.82rem; color:var(--muted); margin-bottom:10px;">
      ${days}-day plan for goal: <strong style="color:var(--primary);">${goal}</strong>
    </p>
    ${scheduleHTML}`;

  // Show all result cards
  document.getElementById("result-bmi").style.display      = "block";
  document.getElementById("result-calories").style.display = "block";
  document.getElementById("result-schedule").style.display = "block";
}

// ── Reset function ──
function resetCalc() {
  ["inp-name","inp-height","inp-weight","inp-age","inp-days"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("inp-goal").value = "";
  document.getElementById("result-bmi").style.display      = "none";
  document.getElementById("result-calories").style.display = "none";
  document.getElementById("result-schedule").style.display = "none";
}
