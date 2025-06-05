

const loader = document.getElementById("loading");
const sectionFiltres = document.querySelector(".filtres");
const btnFiter = document.getElementById("btn-filtre");
const btnRanger = document.getElementById("inputRange");
const sectionFiches = document.querySelector(".fiches");
const btnSortPiece = document.getElementById("btn-sort");
const resultSection = document.getElementById("piecs-filtres");
const btnModeToggle = document.getElementById("darkModeToggle");

// Fonction pour afficher les pièces
function displayPieces (pieces) {
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces [i];
        const block = document.createElement("div");
        const title = document.createElement("h2");
        const imgPiece = document.createElement("img");
        const priceElement = document.createElement("span");
        const descElement = document.createElement("p");
        const categoryElement = document.createElement("p");
        const btnAvis = document.createElement("button");

        title.textContent = piece.nom;
        imgPiece.src = piece.image;
        imgPiece.alt = piece.image;
        priceElement.innerText = `prix: ${piece.prix} € (${piece.prix < 35 ? "€" : "€€€"}) `;
        descElement.textContent = piece.description;
        categoryElement.textContent = piece.categorie?? "aucune";
        btnAvis.textContent = "afficher les avis";
        btnAvis.classList.add("btn-avis");
        btnAvis.dataset.id = piece.id;

        block.classList.add("blockPiece");
        block.appendChild(imgPiece);
        block.appendChild(title);
        block.appendChild(descElement);
        block.appendChild(categoryElement);
        block.appendChild(priceElement);
        block.appendChild(btnAvis);

        sectionFiches.appendChild(block);
    }

    
}

// Fonction pour filtrer les pièces non abordables
function filterPieceNonAbordable (pieces) {
    resultSection.innerHTML = "";

    const pieceFiltre = pieces.filter(piece => piece.prix <= 20 )
    .map(piece => piece.nom);

    for (let i = 0; i < pieceFiltre.length; i++) {
        const titleElement = document.createElement("h5");

        const piece = pieceFiltre[i];
        titleElement.textContent = piece;

        resultSection.appendChild(titleElement);
    }
}

// Fonction pour trier les pièces en fonction du prix
function sortPieces (pieces) {

    resultSection.innerHTML = "";
    const sortPieces = Array.from(pieces);

    sortPieces.sort((a,b) => {

        return a.prix - b.prix;
    })

    for (let i = 0; i < sortPieces.length; i++) {

        const title = document.createElement("h5");
        const piece = sortPieces[i];

        title.textContent = piece.nom;
        resultSection.appendChild(title);
    }
}

// Fonction pour arranger les pièces en fonction du prix
function arrangerpieces(pieces,btnRanger) {

    const pieceRanger = pieces.filter((piece) => {
        if(!piece.prix) {
            // Si le prix n'est pas défini, on ignore cette pièce
            console.warn( "piece manque le prix:",piece);
            return false;
        }
        return piece.prix <= Number(btnRanger.value);
    })

    sectionFiches.innerHTML = ""; 
    displayPieces(pieceRanger);
}

// Fonction pour stocker les informations du navigateur et de la géolocalisation dans le localStorage
async function stockCookies() {

    const browserInfos = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: {
            width: window.screen.width,
            height: window.screen.height
        },
        //cookiesEnabled: navigator.cookieEnabled,
        //timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    const timestamp = new Date().toISOString();
    
    if ( navigator.geolocation) {

        try {
            const position = await getposition();

            const localisation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }

            const fullInfos = {
                browserInfos,
                localisation,
                timestamp,
            }

            window.localStorage.setItem("cookieInfos", JSON.stringify(fullInfos));
        }
        catch (error) {
            console.error("Géolocalisation refusée ou échouée:", error);
        }
    }
    
}

// Fonction pour définir un cookie avec une durée d'expiration
function setCookie (name, value, hours) {
    let expires = "";

    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expires= "; expires=" + date.toUTCString();
    }

    document.cookie = `${name}=${value}${expires}; path=/`;
    
    console.log(`Cookie ${name} défini avec la valeur: ${value}`)
}

// Fonction pour obtenir la valeur d'un cookie par son nom
function getCookie (name) {

    const nameEQ = name + "=";
    const cookies = decodeURIComponent(document.cookie).split(';');

    for (let cookie of cookies) {

        const cookieTrimmed = cookie.trim();

        if (cookieTrimmed.indexOf(nameEQ) === 0) {
            return cookieTrimmed.substring(nameEQ.length, cookieTrimmed.length);
        }
    }
} 

// Fonction pour vérifier si le cookie est accepté
function delay (ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

// Fonction pour obtenir la position géographique de l'utilisateur
function getposition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

//
function listCookies () {

    const cookies = document.cookie.split(";");

    cookies.forEach(cookie => {
        console.log(cookie);
    })
}

// Fonction d'initialisation
async function init () {
    try {
        loader.style.display = "flex";
        let pieces;
        const cache = window.localStorage.getItem("pieces");
        if(cache === true) {

            pieces = JSON.parse(cache);  
        }
        else {
            const response= await fetch(`https://api-pieces.onrender.com/pieces`);//https://api-pieces.onrender.com/pieces
            pieces = await response.json();
            window.localStorage.setItem("pieces", JSON.stringify(pieces));
        }
        
        await delay(2000);
        loader.style.display = "none";

        displayPieces (pieces);

        const darkMode = window.localStorage.getItem("darkMode");

        // Vérification du mode sombre/clair
        if(darkMode === "dark") {
            document.body.classList.add("dark-mode");
            btnModeToggle.textContent = "mode clair";
            sectionFiltres.style.backgroundColor = "#333";
        }

        // Gestion des événements pour changer le mode sombre/clair
        btnModeToggle.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("dark-mode"); // Bascule la classe dark-mode sur le body

            if(document.body.classList.contains("dark-mode")) {

                btnModeToggle.textContent = "mode clair";
                sectionFiltres.style.backgroundColor = "#333";
                btnModeToggle.style.backgroundColor = "#555";
                btnModeToggle.style.color = "#fff";
                localStorage.setItem("darkMode", "dark");
            } else {
                btnModeToggle.textContent = "mode sombre";
                btnModeToggle.style.backgroundColor = "#fff";
                btnModeToggle.style.color = "#000";
                sectionFiltres.style.backgroundColor = "#fff";
                localStorage.setItem("darkMode", "light");
            }
        })
        
        // Gestion des événements pour les boutons de filtrage et de tri
        btnFiter.addEventListener('click', (e) => {
            e.preventDefault();
            filterPieceNonAbordable(pieces);
        })

        // Gestion des événements pour le tri des pièces
        btnSortPiece.addEventListener("click", (e) => {
            e.preventDefault();
            sortPieces (pieces);
        })
        
        // Gestion des événements pour le slider de prix
        btnRanger.addEventListener("input", (e) => {
            e.preventDefault();
            arrangerpieces(pieces,btnRanger);
        })

        

        const Banner = document.getElementById("cookieBanner");
        const btnAcceptCookie = document.getElementById("acceptCookie");
        const accepted = getCookie("cookieAccepted") === "true";

        // Vérification de l'acceptation des cookies
        if (accepted) {

            Banner.style.display = "none";
            listCookies();

        } else {

            btnAcceptCookie.addEventListener("click", async(e) => {
                e.preventDefault();
                setCookie("cookieAccepted", "true", 1);
                await stockCookies();
                listCookies();
                Banner.style.display = "none";
            })
        }

    } catch (error) {
        return "erreur de charhement:", error;
    }
}

document.addEventListener("DOMContentLoaded", init());