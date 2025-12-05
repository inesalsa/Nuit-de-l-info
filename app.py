from flask import Flask, render_template, request, jsonify, session
import os
import requests
import logging
from datetime import timedelta

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24).hex())

# Configuration sécurisée
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)

# Variables d'environnement
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Données du jeu
SCENARIOS = [
    {
        "id": 1,
        "title": "🖥️ Fin de support Windows 10",
        "question": "Votre école utilise 40 ordinateurs sous Windows 10. Microsoft annonce la fin du support. Que faites-vous ?",
        "choices": [
            {
                "text": "Acheter 40 PC neufs sous Windows 11",
                "scores": {"durabilite": -2, "autonomie": -1, "sobriete": -2, "souverainete": 0, "inclusion": 0},
                "feedback": "❌ Coûteux et peu durable ! 40 PC jetés = tonnes de déchets électroniques."
            },
            {
                "text": "Installer Linux sur les PC existants",
                "scores": {"durabilite": 3, "autonomie": 3, "sobriete": 2, "souverainete": 2, "inclusion": 1},
                "feedback": "✅ Excellent choix ! Linux redonne vie aux vieux PC et vous libère des licences."
            },
            {
                "text": "Continuer sans mise à jour",
                "scores": {"durabilite": 0, "autonomie": -2, "sobriete": 0, "souverainete": -2, "inclusion": -1},
                "feedback": "⚠️ Dangereux ! Pas de sécurité = risques de piratage."
            }
        ]
    },
    {
        "id": 2,
        "title": "☁️ Stockage des données",
        "question": "Vous devez stocker les données de 500 élèves. Où les héberger ?",
        "choices": [
            {
                "text": "Google Drive ou Dropbox (USA)",
                "scores": {"durabilite": 0, "autonomie": -2, "sobriete": 0, "souverainete": -3, "inclusion": 0},
                "feedback": "❌ Vos données sont hors UE, soumises au Cloud Act américain."
            },
            {
                "text": "Serveur cloud souverain (UE)",
                "scores": {"durabilite": 1, "autonomie": 1, "sobriete": 0, "souverainete": 3, "inclusion": 1},
                "feedback": "✅ Bon choix ! Données en Europe = respect du RGPD."
            },
            {
                "text": "Serveur local sécurisé",
                "scores": {"durabilite": 1, "autonomie": 3, "sobriete": 2, "souverainete": 3, "inclusion": 0},
                "feedback": "✅ Parfait ! Vous maîtrisez 100% de vos données."
            }
        ]
    },
    {
        "id": 3,
        "title": "📝 Outils collaboratifs",
        "question": "Les enseignants veulent des outils de collaboration en ligne. Que choisir ?",
        "choices": [
            {
                "text": "Microsoft 365 ou Google Workspace",
                "scores": {"durabilite": 0, "autonomie": -2, "sobriete": 0, "souverainete": -2, "inclusion": -1},
                "feedback": "❌ Abonnements coûteux, dépendance totale, données hors Europe."
            },
            {
                "text": "Nextcloud + OnlyOffice (auto-hébergé)",
                "scores": {"durabilite": 2, "autonomie": 3, "sobriete": 1, "souverainete": 3, "inclusion": 2},
                "feedback": "✅ Excellent ! Logiciels libres + maîtrise totale."
            },
            {
                "text": "Mix outils libres + propriétaires",
                "scores": {"durabilite": 0, "autonomie": 0, "sobriete": 0, "souverainete": 0, "inclusion": 0},
                "feedback": "⚠️ Compromis acceptable, mais dépendance partielle."
            }
        ]
    },
    {
        "id": 4,
        "title": "♻️ Matériel informatique",
        "question": "Vous avez 20 ordinateurs de 6 ans qui ralentissent. Que faire ?",
        "choices": [
            {
                "text": "Les jeter et acheter du neuf",
                "scores": {"durabilite": -3, "autonomie": 0, "sobriete": -2, "souverainete": 0, "inclusion": 0},
                "feedback": "❌ Gâchis total ! Un PC reconditionné émet 10x moins de CO2."
            },
            {
                "text": "Les reconditionner avec Linux",
                "scores": {"durabilite": 3, "autonomie": 2, "sobriete": 3, "souverainete": 1, "inclusion": 2},
                "feedback": "✅ Top ! Vous prolongez leur vie de 5 ans minimum."
            },
            {
                "text": "Louer du matériel neuf",
                "scores": {"durabilite": -1, "autonomie": -1, "sobriete": 1, "souverainete": 0, "inclusion": 0},
                "feedback": "⚠️ Location = dépendance continue, mais moins de déchets."
            }
        ]
    },
    {
        "id": 5,
        "title": "💰 Budget numérique",
        "question": "Votre budget annuel numérique est de 15 000€. Comment l'allouer ?",
        "choices": [
            {
                "text": "Abonnements logiciels (10k€) + licences (5k€)",
                "scores": {"durabilite": -1, "autonomie": -3, "sobriete": -1, "souverainete": -2, "inclusion": -1},
                "feedback": "❌ Dépendance totale ! Coûts récurrents infinis."
            },
            {
                "text": "Formation Linux (3k€) + matériel reconditionné (7k€) + logiciels libres (0€)",
                "scores": {"durabilite": 3, "autonomie": 3, "sobriete": 2, "souverainete": 3, "inclusion": 3},
                "feedback": "✅ Parfait ! Investissement pérenne, autonomie maximale."
            },
            {
                "text": "50% matériel neuf + 50% abonnements",
                "scores": {"durabilite": -1, "autonomie": -1, "sobriete": -1, "souverainete": -1, "inclusion": 0},
                "feedback": "⚠️ Compromis médiocre, dépendance maintenue."
            }
        ]
    }
]

@app.route("/")
def home():
    """Page d'accueil"""
    return render_template("home.html")

@app.route("/story")
def story():
    """Prologue narratif"""
    return render_template("story.html")

@app.route("/pacman")
def pacman():
    """Mini-jeu Pac-Man : Data Rescue"""
    return render_template("pacman.html")

@app.route("/quest")
def quest():
    """Mini-jeu : La Quête du Serveur Sacré"""
    return render_template("quest.html")

@app.route("/api/complete_quest", methods=['POST'])
def complete_quest():
    """Enregistre la completion de la quête"""
    data = request.json
    artifacts = data.get('artifacts', [])
    
    # Bonus pour le jeu principal
    if 'scores' not in session:
        session['scores'] = {
            "durabilite": 0,
            "autonomie": 0,
            "sobriete": 0,
            "souverainete": 0,
            "inclusion": 0
        }
    
    # Appliquer les bonus
    session['scores']['autonomie'] += 3
    session['scores']['durabilite'] += 3
    session['quest_completed'] = True
    session.modified = True
    
    logger.info(f"Quête complétée avec {len(artifacts)} artefacts")
    
    return jsonify({"success": True, "bonus_applied": True})

@app.route("/game")
def game():
    """Mini-jeu interactif"""
    session['scores'] = {
        "durabilite": 0,
        "autonomie": 0,
        "sobriete": 0,
        "souverainete": 0,
        "inclusion": 0
    }
    return render_template("game.html", scenarios=SCENARIOS)

@app.route("/api/submit_choice", methods=['POST'])
def submit_choice():
    """Enregistre un choix et met à jour le score"""
    try:
        data = request.json
        scenario_id = data.get('scenario_id')
        choice_index = data.get('choice_index')
        
        if 'scores' not in session:
            session['scores'] = {
                "durabilite": 0,
                "autonomie": 0,
                "sobriete": 0,
                "souverainete": 0,
                "inclusion": 0
            }
        
        # Trouver le scénario correspondant
        scenario = next((s for s in SCENARIOS if s['id'] == scenario_id), None)
        if not scenario:
            return jsonify({"success": False, "error": "Scenario not found"}), 404
        
        # Vérifier que l'index est valide
        if choice_index < 0 or choice_index >= len(scenario['choices']):
            return jsonify({"success": False, "error": "Invalid choice"}), 400
        
        # Récupérer le choix
        choice = scenario['choices'][choice_index]
        
        # Mettre à jour les scores
        for key, value in choice['scores'].items():
            session['scores'][key] += value
        
        session.modified = True
        
        logger.info(f"Choix enregistré - Scenario {scenario_id}, Choice {choice_index}")
        logger.info(f"Scores actuels: {session['scores']}")
        
        return jsonify({
            "success": True,
            "feedback": choice['feedback'],
            "scores": session['scores']
        })
    
    except Exception as e:
        logger.error(f"Erreur submit_choice: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/results")
def results():
    """Page de résultats"""
    scores = session.get('scores', {
        "durabilite": 0,
        "autonomie": 0,
        "sobriete": 0,
        "souverainete": 0,
        "inclusion": 0
    })
    
    total = sum(scores.values())
    
    # Déterminer le niveau
    if total >= 12:
        level = "expert"
        message = "🌟 Bravo ! Vous êtes un véritable champion du numérique responsable !"
    elif total >= 6:
        level = "avance"
        message = "👍 Bien joué ! Vous avez compris les enjeux NIRD."
    elif total >= 0:
        level = "debutant"
        message = "💪 Bon début ! Il y a encore du chemin vers l'autonomie numérique."
    else:
        level = "danger"
        message = "⚠️ Attention ! Le village est en danger. Découvrez les solutions NIRD."
    
    return render_template("results.html", scores=scores, total=total, level=level, message=message)

@app.route("/solutions")
def solutions():
    """Salle des solutions NIRD"""
    return render_template("solutions.html")

@app.route("/assistant")
def assistant():
    """Assistant IA Mistral"""
    return render_template("assistant.html")

@app.route("/api/generate_plan", methods=['POST'])
def generate_plan():
    """Génère un plan d'action personnalisé avec Mistral AI"""
    
    if not MISTRAL_API_KEY:
        return jsonify({
            "error": "Clé API Mistral non configurée",
            "plan": "⚠️ L'assistant IA n'est pas disponible. Consultez la section Solutions pour des recommandations."
        }), 503
    
    scores = session.get('scores', {})
    total = sum(scores.values())
    
    # Construire le prompt
    prompt = f"""Tu es Luma, la mascotte lumineuse du Village Numérique Résilient. Tu analyses les choix d'un établissement scolaire sur le numérique responsable.

Scores obtenus :
- Durabilité : {scores.get('durabilite', 0)}/15
- Autonomie : {scores.get('autonomie', 0)}/15  
- Sobriété : {scores.get('sobriete', 0)}/15
- Souveraineté : {scores.get('souverainete', 0)}/15
- Inclusion : {scores.get('inclusion', 0)}/15
Total : {total}/75

Génère un plan d'action personnalisé en 5 étapes concrètes pour améliorer la démarche NIRD de cet établissement.

Format attendu :
**Diagnostic** (2 phrases)

**Forces du village** (3 points forts)

**Axes d'amélioration** (3 points faibles)

**Plan d'action NIRD** (5 étapes numérotées)

**Message inspirant** (1 phrase de Luma)

Ton : pédagogique, bienveillant, optimiste. Pas de jargon technique. 300 mots max."""

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "mistral-small-latest",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            json=data,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        plan = result['choices'][0]['message']['content']
        logger.info("Plan d'action généré avec succès")
        
        return jsonify({"plan": plan})
        
    except requests.exceptions.Timeout:
        logger.error("Timeout Mistral API")
        return jsonify({"error": "L'IA met trop de temps à répondre"}), 504
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur Mistral API : {e}")
        return jsonify({"error": "Service IA temporairement indisponible"}), 503
    
    except (KeyError, IndexError) as e:
        logger.error(f"Erreur parsing réponse : {e}")
        return jsonify({"error": "Erreur de traitement"}), 500

@app.route("/resources")
def resources():
    """Page ressources"""
    return render_template("resources.html")

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/benevolat')
def benevolat():
    return render_template('benevolat.html')

@app.route("/license")
def license_page():
    """Page licence"""
    return render_template("license.html")

@app.route("/api/chatbot", methods=['POST'])
def chatbot_api():
    """API Chatbot avec Mistral AI"""
    try:
        data = request.json
        user_message = data.get('message', '')
        user_profile = data.get('profile', {})
        history = data.get('history', [])
        
        if not user_message:
            return jsonify({'success': False, 'error': 'Message vide'})
        
        if not MISTRAL_API_KEY:
            return jsonify({
                'success': True,
                'response': "⚠️ L'API Mistral n'est pas configurée. Veuillez définir la variable MISTRAL_API_KEY."
            })
        
        # Construire le contexte NIRD pour l'IA
        system_prompt = f"""Tu es NirdBot, l'assistant du projet NIRD (Numérique Inclusif, Responsable et Durable).

CONTEXTE UTILISATEUR:
- Profil: {user_profile.get('type', 'non défini')}
- Budget: {user_profile.get('budget', 'non défini')}
- Objectif: {user_profile.get('objective', 'non défini')}
- Expérience: {user_profile.get('experience', 'débutant')}

PRINCIPES NIRD À RESPECTER:
1. SOUVERAINETÉ: Privilégier les solutions européennes (Mageia, Yunohost, Framasoft, OVH, Scaleway)
2. DURABILITÉ: Encourager le reconditionné, Raspberry Pi, réutilisation du matériel
3. LOGICIEL LIBRE: Promouvoir Linux, LibreOffice, Nextcloud, Firefox
4. ACCESSIBILITÉ: Solutions économiques pour tous (Raspberry Pi < 50€, reconditionnement)
5. VIE PRIVÉE: RGPD, hébergement EU, chiffrement

SOLUTIONS RECOMMANDÉES PAR PROFIL:
- Étudiant: Raspberry Pi 4 (35-55€), Mageia, LibreOffice gratuit
- Particulier: Yunohost (auto-hébergement), Nextcloud, Proton Mail
- Entreprise: Migration Linux (Ubuntu LTS/Mageia), OVH/Scaleway cloud

RÉPONSES:
- Concises et pédagogiques
- Inclure des liens pratiques quand pertinent
- Encourager l'autonomie
- Mentionner les bénéfices écologiques (10x moins CO2 pour le reconditionné)

Réponds toujours en français, avec des emojis pour la clarté."""

        # Construire l'historique pour l'API
        messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Ajouter les 5 derniers messages de l'historique
        for msg in history[-5:]:
            if msg['sender'] == 'user':
                messages.append({"role": "user", "content": msg['text']})
            elif msg['sender'] == 'bot':
                # Nettoyer le HTML des messages bot
                clean_text = msg['text'].replace('<br>', '\n').replace('<strong>', '').replace('</strong>', '')
                messages.append({"role": "assistant", "content": clean_text})
        
        # Ajouter le message actuel
        messages.append({"role": "user", "content": user_message})
        
        # Appel à l'API Mistral
        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {MISTRAL_API_KEY}"
            },
            json={
                "model": "mistral-small-latest",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500
            },
            timeout=30
        )
        
        if response.status_code == 200:
            ai_response = response.json()['choices'][0]['message']['content']
            
            # Formatter la réponse pour le HTML
            formatted_response = ai_response.replace('\n', '<br>')
            
            return jsonify({
                'success': True,
                'response': formatted_response
            })
        else:
            logger.error(f"Erreur API Mistral: {response.status_code} - {response.text}")
            return jsonify({
                'success': True,
                'response': "❌ Désolé, je rencontre un problème temporaire. Réessayez dans quelques instants."
            })
            
    except Exception as e:
        logger.error(f"Erreur chatbot: {e}")
        return jsonify({
            'success': True,
            'response': "❌ Une erreur s'est produite. Veuillez réessayer."
        })

# Gestionnaire d'erreurs
@app.errorhandler(404)
def not_found(e):
    return render_template("home.html"), 404

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Erreur 500 : {e}")
    return "Erreur interne du serveur", 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
