const events = [
  {id:"web-dev", title:"Modern Web Development", category:"Technology", date:"2026-11-08", time:"10:00 AM – 1:00 PM", location:"Online workshop", seats:24, symbol:"⌘", banner:"banner-tech", description:"Build a strong foundation in HTML, CSS, and JavaScript with practical mini challenges."},
  {id:"career-ready", title:"Career Launchpad", category:"Career", date:"2026-11-14", time:"11:00 AM – 12:30 PM", location:"Innovation Hub", seats:35, symbol:"↗", banner:"banner-career", description:"Improve your resume, practice interview answers, and learn how to present your projects."},
  {id:"ui-ux", title:"UI/UX Design Basics", category:"Design", date:"2026-11-20", time:"2:00 PM – 4:00 PM", location:"Online workshop", seats:18, symbol:"✳", banner:"banner-design", description:"Explore user journeys, wireframes, and the principles behind clear digital experiences."},
  {id:"tech-talk", title:"The Future of Cloud", category:"Technology", date:"2026-11-25", time:"4:00 PM – 5:30 PM", location:"Tech Auditorium", seats:42, symbol:"☁", banner:"banner-tech", description:"An approachable introduction to cloud computing, deployment, and modern infrastructure."},
  {id:"community", title:"Community Clean-Up Day", category:"Community", date:"2026-12-02", time:"8:00 AM – 11:00 AM", location:"Central Park Gate", seats:50, symbol:"♧", banner:"banner-community", description:"Meet your neighbors and help make shared public spaces cleaner and greener."},
  {id:"portfolio", title:"Portfolio Review Meetup", category:"Career", date:"2026-12-10", time:"3:00 PM – 5:00 PM", location:"Innovation Hub", seats:20, symbol:"▤", banner:"banner-career", description:"Get practical feedback on your portfolio and learn how to explain your work clearly."}
];

const STORAGE_KEY = "eventify-registrations-v1";
let selectedCategory = "All";
let selectedEventId = null;
let toastTimeout;

const eventGrid = document.querySelector("#event-grid");
const registrationsList = document.querySelector("#registrations-list");
const searchInput = document.querySelector("#search-input");
const dialog = document.querySelector("#register-dialog");
const form = document.querySelector("#registration-form");
const toast = document.querySelector("#toast");

function getRegistrations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveRegistrations(registrations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function dateParts(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat("en-IN", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date).toUpperCase()
  };
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const registrations = getRegistrations();
  const filtered = events.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const searchable = `${event.title} ${event.category} ${event.description} ${event.location}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  document.querySelector("#event-status").textContent =
    `${filtered.length} event${filtered.length === 1 ? "" : "s"} found`;

  if (!filtered.length) {
    eventGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><strong>No events found</strong>Try another search or category.</div>';
    return;
  }

  eventGrid.innerHTML = filtered.map(event => {
    const alreadyRegistered = registrations.some(item => item.eventId === event.id);
    const parts = dateParts(event.date);
    return `
      <article class="event-card">
        <div class="event-banner ${event.banner}">
          <span class="category-label">${escapeHTML(event.category)}</span>
          <span class="banner-symbol" aria-hidden="true">${event.symbol}</span>
        </div>
        <div class="event-content">
          <p class="event-date">${parts.day} ${parts.month} · ${formatDate(event.date).split(" ").pop()}</p>
          <h3>${escapeHTML(event.title)}</h3>
          <p class="description">${escapeHTML(event.description)}</p>
          <div class="event-meta"><span>◷ ${escapeHTML(event.time)}</span><span>⌖ ${escapeHTML(event.location)}</span></div>
          <div class="event-actions">
            <span class="seats">${event.seats} spots available*</span>
            <button class="small-button" data-register="${event.id}" ${alreadyRegistered ? "disabled" : ""}>
              ${alreadyRegistered ? "Registered ✓" : "Register →"}
            </button>
          </div>
        </div>
      </article>`;
  }).join("");

  eventGrid.querySelectorAll("[data-register]").forEach(button => {
    button.addEventListener("click", () => openRegistration(button.dataset.register));
  });
}

function renderRegistrations() {
  const registrations = getRegistrations();
  document.querySelector("#nav-count").textContent = registrations.length;
  document.querySelector("#registration-count").textContent = registrations.length;

  if (!registrations.length) {
    registrationsList.innerHTML = '<div class="empty-state"><strong>No registrations yet</strong>Explore the events above and register for something you like.</div>';
    return;
  }

  registrationsList.innerHTML = registrations.map(registration => {
    const event = events.find(item => item.id === registration.eventId);
    if (!event) return "";
    const parts = dateParts(event.date);
    return `
      <article class="registration-item">
        <div class="registration-info">
          <div class="registration-date"><span>${parts.day}</span><br>${parts.month}</div>
          <div><h3>${escapeHTML(event.title)}</h3><p>${formatDate(event.date)} · ${escapeHTML(event.location)}<br>Registered as ${escapeHTML(registration.name)}</p></div>
        </div>
        <button class="cancel-button" data-cancel="${event.id}">Cancel</button>
      </article>`;
  }).join("");

  registrationsList.querySelectorAll("[data-cancel]").forEach(button => {
    button.addEventListener("click", () => cancelRegistration(button.dataset.cancel));
  });
}

function refreshUI() {
  renderEvents();
  renderRegistrations();
}

function openRegistration(eventId) {
  const event = events.find(item => item.id === eventId);
  if (!event) return;
  if (getRegistrations().some(item => item.eventId === eventId)) {
    showToast("You are already registered for this event.");
    return;
  }
  selectedEventId = eventId;
  document.querySelector("#dialog-event-title").textContent = `${event.title} · ${formatDate(event.date)}`;
  document.querySelector("#form-error").textContent = "";
  form.reset();
  dialog.showModal();
  document.querySelector("#attendee-name").focus();
}

function cancelRegistration(eventId) {
  const event = events.find(item => item.id === eventId);
  const updated = getRegistrations().filter(item => item.eventId !== eventId);
  saveRegistrations(updated);
  refreshUI();
  showToast(`Registration cancelled${event ? ` for ${event.title}` : ""}.`);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.querySelector("#attendee-name").value.trim();
  const email = document.querySelector("#attendee-email").value.trim().toLowerCase();
  const error = document.querySelector("#form-error");

  if (name.length < 2) {
    error.textContent = "Please enter a name with at least 2 characters.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  const registrations = getRegistrations();
  if (registrations.some(item => item.eventId === selectedEventId)) {
    error.textContent = "You are already registered for this event.";
    return;
  }

  const eventInfo = events.find(item => item.id === selectedEventId);
  registrations.push({ eventId: selectedEventId, name, email, registeredAt: new Date().toISOString() });
  saveRegistrations(registrations);
  dialog.close();
  refreshUI();
  showToast(`You're registered for ${eventInfo ? eventInfo.title : "the event"}!`);
});

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
searchInput.addEventListener("input", renderEvents);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter === button));
    renderEvents();
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
refreshUI();
