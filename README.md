# 🌟 NIRD Quest - Le Village Numérique Résilient

Un jeu interactif et éducatif pour découvrir la démarche **NIRD** (Numérique Inclusif, Responsable et Durable) dans les établissements scolaires.

![Licence MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)

## 🎯 Concept

**NIRD Quest** est une aventure gamifiée où l'utilisateur devient le protecteur d'une école face aux menaces du "Numérique Goliath" : obsolescence programmée, dépendance aux Big Tech, perte de souveraineté des données...

À travers **5 scénarios réalistes**, le joueur fait des choix qui impactent ses scores en :
- ♻️ **Durabilité** - Réemploi et reconditionnement
- 🔓 **Autonomie** - Logiciels libres et Linux
- 🌍 **Souveraineté** - Hébergement en Europe
- 🌱 **Sobriété** - Consommation raisonnée
- 🤝 **Inclusion** - Accessibilité et formation

## ✨ Fonctionnalités

- 🎮 **Mini-jeu interactif** avec 5 scénarios et choix multiples
- 📊 **Système de scoring** dynamique sur 5 axes NIRD
- 🤖 **Assistant IA Mistral** générant un plan d'action personnalisé
- 💡 **Salle des solutions** avec explications détaillées
- 📚 **Ressources** vers outils libres et communautés
- 🎨 **Design original** avec illustrations SVG
- 📱 **Responsive** pour mobile et desktop

## 🚀 Installation

### Prérequis

- Python 3.8+
- pip
- Clé API Mistral AI (optionnel)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-repo/nird-quest.git
cd nird-quest

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
export SECRET_KEY="votre_secret_key_aleatoire"
export MISTRAL_API_KEY="votre_cle_mistral"  # Optionnel

# Lancer l'application
python app.py
```

L'application sera accessible sur `http://localhost:5000`

## 🌐 Déploiement sur Render

1. Fork ce repository
2. Créer un nouveau Web Service sur [Render](https://render.com)
3. Connecter votre repository GitHub
4. Configurer les variables d'environnement :
   - `SECRET_KEY` : Générer avec `python -c "import os; print(os.urandom(24).hex())"`
   - `MISTRAL_API_KEY` : Votre clé API Mistral (optionnel)
5. Déployer !

### Configuration Render

```yaml
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

## 📂 Structure du Projet

```
nird-quest/
├── app.py                 # Application Flask principale
├── requirements.txt       # Dépendances Python
├── Procfile              # Configuration Render/Heroku
├── README.md             # Ce fichier
├── templates/            # Templates HTML
│   ├── base.html
│   ├── home.html
│   ├── story.html
│   ├── game.html
│   ├── results.html
│   ├── solutions.html
│   ├── assistant.html
│   ├── resources.html
│   └── license.html
└── static/               # Fichiers statiques
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── svg/             # (À venir)
```

## 🎮 Utilisation

1. **Accueil** → Découvrez le concept NIRD
2. **Histoire** → Plongez dans l'univers du Village Numérique Résilient
3. **Jouer** → Faites vos choix sur 5 scénarios critiques
4. **Résultats** → Obtenez vos scores et feedback personnalisés
5. **Solutions** → Découvrez comment mettre en œuvre NIRD
6. **Assistant IA** → Générez votre plan d'action (nécessite clé Mistral)
7. **Ressources** → Explorez outils libres et communautés

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

## 🎨 Design & Ressources

### Personnages Originaux (SVG)

- 🌟 **Luma** - Mascotte lumineuse du village
- 🧙 **Maître Récupix** - Expert du réemploi et de Linux
- 💻 **Les Numérins** - Petits ordinateurs vivants
- 😈 **Agent Cloudox** - Antagoniste de l'Empire Numérico

### Palette de Couleurs

- Primary: `#4A90E2` (Bleu)
- Secondary: `#7B68EE` (Violet)
- Accent: `#50C878` (Vert)
- Danger: `#E74C3C` (Rouge)
- Warning: `#F39C12` (Orange)

## 📜 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de :
- ✅ Utiliser commercialement
- ✅ Modifier
- ✅ Distribuer
- ✅ Utiliser en privé

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🎓 Contexte Éducatif

Ce projet a été créé pour la **Nuit de l'Info 2025** avec pour objectif de sensibiliser aux enjeux du numérique responsable dans l'éducation.

### Objectifs Pédagogiques

- Comprendre les risques de dépendance aux Big Tech
- Découvrir les alternatives libres (Linux, logiciels libres)
- Apprendre l'importance du réemploi et de la sobriété
- Saisir les enjeux de souveraineté des données (RGPD, Cloud Act)
- Valoriser l'inclusion et l'accessibilité numérique

## 📚 Ressources Externes

- [Apps.education.fr](https://forge.apps.education.fr) - Outils libres pour l'éducation
- [Framasoft](https://framasoft.org) - Éducation populaire au numérique libre
- [SILL](https://www.sill.etalab.gouv.fr) - Socle Interministériel de Logiciels Libres
- [Mistral AI](https://mistral.ai) - Intelligence artificielle française

## 🐛 Problèmes Connus

- L'assistant IA nécessite une clé Mistral API valide
- Les sessions sont en mémoire (redémarrage = perte des scores)

## 🔮 Roadmap

- [ ] Système de sauvegarde des résultats
- [ ] Nouveaux scénarios de jeu
- [ ] Mode multi-joueurs
- [ ] Version multilingue (EN, ES, DE)
- [ ] Export PDF du plan d'action
- [ ] Dashboard administrateur
- [ ] API REST pour intégrations

## 👨‍💻 Auteurs

- **Équipe NIRD Quest** - *Nuit de l'Info 2025*
- Propulsé par **Claude (Anthropic)** pour le développement

## 🙏 Remerciements

- La **Nuit de l'Info** pour l'organisation
- **Mistral AI** pour l'IA souveraine française
- La **communauté du logiciel libre**
- Le **Ministère de l'Éducation Nationale** pour Apps.education.fr

## 📧 Contact

Pour toute question ou suggestion :
- Ouvrir une issue sur GitHub
- Contacter via la Nuit de l'Info

---

**Ensemble, construisons un numérique plus libre, responsable et durable ! 🌟**

Made with ❤️ for education and open source.
