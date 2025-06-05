# 🛠️ API Pièces – Frontend + Backend JSON Server

Ce projet est une démonstration d'une application frontend qui consomme une API REST simulée avec `json-server`, hébergée sur [Render.com](https://render.com). Elle permet d'afficher des pièces électroniques et leurs avis utilisateurs de façon interactive.

---

## 🚀 Fonctionnalités

- Affichage dynamique des pièces depuis l'API.
- Chargement des avis pour chaque pièce au clic.
- Mise en cache locale des avis via `localStorage`.
- API auto-déployée sur Render à partir d’un fichier `db.json`.

---

## 📦 Technologies utilisées

### Backend
- [`json-server`](https://github.com/typicode/json-server) – pour simuler une API REST à partir de `db.json`.
- [Render.com](https://render.com) – pour déployer l’API gratuitement en ligne.

### Frontend
- HTML/CSS/JavaScript Vanilla
- `fetch` API pour la communication avec le serveur
- `localStorage` pour le caching des données

---

## 🌐 API publique

L’API est disponible à cette adresse :  
👉 [`https://api-pieces.onrender.com`](https://api-pieces.onrender.com)

### Endpoints disponibles

- `GET /pieces` : Liste toutes les pièces
- `GET /pieces/:id` : Récupère une pièce spécifique
- `GET /avis?pieceId=:id` : Avis d’une pièce

---

## 📁 Structure du projet

