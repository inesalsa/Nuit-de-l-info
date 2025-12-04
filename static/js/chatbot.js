// ============================================
// NIRDBOT - Chatbot Hybride NIRD
// ============================================

class NirdBot {
    constructor() {
        this.currentStep = 'welcome';
        this.userProfile = {
            type: null,        // etudiant, particulier, entreprise
            budget: null,      // <50, 50-200, 200-500, >500
            objective: null,   // decouvrir, migrer, heberger, proteger
            experience: null   // debutant, intermediaire, avance
        };
        this.conversationHistory = [];
        this.chatMode = 'questionnaire'; // questionnaire ou ai
        this.loadState();
        this.init();
    }

    
saveState() {
    const state = {
        currentStep: this.currentStep,
        userProfile: this.userProfile,
        conversationHistory: this.conversationHistory,
        chatMode: this.chatMode,
        timestamp: Date.now()
    };
    localStorage.setItem('nirdbot_state', JSON.stringify(state));
}

loadState() {
    const saved = localStorage.getItem('nirdbot_state');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            if (Date.now() - state.timestamp < 3600000) {
                this.currentStep = state.currentStep;
                this.userProfile = state.userProfile;
                this.conversationHistory = state.conversationHistory;
                this.chatMode = state.chatMode;
            }
        } catch (e) {
            console.error('Erreur chargement chatbot:', e);
        }
    }
}
    
    init() {
        this.createChatbotUI();
        this.bindEvents();
        // Popup automatique après 2 secondes
        setTimeout(() => this.show(), 2000);
    }

    createChatbotUI() {
        const chatbotHTML = `
            <div id="nirdbot-container" class="nirdbot-hidden">
                <!-- Bouton flottant -->
                <button id="nirdbot-toggle" class="nirdbot-toggle" title="Besoin d'aide ? 🤖">
                    <span class="nirdbot-icon">🤖</span>
                    <span class="nirdbot-pulse"></span>
                </button>

                <!-- Fenêtre de chat -->
                <div id="nirdbot-window" class="nirdbot-window nirdbot-hidden">
                    <div class="nirdbot-header">
                        <div class="nirdbot-header-info">
                            <div class="nirdbot-avatar">🤖</div>
                            <div>
                                <h3>NirdBot</h3>
                                <p class="nirdbot-status">En ligne - Ici pour vous aider !</p>
                            </div>
                        </div>
                        <button id="nirdbot-close" class="nirdbot-close">✕</button>
                    </div>

                    <div id="nirdbot-messages" class="nirdbot-messages">
                        <!-- Messages apparaîtront ici -->
                    </div>

                    <div id="nirdbot-quick-replies" class="nirdbot-quick-replies">
                        <!-- Boutons de réponse rapide -->
                    </div>

                    <div class="nirdbot-input-container">
                        <input 
                            type="text" 
                            id="nirdbot-input" 
                            class="nirdbot-input" 
                            placeholder="Posez votre question..."
                            disabled
                        />
                        <button id="nirdbot-send" class="nirdbot-send" disabled>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>

                    <div class="nirdbot-footer">
                        <button id="nirdbot-restart" class="nirdbot-restart-btn">
                            🔄 Recommencer
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('nirdbot-toggle');
        const close = document.getElementById('nirdbot-close');
        const send = document.getElementById('nirdbot-send');
        const input = document.getElementById('nirdbot-input');
        const restart = document.getElementById('nirdbot-restart');

        toggle.addEventListener('click', () => this.toggle());
        close.addEventListener('click', () => this.hide());
        send.addEventListener('click', () => this.handleSend());
        restart.addEventListener('click', () => this.restart());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !input.disabled) {
                this.handleSend();
            }
        });
    }

    show() {
        const container = document.getElementById('nirdbot-container');
        const window = document.getElementById('nirdbot-window');
        
        container.classList.remove('nirdbot-hidden');
        window.classList.remove('nirdbot-hidden');

        if (this.conversationHistory.length === 0) {
            this.startQuestionnaire();
        }
    }

    hide() {
        const window = document.getElementById('nirdbot-window');
        window.classList.add('nirdbot-hidden');
    }

    toggle() {
        const window = document.getElementById('nirdbot-window');
        if (window.classList.contains('nirdbot-hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    addMessage(text, sender = 'bot', showTyping = true) {
        const messagesDiv = document.getElementById('nirdbot-messages');
        
        if (showTyping && sender === 'bot') {
            this.showTypingIndicator();
        }

        setTimeout(() => {
            this.removeTypingIndicator();

            const messageDiv = document.createElement('div');
            messageDiv.className = `nirdbot-message nirdbot-message-${sender}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'nirdbot-bubble';
            bubble.innerHTML = text;
            
            messageDiv.appendChild(bubble);
            messagesDiv.appendChild(messageDiv);
            
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            this.conversationHistory.push({ sender, text, timestamp: Date.now() });
        }, showTyping ? 1000 : 0);
    }

    showTypingIndicator() {
        const messagesDiv = document.getElementById('nirdbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'nirdbot-message nirdbot-message-bot';
        typingDiv.id = 'nirdbot-typing';
        typingDiv.innerHTML = `
            <div class="nirdbot-bubble nirdbot-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    removeTypingIndicator() {
        const typing = document.getElementById('nirdbot-typing');
        if (typing) typing.remove();
    }

    showQuickReplies(options) {
        const container = document.getElementById('nirdbot-quick-replies');
        container.innerHTML = '';

        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'nirdbot-quick-reply';
            button.innerHTML = `${option.emoji || ''} ${option.text}`;
            button.onclick = () => {
                this.handleQuickReply(option);
                container.innerHTML = ''; // Clear buttons after selection
            };
            container.appendChild(button);
        });
    }

    handleQuickReply(option) {
        this.addMessage(option.text, 'user', false);
        
        if (option.action) {
            option.action.call(this, option.value);
        }
    }

    // ============================================
    // QUESTIONNAIRE GUIDÉ
    // ============================================

    startQuestionnaire() {
        this.addMessage(`
            <strong>👋 Bienvenue sur NIRD Quest !</strong><br><br>
            Je suis <strong>NirdBot</strong>, votre assistant pour un numérique 
            <span style="color: #4A90E2;">🇫🇷 souverain</span>, 
            <span style="color: #8BC34A;">♻️ durable</span> et 
            <span style="color: #FFD700;">🔓 libre</span>.<br><br>
            Je vais vous poser quelques questions pour vous recommander les meilleures solutions adaptées à votre situation.
        `);

        setTimeout(() => this.askProfileType(), 1500);
    }

    askProfileType() {
        this.currentStep = 'profile';
        this.addMessage("👤 Quel est votre profil ?");

        this.showQuickReplies([
            { 
                emoji: '🎓', 
                text: 'Étudiant', 
                value: 'etudiant',
                action: this.setProfile 
            },
            { 
                emoji: '👨‍💼', 
                text: 'Particulier', 
                value: 'particulier',
                action: this.setProfile 
            },
            { 
                emoji: '🏢', 
                text: 'TPE/PME', 
                value: 'entreprise',
                action: this.setProfile 
            },
            { 
                emoji: '🏭', 
                text: 'Grande entreprise', 
                value: 'grande_entreprise',
                action: this.setProfile 
            }
        ]);
    }

    setProfile(type) {
        this.userProfile.type = type;
        this.currentStep = 'budget';
        
        setTimeout(() => this.askBudget(), 800);
    }

    askBudget() {
        this.addMessage("💰 Quel est votre budget pour le matériel ?");

        this.showQuickReplies([
            { 
                emoji: '💸', 
                text: 'Moins de 50€', 
                value: '<50',
                action: this.setBudget 
            },
            { 
                emoji: '💵', 
                text: '50-200€', 
                value: '50-200',
                action: this.setBudget 
            },
            { 
                emoji: '💴', 
                text: '200-500€', 
                value: '200-500',
                action: this.setBudget 
            },
            { 
                emoji: '💶', 
                text: 'Plus de 500€', 
                value: '>500',
                action: this.setBudget 
            },
            { 
                emoji: '❓', 
                text: 'Pas encore défini', 
                value: 'undefined',
                action: this.setBudget 
            }
        ]);
    }

    setBudget(budget) {
        this.userProfile.budget = budget;
        this.currentStep = 'objective';
        
        setTimeout(() => this.askObjective(), 800);
    }

    askObjective() {
        this.addMessage("🎯 Quel est votre objectif principal ?");

        this.showQuickReplies([
            { 
                emoji: '🐧', 
                text: 'Découvrir Linux', 
                value: 'decouvrir',
                action: this.setObjective 
            },
            { 
                emoji: '🚀', 
                text: 'Migrer mon entreprise', 
                value: 'migrer',
                action: this.setObjective 
            },
            { 
                emoji: '🏠', 
                text: 'Auto-héberger mes données', 
                value: 'heberger',
                action: this.setObjective 
            },
            { 
                emoji: '🔒', 
                text: 'Protéger ma vie privée', 
                value: 'proteger',
                action: this.setObjective 
            }
        ]);
    }

    setObjective(objective) {
        this.userProfile.objective = objective;
        this.currentStep = 'experience';
        
        setTimeout(() => this.askExperience(), 800);
    }

    askExperience() {
        this.addMessage("🎓 Quel est votre niveau d'expérience technique ?");

        this.showQuickReplies([
            { 
                emoji: '🌱', 
                text: 'Débutant', 
                value: 'debutant',
                action: this.setExperience 
            },
            { 
                emoji: '🌿', 
                text: 'Intermédiaire', 
                value: 'intermediaire',
                action: this.setExperience 
            },
            { 
                emoji: '🌳', 
                text: 'Avancé', 
                value: 'avance',
                action: this.setExperience 
            }
        ]);
    }

    setExperience(experience) {
        this.userProfile.experience = experience;
        this.currentStep = 'recommendations';
        
        setTimeout(() => this.generateRecommendations(), 1000);
    }

    // ============================================
    // GÉNÉRATION DE RECOMMANDATIONS
    // ============================================

    generateRecommendations() {
        this.addMessage("🤔 Parfait ! Je prépare vos recommandations personnalisées...");

        const recommendations = this.getRecommendations();

        setTimeout(() => {
            this.addMessage(recommendations.message);
            
            if (recommendations.solutions.length > 0) {
                setTimeout(() => {
                    this.displaySolutions(recommendations.solutions);
                }, 1000);
            }

            setTimeout(() => {
                this.enableAIChat();
            }, 2000);
        }, 1500);
    }

    getRecommendations() {
        const { type, budget, objective, experience } = this.userProfile;
        
        let message = `<strong>✨ Recommandations pour vous :</strong><br><br>`;
        let solutions = [];

        // ÉTUDIANT
        if (type === 'etudiant') {
            if (budget === '<50' || budget === '50-200') {
                message += `🎓 <strong>Raspberry Pi 4 (35-55€)</strong><br>
                Une solution ultra-économique et écologique ! Parfait pour découvrir Linux sans investissement.<br><br>`;
                solutions.push({
                    name: 'Raspberry Pi 4 + Mageia',
                    link: '/solutions',
                    icon: '🍓'
                });
            }
            
            message += `🇫🇷 <strong>Mageia Linux</strong> (Gratuit)<br>
            Distribution française, stable et facile. Idéale pour les études !<br><br>`;
            solutions.push({
                name: 'Guide Mageia',
                link: '/solutions',
                icon: '🐧'
            });

            message += `📚 <strong>LibreOffice</strong> (Gratuit)<br>
            Suite bureautique libre française pour vos travaux.<br><br>`;
        }

        // PARTICULIER
        else if (type === 'particulier') {
            if (objective === 'proteger') {
                message += `🔒 <strong>Protection de la vie privée</strong><br><br>`;
                message += `• <strong>Nextcloud</strong> (stockage souverain)<br>`;
                message += `• <strong>Proton Mail</strong> (email chiffré suisse)<br>`;
                message += `• <strong>Brave/Firefox</strong> (navigation privée)<br><br>`;
                
                solutions.push({
                    name: 'Kit Vie Privée',
                    link: '/solutions',
                    icon: '🔐'
                });
            }

            if (objective === 'heberger') {
                message += `🏠 <strong>Yunohost</strong> (Auto-hébergement français)<br>
                Solution française clé en main pour héberger vos services chez vous !<br><br>`;
                
                solutions.push({
                    name: 'Guide Yunohost',
                    link: '/solutions',
                    icon: '🏠'
                });
            }

            if (budget === '<50') {
                message += `♻️ <strong>PC Reconditionné</strong><br>
                Un ordinateur reconditionné = 10x moins de CO2 qu'un neuf !<br><br>`;
                
                solutions.push({
                    name: 'Où acheter reconditionné',
                    link: '/solutions',
                    icon: '♻️'
                });
            }
        }

        // ENTREPRISE
        else if (type === 'entreprise' || type === 'grande_entreprise') {
            if (objective === 'migrer') {
                message += `🚀 <strong>Migration Linux Professionnelle</strong><br><br>`;
                message += `• <strong>Ubuntu LTS</strong> ou <strong>Mageia</strong> (support long terme)<br>`;
                message += `• <strong>LibreOffice</strong> (bureautique)<br>`;
                message += `• <strong>Nextcloud</strong> (collaboration)<br>`;
                message += `• <strong>OnlyOffice</strong> (compatibilité MS Office)<br><br>`;
                
                solutions.push({
                    name: 'Guide Migration Entreprise',
                    link: '/solutions',
                    icon: '🏢'
                });
            }

            message += `🇫🇷 <strong>Hébergement Cloud Souverain</strong><br>`;
            message += `• <strong>OVH</strong> (français, RGPD)<br>`;
            message += `• <strong>Scaleway</strong> (français, écologique)<br>`;
            message += `• <strong>Outscale</strong> (français, certifié)<br><br>`;
            
            solutions.push({
                name: 'Hébergeurs Français',
                link: '/solutions',
                icon: '☁️'
            });
        }

        // DÉBUTANT : Toujours proposer support Framasoft
        if (experience === 'debutant') {
            message += `🎓 <strong>Formation & Support</strong><br>`;
            message += `• <strong>Framasoft</strong> (tutoriels gratuits en français)<br>`;
            message += `• <strong>LinuxFr.org</strong> (communauté bienveillante)<br><br>`;
            
            solutions.push({
                name: 'Ressources Débutant',
                link: '/resources#debutant',
                icon: '📚'
            });
        }

        message += `<em>💡 Besoin de plus d'informations ? Posez-moi vos questions !</em>`;

        return { message, solutions };
    }

    displaySolutions(solutions) {
        let solutionsHTML = '<div class="nirdbot-solutions">';
        
        solutions.forEach(sol => {
            solutionsHTML += `
                <a href="${sol.link}" class="nirdbot-solution-card" target="_blank">
                    <span class="solution-icon">${sol.icon}</span>
                    <span class="solution-name">${sol.name}</span>
                    <span class="solution-arrow">→</span>
                </a>
            `;
        });
        
        solutionsHTML += '</div>';
        
        this.addMessage(solutionsHTML, 'bot', false);
    }

    // ============================================
    // CHATBOT IA (MODE AVANCÉ)
    // ============================================

    enableAIChat() {
        this.chatMode = 'ai';
        const input = document.getElementById('nirdbot-input');
        const send = document.getElementById('nirdbot-send');
        
        input.disabled = false;
        send.disabled = false;
        input.placeholder = "Posez votre question...";
        
        this.addMessage(`
            <strong>🤖 Mode Chat IA activé !</strong><br><br>
            Vous pouvez maintenant me poser des questions spécifiques sur :
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Installation de logiciels</li>
                <li>Configuration de matériel</li>
                <li>Comparaison de solutions</li>
                <li>Dépannage</li>
            </ul>
        `, 'bot', false);
    }

    async handleSend() {
        const input = document.getElementById('nirdbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        input.value = '';
        this.addMessage(message, 'user', false);
        
        // Appel API IA
        await this.sendToAI(message);
    }

    async sendToAI(message) {
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    profile: this.userProfile,
                    history: this.conversationHistory.slice(-10) // 10 derniers messages
                })
            });

            const data = await response.json();
            
            this.removeTypingIndicator();
            
            if (data.success) {
                this.addMessage(data.response, 'bot', false);
            } else {
                this.addMessage("❌ Désolé, une erreur s'est produite. Réessayez.", 'bot', false);
            }
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage("❌ Erreur de connexion. Vérifiez votre connexion internet.", 'bot', false);
        }
    }

    restart() {
        this.currentStep = 'welcome';
        this.userProfile = {
            type: null,
            budget: null,
            objective: null,
            experience: null
        };
        this.conversationHistory = [];
        this.chatMode = 'questionnaire';
        
        document.getElementById('nirdbot-messages').innerHTML = '';
        document.getElementById('nirdbot-quick-replies').innerHTML = '';
        
        const input = document.getElementById('nirdbot-input');
        const send = document.getElementById('nirdbot-send');
        input.disabled = true;
        send.disabled = true;
        input.placeholder = "Posez votre question...";
        
        this.startQuestionnaire();
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.nirdBot = new NirdBot();
});
