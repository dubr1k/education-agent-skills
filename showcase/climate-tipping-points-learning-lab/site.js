const sections = [...document.querySelectorAll(".section")];
const navItems = [...document.querySelectorAll(".nav-item")];
const chatWindow = document.querySelector("#chatWindow");
const toast = document.querySelector("#toast");
const tutorState = {
  step: 0,
  hintLevel: 0
};

const tutorMoves = [
  {
    mode: "Retrieve-first",
    messages: [
      ["tutor", "Before I explain anything, rate your confidence from 0 to 100 and tell me what you already know about the ice-albedo feedback."],
      ["student", "Confidence: 45. Ice reflects sunlight. When ice melts, darker ocean absorbs more heat, which causes more melting."]
    ],
    effect() {
      document.querySelector("#confAfter").textContent = "40";
    }
  },
  {
    mode: "Gap map",
    messages: [
      ["tutor", "Accurate: ice reflects sunlight and darker ocean absorbs more heat. Missing: you have not fully named why this is positive feedback or how it relates to a threshold."],
      ["tutor", "What happens to warming when the darker ocean absorbs more solar energy?"]
    ],
    effect() {
      document.querySelector("#hintStep").classList.add("is-done");
      document.querySelector("#hintLevel").textContent = "1";
      document.querySelector("#kc3").classList.add("ok");
      tutorState.hintLevel = 1;
    }
  },
  {
    mode: "Teach-back",
    messages: [
      ["student", "More absorbed energy causes more warming. More warming melts more ice, so the loop reinforces itself."],
      ["tutor", "Good. Teach it back as if I were younger: variables, causal links, and loop closure."]
    ],
    effect() {
      document.querySelector("#kc4").classList.add("ok");
    }
  },
  {
    mode: "Transfer",
    messages: [
      ["student", "Permafrost example: warming thaws permafrost, thawing releases carbon dioxide and methane, those gases trap more heat, and that causes more warming."],
      ["tutor", "Near transfer passed. Now far transfer: give a reinforcing feedback outside climate."]
    ],
    effect() {
      document.querySelector("#transferStatus").textContent = "Near passed";
      document.querySelector("#kc5").classList.add("ok");
    }
  },
  {
    mode: "Unassisted checkpoint",
    messages: [
      ["tutor", "No hints now. Explain how Amazon forest dieback could become a reinforcing climate feedback. Use variables, causal links, loop closure, and uncertainty language."],
      ["student", "Forest loss reduces rainfall recycling and carbon storage. Drier conditions and carbon release increase stress, fire risk, and warming, which can cause more forest loss. I should say risk increases rather than claiming a definite date."]
    ],
    effect() {
      document.querySelector("#checkStep").classList.add("is-done");
      document.querySelector("#unassistedStatus").textContent = "Strong";
      document.querySelector("#transferStatus").textContent = "Near and far passed";
      document.querySelector("#kc6").classList.add("ok");
    }
  },
  {
    mode: "Evidence summary",
    messages: [
      ["tutor", "Evidence record: recall quality partial, misconception corrected, hint level 1, transfer passed, unassisted Amazon feedback strong. Next teacher move: sharpen threshold graph reasoning."]
    ],
    effect() {
      showToast("Evidence sent to teacher dashboard.");
    }
  }
];

function showSection(id) {
  sections.forEach((section) => section.classList.toggle("is-visible", section.id === id));
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.section === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addMessage(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role === "student" ? "student" : ""}`;
  message.innerHTML = `<strong>${role === "student" ? "Student" : "Tutor"}</strong><p>${text}</p>`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function runTutorMove() {
  const move = tutorMoves[tutorState.step];
  if (!move) {
    showToast("Demo complete. Open the dashboard to inspect the evidence.");
    return;
  }
  document.querySelector("#tutorMode").textContent = move.mode;
  move.messages.forEach(([role, text]) => addMessage(role, text));
  move.effect();
  tutorState.step += 1;
}

function resetTutor() {
  tutorState.step = 0;
  tutorState.hintLevel = 0;
  chatWindow.innerHTML = "";
  document.querySelector("#tutorMode").textContent = "Retrieve-first";
  document.querySelector("#confAfter").textContent = "Pending";
  document.querySelector("#hintLevel").textContent = "0";
  document.querySelector("#transferStatus").textContent = "Pending";
  document.querySelector("#unassistedStatus").textContent = "Pending";
  document.querySelector("#hintStep").classList.remove("is-done");
  document.querySelector("#checkStep").classList.remove("is-done");
  ["#kc3", "#kc4", "#kc5", "#kc6"].forEach((selector) => {
    document.querySelector(selector).classList.remove("ok");
  });
  runTutorMove();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showSection(item.dataset.section));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.jump));
});

document.querySelector("#openDemo").addEventListener("click", () => {
  showSection("tutor");
  resetTutor();
});

document.querySelector("#nextTutorMove").addEventListener("click", runTutorMove);
document.querySelector("#resetTutor").addEventListener("click", resetTutor);

document.querySelector("#copyBrief").addEventListener("click", async () => {
  const brief = "Climate Tipping Points Learning Lab: a teacher-facing AI learning system that combines curriculum design, retrieve-first tutoring, progressive hints, hallucination defence, unassisted checkpoints, and teacher evidence dashboards.";
  try {
    await navigator.clipboard.writeText(brief);
    showToast("Teacher brief copied.");
  } catch {
    showToast("Brief ready: select the overview text to copy.");
  }
});

document.querySelector("#runQa").addEventListener("click", () => {
  document.querySelectorAll("#qaList input").forEach((input) => {
    input.checked = true;
  });
  showToast("QA review passed: all criteria marked excellent.");
});

resetTutor();
