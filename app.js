let currentLang = 'tl';
let isPlaying = false;
const allowedGuestNames = [
  'Aldrin Pangilinan',
  'Lorna Miclat',
  'Edwin Miclat',
  'Aldrich Nunag',
  'Azee Miclat',
  'Paul Maverick Miclat'
];

const audio = document.getElementById('weddingAudio');
const musicIcon = document.getElementById('musicIcon');

function applyLanguage() {
  document.getElementById('langText').innerText = currentLang === 'en' ? 'Tagalog' : 'English';
  document.querySelectorAll('[data-en]').forEach(element => {
    const text = element.getAttribute(`data-${currentLang}`);
    if (text) element.innerText = text;
  });
}

function toggleAudio() {
  if (isPlaying) {
    audio.pause();
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-music');
  } else {
    audio.play().then(() => {
      musicIcon.classList.remove('fa-music');
      musicIcon.classList.add('fa-pause');
    }).catch(error => {
      console.log('Audio playback blocked:', error);
    });
  }
  isPlaying = !isPlaying;
}

function filterEntourage(category, activeButton) {
  document.querySelectorAll('.ent-btn').forEach(button => {
    button.classList.remove('bg-gold-600', 'text-white');
    button.classList.add('bg-white', 'text-stone-700');
  });
  activeButton.classList.add('bg-gold-600', 'text-white');

  document.querySelectorAll('.ent-card').forEach(card => {
    card.style.display = category === 'all' || card.classList.contains(category) ? 'block' : 'none';
  });
}

function copyToClipboard(text, label) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert(`✨ ${label} details copied to clipboard!`);
}

function submitRSVP(event) {
  event.preventDefault();
  const guestName = normalizeGuestName(document.getElementById('guestLookup').value);
  const invitedName = allowedGuestNames.find(name => normalizeGuestName(name) === guestName);
  if (!invitedName) {
    updateInviteLookup();
    return;
  }

  document.getElementById('rsvpName').value = invitedName;
  document.getElementById('rsvpForm').reset();
  document.getElementById('rsvpAlert').classList.remove('hidden');
}

function normalizeGuestName(name) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function updateInviteLookup() {
  const lookup = document.getElementById('guestLookup');
  const query = normalizeGuestName(lookup.value);
  const exactMatch = allowedGuestNames.find(name => normalizeGuestName(name) === query);
  const hasSuggestions = allowedGuestNames.some(name => normalizeGuestName(name).includes(query));
  const access = document.getElementById('rsvpAccess');
  const message = document.getElementById('guestLookupMessage');

  access.classList.toggle('hidden', !exactMatch);
  document.getElementById('rsvpName').value = exactMatch || '';

  let messageKey;
  if (exactMatch) messageKey = 'matched';
  else if (!allowedGuestNames.length) messageKey = 'emptyList';
  else if (!query) messageKey = 'emptySearch';
  else if (hasSuggestions) messageKey = 'partialMatch';
  else messageKey = 'notFound';

  const messages = {
    matched: { en: 'Name found. You may submit your RSVP.', tl: 'Nakita ang pangalan mo. Maaari ka nang mag-RSVP.' },
    emptyList: { en: 'The invitation list has not been added yet.', tl: 'Hindi pa nailalagay ang listahan ng mga inimbitahan.' },
    emptySearch: { en: 'Type your full name to check the invitation list.', tl: 'Ilagay ang buong pangalan para hanapin sa listahan.' },
    partialMatch: { en: 'Choose your full name from the suggestions.', tl: 'Piliin ang buong pangalan mo mula sa mga mungkahi.' },
    notFound: { en: 'This name is not on the invitation list.', tl: 'Wala sa listahan ng mga inimbitahan ang pangalang ito.' }
  };
  message.innerText = messages[messageKey][currentLang];
}

function postMessage(event) {
  event.preventDefault();
  const name = document.getElementById('msgName').value;
  const relation = document.getElementById('msgRelation').value || 'Guest';
  const content = document.getElementById('msgContent').value;

  const newMessage = document.createElement('div');
  newMessage.className = 'bg-cream-50 p-5 rounded-2xl border border-gold-200 shadow-sm animate-fade-in';
  newMessage.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <h5 class="font-serif font-bold text-stone-800">${name}</h5>
      <span class="text-[10px] text-gold-600 font-semibold bg-gold-100 px-2.5 py-1 rounded-full">${relation}</span>
    </div>
    <p class="text-stone-600 text-sm italic">“${content}”</p>
  `;

  document.getElementById('messageWall').prepend(newMessage);
  document.getElementById('msgForm').reset();
}

applyLanguage();

const targetDate = new Date('Sep 16, 2027 15:00:00').getTime();
setInterval(() => {
  const difference = targetDate - Date.now();
  if (difference > 0) {
    document.getElementById('cd-days').innerText = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    document.getElementById('cd-minutes').innerText = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    document.getElementById('cd-seconds').innerText = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
  }
}, 1000);

document.addEventListener('click', event => {
  const control = event.target.closest('[data-action], [data-map], [data-filter], [data-gallery-src], [data-copy-text]');
  if (!control) return;

  if (control.dataset.action === 'toggle-audio') toggleAudio();
  if (control.dataset.action === 'toggle-language') {
    currentLang = currentLang === 'en' ? 'tl' : 'en';
    applyLanguage();
    updateInviteLookup();
  }
  if (control.dataset.action === 'close-gallery') document.getElementById('galleryModal').classList.add('hidden');
  if (control.dataset.map) document.getElementById(control.dataset.map).classList.toggle('hidden');
  if (control.dataset.filter) filterEntourage(control.dataset.filter, control);
  if (control.dataset.gallerySrc) {
    document.getElementById('modalImg').src = control.dataset.gallerySrc;
    document.getElementById('galleryModal').classList.remove('hidden');
  }
  if (control.dataset.copyText) copyToClipboard(control.dataset.copyText, control.dataset.copyLabel);
});

document.getElementById('rsvpForm').addEventListener('submit', submitRSVP);
document.getElementById('msgForm').addEventListener('submit', postMessage);

const guestOptions = document.getElementById('invitedGuestOptions');
allowedGuestNames.forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  guestOptions.appendChild(option);
});
document.getElementById('guestLookup').addEventListener('input', updateInviteLookup);
updateInviteLookup();
