/* KASSIO 2.0 — comportements de la page (aucune dépendance externe, aucune donnée envoyée). */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const attendre = ms => new Promise(r => setTimeout(r, calme ? Math.min(ms, 60) : ms));

  /* ---------- Contact : un message WhatsApp par point d'entrée ---------- */
  const WHATSAPP = "2250789263373";
  const LINKEDIN = "https://www.linkedin.com/in/mr-kassio-6190331b1";
  const MSG = {
    site: "Bonjour Kassio, j'ai vu votre site. J'aimerais parler d'un projet pour mon entreprise.",
    diag: "Bonjour Kassio, j'aimerais un diagnostic offert de 30 minutes. Mon entreprise : … Ce que je veux améliorer : …",
    devis: "Bonjour Kassio, j'aimerais un devis. Mon entreprise : … Ce que je veux améliorer : …",
    demo: "Bonjour Kassio, j'ai testé la démo WhatsApp. Je veux un agent comme ça pour mon entreprise.",
    "demo-pr": "Bonjour Kassio, j'ai testé la démo de prospection. J'aimerais en parler pour mon entreprise.",
    "demo-wf": "Bonjour Kassio, j'ai testé la démo de workflow. J'ai des tâches répétées à automatiser.",
    wa: "Bonjour Kassio, j'ai vu l'exemple de l'agent WhatsApp 24 h/24. Je veux le même pour mon entreprise.",
    pros: "Bonjour Kassio, j'ai vu l'exemple des agents de prospection. J'aimerais en parler pour mon entreprise.",
    bi: "Bonjour Kassio, j'ai vu l'exemple de tableau de bord Power BI. J'aimerais le même pour suivre mon activité.",
    site2: "Bonjour Kassio, j'ai vu l'exemple de site avec assistant WhatsApp. J'aimerais le même pour mon entreprise.",
    erp: "Bonjour Kassio, j'ai vu l'exemple d'ERP sur mesure. J'aimerais en parler pour mon entreprise.",
    n8n: "Bonjour Kassio, j'ai vu l'exemple de relance automatique. J'ai des tâches répétées à automatiser."
  };
  const waLien = k => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG[k] || MSG.site)}`;
  $$("[data-wa]").forEach(a => a.href = waLien(a.dataset.wa));
  ["li", "li-f"].forEach(id => { const a = document.getElementById(id); if (a) a.href = LINKEDIN; });
  const cp = $("#copier");
  if (cp) cp.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("+" + WHATSAPP); cp.textContent = "Copié"; }
    catch (_) { const s = getSelection(), r = document.createRange(); r.selectNodeContents($("#wa-num")); s.removeAllRanges(); s.addRange(r); }
  });

  /* ---------- Navigation ---------- */
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 8), { passive: true });
  const solB = $("#sol-b"), solM = $("#sol-m");
  const menu = ouvert => { solB.setAttribute("aria-expanded", ouvert); solM.classList.toggle("open", ouvert); };
  solB.addEventListener("click", e => { e.stopPropagation(); menu(solB.getAttribute("aria-expanded") !== "true"); });
  solM.addEventListener("click", e => { if (e.target.closest("a")) menu(false); });
  document.addEventListener("click", e => { if (!e.target.closest(".nav-l > li")) menu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { menu(false); fermerPanel(); } });
  // panneau mobile plein écran
  const pm = $("#panel-m"), bg = $("#burger");
  function ouvrirPanel() { pm.classList.add("open"); bg.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("#pm-x").focus(); }
  function fermerPanel() { if (!pm.classList.contains("open")) return; pm.classList.remove("open"); bg.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; bg.focus(); }
  bg.addEventListener("click", ouvrirPanel);
  $("#pm-x").addEventListener("click", fermerPanel);
  $$("[data-pm]", pm).forEach(a => a.addEventListener("click", fermerPanel));
  pm.addEventListener("keydown", e => {            // focus maintenu dans le panneau
    if (e.key !== "Tab") return;
    const f = $$("a,button", pm), a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  /* ---------- Apparition au défilement ---------- */
  if ("IntersectionObserver" in window && !calme) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
  } else $$(".rv").forEach(el => el.classList.add("vu"));

  /* ---------- Intelligence Hub (illustratif) ---------- */
  const LOG = [
    ["21:42", "#16A34A", "Accueil · commande de 40 m² de carrelage enregistrée"],
    ["21:43", "#3478F6", "CRM · fiche client créée, objection « prix » notée"],
    ["21:47", "#55D6D0", "ERP · stock réservé, bon de livraison préparé"],
    ["22:05", "#16A34A", "Accueil · question technique transférée au gérant"],
    ["06:30", "#0E9F97", "Rapports · ventes d'hier : +8 %, alerte stock peinture"],
    ["08:59", "#3478F6", "Prospection · 3 entreprises qualifiées, messages à valider"],
    ["10:00", "#7C5CE0", "Admin · 4 devis relancés, 2 factures prêtes"]
  ];
  const ol = $("#hub-log");
  if (ol) {
    let i = 0;
    const ajout = () => {
      const [t, c, x] = LOG[i % LOG.length]; i++;
      const li = document.createElement("li");
      li.innerHTML = `<time>${t}</time><i style="--c:${c}"></i><span></span>`; li.lastChild.textContent = x;
      ol.appendChild(li); while (ol.children.length > 5) ol.firstChild.remove();
    };
    for (let k = 0; k < 4; k++) ajout();
    if (!calme) setInterval(ajout, 2600);
    const f = $$("#hub-f span:not(.ar)"); let j = 0;
    const pas = () => { f.forEach((s, k) => s.classList.toggle("on", k === j)); j = (j + 1) % f.length; };
    pas(); if (!calme) setInterval(pas, 1300);
  }

  /* ---------- Journaux des cartes agents ---------- */
  $$(".ag .log").forEach((el, k) => {
    const l = el.dataset.log.split("|"); let i = 0;
    const w = () => { el.textContent = l.slice(0, i + 1).slice(-2).join("\n"); i = (i + 1) % l.length; };
    w(); if (!calme) setInterval(w, 2800 + k * 400);
  });

  /* ---------- Demo Studio : onglets ---------- */
  const tabs = $$('.tabs [role="tab"]');
  function choisir(t) {
    tabs.forEach(b => { const on = b === t; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; document.getElementById(b.getAttribute("aria-controls")).hidden = !on; });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => choisir(t));
    t.addEventListener("keydown", e => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length]; choisir(n); n.focus();
    });
  });
  const heure = (() => { let m = 12; return () => `21:${String(m++ % 60).padStart(2, "0")}`; })();
  const journal = (ol, txt, t) => { const li = document.createElement("li"); li.innerHTML = `<span>${t || heure().slice(0, 5)}</span><span></span>`; li.lastChild.textContent = txt; ol.prepend(li); };

  /* ---------- Démo WhatsApp : machine à états ---------- */
  const fil = $("#fil"), choixEl = $("#wa-choix"), jr = $("#journal"), lab = $("#wa-lab");
  const ETATS = {
    debut: { choix: [["stock", "Vous avez du carrelage 60×60 gris ?"], ["prix", "C'est combien le sac de ciment ?"], ["tech", "Quel joint pour une douche à l'italienne ?"]] },
    stock: { r: "Bonsoir ! Oui, 46 m² en stock à 7 500 FCFA le m². Combien de m² vous faut-il ?", crm: { client: "Nouveau client · WhatsApp", besoin: "Carrelage 60×60 gris", score: 35 }, log: "Stock vérifié : 46 m² disponibles", choix: [["qte", "Il me faut 40 m², livré à Cocody."]] },
    prix: { r: "Le sac de ciment 50 kg est à 5 200 FCFA. À partir de 20 sacs : 4 950 FCFA. Combien vous en faut-il ?", crm: { client: "Nouveau client · WhatsApp", besoin: "Ciment 50 kg", score: 30 }, log: "Tarif dégressif proposé", choix: [["qte2", "12 sacs, livrés à Yopougon demain."]] },
    tech: { r: "Bonne question. Je préfère que le gérant vous réponde précisément : je lui transmets votre demande, il vous rappelle avant 9 h demain.", crm: { client: "Nouveau client · WhatsApp", besoin: "Conseil technique · douche", score: 25, humain: true }, log: "Transfert au gérant : question technique", choix: [["fin-h", "D'accord, merci."]] },
    qte: { r: "Parfait. 40 m² = 300 000 FCFA. Livraison à Cocody demain avant 12 h : 10 000 FCFA. Je vous réserve le stock ?", crm: { qte: "40 m²", zone: "Cocody · demain matin", score: 60 }, log: "Devis calculé : 310 000 FCFA", choix: [["cher", "C'est un peu cher…"], ["ok", "D'accord, je prends."]] },
    qte2: { r: "Noté : 12 sacs = 62 400 FCFA, livrés demain à Yopougon. Paiement Wave ou à la livraison. Je confirme ?", crm: { qte: "12 sacs", zone: "Yopougon · demain", score: 70 }, log: "Devis calculé : 62 400 FCFA", choix: [["ok2", "Oui, je confirme."]] },
    cher: { r: "Je comprends. Dès 40 m², je peux vous offrir la livraison : 300 000 FCFA tout compris. Ça vous convient ?", crm: { obj: "prix", score: 78 }, log: "Objection « prix » levée : livraison offerte", choix: [["ok", "D'accord, je prends."]] },
    ok: { r: "Merci ! Commande enregistrée : 40 m² de carrelage 60×60 gris, livrés demain à Cocody. Le gérant vous confirme ce soir. ✅", crm: { vendu: true, score: 95 }, log: "Commande créée · stock réservé dans l'ERP", fin: true },
    ok2: { r: "C'est enregistré ✅ Le livreur vous appelle demain matin. Merci pour votre confiance !", crm: { vendu: true, score: 92 }, log: "Commande créée · livraison planifiée", fin: true },
    "fin-h": { r: "Avec plaisir. Bonne soirée !", crm: {}, log: "Rappel programmé pour le gérant · 08:30", fin: true }
  };
  let occupe = false;
  function bulle(cls, html) { const d = document.createElement("div"); d.className = "m " + cls; d.innerHTML = html; fil.appendChild(d); fil.scrollTop = fil.scrollHeight; return d; }
  function champ(id, v) { const c = document.getElementById(id); c.classList.remove("vide"); c.querySelector("b").textContent = v; c.classList.add("flash"); setTimeout(() => c.classList.remove("flash"), 900); }
  function pill(t, cls) { const p = document.createElement("span"); p.className = "pill " + (cls || ""); p.textContent = t; $("#pills").appendChild(p); }
  function majCRM(c) {
    if (c.client) { champ("c-client", c.client); $("#crm-etat").textContent = "synchronisée"; }
    if (c.besoin) champ("c-besoin", c.besoin);
    if (c.qte) champ("c-qte", c.qte);
    if (c.zone) champ("c-zone", c.zone);
    if (c.obj) { champ("c-obj", "Levées par l'agent :"); pill(c.obj); }
    if (c.humain) { champ("c-obj", "Transféré à un humain"); pill("gérant", "hu"); $("#wa-etat").textContent = "Transféré au gérant"; $("#wa-etat").classList.add("hum"); }
    if (c.vendu) { champ("c-obj", $("#pills").children.length ? "Levées par l'agent :" : "Aucune"); pill("vendu", "ok"); $("#crm-etat").textContent = "commande créée"; }
    if (c.score) { $("#score-t").textContent = c.score + " %"; $("#score-b").style.width = c.score + "%"; }
  }
  function afficherChoix(k) {
    choixEl.innerHTML = "";
    const e = ETATS[k];
    if (e.fin) {
      lab.textContent = e.crm && e.crm.vendu ? "Vente conclue par l'agent. À vous ?" : "Le gérant reprend la main. À vous ?";
      const a = document.createElement("a"); a.className = "chip go"; a.href = waLien("demo"); a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = 'Avoir cet agent sur mon numéro <span aria-hidden="true">→</span>'; choixEl.appendChild(a);
      const b = document.createElement("button"); b.type = "button"; b.className = "chip ghost"; b.textContent = "Essayer un autre scénario"; b.onclick = resetWA; choixEl.appendChild(b);
      return;
    }
    lab.textContent = k === "debut" ? "Choisissez un scénario client" : "Répondez comme le client";
    e.choix.forEach(([cle, txt]) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = txt; b.onclick = () => envoyer(cle, txt); choixEl.appendChild(b); });
  }
  async function envoyer(cle, txt) {
    if (occupe) return; occupe = true;
    $$("button", choixEl).forEach(b => b.disabled = true);
    bulle("in", `<span></span><time>${heure()}</time>`).firstChild.textContent = txt;
    const t = bulle("out typing", "<i></i><i></i><i></i>");
    await attendre(900);
    t.remove();
    const e = ETATS[cle];
    bulle("out", `<span></span><time>${heure()}</time>`).firstChild.textContent = e.r;
    if (e.crm && e.crm.humain) bulle("sys", "Conversation transférée à un humain · le gérant est notifié");
    majCRM(e.crm || {}); journal(jr, e.log);
    occupe = false; afficherChoix(cle);
  }
  function resetWA() {
    fil.innerHTML = ""; jr.innerHTML = ""; $("#pills").innerHTML = "";
    ["c-client", "c-besoin", "c-qte", "c-zone"].forEach(id => { const c = document.getElementById(id); c.classList.add("vide"); c.querySelector("b").textContent = "—"; });
    $("#c-obj").querySelector("b").textContent = "Aucune pour l'instant";
    $("#score-t").textContent = "—"; $("#score-b").style.width = "0";
    $("#crm-etat").textContent = "en attente"; $("#wa-etat").textContent = "Agent Kassio · répond"; $("#wa-etat").classList.remove("hum");
    bulle("sys", "Démo locale · Quincaillerie du Boulevard (fictive) · 21:11");
    afficherChoix("debut");
  }
  $("#wa-reset").addEventListener("click", resetWA);
  resetWA();

  /* ---------- Démo Prospection ---------- */
  const CIBLES = [
    { n: "Pharmacie Les Lauriers", m: "Cocody · pharmacie · 2 points de vente", fit: "9/10", why: "ouvre une 2e officine", msg: "Bonjour Docteur Aka, félicitations pour la nouvelle officine. Avec deux adresses, comment suivez-vous aujourd'hui les demandes de disponibilité envoyées sur WhatsApp ?" },
    { n: "Garage Auto Plus", m: "Marcory · garage · 8 employés", fit: "8/10", why: "beaucoup de devis par téléphone", msg: "Bonjour M. Traoré, vos clients demandent souvent un devis avant de passer. Combien de ces devis sont relancés aujourd'hui, et par qui ?" },
    { n: "Traiteur Saveurs d'Ici", m: "Riviera · traiteur · commandes WhatsApp", fit: "8/10", why: "commandes surtout le soir", msg: "Bonjour Madame Bamba, beaucoup de commandes de traiteur arrivent le soir. Que devient une demande reçue à 22 h quand l'équipe est partie ?" }
  ];
  const cibles = $("#cibles"), prJ = $("#pr-j");
  let prEnCours = false, valides = 0;
  $("#pr-go").addEventListener("click", async () => {
    if (prEnCours) return; prEnCours = true; $("#pr-go").disabled = true;
    cibles.innerHTML = ""; valides = 0; $("#pr-v").textContent = "0";
    journal(prJ, "Recherche : commerces et PME, Abidjan", "08:57");
    for (let i = 0; i < CIBLES.length; i++) {
      await attendre(700);
      const c = CIBLES[i], el = document.createElement("article"); el.className = "cible";
      el.innerHTML = `<b></b><span class="fit">FIT ${c.fit}</span><span class="meta"></span><div class="msg"></div><div class="act"><button type="button" class="chip" data-v>Valider · je l'envoie</button><button type="button" class="chip ghost" data-r>Écarter</button></div>`;
      el.querySelector("b").textContent = c.n; el.querySelector(".meta").textContent = `${c.m} · accroche : ${c.why}`; el.querySelector(".msg").textContent = c.msg;
      cibles.appendChild(el); $("#pr-q").textContent = i + 1;
      journal(prJ, `Qualifiée : ${c.n} (${c.fit})`, ["08:58", "08:59", "09:00"][i]);
    }
    journal(prJ, "3 messages prêts à valider", "09:01");
    prEnCours = false;
  });
  cibles.addEventListener("click", e => {
    const v = e.target.closest("[data-v]"), r = e.target.closest("[data-r]"); if (!v && !r) return;
    const c = e.target.closest(".cible"), nom = c.querySelector("b").textContent, act = c.querySelector(".act");
    act.innerHTML = v ? '<span class="etat">✓ validé · à envoyer par vous · relance programmée J+4</span>' : '<span class="etat" style="color:var(--n-muted)">écartée · ne sera plus proposée</span>';
    if (v) { valides++; $("#pr-v").textContent = valides; }
    journal(prJ, v ? `Validé : ${nom} · relance J+4` : `Écartée : ${nom}`, "09:1" + (prJ.children.length % 10));
    if (valides && !$(".cible .act button") && !$("#pr-cta")) {
      const a = document.createElement("a"); a.id = "pr-cta"; a.className = "chip go"; a.href = waLien("demo-pr"); a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = 'Avoir cet agent pour ma prospection <span aria-hidden="true">→</span>'; a.style.alignSelf = "flex-start"; cibles.appendChild(a);
    }
  });
  $("#pr-reset").addEventListener("click", () => {
    cibles.innerHTML = '<div class="vide-st">Lancez la recherche : l\'agent trouve 3 entreprises, explique pourquoi, et prépare un message pour chacune.</div>';
    prJ.innerHTML = ""; $("#pr-q").textContent = "0"; $("#pr-v").textContent = "0"; $("#pr-go").disabled = false; prEnCours = false;
  });

  /* ---------- Démo Workflow ---------- */
  const etapes = $$("#wf .s"), wfJ = $("#wf-j");
  const DUREES = ["0,4 s", "0,2 s", "1,1 s", "en attente", "0,3 s"];
  let wfEnCours = false;
  $("#wf-go").addEventListener("click", async () => {
    if (wfEnCours) return; wfEnCours = true; const go = $("#wf-go"); go.disabled = true;
    etapes.forEach(s => { s.classList.remove("fait", "cours"); s.querySelector(".d").textContent = "—"; });
    wfJ.innerHTML = ""; $("#wf-etat").textContent = "en cours"; $("#wf-e").textContent = "0"; $("#wf-t").textContent = "…";
    journal(wfJ, "Déclenchement planifié · 08:00", "08:00");
    for (let i = 0; i < etapes.length; i++) {
      const s = etapes[i]; s.classList.add("cours");
      if (i === 3) {
        $("#wf-etat").textContent = "attend votre validation";
        go.disabled = false; go.textContent = "Valider les 2 relances";
        await new Promise(r => go.addEventListener("click", r, { once: true }));
        go.disabled = true; go.textContent = "Exécuter le workflow"; $("#wf-etat").textContent = "en cours";
        s.querySelector(".d").textContent = "validé";
        journal(wfJ, "Relances validées par le gérant", "08:12");
      } else {
        await attendre(750);
        s.querySelector(".d").textContent = DUREES[i];
        journal(wfJ, s.querySelector("b").textContent, ["08:01", "08:02", "08:03", "", "08:13"][i]);
      }
      s.classList.remove("cours"); s.classList.add("fait");
    }
    $("#wf-t").textContent = "2,0 s + validation"; $("#wf-etat").textContent = "terminé";
    journal(wfJ, "Terminé · 2 devis relancés, rappel J+7", "08:13");
    go.disabled = false; go.textContent = "Rejouer le workflow";
    if (!$("#wf-cta")) { const a = document.createElement("a"); a.id = "wf-cta"; a.className = "chip go"; a.href = waLien("demo-wf"); a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = 'Automatiser un de mes processus <span aria-hidden="true">→</span>'; go.after(a); }
    wfEnCours = false;
  });
  $("#wf-reset").addEventListener("click", () => {
    if (wfEnCours) return;
    etapes.forEach(s => { s.classList.remove("fait", "cours"); s.querySelector(".d").textContent = "—"; });
    wfJ.innerHTML = ""; $("#wf-etat").textContent = "prête"; $("#wf-t").textContent = "—"; $("#wf-e").textContent = "—";
    $("#wf-go").textContent = "Exécuter le workflow"; const a = $("#wf-cta"); if (a) a.remove();
  });

  /* ---------- Fenêtres d'exemple ---------- */
  const INFO = {
    wa: ["Agent WhatsApp 24 h/24", "Le rapport que vous recevez chaque lundi"],
    pros: ["Agents de prospection", "La prospection du jour, prête à envoyer"],
    bi: ["Tableaux de bord Power BI", "Ce que vous voyez sur votre téléphone le matin"],
    site: ["Site avec assistant WhatsApp", "Un site et son assistant"],
    erp: ["ERP sur mesure", "Le suivi des commandes, du stock et des factures"],
    n8n: ["Relance automatique des devis", "Une automatisation, étape par étape"]
  };
  const ORDRE = Object.keys(INFO);
  const ico = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const dlg = $("#ex"), body = $("#ex-b"), fixe = $("#wa-fixe");
  let dernier = null;
  function ouvrir(k, bouton) {
    if (!INFO[k]) return;
    if (bouton) dernier = bouton;
    $("#ex-t").textContent = INFO[k][0]; $("#ex-s").textContent = INFO[k][1];
    body.innerHTML = ""; body.appendChild(document.getElementById("t-" + k).content.cloneNode(true));
    const suiv = ORDRE[(ORDRE.indexOf(k) + 1) % ORDRE.length];
    const cta = document.createElement("div"); cta.className = "ex-cta";
    cta.innerHTML = `<a class="btn btn-w" target="_blank" rel="noopener" href="${waLien(k === "site" ? "site2" : k)}">${ico("msg")}Je veux ça pour mon entreprise</a>`
      + `<button type="button" class="btn btn-s" data-suiv="${suiv}">Exemple suivant ${ico("arrow")}</button>`
      + `<button type="button" class="lien" data-copie>Copier le lien de cet exemple</button>`;
    body.appendChild(cta); body.scrollTop = 0;
    try { history.replaceState(null, "", "#exemple-" + k); } catch (_) {}
    if (!dlg.open) dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    fixe.classList.remove("on");
  }
  const fermer = () => dlg.close ? dlg.close() : dlg.removeAttribute("open");
  $$("[data-ex]").forEach(b => b.addEventListener("click", () => ouvrir(b.dataset.ex, b)));
  $("#ex-x").addEventListener("click", fermer);
  dlg.addEventListener("click", async e => {
    if (e.target === dlg) return fermer();
    const s = e.target.closest("[data-suiv]"); if (s) return ouvrir(s.dataset.suiv);
    const c = e.target.closest("[data-copie]");
    if (c) { const url = location.href; try { await navigator.clipboard.writeText(url); c.textContent = "Lien copié"; } catch (_) { c.textContent = url; } }
  });
  dlg.addEventListener("close", () => {
    try { if (/^#exemple-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#solutions"); } catch (_) {}
    if (dernier) dernier.focus();
  });
  const depuisLien = () => { const m = location.hash.match(/^#exemple-(\w+)/); if (m && INFO[m[1]]) ouvrir(m[1], document.querySelector(`.voir[data-ex="${m[1]}"]`)); };
  addEventListener("hashchange", depuisLien); depuisLien();

  /* ---------- Confidentialité ---------- */
  const conf = $("#conf");
  $("#conf-o").addEventListener("click", () => conf.showModal ? conf.showModal() : conf.setAttribute("open", ""));
  $("#conf-x").addEventListener("click", () => conf.close());
  conf.addEventListener("click", e => { if (e.target === conf) conf.close(); });

  /* ---------- Bouton WhatsApp fixe (mobile et tablette) ---------- */
  if ("IntersectionObserver" in window) {
    let apres = false, contact = false;
    const maj = () => fixe.classList.toggle("on", apres && !contact && !dlg.open);
    new IntersectionObserver(([e]) => { apres = !e.isIntersecting && e.boundingClientRect.top < 0; maj(); }).observe($(".hero .cta"));
    new IntersectionObserver(([e]) => { contact = e.isIntersecting; maj(); }).observe($("#contact"));
    dlg.addEventListener("close", maj);
  }
})();
