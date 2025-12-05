# 🌟 NIRD Quest - Le Village Numérique Résilient

Un jeu interactif et éducatif pour découvrir la démarche **NIRD** (Numérique Inclusif, Responsable et Durable) dans les établissements scolaires. 

Le site : https://nuit-de-l-info-108k.onrender.com (il faut attendre 1-2 minutes pour que le serveur se lance car il se met en mode cold start après 15min d'inactivité

![Licence MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Nuit de l'Info](https://img.shields.io/badge/Nuit%20de%20l'Info-2025-orange.svg)

---

## 📥 GUIDE COMPLET PDF

**[📄 Télécharger le Guide Complet (PDF)](./NIRD_QUEST_GUIDE_COMPLET.pdf)**

Guide de 25+ pages avec :
- Installation détaillée pas à pas
- Toutes les fonctionnalités expliquées
- Configuration avancée
- Déploiement en production
- Dépannage et FAQ

---

## 🎯 Concept

**NIRD Quest** est une aventure gamifiée où l'utilisateur devient le protecteur d'une école face aux menaces du "Numérique Goliath" : obsolescence programmée, dépendance aux Big Tech, perte de souveraineté des données...

À travers **5 scénarios réalistes** + **3 mini-jeux**, le joueur fait des choix qui impactent ses scores en :
- ♻️ **Durabilité** - Réemploi et reconditionnement
- 🔓 **Autonomie** - Logiciels libres et Linux
- 🌍 **Souveraineté** - Hébergement en Europe
- 🌱 **Sobriété** - Consommation raisonnée
- 🤝 **Inclusion** - Accessibilité et formation

---

## ✨ Fonctionnalités

### Jeu Principal
- 🎮 **Mini-jeu interactif** avec 5 scénarios et choix multiples
- 📊 **Système de scoring** dynamique sur 5 axes NIRD
- 🎖️ **Niveaux** : Expert, Avancé, Débutant, Danger
- 💾 **Sauvegarde** des sessions en temps réel

### Mini-Jeux Intégrés
- 🏰 **La Quête du Serveur Sacré** : 3 zones avec énigmes NIRD (drag & drop, choix multiples)
- 👾 **Numérifix (Pac-Man)** : Protège les données contre l'Empire Numérico
- 🏋️ **Santé Posturale** (Défi Decathlon) : 4 niveaux pour une santé durable

### Intelligence Artificielle
- 🤖 **Assistant IA Mistral** générant un plan d'action personnalisé
- 💬 **Chatbot NirdBot** : Questionnaire guidé + mode chat libre
- 🧠 Analyse des scores et recommandations adaptées

### Ressources et Solutions
- 💡 **Salle des solutions** avec alternatives NIRD complètes
- 📚 **Ressources** : Tutoriels, vidéos, guides d'installation
- 🛍️ **Produits recommandés** par profil (étudiant, particulier, entreprise)
- 🌍 **Hébergeurs souverains** français et européens

### Accessibilité
- ⚙️ **Mode dyslexie** (police OpenDyslexic)
- 🔍 **Taille de police** ajustable
- 🌓 **Contraste élevé** pour malvoyants
- ✨ **Désactivation des animations**

### Communauté
- 🤝 **Section bénévolat** : Contribuer, rejoindre Discord
- 💶 **Support Wero** : Paiement européen souverain
- 📢 **Partage** des résultats

---

## 🚀 Installation Rapide

### Prérequis
- Python 3.8+
- pip
- Git (optionnel)

### En 5 étapes

```bash
# 1. Cloner le repository
git clone https://github.com/votre-repo/nird-quest.git
cd nird-quest

# 2. Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configurer les variables d'environnement
export SECRET_KEY="votre_secret_key_aleatoire"
export MISTRAL_API_KEY="votre_cle_mistral"  # Optionnel

# Générer une SECRET_KEY :
python -c "import os; print(os.urandom(24).hex())"

# 5. Lancer l'application
python app.py
```

L'application sera accessible sur `http://localhost:5000`

---

## 🌐 Déploiement sur Render

1. Fork ce repository
2. Créer un nouveau Web Service sur [Render](https://render.com)
3. Connecter votre repository GitHub
4. Configurer les variables d'environnement :
   - `SECRET_KEY` : Clé secrète Flask
   - `MISTRAL_API_KEY` : Clé API Mistral (optionnel)
5. Configuration :
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `gunicorn app:app`
6. Déployer !

---

## 📂 Structure du Projet

```
nird-quest/
├── app.py                      # Application Flask principale
├── requirements.txt            # Dépendances Python
├── Procfile                    # Configuration Render/Heroku
├── README.md                   # Ce fichier
├── NIRD_QUEST_GUIDE_COMPLET.pdf # Guide complet
├── templates/                  # Templates HTML
│   ├── base.html              # Template de base
│   ├── home.html              # Page d'accueil avec gaulois animé
│   ├── story.html             # Prologue narratif
│   ├── game.html              # Mini-jeu principal (5 scénarios)
│   ├── quest.html             # Quête du Serveur Sacré
│   ├── pacman.html            # Numérifix (Pac-Man NIRD)
│   ├── posture.html           # Défi Decathlon (4 niveaux)
│   ├── results.html           # Résultats et scoring
│   ├── solutions.html         # Salle des solutions NIRD
│   ├── assistant.html         # Assistant IA Mistral
│   ├── resources.html         # Ressources et tutoriels
│   ├── settings.html          # Paramètres d'accessibilité
│   ├── benevolat.html         # Bénévolat et communauté
│   └── license.html           # Page licence MIT
└── static/                     # Fichiers statiques
    ├── css/
    │   ├── style.css          # Styles principaux
    │   └── chatbot.css        # Styles chatbot NirdBot
    └── js/
        ├── main.js            # JavaScript principal
        ├── chatbot.js         # Chatbot hybride (questionnaire + IA)
        └── quest/
            └── quest.js       # Logique de la quête
```

---

## 🎮 Comment Jouer

### Parcours Classique
1. **Accueil** → Découvrez le concept NIRD
2. **Histoire** → Plongez dans l'univers du Village Numérique Résilient
3. **Jouer** → 5 scénarios avec choix multiples
4. **Résultats** → Obtenez vos scores et niveau NIRD
5. **Solutions** → Découvrez comment mettre en œuvre NIRD
6. **Assistant IA** → Générez votre plan d'action personnalisé
7. **Ressources** → Explorez outils libres et communautés

### Mini-Jeux Bonus
- 🏰 **Quête du Serveur** : 3 zones, récupérez les artefacts NIRD
- 👾 **Numérifix** : Protégez les données, évitez les collecteurs
- 🏋️ **Santé Posturale** : 4 niveaux, devenez CTO de votre corps

---

## 🤖 API Mistral AI

L'assistant IA utilise Mistral AI pour générer des plans d'action personnalisés.

### Obtenir une clé API

1. Créer un compte sur [console.mistral.ai](https://console.mistral.ai)
2. Générer une clé API
3. Configurer la variable d'environnement `MISTRAL_API_KEY`

### Fonctionnement

L'IA analyse vos 5 scores NIRD et génère :
- Un diagnostic de votre situation
- 3 forces identifiées
- 3 axes d'amélioration
- Un plan d'action en 5 étapes
- Un message inspirant de Luma

**Note** : Le projet fonctionne sans clé Mistral (mode dégradé avec messages d'avertissement)

---

## 🎨 Design & Personnages Originaux

### Personnages SVG Animés
- 🌟 **Luma** - Mascotte lumineuse du village (IA bienveillante)
- 🧙 **Maître Récupix** - Expert du réemploi et de Linux
- 💻 **Les Numérins** - Petits ordinateurs vivants
- 😈 **Agent Cloudox** - Antagoniste de l'Empire Numérico
- 🛡️ **Numérifix** - Héros gaulois (Pac-Man NIRD)

### Palette de Couleurs
- Primary: `#4A90E2` (Bleu NIRD)
- Secondary: `#7B68EE` (Violet)
- Accent: `#50C878` (Vert durabilité)
- Danger: `#E74C3C` (Rouge)
- Warning: `#F39C12` (Orange)
- Decathlon: `#FF6B35` (Orange Decathlon)

---

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de :
- ✅ Utiliser commercialement
- ✅ Modifier
- ✅ Distribuer
- ✅ Utiliser en privé

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 🎓 Contexte Éducatif

Ce projet a été créé pour la **Nuit de l'Info 2025** avec pour objectif de sensibiliser aux enjeux du numérique responsable dans l'éducation.

### Objectifs Pédagogiques

- Comprendre les risques de dépendance aux Big Tech
- Découvrir les alternatives libres (Linux, logiciels libres)
- Apprendre l'importance du réemploi et de la sobriété
- Saisir les enjeux de souveraineté des données (RGPD, Cloud Act)
- Valoriser l'inclusion et l'accessibilité numérique

---

## 📚 Ressources Externes

- [Apps.education.fr](https://forge.apps.education.fr) - Outils libres pour l'éducation
- [Framasoft](https://framasoft.org) - Éducation populaire au numérique libre
- [SILL](https://www.sill.etalab.gouv.fr) - Socle Interministériel de Logiciels Libres
- [Mistral AI](https://mistral.ai) - Intelligence artificielle française
- [Decathlon](https://www.decathlon.fr) - Partenaire défi santé posturale

### Communautés
- [Discord NIRD](https://discord.gg/Avn729Av2x) - +500 membres, support 24/7
- [LinuxFr.org](https://linuxfr.org) - Forum francophone Linux
- [Ubuntu-FR](https://ubuntu-fr.org) - Communauté Ubuntu française
- [Forum Mageia](https://forum.mageia.org/fr/) - Support Mageia

---

## 🐛 Dépannage

### Problèmes Courants

**Erreur : Module 'flask' not found**
```bash
pip install -r requirements.txt
```

**Erreur : Port 5000 already in use**
```bash
export PORT=5001  # Linux/Mac
set PORT=5001     # Windows
python app.py
```

**L'assistant IA ne fonctionne pas**
- Vérifier que `MISTRAL_API_KEY` est définie
- L'assistant fonctionne en mode dégradé sans clé (messages d'avertissement)

**Les scores ne se sauvegardent pas**
- Vérifier que `SECRET_KEY` est définie (requise pour les sessions Flask)

**Les paramètres d'accessibilité ne s'appliquent pas**
- Les paramètres sont en `localStorage`
- Vider le cache du navigateur ou utiliser un autre navigateur

---

## 🔮 Roadmap

- [ ] Nouveaux scénarios de jeu
- [ ] Mode multi-joueurs
- [ ] Version multilingue (EN, ES, DE)
- [ ] Export PDF du plan d'action
- [ ] Dashboard administrateur
- [ ] API REST pour intégrations
- [ ] Application mobile (React Native)
- [ ] Système de badges et achievements
- [ ] Intégration Moodle pour établissements scolaires

---

## 👨‍💻 Auteurs

- **Équipe NIRD Quest** - *Nuit de l'Info 2025*
- Propulsé par **Claude (Anthropic)** pour le développement
- Partenaire **Decathlon** pour le défi santé posturale

---

## 🙏 Remerciements

- La **Nuit de l'Info** pour l'organisation
- **Mistral AI** pour l'IA souveraine française
- **Decathlon** pour le défi santé posturale
- La **communauté du logiciel libre**
- Le **Ministère de l'Éducation Nationale** pour Apps.education.fr
- **Framasoft** pour l'inspiration et les valeurs
- Tous les **contributeurs** du projet

---

## 📧 Contact

Pour toute question ou suggestion :
- Ouvrir une issue sur GitHub
- Rejoindre le [Discord NIRD](https://discord.gg/Avn729Av2x)
- Contacter via la Nuit de l'Info

---

## 📊 Statistiques du Projet

- **10+ pages HTML** avec templates Jinja2
- **3 mini-jeux** interactifs complets
- **2000+ lignes** de JavaScript
- **3000+ lignes** de Python (Flask + IA)
- **5000+ lignes** de CSS responsive
- **4 niveaux** de défi Decathlon
- **SVG animés** pour tous les personnages
- **0 dépendance** à des images externes
- **100% open source** sous licence MIT

---

**Ensemble, construisons un numérique plus libre, responsable et durable ! 🌟**

Made with ❤️ for education and open source.

---

## 🔗 Liens Rapides

| Lien | Description |
|------|-------------|
| [📄 Guide PDF Complet](./NIRD_QUEST_GUIDE_COMPLET.pdf) | Guide de 25+ pages |
| [🎮 Démo en Ligne](https://nird-quest.render.com) | Version déployée |
| [💬 Discord](https://discord.gg/Avn729Av2x) | Communauté NIRD |
| [📚 Apps.education.fr](https://forge.apps.education.fr) | Outils libres éducation |
| [🤖 Mistral AI](https://console.mistral.ai) | Obtenir une clé API |
| [🏋️ Decathlon](https://www.decathlon.fr) | Produits sportifs |

---

_README mis à jour le 05/12/2025 - Version 1.0_
