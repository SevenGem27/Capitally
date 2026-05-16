// ==========================================
// CONFIGURAZIONE E INIZIALIZZAZIONE FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAKi-bwLLwdv87GbdVmWKWKeokzcTGJkdA",
  authDomain: "capitally-f62f4.firebaseapp.com",
  projectId: "capitally-f62f4",
  storageBucket: "capitally-f62f4.firebasestorage.app",
  messagingSenderId: "76174950116",
  appId: "1:76174950116:web:dd116f9045a0bb5aa276f1"
};

// Inizializza Firebase e il Database Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variabili globali di supporto per la classifica
let durataPartitaMinuti = 2;

// 1. Inizializzazione Mappa con accelerazione Hardware e Buffer ampio
const myRenderer = L.canvas({ padding: 1.5 });

const map = L.map('map', {
  center: [0, 10], // Equatore
  zoom: 4,
  minZoom: 3,
  maxZoom: 6,
  maxBounds: [[-90, -180], [90, 180]],
  maxBoundsViscosity: 1.0,
  preferCanvas: true,
  renderer: myRenderer,
  zoomControl: false,
  worldCopyJump: true, // Aiuta a gestire i bordi della mappa
  layers: [] 
});

const capitali = [
{ nome: "Sukhumi", nazione: "Abcasia", lat: 43.00, lng: 41.02 },
{ nome: "Kabul", nazione: "Afghanistan", lat: 34.53, lng: 69.17 },
{ nome: "Tirana", nazione: "Albania", lat: 41.33, lng: 19.82 },
{ nome: "Algeri", nazione: "Algeria", lat: 36.75, lng: 3.06 },
{ nome: "Andorra la Vella", nazione: "Andorra", lat: 42.51, lng: 1.52 },
{ nome: "Luanda", nazione: "Angola", lat: -8.84, lng: 13.23 },
{ nome: "Saint John's", nazione: "Antigua e Barbuda", lat: 17.12, lng: -61.85 },
{ nome: "Riad", nazione: "Arabia Saudita", lat: 24.71, lng: 46.68 },
{ nome: "Buenos Aires", nazione: "Argentina", lat: -34.60, lng: -58.38 },
{ nome: "Yerevan", nazione: "Armenia", lat: 40.18, lng: 44.51 },
{ nome: "Canberra", nazione: "Australia", lat: -35.28, lng: 149.13 },
{ nome: "Vienna", nazione: "Austria", lat: 48.21, lng: 16.37 },
{ nome: "Baku", nazione: "Azerbaigian", lat: 40.41, lng: 49.87 },
{ nome: "Nassau", nazione: "Bahamas", lat: 25.03, lng: -77.40 },
{ nome: "Manama", nazione: "Bahrein", lat: 27.16, lng: 49.38 },
{ nome: "Dhaka", nazione: "Bangladesh", lat: 23.81, lng: 90.41 },
{ nome: "Bridgetown", nazione: "Barbados", lat: 13.10, lng: -59.62 },
{ nome: "Bruxelles", nazione: "Belgio", lat: 50.85, lng: 4.35 },
{ nome: "Belmopan", nazione: "Belize", lat: 17.25, lng: -88.77 },
{ nome: "Porto-Novo", nazione: "Benin", lat: 6.50, lng: 2.60 },
{ nome: "Thimphu", nazione: "Bhutan", lat: 27.47, lng: 89.64 },
{ nome: "Minsk", nazione: "Bielorussia", lat: 53.90, lng: 27.57 },
{ nome: "Naypyidaw", nazione: "Birmania", lat: 19.75, lng: 96.13 },
{ nome: "Sucre", nazione: "Bolivia", lat: -19.03, lng: -65.26 },
{ nome: "Sarajevo", nazione: "Bosnia ed Erzegovina", lat: 43.85, lng: 18.41 },
{ nome: "Gaborone", nazione: "Botswana", lat: -24.63, lng: 25.92 },
{ nome: "Brasilia", nazione: "Brasile", lat: -15.79, lng: -47.88 },
{ nome: "Bandar Seri Begawan", nazione: "Brunei", lat: 4.89, lng: 114.94 },
{ nome: "Sofia", nazione: "Bulgaria", lat: 42.70, lng: 23.32 },
{ nome: "Ouagadougou", nazione: "Burkina Faso", lat: 12.37, lng: -1.53 },
{ nome: "Gitega", nazione: "Burundi", lat: -3.43, lng: 29.93 },
{ nome: "Phnom Penh", nazione: "Cambogia", lat: 11.56, lng: 104.93 },
{ nome: "Yaoundé", nazione: "Camerun", lat: 3.85, lng: 11.50 },
{ nome: "Ottawa", nazione: "Canada", lat: 45.42, lng: -75.70 },
{ nome: "Praia", nazione: "Capo Verde", lat: 14.92, lng: -23.51 },
{ nome: "N'Djamena", nazione: "Ciad", lat: 12.13, lng: 15.05 },
{ nome: "Santiago", nazione: "Cile", lat: -33.45, lng: -70.67 },
{ nome: "Pechino", nazione: "Cina", lat: 39.90, lng: 116.41 },
{ nome: "Nicosia", nazione: "Cipro", lat: 35.19, lng: 33.38 },
{ nome: "Bogotà", nazione: "Colombia", lat: 4.71, lng: -74.07 },
{ nome: "Moroni", nazione: "Comore", lat: -11.70, lng: 43.25 },
{ nome: "Pyongyang", nazione: "Corea del Nord", lat: 39.03, lng: 125.75 },
{ nome: "Seul", nazione: "Corea del Sud", lat: 37.57, lng: 126.98 },
{ nome: "Yamoussoukro", nazione: "Costa d'Avorio", lat: 6.82, lng: -5.28 },
{ nome: "San José", nazione: "Costa Rica", lat: 9.93, lng: -84.08 },
{ nome: "Zagabria", nazione: "Croazia", lat: 45.81, lng: 15.98 },
{ nome: "L'Avana", nazione: "Cuba", lat: 23.11, lng: -82.37 },
{ nome: "Copenaghen", nazione: "Danimarca", lat: 55.68, lng: 12.57 },
{ nome: "Roseau", nazione: "Dominica", lat: 15.30, lng: -61.39 },
{ nome: "Quito", nazione: "Ecuador", lat: -0.22, lng: -78.50 },
{ nome: "Il Cairo", nazione: "Egitto", lat: 30.04, lng: 31.24 },
{ nome: "San Salvador", nazione: "El Salvador", lat: 13.70, lng: -89.20 },
{ nome: "Abu Dhabi", nazione: "Emirati Arabi Uniti", lat: 24.45, lng: 54.37 },
{ nome: "Asmara", nazione: "Eritrea", lat: 15.33, lng: 38.93 },
{ nome: "Tallinn", nazione: "Estonia", lat: 59.44, lng: 24.75 },
{ nome: "Mbabane", nazione: "Eswatini", lat: -26.32, lng: 31.14 },
{ nome: "Addis Abeba", nazione: "Etiopia", lat: 9.02, lng: 38.75 },
{ nome: "Suva", nazione: "Figi", lat: -18.12, lng: 178.43 },
{ nome: "Manila", nazione: "Filippine", lat: 14.60, lng: 120.98 },
{ nome: "Helsinki", nazione: "Finlandia", lat: 60.17, lng: 24.94 },
{ nome: "Parigi", nazione: "Francia", lat: 48.86, lng: 2.35 },
{ nome: "Libreville", nazione: "Gabon", lat: 0.42, lng: 9.45 },
{ nome: "Banjul", nazione: "Gambia", lat: 13.45, lng: -16.58 },
{ nome: "Tbilisi", nazione: "Georgia", lat: 41.72, lng: 44.78 },
{ nome: "Berlino", nazione: "Germania", lat: 52.52, lng: 13.41 },
{ nome: "Accra", nazione: "Ghana", lat: 5.56, lng: -0.20 },
{ nome: "Kingston", nazione: "Giamaica", lat: 17.97, lng: -76.79 },
{ nome: "Tokyo", nazione: "Giappone", lat: 35.69, lng: 139.69 },
{ nome: "Gibuti", nazione: "Gibuti", lat: 11.59, lng: 43.15 },
{ nome: "Amman", nazione: "Giordania", lat: 31.95, lng: 35.93 },
{ nome: "Atene", nazione: "Grecia", lat: 37.98, lng: 23.73 },
{ nome: "Saint George's", nazione: "Grenada", lat: 12.06, lng: -61.75 },
{ nome: "Guatemala City", nazione: "Guatemala", lat: 14.63, lng: -90.53 },
{ nome: "Conakry", nazione: "Guinea", lat: 9.51, lng: -13.71 },
{ nome: "Bissau", nazione: "Guinea-Bissau", lat: 11.86, lng: -15.60 },
{ nome: "Ciudad de la Paz", nazione: "Guinea Equatoriale", lat: 1.75, lng: 10.58 },
{ nome: "Georgetown", nazione: "Guyana", lat: 6.80, lng: -58.16 },
{ nome: "Port-au-Prince", nazione: "Haiti", lat: 18.54, lng: -72.34 },
{ nome: "Tegucigalpa", nazione: "Honduras", lat: 14.10, lng: -87.20 },
{ nome: "Nuova Delhi", nazione: "India", lat: 28.61, lng: 77.21 },
{ nome: "Jakarta", nazione: "Indonesia", lat: -6.20, lng: 106.82 },
{ nome: "Teheran", nazione: "Iran", lat: 35.69, lng: 51.38 },
{ nome: "Baghdad", nazione: "Iraq", lat: 33.32, lng: 44.36 },
{ nome: "Dublino", nazione: "Irlanda", lat: 53.35, lng: -6.26 },
{ nome: "Reykjavík", nazione: "Islanda", lat: 64.15, lng: -21.94 },
{ nome: "Avarua", nazione: "Isole Cook", lat: -21.21, lng: -159.77 },
{ nome: "Majuro", nazione: "Isole Marshall", lat: 7.09, lng: 171.38 },
{ nome: "Honiara", nazione: "Isole Salomone", lat: -9.43, lng: 159.95 },
{ nome: "Gerusalemme", nazione: "Israele", lat: 31.40, lng: 34.80 },
{ nome: "Roma", nazione: "Italia", lat: 41.90, lng: 12.50 },
{ nome: "Astana", nazione: "Kazakistan", lat: 51.17, lng: 71.43 },
{ nome: "Nairobi", nazione: "Kenya", lat: -1.29, lng: 36.82 },
{ nome: "Biškek", nazione: "Kirghizistan", lat: 42.87, lng: 74.59 },
{ nome: "Tarawa Sud", nazione: "Kiribati", lat: 1.33, lng: 172.98 },
{ nome: "Pristina", nazione: "Kosovo", lat: 42.66, lng: 21.16 },
{ nome: "Al Kuwait", nazione: "Kuwait", lat: 29.37, lng: 47.98 },
{ nome: "Vientiane", nazione: "Laos", lat: 17.97, lng: 102.60 },
{ nome: "Maseru", nazione: "Lesotho", lat: -29.32, lng: 27.48 },
{ nome: "Riga", nazione: "Lettonia", lat: 56.95, lng: 24.11 },
{ nome: "Beirut", nazione: "Libano", lat: 33.89, lng: 35.50 },
{ nome: "Monrovia", nazione: "Liberia", lat: 6.31, lng: -10.80 },
{ nome: "Tripoli", nazione: "Libia", lat: 32.89, lng: 13.19 },
{ nome: "Vaduz", nazione: "Liechtenstein", lat: 47.14, lng: 9.52 },
{ nome: "Vilnius", nazione: "Lituania", lat: 54.69, lng: 25.28 },
{ nome: "Lussemburgo", nazione: "Lussemburgo", lat: 49.61, lng: 6.13 },
{ nome: "Skopje", nazione: "Macedonia del Nord", lat: 42.00, lng: 21.43 },
{ nome: "Antananarivo", nazione: "Madagascar", lat: -18.88, lng: 47.53 },
{ nome: "Lilongwe", nazione: "Malawi", lat: -13.97, lng: 33.79 },
{ nome: "Malé", nazione: "Maldive", lat: 4.18, lng: 73.51 },
{ nome: "Kuala Lumpur", nazione: "Malesia", lat: 3.14, lng: 101.69 },
{ nome: "Bamako", nazione: "Mali", lat: 12.64, lng: -7.99 },
{ nome: "La Valletta", nazione: "Malta", lat: 35.90, lng: 14.51 },
{ nome: "Rabat", nazione: "Marocco", lat: 34.02, lng: -6.83 },
{ nome: "Nouakchott", nazione: "Mauritania", lat: 18.07, lng: -15.97 },
{ nome: "Port Louis", nazione: "Mauritius", lat: -20.16, lng: 57.50 },
{ nome: "Città del Messico", nazione: "Messico", lat: 19.43, lng: -99.13 },
{ nome: "Palikir", nazione: "Micronesia", lat: 6.92, lng: 158.16 },
{ nome: "Chișinău", nazione: "Moldavia", lat: 47.01, lng: 28.86 },
{ nome: "Monaco", nazione: "Monaco", lat: 43.73, lng: 7.42 },
{ nome: "Ulan Bator", nazione: "Mongolia", lat: 47.92, lng: 106.92 },
{ nome: "Podgorica", nazione: "Montenegro", lat: 42.44, lng: 19.26 },
{ nome: "Maputo", nazione: "Mozambico", lat: -25.97, lng: 32.59 },
{ nome: "Windhoek", nazione: "Namibia", lat: -22.56, lng: 17.08 },
{ nome: "Yaren", nazione: "Nauru", lat: -0.55, lng: 166.92 },
{ nome: "Katmandu", nazione: "Nepal", lat: 27.70, lng: 85.32 },
{ nome: "Managua", nazione: "Nicaragua", lat: 12.13, lng: -86.25 },
{ nome: "Niamey", nazione: "Niger", lat: 13.51, lng: 2.13 },
{ nome: "Abuja", nazione: "Nigeria", lat: 9.06, lng: 7.50 },
{ nome: "Alofi", nazione: "Niue", lat: -19.05, lng: -169.91 },
{ nome: "Oslo", nazione: "Norvegia", lat: 59.91, lng: 10.75 },
{ nome: "Wellington", nazione: "Nuova Zelanda", lat: -41.29, lng: 174.78 },
{ nome: "Mascate", nazione: "Oman", lat: 23.59, lng: 58.40 },
{ nome: "Tskhinvali", nazione: "Ossezia del Sud", lat: 42.60, lng: 43.69 },
{ nome: "Amsterdam", nazione: "Paesi Bassi", lat: 52.37, lng: 4.90 },
{ nome: "Islamabad", nazione: "Pakistan", lat: 33.73, lng: 73.09 },
{ nome: "Ngerulmud", nazione: "Palau", lat: 7.50, lng: 134.62 },
{ nome: "Ramallah", nazione: "Palestina", lat: 31.90, lng: 35.20 },
{ nome: "Panama", nazione: "Panama", lat: 8.98, lng: -79.52 },
{ nome: "Port Moresby", nazione: "Papua Nuova Guinea", lat: -9.44, lng: 147.18 },
{ nome: "Asunción", nazione: "Paraguay", lat: -25.26, lng: -57.63 },
{ nome: "Lima", nazione: "Perù", lat: -12.04, lng: -77.03 },
{ nome: "Varsavia", nazione: "Polonia", lat: 52.23, lng: 21.01 },
{ nome: "Lisbona", nazione: "Portogallo", lat: 38.72, lng: -9.14 },
{ nome: "Doha", nazione: "Qatar", lat: 25.29, lng: 51.53 },
{ nome: "Londra", nazione: "Regno Unito", lat: 51.51, lng: -0.13 },
{ nome: "Praga", nazione: "Repubblica Ceca", lat: 50.08, lng: 14.44 },
{ nome: "Bangui", nazione: "Repubblica Centrafricana", lat: 4.36, lng: 18.55 },
{ nome: "Brazzaville", nazione: "Repubblica del Congo", lat: -3.26, lng: 15.28 },
{ nome: "Kinshasa", nazione: "Repubblica Democratica del Congo", lat: -4.32, lng: 15.30 },
{ nome: "Santo Domingo", nazione: "Repubblica Dominicana", lat: 18.49, lng: -69.93 },
{ nome: "Bucarest", nazione: "Romania", lat: 44.43, lng: 26.11 },
{ nome: "Kigali", nazione: "Ruanda", lat: -1.94, lng: 30.06 },
{ nome: "Mosca", nazione: "Russia", lat: 55.75, lng: 37.62 },
{ nome: "El Aaiún", nazione: "Sahara Occidentale", lat: 27.15, lng: -13.20 },
{ nome: "Basseterre", nazione: "Saint Kitts e Nevis", lat: 17.30, lng: -62.73 },
{ nome: "Kingstown", nazione: "Saint Vincent e Grenadine", lat: 13.16, lng: -61.23 },
{ nome: "Apia", nazione: "Samoa", lat: -13.83, lng: -171.77 },
{ nome: "Città di San Marino", nazione: "San Marino", lat: 43.94, lng: 12.45 },
{ nome: "Castries", nazione: "Santa Lucia", lat: 14.01, lng: -60.99 },
{ nome: "São Tomé", nazione: "São Tomé e Príncipe", lat: 0.34, lng: 6.73 },
{ nome: "Dakar", nazione: "Senegal", lat: 14.72, lng: -17.47 },
{ nome: "Belgrado", nazione: "Serbia", lat: 44.82, lng: 20.46 },
{ nome: "Victoria", nazione: "Seychelles", lat: -4.62, lng: 55.45 },
{ nome: "Freetown", nazione: "Sierra Leone", lat: 8.48, lng: -13.23 },
{ nome: "Singapore", nazione: "Singapore", lat: 1.29, lng: 103.85 },
{ nome: "Damasco", nazione: "Siria", lat: 33.51, lng: 36.30 },
{ nome: "Bratislava", nazione: "Slovacchia", lat: 48.15, lng: 17.11 },
{ nome: "Lubiana", nazione: "Slovenia", lat: 46.05, lng: 14.51 },
{ nome: "Mogadiscio", nazione: "Somalia", lat: 2.04, lng: 45.34 },
{ nome: "Hargheisa", nazione: "Somaliland", lat: 9.56, lng: 44.06 },
{ nome: "Madrid", nazione: "Spagna", lat: 40.42, lng: -3.70 },
{ nome: "Sri Jayawardenapura Kotte", nazione: "Sri Lanka", lat: 6.90, lng: 79.91 },
{ nome: "Washington", nazione: "Stati Uniti", lat: 38.89, lng: -77.04 },
{ nome: "Pretoria", nazione: "Sudafrica", lat: -25.75, lng: 28.19 },
{ nome: "Khartum", nazione: "Sudan", lat: 15.50, lng: 32.56 },
{ nome: "Juba", nazione: "Sudan del Sud", lat: 4.85, lng: 31.58 },
{ nome: "Paramaribo", nazione: "Suriname", lat: 5.85, lng: -55.20 },
{ nome: "Stoccolma", nazione: "Svezia", lat: 59.33, lng: 18.06 },
{ nome: "Berna", nazione: "Svizzera", lat: 46.95, lng: 7.45 },
{ nome: "Dušanbe", nazione: "Tagikistan", lat: 38.56, lng: 68.78 },
{ nome: "Taipei", nazione: "Taiwan", lat: 25.03, lng: 121.57 },
{ nome: "Dodoma", nazione: "Tanzania", lat: -6.17, lng: 35.74 },
{ nome: "Bangkok", nazione: "Thailandia", lat: 13.75, lng: 100.50 },
{ nome: "Dili", nazione: "Timor Est", lat: -8.56, lng: 125.57 },
{ nome: "Lomé", nazione: "Togo", lat: 6.13, lng: 1.21 },
{ nome: "Nukuʻalofa", nazione: "Tonga", lat: -21.13, lng: -175.20 },
{ nome: "Tiraspol", nazione: "Transnistria", lat: 46.83, lng: 29.63 },
{ nome: "Port of Spain", nazione: "Trinidad e Tobago", lat: 10.67, lng: -61.52 },
{ nome: "Tunisi", nazione: "Tunisia", lat: 36.80, lng: 10.18 },
{ nome: "Ankara", nazione: "Turchia", lat: 39.92, lng: 32.85 },
{ nome: "Aşgabat", nazione: "Turkmenistan", lat: 37.95, lng: 58.38 },
{ nome: "Funafuti", nazione: "Tuvalu", lat: -8.52, lng: 179.20 },
{ nome: "Kiev", nazione: "Ucraina", lat: 50.45, lng: 30.52 },
{ nome: "Kampala", nazione: "Uganda", lat: 0.35, lng: 32.58 },
{ nome: "Budapest", nazione: "Ungheria", lat: 47.50, lng: 19.04 },
{ nome: "Montevideo", nazione: "Uruguay", lat: -34.90, lng: -56.17 },
{ nome: "Tashkent", nazione: "Uzbekistan", lat: 41.30, lng: 69.24 },
{ nome: "Port Vila", nazione: "Vanuatu", lat: -17.73, lng: 168.32 },
{ nome: "Caracas", nazione: "Venezuela", lat: 10.48, lng: -66.90 },
{ nome: "Hanoi", nazione: "Vietnam", lat: 21.03, lng: 105.83 },
{ nome: "Sana'a", nazione: "Yemen", lat: 15.35, lng: 44.21 },
{ nome: "Lusaka", nazione: "Zambia", lat: -15.42, lng: 28.28 },
{ nome: "Harare", nazione: "Zimbabwe", lat: -17.83, lng: 31.05 },
];

// 3. Disegno confini RAFFINATO
L.geoJSON(datiConfini, {
  renderer: myRenderer,
  style: { 
    color: '#999',       // Grigio più chiaro
    weight: 0.7,         // Linea più sottile
    fillColor: '#ffffff', 
    fillOpacity: 1,
    smoothFactor: 1 
  },
  interactive: false 
}).addTo(map);

// Variabili di Stato
let modalitaCorrente = ''; 
let tempoImpostato = 0; 
let tempoRimanente = 0;
let countdownInterval;
let capitaliDaGiocare = [];
let capitaleCorrente;
let punteggio = 0;
let inAttesa = false;
let puntiniMappa = {};

// --- GESTIONE MENU E NAVIGAZIONE ---
function mostraSelettoreTempo() {
  document.getElementById('primary-buttons').style.display = 'none';
  document.getElementById('time-selector').style.display = 'block';
}

function nascondiSelettoreTempo() {
  document.getElementById('primary-buttons').style.display = 'block';
  document.getElementById('time-selector').style.display = 'none';
}

function tornaAlMenu() {
  clearInterval(countdownInterval);
  document.getElementById('main-menu').style.display = 'flex';
  document.getElementById('game-over-screen').style.display = 'none';
  if(punteggio > 0 && modalitaCorrente !== 'studio') {
    document.getElementById('last-score-text').innerText = "Ultimo punteggio: " + punteggio;
  }
}

function avviaModalita(modo, tempo = 0) {
  modalitaCorrente = modo;
  tempoImpostato = tempo;
  
  // Nascondi Menù
  document.getElementById('main-menu').style.display = 'none';
  nascondiSelettoreTempo();

  // Reset Interfaccia e Logica
  clearInterval(countdownInterval);
  punteggio = 0;
  inAttesa = false;
  capitaliDaGiocare = [...capitali];
  
  // Pulizia Mappa
  for (let n in puntiniMappa) {
    puntiniMappa[n].setStyle({ color: '#007BFF', fillColor: '#007BFF', fillOpacity: 0 });
    puntiniMappa[n].hitBox.unbindTooltip();
  }

  // Configurazione in base alla modalità
  if (modo === 'studio') {
    document.getElementById('target-text').innerText = "Esplora e clicca i pallini";
    document.getElementById('score').style.display = 'none';
    document.getElementById('timer-display').style.display = 'none';
  } else if (modo === 'libera') {
    document.getElementById('score').style.display = 'block';
    document.getElementById('score').innerText = "Punteggio: 0";
    document.getElementById('timer-display').style.display = 'none';
    nuovaCapitale();
  } else if (modo === 'tempo') {
    document.getElementById('score').style.display = 'block';
    document.getElementById('score').innerText = "Punteggio: 0";
    document.getElementById('timer-display').style.display = 'block';
    tempoRimanente = tempoImpostato;
    aggiornaDisplayTimer();
    countdownInterval = setInterval(tickTimer, 1000);
    nuovaCapitale();
  }
}

// --- LOGICA DI GIOCO ---
function calcolaRaggio() { return map.getZoom() * 1.2; }

function creaTestoTooltip(c) {
  return `<div style="text-align: center; line-height: 1.3;">
            <b style="color: #444; font-size: 12px;">${c.nazione.toUpperCase()}</b><br>
            <span style="color: #666; font-size: 13px;">${c.nome}</span>
          </div>`;
}

// Inizializzazione Pallini (Viene chiamata una sola volta all'avvio)
capitali.forEach(c => {
  const marker = L.circleMarker([c.lat, c.lng], {
    color: '#007BFF', fillOpacity: 0, radius: calcolaRaggio(), weight: 1.5, interactive: false 
  }).addTo(map);

  const hitBox = L.circleMarker([c.lat, c.lng], {
    color: 'transparent', fillColor: 'transparent', fillOpacity: 0, opacity: 0, radius: 7, interactive: true    
  }).addTo(map);

  marker.hitBox = hitBox;
  puntiniMappa[c.nome] = marker;

  hitBox.on('click', () => {
    // Se siamo in MODALITÀ STUDIO, mostra solo il nome senza punti
    if (modalitaCorrente === 'studio') {
      marker.setStyle({ fillOpacity: 0.5 });
      marker.hitBox.bindTooltip(creaTestoTooltip(c)).openTooltip();
      return;
    }

    if (inAttesa || marker.options.fillOpacity === 1) return;
    if (modalitaCorrente === 'tempo' && tempoRimanente <= 0) return;
    
    inAttesa = true;
    const markerCorretto = puntiniMappa[capitaleCorrente.nome];

    if (c.nome === capitaleCorrente.nome) {
      marker.setStyle({ color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 1 });
      marker.hitBox.bindTooltip(creaTestoTooltip(c), { direction: 'top', offset: [0, -6] }).openTooltip();
      punteggio += 10;
    } else {
      marker.setStyle({ color: '#c62828', fillColor: '#ef5350', fillOpacity: 1 });
      markerCorretto.setStyle({ color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 1 });
      markerCorretto.hitBox.bindTooltip(creaTestoTooltip(capitaleCorrente), { direction: 'top', offset: [0, -6] }).openTooltip();
    }

    document.getElementById('score').innerText = "Punteggio: " + punteggio;
    setTimeout(() => {
      if (c.nome !== capitaleCorrente.nome) { marker.setStyle({ color: '#007BFF', fillOpacity: 0 }); }
      nuovaCapitale();
    }, 600);
  });
});

function nuovaCapitale() {
  inAttesa = false;
  if (modalitaCorrente === 'tempo' && tempoRimanente <= 0) return;
  if (capitaliDaGiocare.length === 0) {
    document.getElementById('target-text').innerText = "Mappa completata!";
    if (modalitaCorrente === 'tempo') finePartitaTempo();
    return;
  }
  const idx = Math.floor(Math.random() * capitaliDaGiocare.length);
  capitaleCorrente = capitaliDaGiocare[idx];
  capitaliDaGiocare.splice(idx, 1);
  document.getElementById('target-text').innerText = "Trova: " + capitaleCorrente.nome;
}

// --- GESTIONE TEMPO E RECORD ---
function tickTimer() {
  tempoRimanente--;
  aggiornaDisplayTimer();
  if (tempoRimanente <= 0) finePartitaTempo();
}

function aggiornaDisplayTimer() {
  const m = Math.floor(tempoRimanente / 60);
  const s = tempoRimanente % 60;
  document.getElementById('timer-display').innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function finePartitaTempo() {
  clearInterval(countdownInterval);
  inAttesa = true;
  document.getElementById('target-text').innerText = "Tempo Scaduto!";
  
  durataPartitaMinuti = tempoImpostato / 60;
  
  document.getElementById('final-score-display').innerText = punteggio + " Punti";
  document.getElementById('lb-time-label').innerText = durataPartitaMinuti;
  
  // Prepara l'input del nome
  document.getElementById("player-name").value = "";
  document.getElementById("player-name").disabled = false;
  document.getElementById("name-input-container").style.display = "block";
  document.getElementById("leaderboard-container").style.display = "none";

  document.getElementById("game-over-screen").style.display = "flex"; 
}

// Reattività Zoom
map.on('zoomend', () => {
  const r = calcolaRaggio();
  for (let n in puntiniMappa) puntiniMappa[n].setRadius(r);
});

// Forza Leaflet a ricalcolare le dimensioni esatte dopo l'avvio su mobile
setTimeout(() => {
  map.invalidateSize();
}, 500);

// Aggiorna anche se si ruota il telefono
window.addEventListener('resize', () => {
  map.invalidateSize();
});

// --- INIZIO FUNZIONI DATABASE GLOBALE ---
function inviaPunteggioGlobale() {
  const nomeInserito = document.getElementById("player-name").value.trim();
  
  if (nomeInserito === "") {
    alert("Inserisci un nome o un nickname per salvarti in classifica!");
    return;
  }
  
  document.getElementById("player-name").disabled = true;
  document.getElementById("btn-submit-score").innerText = "Invio in corso...";
  
  const nomeCollezione = "classifica_" + durataPartitaMinuti + "min";
  
  db.collection(nomeCollezione).add({
    name: nomeInserito,
    score: punteggio, // Modificato per corrispondere alla tua variabile globale
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById("name-input-container").style.display = "none";
    document.getElementById("btn-submit-score").innerText = "🚀 Invia alla Classifica";
    caricaClassificaGlobale(durataPartitaMinuti);
  })
  .catch((error) => {
    console.error("Errore:", error);
    alert("Errore di rete. Riprova tra poco.");
    document.getElementById("player-name").disabled = false;
    document.getElementById("btn-submit-score").innerText = "🚀 Invia alla Classifica";
  });
}

function caricaClassificaGlobale(minuti) {
  const nomeCollezione = "classifica_" + minuti + "min";
  const listaHTML = document.getElementById("leaderboard-list");
  
  listaHTML.innerHTML = "<li>Caricamento podio...</li>";
  document.getElementById("leaderboard-container").style.display = "block";
  
  db.collection(nomeCollezione)
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then((querySnapshot) => {
      listaHTML.innerHTML = ""; 
      if (querySnapshot.empty) {
        listaHTML.innerHTML = "<li>Nessun punteggio record. Sii il primo!</li>";
        return;
      }
      
      let posizione = 1;
      querySnapshot.forEach((doc) => {
        const dati = doc.data();
        let medaglia = posizione + ". ";
        if (posizione === 1) medaglia = "🥇 ";
        if (posizione === 2) medaglia = "🥈 ";
        if (posizione === 3) medaglia = "🥉 ";
        
        listaHTML.innerHTML += `<li>${medaglia} ${dati.name} — <span style="color:#007BFF">${dati.score} pt</span></li>`;
        posizione++;
      });
    })
    .catch((error) => {
      listaHTML.innerHTML = "<li>Impossibile caricare la classifica globale.</li>";
    });
}
// --- FINE FUNZIONI DATABASE GLOBALE ---