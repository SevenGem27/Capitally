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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variabili di Stato Globali
let durataPartitaMinuti = 2;
let zonaSelezionata = 'Mondo'; 
let modalitaCorrente = ''; 
let tempoImpostato = 0; 
let tempoRimanente = 0;
let countdownInterval;
let capitaliDaGiocare = [];
let capitaleCorrente;
let punteggio = 0;
let inAttesa = false;
let puntiniMappa = {};

// ==========================================
// 1. INIZIALIZZAZIONE MAPPA LEAFLET
// ==========================================
const myRenderer = L.canvas({ padding: 1.5 });

const map = L.map('map', {
  center: [0, 10], 
  zoom: 4,
  minZoom: 3,
  maxZoom: 6,
  maxBounds: [[-90, -180], [90, 180]],
  maxBoundsViscosity: 1.0,
  preferCanvas: true,
  renderer: myRenderer,
  zoomControl: false,
  worldCopyJump: true,
  layers: [] 
});

// ==========================================
// COORDINATE DI FUOCO PER I CONTINENTI
// ==========================================
const inquadratureContinenti = {
    'Mondo':   [[-60, -130], [75, 150]], 
    'Europa':  [[34, -15], [72, 45]],    
    'Africa':  [[-35, -20], [38, 60]],   
    'Asia':    [[-11, 25], [75, 150]],   
    'America': [[-56, -170], [75, -35]], 
    'Oceania': [[-50, 110], [15, 180]]   
};

// DISEGNO DEI CONFINI
if (typeof datiConfini !== 'undefined') {
  L.geoJSON(datiConfini, {
      style: function() {
          return { fillColor: "#3a5a40", weight: 1, opacity: 1, color: "#c2a153", fillOpacity: 1 };
      }
  }).addTo(map);
}

// IL DATABASE DELLE CAPITALI CON I CONTINENTI
const capitali = [
{ nome: "Sukhumi", nazione: "Abcasia", lat: 43.00, lng: 41.02, continente: "Asia" },
{ nome: "Kabul", nazione: "Afghanistan", lat: 34.53, lng: 69.17, continente: "Asia" },
{ nome: "Tirana", nazione: "Albania", lat: 41.33, lng: 19.82, continente: "Europa" },
{ nome: "Algeri", nazione: "Algeria", lat: 36.75, lng: 3.06, continente: "Africa" },
{ nome: "Andorra la Vella", nazione: "Andorra", lat: 42.51, lng: 1.52, continente: "Europa" },
{ nome: "Luanda", nazione: "Angola", lat: -8.84, lng: 13.23, continente: "Africa" },
{ nome: "Saint John's", nazione: "Antigua e Barbuda", lat: 17.12, lng: -61.85, continente: "America" },
{ nome: "Riad", nazione: "Arabia Saudita", lat: 24.71, lng: 46.68, continente: "Asia" },
{ nome: "Buenos Aires", nazione: "Argentina", lat: -34.60, lng: -58.38, continente: "America" },
{ nome: "Yerevan", nazione: "Armenia", lat: 40.18, lng: 44.51, continente: "Asia" },
{ nome: "Canberra", nazione: "Australia", lat: -35.28, lng: 149.13, continente: "Oceania" },
{ nome: "Vienna", nazione: "Austria", lat: 48.21, lng: 16.37, continente: "Europa" },
{ nome: "Baku", nazione: "Azerbaigian", lat: 40.41, lng: 49.87, continente: "Asia" },
{ nome: "Nassau", nazione: "Bahamas", lat: 25.03, lng: -77.40, continente: "America" },
{ nome: "Manama", nazione: "Bahrein", lat: 27.16, lng: 49.38, continente: "Asia" },
{ nome: "Dhaka", nazione: "Bangladesh", lat: 23.81, lng: 90.41, continente: "Asia" },
{ nome: "Bridgetown", nazione: "Barbados", lat: 13.10, lng: -59.62, continente: "America" },
{ nome: "Bruxelles", nazione: "Belgio", lat: 50.85, lng: 4.35, continente: "Europa" },
{ nome: "Belmopan", nazione: "Belize", lat: 17.25, lng: -88.77, continente: "America" },
{ nome: "Porto-Novo", nazione: "Benin", lat: 6.50, lng: 2.60, continente: "Africa" },
{ nome: "Thimphu", nazione: "Bhutan", lat: 27.47, lng: 89.64, continente: "Asia" },
{ nome: "Minsk", nazione: "Bielorussia", lat: 53.90, lng: 27.57, continente: "Europa" },
{ nome: "Naypyidaw", nazione: "Birmania", lat: 19.75, lng: 96.13, continente: "Asia" },
{ nome: "Sucre", nazione: "Bolivia", lat: -19.03, lng: -65.26, continente: "America" },
{ nome: "Sarajevo", nazione: "Bosnia ed Erzegovina", lat: 43.85, lng: 18.41, continente: "Europa" },
{ nome: "Gaborone", nazione: "Botswana", lat: -24.63, lng: 25.92, continente: "Africa" },
{ nome: "Brasilia", nazione: "Brasile", lat: -15.79, lng: -47.88, continente: "America" },
{ nome: "Bandar Seri Begawan", nazione: "Brunei", lat: 4.89, lng: 114.94, continente: "Asia" },
{ nome: "Sofia", nazione: "Bulgaria", lat: 42.70, lng: 23.32, continente: "Europa" },
{ nome: "Ouagadougou", nazione: "Burkina Faso", lat: 12.37, lng: -1.53, continente: "Africa" },
{ nome: "Gitega", nazione: "Burundi", lat: -3.43, lng: 29.93, continente: "Africa" },
{ nome: "Phnom Penh", nazione: "Cambogia", lat: 11.56, lng: 104.93, continente: "Asia" },
{ nome: "Yaoundé", nazione: "Camerun", lat: 3.85, lng: 11.50, continente: "Africa" },
{ nome: "Ottawa", nazione: "Canada", lat: 45.42, lng: -75.70, continente: "America" },
{ nome: "Praia", nazione: "Capo Verde", lat: 14.92, lng: -23.51, continente: "Africa" },
{ nome: "N'Djamena", nazione: "Ciad", lat: 12.13, lng: 15.05, continente: "Africa" },
{ nome: "Santiago", nazione: "Cile", lat: -33.45, lng: -70.67, continente: "America" },
{ nome: "Pechino", nazione: "Cina", lat: 39.90, lng: 116.41, continente: "Asia" },
{ nome: "Nicosia", nazione: "Cipro", lat: 35.19, lng: 33.38, continente: "Europa" },
{ nome: "Bogotà", nazione: "Colombia", lat: 4.71, lng: -74.07, continente: "America" },
{ nome: "Moroni", nazione: "Comore", lat: -11.70, lng: 43.25, continente: "Africa" },
{ nome: "Pyongyang", nazione: "Corea del Nord", lat: 39.03, lng: 125.75, continente: "Asia" },
{ nome: "Seul", nazione: "Corea del Sud", lat: 37.57, lng: 126.98, continente: "Asia" },
{ nome: "Yamoussoukro", nazione: "Costa d'Avorio", lat: 6.82, lng: -5.28, continente: "Africa" },
{ nome: "San José", nazione: "Costa Rica", lat: 9.93, lng: -84.08, continente: "America" },
{ nome: "Zagabria", nazione: "Croazia", lat: 45.81, lng: 15.98, continente: "Europa" },
{ nome: "L'Avana", nazione: "Cuba", lat: 23.11, lng: -82.37, continente: "America" },
{ nome: "Copenaghen", nazione: "Danimarca", lat: 55.68, lng: 12.57, continente: "Europa" },
{ nome: "Roseau", nazione: "Dominica", lat: 15.30, lng: -61.39, continente: "America" },
{ nome: "Quito", nazione: "Ecuador", lat: -0.22, lng: -78.50, continente: "America" },
{ nome: "Il Cairo", nazione: "Egitto", lat: 30.04, lng: 31.24, continente: "Africa" },
{ nome: "San Salvador", nazione: "El Salvador", lat: 13.70, lng: -89.20, continente: "America" },
{ nome: "Abu Dhabi", nazione: "Emirati Arabi Uniti", lat: 24.45, lng: 54.37, continente: "Asia" },
{ nome: "Asmara", nazione: "Eritrea", lat: 15.33, lng: 38.93, continente: "Africa" },
{ nome: "Tallinn", nazione: "Estonia", lat: 59.44, lng: 24.75, continente: "Europa" },
{ nome: "Mbabane", nazione: "Eswatini", lat: -26.32, lng: 31.14, continente: "Africa" },
{ nome: "Addis Abeba", nazione: "Etiopia", lat: 9.02, lng: 38.75, continente: "Africa" },
{ nome: "Suva", nazione: "Figi", lat: -18.12, lng: 178.43, continente: "Oceania" },
{ nome: "Manila", nazione: "Filippine", lat: 14.60, lng: 120.98, continente: "Asia" },
{ nome: "Helsinki", nazione: "Finlandia", lat: 60.17, lng: 24.94, continente: "Europa" },
{ nome: "Parigi", nazione: "Francia", lat: 48.86, lng: 2.35, continente: "Europa" },
{ nome: "Libreville", nazione: "Gabon", lat: 0.42, lng: 9.45, continente: "Africa" },
{ nome: "Banjul", nazione: "Gambia", lat: 13.45, lng: -16.58, continente: "Africa" },
{ nome: "Tbilisi", nazione: "Georgia", lat: 41.72, lng: 44.78, continente: "Asia" },
{ nome: "Berlino", nazione: "Germania", lat: 52.52, lng: 13.41, continente: "Europa" },
{ nome: "Accra", nazione: "Ghana", lat: 5.56, lng: -0.20, continente: "Africa" },
{ nome: "Kingston", nazione: "Giamaica", lat: 17.97, lng: -76.79, continente: "America" },
{ nome: "Tokyo", nazione: "Giappone", lat: 35.69, lng: 139.69, continente: "Asia" },
{ nome: "Gibuti", nazione: "Gibuti", lat: 11.59, lng: 43.15, continente: "Africa" },
{ nome: "Amman", nazione: "Giordania", lat: 31.95, lng: 35.93, continente: "Asia" },
{ nome: "Atene", nazione: "Grecia", lat: 37.98, lng: 23.73, continente: "Europa" },
{ nome: "Saint George's", nazione: "Grenada", lat: 12.06, lng: -61.75, continente: "America" },
{ nome: "Guatemala City", nazione: "Guatemala", lat: 14.63, lng: -90.53, continente: "America" },
{ nome: "Conakry", nazione: "Guinea", lat: 9.51, lng: -13.71, continente: "Africa" },
{ nome: "Bissau", nazione: "Guinea-Bissau", lat: 11.86, lng: -15.60, continente: "Africa" },
{ nome: "Ciudad de la Paz", nazione: "Guinea Equatoriale", lat: 1.75, lng: 10.58, continente: "Africa" },
{ nome: "Georgetown", nazione: "Guyana", lat: 6.80, lng: -58.16, continente: "America" },
{ nome: "Port-au-Prince", nazione: "Haiti", lat: 18.54, lng: -72.34, continente: "America" },
{ nome: "Tegucigalpa", nazione: "Honduras", lat: 14.10, lng: -87.20, continente: "America" },
{ nome: "Nuova Delhi", nazione: "India", lat: 28.61, lng: 77.21, continente: "Asia" },
{ nome: "Jakarta", nazione: "Indonesia", lat: -6.20, lng: 106.82, continente: "Asia" },
{ nome: "Teheran", nazione: "Iran", lat: 35.69, lng: 51.38, continente: "Asia" },
{ nome: "Baghdad", nazione: "Iraq", lat: 33.32, lng: 44.36, continente: "Asia" },
{ nome: "Dublino", nazione: "Irlanda", lat: 53.35, lng: -6.26, continente: "Europa" },
{ nome: "Reykjavík", nazione: "Islanda", lat: 64.15, lng: -21.94, continente: "Europa" },
{ nome: "Avarua", nazione: "Isole Cook", lat: -21.21, lng: -159.77, continente: "Oceania" },
{ nome: "Majuro", nazione: "Isole Marshall", lat: 7.09, lng: 171.38, continente: "Oceania" },
{ nome: "Honiara", nazione: "Isole Salomone", lat: -9.43, lng: 159.95, continente: "Oceania" },
{ nome: "Gerusalemme", nazione: "Israele", lat: 31.40, lng: 34.80, continente: "Asia" },
{ nome: "Roma", nazione: "Italia", lat: 41.90, lng: 12.50, continente: "Europa" },
{ nome: "Astana", nazione: "Kazakistan", lat: 51.17, lng: 71.43, continente: "Asia" },
{ nome: "Nairobi", nazione: "Kenya", lat: -1.29, lng: 36.82, continente: "Africa" },
{ nome: "Biškek", nazione: "Kirghizistan", lat: 42.87, lng: 74.59, continente: "Asia" },
{ nome: "Tarawa Sud", nazione: "Kiribati", lat: 1.33, lng: 172.98, continente: "Oceania" },
{ nome: "Pristina", nazione: "Kosovo", lat: 42.66, lng: 21.16, continente: "Europa" },
{ nome: "Al Kuwait", nazione: "Kuwait", lat: 29.37, lng: 47.98, continente: "Asia" },
{ nome: "Vientiane", nazione: "Laos", lat: 17.97, lng: 102.60, continente: "Asia" },
{ nome: "Maseru", nazione: "Lesotho", lat: -29.32, lng: 27.48, continente: "Africa" },
{ nome: "Riga", nazione: "Lettonia", lat: 56.95, lng: 24.11, continente: "Europa" },
{ nome: "Beirut", nazione: "Libano", lat: 33.89, lng: 35.50, continente: "Asia" },
{ nome: "Monrovia", nazione: "Liberia", lat: 6.31, lng: -10.80, continente: "Africa" },
{ nome: "Tripoli", nazione: "Libia", lat: 32.89, lng: 13.19, continente: "Africa" },
{ nome: "Vaduz", nazione: "Liechtenstein", lat: 47.14, lng: 9.52, continente: "Europa" },
{ nome: "Vilnius", nazione: "Lituania", lat: 54.69, lng: 25.28, continente: "Europa" },
{ nome: "Lussemburgo", nazione: "Lussemburgo", lat: 49.61, lng: 6.13, continente: "Europa" },
{ nome: "Skopje", nazione: "Macedonia del Nord", lat: 42.00, lng: 21.43, continente: "Europa" },
{ nome: "Antananarivo", nazione: "Madagascar", lat: -18.88, lng: 47.53, continente: "Africa" },
{ nome: "Lilongwe", nazione: "Malawi", lat: -13.97, lng: 33.79, continente: "Africa" },
{ nome: "Malé", nazione: "Maldive", lat: 4.18, lng: 73.51, continente: "Asia" },
{ nome: "Kuala Lumpur", nazione: "Malesia", lat: 3.14, lng: 101.69, continente: "Asia" },
{ nome: "Bamako", nazione: "Mali", lat: 12.64, lng: -7.99, continente: "Africa" },
{ nome: "La Valletta", nazione: "Malta", lat: 35.90, lng: 14.51, continente: "Europa" },
{ nome: "Rabat", nazione: "Marocco", lat: 34.02, lng: -6.83, continente: "Africa" },
{ nome: "Nouakchott", nazione: "Mauritania", lat: 18.07, lng: -15.97, continente: "Africa" },
{ nome: "Port Louis", nazione: "Mauritius", lat: -20.16, lng: 57.50, continente: "Africa" },
{ nome: "Città del Messico", nazione: "Messico", lat: 19.43, lng: -99.13, continente: "America" },
{ nome: "Palikir", nazione: "Micronesia", lat: 6.92, lng: 158.16, continente: "Oceania" },
{ nome: "Chișinău", nazione: "Moldavia", lat: 47.01, lng: 28.86, continente: "Europa" },
{ nome: "Monaco", nazione: "Monaco", lat: 43.73, lng: 7.42, continente: "Europa" },
{ nome: "Ulan Bator", nazione: "Mongolia", lat: 47.92, lng: 106.92, continente: "Asia" },
{ nome: "Podgorica", nazione: "Montenegro", lat: 42.44, lng: 19.26, continente: "Europa" },
{ nome: "Maputo", nazione: "Mozambico", lat: -25.97, lng: 32.59, continente: "Africa" },
{ nome: "Windhoek", nazione: "Namibia", lat: -22.56, lng: 17.08, continente: "Africa" },
{ nome: "Yaren", nazione: "Nauru", lat: -0.55, lng: 166.92, continente: "Oceania" },
{ nome: "Katmandu", nazione: "Nepal", lat: 27.70, lng: 85.32, continente: "Asia" },
{ nome: "Managua", nazione: "Nicaragua", lat: 12.13, lng: -86.25, continente: "America" },
{ nome: "Niamey", nazione: "Niger", lat: 13.51, lng: 2.13, continente: "Africa" },
{ nome: "Abuja", nazione: "Nigeria", lat: 9.06, lng: 7.50, continente: "Africa" },
{ nome: "Alofi", nazione: "Niue", lat: -19.05, lng: -169.91, continente: "Oceania" },
{ nome: "Oslo", nazione: "Norvegia", lat: 59.91, lng: 10.75, continente: "Europa" },
{ nome: "Wellington", nazione: "Nuova Zelanda", lat: -41.29, lng: 174.78, continente: "Oceania" },
{ nome: "Mascate", nazione: "Oman", lat: 23.59, lng: 58.40, continente: "Asia" },
{ nome: "Tskhinvali", nazione: "Ossezia del Sud", lat: 42.60, lng: 43.69, continente: "Asia" },
{ nome: "Amsterdam", nazione: "Paesi Bassi", lat: 52.37, lng: 4.90, continente: "Europa" },
{ nome: "Islamabad", nazione: "Pakistan", lat: 33.73, lng: 73.09, continente: "Asia" },
{ nome: "Ngerulmud", nazione: "Palau", lat: 7.50, lng: 134.62, continente: "Oceania" },
{ nome: "Ramallah", nazione: "Palestina", lat: 31.90, lng: 35.20, continente: "Asia" },
{ nome: "Panama", nazione: "Panama", lat: 8.98, lng: -79.52, continente: "America" },
{ nome: "Port Moresby", nazione: "Papua Nuova Guinea", lat: -9.44, lng: 147.18, continente: "Oceania" },
{ nome: "Asunción", nazione: "Paraguay", lat: -25.26, lng: -57.63, continente: "America" },
{ nome: "Lima", nazione: "Perù", lat: -12.04, lng: -77.03, continente: "America" },
{ nome: "Varsavia", nazione: "Polonia", lat: 52.23, lng: 21.01, continente: "Europa" },
{ nome: "Lisbona", nazione: "Portogallo", lat: 38.72, lng: -9.14, continente: "Europa" },
{ nome: "Doha", nazione: "Qatar", lat: 25.29, lng: 51.53, continente: "Asia" },
{ nome: "Londra", nazione: "Regno Unito", lat: 51.51, lng: -0.13, continente: "Europa" },
{ nome: "Praga", nazione: "Repubblica Ceca", lat: 50.08, lng: 14.44, continente: "Europa" },
{ nome: "Bangui", nazione: "Repubblica Centrafricana", lat: 4.36, lng: 18.55, continente: "Africa" },
{ nome: "Brazzaville", nazione: "Repubblica del Congo", lat: -3.26, lng: 15.28, continente: "Africa" },
{ nome: "Kinshasa", nazione: "Repubblica Democratica del Congo", lat: -4.32, lng: 15.30, continente: "Africa" },
{ nome: "Santo Domingo", nazione: "Repubblica Dominicana", lat: 18.49, lng: -69.93, continente: "America" },
{ nome: "Bucarest", nazione: "Romania", lat: 44.43, lng: 26.11, continente: "Europa" },
{ nome: "Kigali", nazione: "Ruanda", lat: -1.94, lng: 30.06, continente: "Africa" },
{ nome: "Mosca", nazione: "Russia", lat: 55.75, lng: 37.62, continente: "Europa" },
{ nome: "El Aaiún", nazione: "Sahara Occidentale", lat: 27.15, lng: -13.20, continente: "Africa" },
{ nome: "Basseterre", nazione: "Saint Kitts e Nevis", lat: 17.30, lng: -62.73, continente: "America" },
{ nome: "Kingstown", nazione: "Saint Vincent e Grenadine", lat: 13.16, lng: -61.23, continente: "America" },
{ nome: "Apia", nazione: "Samoa", lat: -13.83, lng: -171.77, continente: "Oceania" },
{ nome: "Città di San Marino", nazione: "San Marino", lat: 43.94, lng: 12.45, continente: "Europa" },
{ nome: "Castries", nazione: "Santa Lucia", lat: 14.01, lng: -60.99, continente: "America" },
{ nome: "São Tomé", nazione: "São Tomé e Príncipe", lat: 0.34, lng: 6.73, continente: "Africa" },
{ nome: "Dakar", nazione: "Senegal", lat: 14.72, lng: -17.47, continente: "Africa" },
{ nome: "Belgrado", nazione: "Serbia", lat: 44.82, lng: 20.46, continente: "Europa" },
{ nome: "Victoria", nazione: "Seychelles", lat: -4.62, lng: 55.45, continente: "Africa" },
{ nome: "Freetown", nazione: "Sierra Leone", lat: 8.48, lng: -13.23, continente: "Africa" },
{ nome: "Singapore", nazione: "Singapore", lat: 1.29, lng: 103.85, continente: "Asia" },
{ nome: "Damasco", nazione: "Siria", lat: 33.51, lng: 36.30, continente: "Asia" },
{ nome: "Bratislava", nazione: "Slovacchia", lat: 48.15, lng: 17.11, continente: "Europa" },
{ nome: "Lubiana", nazione: "Slovenia", lat: 46.05, lng: 14.51, continente: "Europa" },
{ nome: "Mogadiscio", nazione: "Somalia", lat: 2.04, lng: 45.34, continente: "Africa" },
{ nome: "Hargheisa", nazione: "Somaliland", lat: 9.56, lng: 44.06, continente: "Africa" },
{ nome: "Madrid", nazione: "Spagna", lat: 40.42, lng: -3.70, continente: "Europa" },
{ nome: "Sri Jayawardenapura Kotte", nazione: "Sri Lanka", lat: 6.90, lng: 79.91, continente: "Asia" },
{ nome: "Washington", nazione: "Stati Uniti", lat: 38.89, lng: -77.04, continente: "America" },
{ nome: "Pretoria", nazione: "Sudafrica", lat: -25.75, lng: 28.19, continente: "Africa" },
{ nome: "Khartum", nazione: "Sudan", lat: 15.50, lng: 32.56, continente: "Africa" },
{ nome: "Juba", nazione: "Sudan del Sud", lat: 4.85, lng: 31.58, continente: "Africa" },
{ nome: "Paramaribo", nazione: "Suriname", lat: 5.85, lng: -55.20, continente: "America" },
{ nome: "Stoccolma", nazione: "Svezia", lat: 59.33, lng: 18.06, continente: "Europa" },
{ nome: "Berna", nazione: "Svizzera", lat: 46.95, lng: 7.45, continente: "Europa" },
{ nome: "Dušanbe", nazione: "Tagikistan", lat: 38.56, lng: 68.78, continente: "Asia" },
{ nome: "Taipei", nazione: "Taiwan", lat: 25.03, lng: 121.57, continente: "Asia" },
{ nome: "Dodoma", nazione: "Tanzania", lat: -6.17, lng: 35.74, continente: "Africa" },
{ nome: "Bangkok", nazione: "Thailandia", lat: 13.75, lng: 100.50, continente: "Asia" },
{ nome: "Dili", nazione: "Timor Est", lat: -8.56, lng: 125.57, continente: "Asia" },
{ nome: "Lomé", nazione: "Togo", lat: 6.13, lng: 1.21, continente: "Africa" },
{ nome: "Nukuʻalofa", nazione: "Tonga", lat: -21.13, lng: -175.20, continente: "Oceania" },
{ nome: "Tiraspol", nazione: "Transnistria", lat: 46.83, lng: 29.63, continente: "Europa" },
{ nome: "Port of Spain", nazione: "Trinidad e Tobago", lat: 10.67, lng: -61.52, continente: "America" },
{ nome: "Tunisi", nazione: "Tunisia", lat: 36.80, lng: 10.18, continente: "Africa" },
{ nome: "Ankara", nazione: "Turchia", lat: 39.92, lng: 32.85, continente: "Asia" },
{ nome: "Aşgabat", nazione: "Turkmenistan", lat: 37.95, lng: 58.38, continente: "Asia" },
{ nome: "Funafuti", nazione: "Tuvalu", lat: -8.52, lng: 179.20, continente: "Oceania" },
{ nome: "Kiev", nazione: "Ucraina", lat: 50.45, lng: 30.52, continente: "Europa" },
{ nome: "Kampala", nazione: "Uganda", lat: 0.35, lng: 32.58, continente: "Africa" },
{ nome: "Budapest", nazione: "Ungheria", lat: 47.50, lng: 19.04, continente: "Europa" },
{ nome: "Montevideo", nazione: "Uruguay", lat: -34.90, lng: -56.17, continente: "America" },
{ nome: "Tashkent", nazione: "Uzbekistan", lat: 41.30, lng: 69.24, continente: "Asia" },
{ nome: "Port Vila", nazione: "Vanuatu", lat: -17.73, lng: 168.32, continente: "Oceania" },
{ nome: "Caracas", nazione: "Venezuela", lat: 10.48, lng: -66.90, continente: "America" },
{ nome: "Hanoi", nazione: "Vietnam", lat: 21.03, lng: 105.83, continente: "Asia" },
{ nome: "Sana'a", nazione: "Yemen", lat: 15.35, lng: 44.21, continente: "Asia" },
{ nome: "Lusaka", nazione: "Zambia", lat: -15.42, lng: 28.28, continente: "Africa" },
{ nome: "Harare", nazione: "Zimbabwe", lat: -17.83, lng: 31.05, continente: "Africa" }
];

// ==========================================
// 2. GESTIONE MENU E NAVIGAZIONE
// ==========================================
function tornaAlGrandMenu() {
  // Sblocca i confini della mappa permettendo la vista globale
  map.setMaxBounds([[-90, -180], [90, 180]]); 
  
  clearInterval(countdownInterval);
  document.getElementById('continent-menu-screen').style.display = 'none';
  document.getElementById('world-menu-screen').style.display = 'none';
  document.getElementById('game-over-screen').style.display = 'none';
  document.getElementById('leaderboard-menu-screen').style.display = 'none';
  document.getElementById('grand-menu').style.display = 'flex';
  
  if(punteggio > 0 && modalitaCorrente !== 'studio') {
    document.getElementById('last-score-text').innerText = "Ultimo punteggio: " + punteggio;
  }
}

function apriMenuContinente(continente) {
  zonaSelezionata = continente;
  document.getElementById('grand-menu').style.display = 'none';
  document.getElementById('titolo-continente').innerText = continente;
  document.getElementById('continent-menu-screen').style.display = 'flex';
}

function apriMenuMondo() {
  zonaSelezionata = 'Mondo';
  document.getElementById('grand-menu').style.display = 'none';
  document.getElementById('world-menu-screen').style.display = 'flex';
}

function mostraSelettoreTempo() {
  document.getElementById('primary-buttons').style.display = 'none';
  document.getElementById('time-selector').style.display = 'block';
}

function nascondiSelettoreTempo() {
  document.getElementById('primary-buttons').style.display = 'block';
  document.getElementById('time-selector').style.display = 'none';
}

function avviaModalita(modo, tempo = 0) {
  modalitaCorrente = modo;
  tempoImpostato = tempo;
  
  document.getElementById('continent-menu-screen').style.display = 'none';
  document.getElementById('world-menu-screen').style.display = 'none';
  nascondiSelettoreTempo();

  clearInterval(countdownInterval);
  punteggio = 0;
  inAttesa = false;
  
  // FILTRA LE CAPITALI IN BASE ALLA SCELTA
  if (zonaSelezionata === 'Mondo') {
      capitaliDaGiocare = [...capitali];
  } else {
      capitaliDaGiocare = capitali.filter(c => c.continente === zonaSelezionata);
  }
  
  // ZOOM AUTOMATICO SUL CONTINENTE (Seziona la mappa)
  const bounds = inquadratureContinenti[zonaSelezionata];
  map.setMaxBounds(bounds); 
  map.fitBounds(bounds, { animate: true });
  
  // GESTIONE DEI PALLINI DA MOSTRARE
  for (let n in puntiniMappa) {
    let capInfo = capitali.find(c => c.nome === n);
    
    if (zonaSelezionata === 'Mondo' || capInfo.continente === zonaSelezionata) {
        puntiniMappa[n].setStyle({ color: '#ffffff', fillColor: '#007BFF', fillOpacity: 0.6, weight: 1.5 });
        puntiniMappa[n].hitBox.setStyle({ interactive: true });
    } else {
        puntiniMappa[n].setStyle({ color: 'transparent', fillColor: 'transparent', fillOpacity: 0, weight: 0 });
        puntiniMappa[n].hitBox.setStyle({ interactive: false });
    }
    puntiniMappa[n].hitBox.unbindTooltip();
  }

  // RESET DELLA UI
  if (modo === 'studio') {
    document.getElementById('target-text').innerText = `Esplora: ${zonaSelezionata}`;
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

// ==========================================
// 3. CREAZIONE PALLINI E GIOCO
// ==========================================
function calcolaRaggio() { return map.getZoom() * 1.2; }

function creaTestoTooltip(c) {
  return `<div style="text-align: center; line-height: 1.3;">
            <b style="color: #0a1128; font-size: 13px;">${c.nazione.toUpperCase()}</b><br>
            <span style="color: #c2a153; font-weight: bold; font-size: 14px;">${c.nome}</span>
          </div>`;
}

capitali.forEach(c => {
  const marker = L.circleMarker([c.lat, c.lng], {
    color: '#ffffff', weight: 1.5, fillColor: '#007BFF', fillOpacity: 0.6,
    radius: calcolaRaggio(), interactive: false 
  }).addTo(map);

  const hitBox = L.circleMarker([c.lat, c.lng], {
    color: 'transparent', fillColor: 'transparent', fillOpacity: 0,
    radius: 12, interactive: true 
  }).addTo(map);

  marker.hitBox = hitBox;
  puntiniMappa[c.nome] = marker;

  hitBox.on('click', () => {
    if (modalitaCorrente === 'studio') {
      marker.setStyle({ color: '#ffffff', fillColor: '#ffd700', fillOpacity: 0.9, weight: 2 });
      marker.hitBox.bindTooltip(creaTestoTooltip(c)).openTooltip();
      return;
    }

    if (inAttesa || marker.options.fillOpacity === 1) return;
    if (modalitaCorrente === 'tempo' && tempoRimanente <= 0) return;
    
    inAttesa = true;
    const markerCorretto = puntiniMappa[capitaleCorrente.nome];

    if (c.nome === capitaleCorrente.nome) {
      marker.setStyle({ color: '#ffffff', fillColor: '#ffd700', fillOpacity: 1, weight: 2 });
      marker.hitBox.bindTooltip(creaTestoTooltip(c), { direction: 'top', offset: [0, -6] }).openTooltip();
      punteggio += 10;
    } else {
      marker.setStyle({ color: '#ffffff', fillColor: '#d62828', fillOpacity: 1, weight: 2 });
      markerCorretto.setStyle({ color: '#ffffff', fillColor: '#ffd700', fillOpacity: 1, weight: 2 });
      markerCorretto.hitBox.bindTooltip(creaTestoTooltip(capitaleCorrente), { direction: 'top', offset: [0, -6] }).openTooltip();
    }

    document.getElementById('score').innerText = "Punteggio: " + punteggio;
    
    setTimeout(() => {
      if (c.nome !== capitaleCorrente.nome) { 
          marker.setStyle({ color: '#ffffff', fillColor: '#007BFF', fillOpacity: 0.6, weight: 1.5 }); 
      }
      nuovaCapitale();
    }, 600);
  });
});

function nuovaCapitale() {
  inAttesa = false;
  if (modalitaCorrente === 'tempo' && tempoRimanente <= 0) return;
  
  if (capitaliDaGiocare.length === 0) {
    document.getElementById('target-text').innerText = `${zonaSelezionata} completata!`;
    if (modalitaCorrente === 'tempo') finePartitaTempo();
    return;
  }
  
  const idx = Math.floor(Math.random() * capitaliDaGiocare.length);
  capitaleCorrente = capitaliDaGiocare[idx];
  capitaliDaGiocare.splice(idx, 1);
  
  document.getElementById('target-text').innerHTML = "Trova: <span id='target-capital'>" + capitaleCorrente.nome + "</span>";
}

// ==========================================
// 4. TEMPO E DIMENSIONI MAPPA
// ==========================================
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
  document.getElementById('game-over-title').innerText = `Fine ${zonaSelezionata}!`;
  durataPartitaMinuti = tempoImpostato / 60;
  
  document.getElementById('final-score-display').innerText = punteggio + " Punti";
  document.getElementById('lb-time-label').innerText = durataPartitaMinuti;
  
  if(zonaSelezionata === 'Mondo') {
      document.getElementById("name-input-container").style.display = "block";
      document.getElementById("leaderboard-container").style.display = "none";
  } else {
      document.getElementById("name-input-container").style.display = "none";
      document.getElementById("leaderboard-container").style.display = "none";
  }
  
  document.getElementById("player-name").value = "";
  document.getElementById("player-name").disabled = false;
  document.getElementById("game-over-screen").style.display = "flex"; 
}

map.on('zoomend', () => {
  const r = calcolaRaggio();
  for (let n in puntiniMappa) puntiniMappa[n].setRadius(r);
});

setTimeout(() => { map.invalidateSize(); }, 500);
window.addEventListener('resize', () => { map.invalidateSize(); });

// ==========================================
// 5. CLASSIFICHE GLOBALI FIREBASE (Solo Mondo)
// ==========================================
function formattaRigaClassifica(posizione, nome, score) {
  let medaglia = posizione + ". ";
  if (posizione === 1) medaglia = "🥇 ";
  if (posizione === 2) medaglia = "🥈 ";
  if (posizione === 3) medaglia = "🥉 ";
  return `<li>${medaglia} ${nome} — <span style="color:#c2a153">${score} pt</span></li>`; 
}

function inviaPunteggioGlobale() {
  const nomeInserito = document.getElementById("player-name").value.trim();
  if (nomeInserito === "") { alert("Inserisci un nome!"); return; }
  
  document.getElementById("player-name").disabled = true;
  document.getElementById("btn-submit-score").innerText = "Invio in corso...";
  
  db.collection("classifica_" + durataPartitaMinuti + "min").add({
    name: nomeInserito, score: punteggio, timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById("name-input-container").style.display = "none";
    document.getElementById("btn-submit-score").innerText = "🚀 Invia alla Classifica";
    caricaClassificaGlobale(durataPartitaMinuti);
  }).catch((error) => {
    alert("Errore di rete.");
    document.getElementById("player-name").disabled = false;
    document.getElementById("btn-submit-score").innerText = "🚀 Invia alla Classifica";
  });
}

function caricaClassificaGlobale(minuti) {
  const listaHTML = document.getElementById("leaderboard-list");
  listaHTML.innerHTML = "<li>Caricamento podio...</li>";
  document.getElementById("leaderboard-container").style.display = "block";
  
  db.collection("classifica_" + minuti + "min").orderBy("score", "desc").limit(5).get().then((querySnapshot) => {
      listaHTML.innerHTML = ""; 
      if (querySnapshot.empty) { listaHTML.innerHTML = "<li>Nessun record presente.</li>"; return; }
      let posizione = 1;
      querySnapshot.forEach((doc) => {
        listaHTML.innerHTML += formattaRigaClassifica(posizione, doc.data().name, doc.data().score);
        posizione++;
      });
  }).catch(() => { listaHTML.innerHTML = "<li>Errore caricamento.</li>"; });
}

function apriSchermataClassifiche() {
  document.getElementById('world-menu-screen').style.display = 'none';
  document.getElementById('leaderboard-menu-screen').style.display = 'flex';
  caricaClassificaMenu(2);
}

function chiudiSchermataClassifiche() {
  document.getElementById('leaderboard-menu-screen').style.display = 'none';
  document.getElementById('world-menu-screen').style.display = 'flex';
}

function caricaClassificaMenu(minuti) {
  document.getElementById('lb-menu-title').innerText = "Top 5 Globale - " + minuti + " Min";
  const listaHTML = document.getElementById('leaderboard-menu-list');
  listaHTML.innerHTML = "<li>Caricamento in corso... ⏳</li>";
  
  db.collection("classifica_" + minuti + "min").orderBy("score", "desc").limit(5).get().then((querySnapshot) => {
      listaHTML.innerHTML = ""; 
      if (querySnapshot.empty) { listaHTML.innerHTML = "<li>Nessun record.</li>"; return; }
      let posizione = 1;
      querySnapshot.forEach((doc) => {
        listaHTML.innerHTML += formattaRigaClassifica(posizione, doc.data().name, doc.data().score);
        posizione++;
      });
  }).catch(() => { listaHTML.innerHTML = "<li>Errore connessione.</li>"; });
}
