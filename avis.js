/* global Chart */

export function ajoutListenerAvis () {
    const btnAvis = document.querySelectorAll(".btn-avis");

    for ( let i = 0; i < btnAvis.length; i++) {
        btnAvis[i].addEventListener("click", async (e) => {
            e.preventDefault();

            const id = e.target.dataset.id;
            const pieceElement = e.target.parentElement;
            let avis;
            const avisEncache = window.localStorage.getItem(`avis-piece-${id}`);

            if (avisEncache) {
                avis = JSON.parse(avisEncache);
            } else {
                const response = await fetch(`https://api-pieces.onrender.com/pieces/${id}/avis`);
                avis = await response.json();
                window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));
            }

            afficherAvis(avis, pieceElement);
            btnAvis[i].disabled = true;
        })
    }
}

export function afficherAvis (avis, pieceElement) {
    for ( let i = 0; i < avis.length; i++) {
        const avisElement = document.createElement("p");

        avisElement.innerHTML = `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} </br>
            <small>etoiles:${
                avis[i].nbEtoiles && avis[i].nbEtoiles > 0 ? "⭐".repeat(avis[i].nbEtoiles) + ` (${avis[i].nbEtoiles})`
                : "Aucune étoile"
            } </small>
        `;
        pieceElement.appendChild(avisElement);
    }       
}

export function ajoutListernerEnvoyerAvis () {
    const formulaire = document.querySelector(".formulaire-avis");

    formulaire.addEventListener("submit", async (e) => {
        e.preventDefault();

        const avisdata = {
            pieceId: parseInt(e.target.querySelector("[name=piece-id]").value),
            utilisateur: e.target.querySelector("[name=utilisateur]").value,
            commentaire: e.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(e.target.querySelector("[name=nb-etoiles]").value)
        }

        const chaine = JSON.stringify(avisdata);

        await fetch(`https://api-pieces.onrender.com/avis`, {
            method: "Post",
            headers: {
                "content-type": "application/json"
            },
            body: chaine
        })
        // Invalide les avis en cache pour la pièce concernée
        window.localStorage.removeItem(`avis-piece-${avisdata.pieceId}`);
        formulaire.reset();
    })
}

// Création du graphique avec Chart.js
export async function afficherGraphiqueAvis () {

    const avis = await fetch(`https://api-pieces.onrender.com/avis`)
        .then(avis => avis.json());

    const nb_commentaires = [0, 0, 0, 0, 0];

    for (let commentaire of avis) {

        nb_commentaires [commentaire.nbEtoiles - 1] ++;
    }

    const labels = ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"];

    const data = {
        labels: labels,
        datasets: [{
            label: "Etoiles attribuées",
            data: nb_commentaires,
            backgroundColor: [
                'rgba(255,206,86,1)',
            ],
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: "y",
        }
    };

    // Création du graphique
    new Chart(
        document.getElementById("graphique-avis"),
        config,
    );
}