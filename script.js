const cards = Array.from(document.querySelectorAll(".timeline-card"));
const timelineWrap = document.querySelector(".timeline-wrap");
const timelineSection = document.querySelector(".timeline-section");
const detailPanel = document.querySelector(".milestone-detail");
const detailClose = document.querySelector(".detail-close");
const detailImage = document.querySelector(".detail-image");
const detailDate = document.querySelector(".detail-date");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector(".detail-description");

let selectedCard = null;
let detailHideTimer = null;
let detailCloseClassTimer = null;

const expandedDescriptions = {
  "1968": "Intel was founded by Robert Noyce and Gordon Moore, two pioneers of the semiconductor industry who shared a vision for continuous innovation. Originally known as NM Electronics, the company was soon renamed Intel, short for \"Integrated Electronics.\" From its earliest days, Intel focused heavily on research and development, establishing a culture of innovation that would shape the future of computing for decades.",
  "1971": "Intel introduced the 4004, the world's first commercially available microprocessor. Originally developed for a calculator project, the tiny chip combined the functions of a computer's central processing unit onto a single piece of silicon. The breakthrough demonstrated that powerful computing could be condensed into smaller, more affordable devices, helping launch the modern microprocessor era.",
  "1978": "Intel released the 8086 processor, introducing the x86 architecture that would become one of the most influential computing platforms in history. The processor provided significant performance improvements and established a foundation that future generations of Intel processors would continue to build upon. Variations of the x86 architecture remain widely used in personal computers, workstations, and servers today.",
  "1985": "The Intel 386 processor marked a major milestone by bringing 32-bit computing to personal computers. With greater processing power, larger memory support, and advanced multitasking capabilities, the chip enabled more sophisticated software and operating systems. The 386 helped accelerate the growth of personal computing and laid the groundwork for many modern computing technologies.",
  "2006": "Intel reached its highest level of operational greenhouse gas emissions in 2006. Recognizing the environmental challenges associated with large-scale semiconductor manufacturing, the company began investing heavily in emissions reduction technologies, renewable electricity, energy efficiency improvements, and chemical abatement systems. These efforts would become the foundation of Intel's long-term sustainability strategy.",
  "2020": "Intel launched its RISE strategy, which stands for Responsible, Inclusive, Sustainable, and Enabling. The initiative established ambitious 2030 goals focused on climate action, water stewardship, waste reduction, workforce diversity, and responsible business practices. RISE represented a company-wide commitment to creating positive environmental and social impact while continuing to drive technological innovation.",
  "2022": "Intel announced its goal of achieving net-zero greenhouse gas emissions across its global operations by 2040. The commitment built upon years of sustainability investments and included plans to expand renewable energy usage, improve manufacturing efficiency, and reduce emissions throughout its facilities worldwide. The announcement reinforced Intel's position as a leader in corporate environmental responsibility.",
  "2023": "Intel achieved 99% renewable electricity usage across its global operations, representing a significant milestone in its sustainability journey. By increasing investments in renewable energy sources such as solar and wind power, the company substantially reduced its carbon footprint. The achievement demonstrated measurable progress toward Intel's long-term environmental and climate goals.",
  "2024": "Intel hosted its first Sustainability Summit, bringing together suppliers, government representatives, industry leaders, and sustainability experts. The event focused on collaboration, innovation, and the future of environmentally responsible semiconductor manufacturing. By encouraging partnerships across the technology sector, Intel aimed to accelerate progress toward shared sustainability goals and promote more sustainable practices throughout the global supply chain."
};

function setProgress(activeIndex) {
  if (!timelineWrap || cards.length < 2) {
    return;
  }

  const progress = (activeIndex / (cards.length - 1)) * 100;
  timelineWrap.style.setProperty("--timeline-progress", `${progress}%`);
}

function getCardImage(card) {
  const img = card.querySelector(".card-media img");
  return img ? img.src : "";
}

function setSelectedCard(card) {
  cards.forEach((item) => {
    const isSelected = item === card;
    item.classList.toggle("is-selected", isSelected);
    item.classList.toggle("is-open", isSelected);
    item.setAttribute("aria-expanded", String(isSelected));
    item.closest(".timeline-item")?.classList.toggle("is-selected", isSelected);
  });
}

function openDetail(card) {
  if (!detailPanel || !detailImage || !detailDate || !detailTitle || !detailDescription) {
    return;
  }

  selectedCard = card;
  const date = card.querySelector(".card-date").textContent.trim();
  const title = card.querySelector(".card-title").textContent.trim();
  const description = expandedDescriptions[date] || card.querySelector(".card-description").textContent.trim();
  const image = getCardImage(card);

  detailDate.textContent = date;
  detailTitle.textContent = title;
  detailDescription.textContent = description;
  detailImage.src = image;
  detailImage.alt = `${title} milestone image`;

  setSelectedCard(card);
  setProgress(cards.indexOf(card));
  document.body.classList.remove("timeline-detail-closing");
  document.body.classList.add("timeline-detail-open");

  window.clearTimeout(detailHideTimer);
  window.clearTimeout(detailCloseClassTimer);
  detailPanel.hidden = false;
  requestAnimationFrame(() => {
    detailPanel.classList.add("is-open");
    timelineSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeDetail({ restoreFocus = true } = {}) {
  if (!detailPanel) {
    return;
  }

  document.body.classList.remove("timeline-detail-open");
  document.body.classList.add("timeline-detail-closing");
  detailPanel.classList.remove("is-open");
  cards.forEach((card) => {
    card.classList.remove("is-selected", "is-open");
    card.setAttribute("aria-expanded", "false");
    card.closest(".timeline-item")?.classList.remove("is-selected");
  });

  window.clearTimeout(detailHideTimer);
  detailPanel.hidden = true;
  window.clearTimeout(detailCloseClassTimer);
  detailCloseClassTimer = window.setTimeout(() => {
    document.body.classList.remove("timeline-detail-closing");
  }, 420);

  if (restoreFocus && selectedCard) {
    selectedCard.focus({ preventScroll: true });
  }

  selectedCard = null;
}

cards.forEach((card, index) => {
  card.setAttribute("aria-expanded", "false");

  card.addEventListener("mouseenter", () => setProgress(index));
  card.addEventListener("focus", () => setProgress(index));

  card.addEventListener("click", (event) => {
    event.preventDefault();
    openDetail(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetail();
    }
  });
});

detailClose?.addEventListener("click", () => closeDetail());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("timeline-detail-open")) {
    closeDetail();
  }
});

/* ──────────────────────────────────────────────────
   RTL AUTO-DETECTION
   Watches for Google Translate (and any other tool)
   changing the <html lang="…"> attribute and toggles
   Bootstrap RTL CSS + dir="rtl" automatically.
   ────────────────────────────────────────────────── */

const RTL_LANGS = new Set([
  "ar", "he", "fa", "ur", "dv", "ha", "ks", "ku", "ps", "sd", "ug", "yi",
]);

function isRTL(lang) {
  if (!lang) return false;
  return RTL_LANGS.has(lang.split("-")[0].toLowerCase());
}

function applyDirection(rtl) {
  const html = document.documentElement;
  const ltrLink = document.getElementById("bootstrap-ltr-css");
  // Insert RTL sheet *before* styles.css so our custom rules always win the cascade
  const customStyles = document.querySelector('link[href="styles.css"]');
  let rtlLink = document.getElementById("bootstrap-rtl-css");

  if (rtl) {
    html.setAttribute("dir", "rtl");
    if (!rtlLink) {
      rtlLink = document.createElement("link");
      rtlLink.id = "bootstrap-rtl-css";
      rtlLink.rel = "stylesheet";
      rtlLink.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css";
      if (customStyles) {
        document.head.insertBefore(rtlLink, customStyles);
      } else {
        document.head.appendChild(rtlLink);
      }
    }
    if (ltrLink) ltrLink.disabled = true;
  } else {
    html.setAttribute("dir", "ltr");
    if (ltrLink) ltrLink.disabled = false;
    if (rtlLink) rtlLink.remove();
  }
}

const langObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.attributeName === "lang") {
      applyDirection(isRTL(document.documentElement.getAttribute("lang")));
    }
  }
});

langObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});

/* ──────────────────────────────────────────────────
   PILLAR "LEARN MORE" → ACCORDION
   Scroll to the deep-dive section and open the
   matching accordion item.
   ────────────────────────────────────────────────── */

document.querySelectorAll("[data-accordion-open]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.accordionOpen;
    const collapseEl = document.getElementById(targetId);
    const section = document.getElementById("deep-dive");
    if (!collapseEl || !section) return;

    // Open the accordion item (Bootstrap Collapse API)
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, {
      parent: "#sustainabilityAccordion",
    });
    bsCollapse.show();

    // Smooth scroll after a short delay so the DOM height updates first
    setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  });
});

/* ──────────────────────────────────────────────────
   SUBSCRIPTION FORM
   ────────────────────────────────────────────────── */

const subscribeForm = document.getElementById("subscribe-form");
const subscribeMsg = document.getElementById("subscribe-msg");

subscribeForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = subscribeForm.querySelector("#subscribe-email");
  if (!emailInput.validity.valid) {
    emailInput.focus();
    showSubscribeMsg("Please enter a valid email address.", false);
    return;
  }
  emailInput.value = "";
  showSubscribeMsg("Thank you for subscribing!", true);
});

function showSubscribeMsg(text, success) {
  if (!subscribeMsg) return;
  subscribeMsg.textContent = text;
  subscribeMsg.className = "subscribe-msg " + (success ? "is-success" : "is-error");
  subscribeMsg.hidden = false;
}
