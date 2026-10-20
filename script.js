(function () {
  "use strict";
  // All products and prices live here (DH = dirhams).
  var MENU = [
    { id: "cafes", fr: "Cafés", ar: "القهوة", items: [
      ["Espresso", "إسبريسو", 12], ["Café Noir", "قهوة سوداء", 12], ["Café Crème", "قهوة بالكريمة", 12],
      ["Cappuccino", "كابتشينو", 12], ["Café au Lait", "قهوة بالحليب", 12], ["Café Américain", "قهوة أمريكية", 12] ] },
    { id: "jus", fr: "Jus frais", ar: "العصائر الطبيعية", items: [
      ["Jus de Pomme", "عصير التفاح", 15], ["Jus de Citron / Citronnade", "عصير الليمون", 15],
      ["Jus de Banane", "عصير الموز", 15], ["Panaché", "باناشي", 20], ["Jus d’Avocat", "عصير الأفوكا", 20] ] },
    { id: "boissons", fr: "Boissons", ar: "المشروبات", items: [
      ["Orangina", "أورنجينا", 20], ["Soda", "صودا", 12], ["Oulmès", "أولماس", 15],
      ["Schweppes Tonic", "شويبس تونيك", 15], ["Schweppes Citron", "شويبس ليمون", 15] ] },
    { id: "snacks", fr: "Snacks / Accompagnements", ar: "المملحات والبسكويت", items: [
      ["Snacks salés", "المملحات", 5], ["Biscuits", "البسكويت", 5] ] },
    { id: "eau", fr: "Eau", ar: "الماء", items: [
      ["Petite bouteille", "قنينة صغيرة", 3], ["Grande bouteille", "قنينة كبيرة", 5] ] }
  ];
  var BADGE = { cafes: { fr: "12 DH chacun", ar: "12 درهم للكأس" } };
  var TEXT = {
    fr: { title: "Bienvenue chez Café Chez Jad", sub: "Découvrez notre carte et laissez-vous tenter.", thanks: "Merci de votre visite. À très bientôt !", dh: "DH", nav: "Catégories" },
    ar: { title: "مرحباً بكم في Café Chez Jad", sub: "اكتشفوا قائمتنا واستمتعوا بمشروباتكم.", thanks: "شكراً لزيارتكم. نراكم قريباً!", dh: "د.م", nav: "الفئات" }
  };
  var lang = "fr";
  try { var s = localStorage.getItem("lang"); if (s === "ar" || s === "fr") lang = s; } catch (e) {}

  var menuEl = document.getElementById("menu"), navEl = document.getElementById("nav");

  function num(n) { return lang === "ar" ? Number(n).toLocaleString("ar-MA", { useGrouping: false }) : String(n); }

  function render() {
    var t = TEXT[lang], i = lang === "fr" ? 0 : 1;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = "Café Chez Jad | Menu";
    navEl.setAttribute("aria-label", t.nav);
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t[el.dataset.i18n]; });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });

    navEl.innerHTML = ""; menuEl.innerHTML = "";
    MENU.forEach(function (c) {
      var a = document.createElement("a");
      a.href = "#" + c.id; a.textContent = c[lang]; a.dataset.id = c.id; navEl.appendChild(a);

      var sec = document.createElement("section"); sec.className = "cat"; sec.id = c.id;
      sec.setAttribute("aria-labelledby", "h-" + c.id);
      var head = document.createElement("div"); head.className = "cat-head";
      var h2 = document.createElement("h2"); h2.id = "h-" + c.id; h2.textContent = c[lang]; head.appendChild(h2);
      if (BADGE[c.id]) { var b = document.createElement("span"); b.className = "badge"; b.textContent = BADGE[c.id][lang]; head.appendChild(b); }
      sec.appendChild(head);
      var ul = document.createElement("ul"); ul.className = "items";
      c.items.forEach(function (it) {
        var li = document.createElement("li"); li.className = "item";
        var n = document.createElement("span"); n.className = "name"; n.textContent = it[i];
        var p = document.createElement("span"); p.className = "price"; p.textContent = num(it[2]) + " " + t.dh;
        li.appendChild(n); li.appendChild(p); ul.appendChild(li);
      });
      sec.appendChild(ul); menuEl.appendChild(sec);
    });
    observe();
  }

  var io;
  function observe() {
    if (!("IntersectionObserver" in window)) return;
    if (io) io.disconnect();
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        navEl.querySelectorAll("a").forEach(function (a) {
          var on = a.dataset.id === e.target.id;
          a.classList.toggle("active", on);
          if (on) { try { navEl.scrollTo({ left: a.offsetLeft - navEl.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" }); } catch (x) {} }
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".cat").forEach(function (s) { io.observe(s); });
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang;
      try { localStorage.setItem("lang", lang); } catch (e) {}
      render();
    });
  });
  render();
})();
