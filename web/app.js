(function () {
  const LANGS = ["English","Hindi","Punjabi","Spanish","French","German","Arabic","Chinese","Japanese","Korean","Russian","Portuguese","Bengali","Tamil","Telugu","Marathi","Gujarati","Urdu"];
  const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","Computer Science","English","Social Science","History","Geography","Economics","Business Studies","Accountancy","General Knowledge"];

  const $ = (id) => document.getElementById(id);
  const profile = JSON.parse(localStorage.getItem("asa-profile") || "{}");

  LANGS.forEach((l) => {
    const o = document.createElement("option");
    o.value = o.textContent = l;
    if ((profile.lang || "English") === l) o.selected = true;
    $("lang").appendChild(o);
  });
  SUBJECTS.forEach((s) => {
    const o = document.createElement("option");
    o.value = o.textContent = s;
    if ((profile.subject || "Mathematics") === s) o.selected = true;
    $("subject").appendChild(o);
  });
  $("country").value = profile.country || "India";
  $("board").value = profile.board || "CBSE";
  $("grade").value = profile.grade || "10";
  $("level").value = profile.level || "School";

  document.querySelectorAll("nav button").forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll("nav button").forEach((x) => x.classList.remove("on"));
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      $(b.dataset.tab).classList.add("on");
    };
  });

  function ctx() {
    return {
      lang: $("lang").value,
      country: $("country").value || "your country",
      board: $("board").value || "your board",
      grade: $("grade").value || "your grade",
      subject: $("subject").value,
      level: $("level").value,
    };
  }

  $("save-profile").onclick = () => {
    const p = ctx();
    localStorage.setItem("asa-profile", JSON.stringify(p));
    $("profile-msg").textContent = "Profile saved on this device.";
  };

  function explain(topic) {
    const c = ctx();
    const t = topic.trim() || c.subject;
    return (
      "AI Study Assistant — study outline (template, not a language model)\n\n" +
      "Topic: " + t + "\n" +
      "For: " + c.grade + " · " + c.board + " · " + c.country + " · " + c.subject + " · " + c.level + "\n" +
      "Language preference: " + c.lang + "\n\n" +
      "1) Simple idea\n" +
      "Think of “" + t + "” as one main question: what is changing, and why does it matter in " + c.subject + "?\n\n" +
      "2) School-level picture\n" +
      "Break it into parts you can name. For each part, say what it does in one sentence. Use " + c.board + " terms if you know them.\n\n" +
      "3) Check you understood\n" +
      "• Can you teach this to a friend in " + c.lang + " without the book?\n" +
      "• What would go wrong if one part was missing?\n\n" +
      "4) Next step\n" +
      "Open Practice and generate questions on this topic. This is guidance, not an official exam paper.\n\n" +
      "Tip: write what you still don’t get in Notes, then ask again with that doubt."
    );
  }

  function quiz(topic) {
    const t = topic.trim() || ctx().subject;
    const c = ctx();
    return (
      "Practice set — " + t + " (" + c.level + ", " + c.board + " " + c.grade + ")\n" +
      "Practice material only — not an official paper.\n\n" +
      "Q1. In one sentence, what is " + t + "?\n" +
      "Q2. Name two parts or steps inside it.\n" +
      "Q3. Give one everyday example that fits " + c.country + " life.\n" +
      "Q4. What mistake do students often make here?\n" +
      "Q5. Write a 4-line answer as if this is a " + c.board + " exam.\n\n" +
      "Self-check: hide this screen and answer aloud in " + c.lang + "."
    );
  }

  function draft(type, title) {
    const c = ctx();
    const t = title.trim() || type;
    return (
      type + " draft — " + t + "\n" +
      "Style: academic / " + c.level + " · " + c.lang + "\n\n" +
      "Title: " + t + "\n\n" +
      "Introduction\nState the topic and why a " + c.grade + " " + c.subject + " student should care.\n\n" +
      "Body\nParagraph 1: definition / main idea.\nParagraph 2: how it works or why it happens.\nParagraph 3: example + one counterpoint.\n\n" +
      "Conclusion\nRestate the idea in simpler words. One sentence on what to revise next.\n\n" +
      "Edit this draft in your own words so it is honestly yours."
    );
  }

  $("go-study").onclick = () => { $("study-out").textContent = explain($("topic").value); };
  $("go-quiz").onclick = () => { $("quiz-out").textContent = quiz($("quiz-topic").value); };
  $("go-write").onclick = () => { $("write-out").textContent = draft($("doc-type").value, $("doc-title").value); };

  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("asa-notes") || "[]");
    $("notes-out").textContent = notes.length ? notes.join("\n\n") : "No notes yet.";
  }
  $("go-note").onclick = () => {
    const t = $("note-in").value.trim();
    if (!t) return;
    const notes = JSON.parse(localStorage.getItem("asa-notes") || "[]");
    notes.unshift(new Date().toLocaleString() + "\n" + t);
    localStorage.setItem("asa-notes", JSON.stringify(notes.slice(0, 40)));
    $("note-in").value = "";
    loadNotes();
  };
  loadNotes();

  let deferred;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    $("btn-install").hidden = false;
  });
  $("btn-install").onclick = async () => {
    if (!deferred) return;
    deferred.prompt();
    deferred = null;
    $("btn-install").hidden = true;
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
