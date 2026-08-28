(function () {
  const $ = (id) => document.getElementById(id);

  document.querySelectorAll("nav button").forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll("nav button").forEach((x) => x.classList.remove("on"));
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      $(b.dataset.tab).classList.add("on");
    };
  });

  function say(who, text) {
    const p = document.createElement("p");
    p.innerHTML = "<b>" + who + "</b><br>" + String(text).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
    $("chat-log").appendChild(p);
    $("chat-log").scrollTop = $("chat-log").scrollHeight;
  }

  async function ask(prompt, fallback) {
    if (window.INSAN_BRIDGE) {
      try {
        const found = await window.INSAN_BRIDGE.find();
        if (found && found.health.ai) {
          return await window.INSAN_BRIDGE.chat("study", prompt);
        }
      } catch (e) {
        return "SpaceXAI error: " + e.message + "\n\n" + fallback;
      }
    }
    return fallback + "\n\n(Start INSAN Bridge with XAI_API_KEY for a real model.)";
  }

  function localChat(q) {
    const low = q.toLowerCase();
    if (/quiz/.test(low)) return "Quiz (template): 1) What is the main idea? 2) Give one example. 3) What would go wrong if a part was missing? Hide this screen and answer aloud.";
    if (/translat/.test(low)) return "I can translate when SpaceXAI is on. Paste the line and name the target language.";
    if (/sky blue/.test(low)) return "Short version: air scatters short (blue) wavelengths of sunlight more than long ones, so the sky looks blue in daytime.";
    return "Template reply for “" + q + "”. I will explain in simple words, then give one check-question. Turn on INSAN Bridge for a full answer.";
  }

  say("Assistant", "Hi. No class/board setup. Chat normally, or open Assignments.");

  $("chat-f").onsubmit = async (e) => {
    e.preventDefault();
    const v = $("chat-q").value.trim();
    if (!v) return;
    say("You", v);
    $("chat-q").value = "";
    say("Assistant", "…");
    const text = await ask(v, localChat(v));
    $("chat-log").lastChild.innerHTML = "<b>Assistant</b><br>" + text.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  };

  $("asg-file").onchange = () => {
    const f = $("asg-file").files && $("asg-file").files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      $("asg-text").value = ($("asg-text").value + "\n\n" + reader.result).trim();
    };
    reader.readAsText(f);
  };

  async function runAsg(mode) {
    const body = $("asg-text").value.trim();
    if (!body) {
      $("asg-out").textContent = "Paste the assignment first.";
      return;
    }
    const attempt = $("asg-attempt").value.trim();
    const prompt = {
      explain: "Explain this assignment clearly. Not an official mark scheme.\n\n" + body,
      steps: "Solve step by step. Show reasoning. Student must still write their own final copy.\n\n" + body,
      hint: "Give hints only. Do not dump the full final answer.\n\n" + body,
      check: "Check this student's attempt. Point out mistakes and how to fix them.\n\nAssignment:\n" + body + "\n\nAttempt:\n" + (attempt || "(none)")
    }[mode];
    const fallback = {
      explain: "Explain: name the topic, the question being asked, and the first idea to write.\n\n" + body.slice(0, 400),
      steps: "Step 1: restate the question.\nStep 2: list what you know.\nStep 3: apply one rule.\nStep 4: check units/sense.\n\n" + body.slice(0, 400),
      hint: "Hint: identify the chapter idea first. Do not look up a full key yet.",
      check: attempt ? "Compare your steps to the method in class. Circle any jump in logic." : "Paste your attempt so I can check it."
    }[mode];
    $("asg-out").textContent = "Working…";
    $("asg-out").textContent = await ask(prompt, fallback);
  }
  $("asg-explain").onclick = () => runAsg("explain");
  $("asg-steps").onclick = () => runAsg("steps");
  $("asg-hint").onclick = () => runAsg("hint");
  $("asg-check").onclick = () => runAsg("check");

  let deferred;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    $("btn-install").hidden = false;
  });
  $("btn-install").onclick = () => { if (deferred) deferred.prompt(); };

  (async function () {
    if (!window.INSAN_BRIDGE) {
      $("ai-st").textContent = "Local templates. Run INSAN Bridge for SpaceXAI.";
      return;
    }
    const found = await window.INSAN_BRIDGE.find();
    $("ai-st").textContent = found && found.health.ai
      ? "SpaceXAI connected. Chat like a normal AI."
      : "Bridge offline — templates until you start INSAN Bridge.";
  })();

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
