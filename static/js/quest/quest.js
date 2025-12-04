// NIRD Quest - Mini-jeu: La Quête du Serveur Sacré

let questProgress = {
    zone1: false,
    zone2: false,
    zone3: false,
    artifacts: [],
    selectedOptions: []
};

let droppedItems = [];

// ========================================
// ZONE 1: Forêt des Logiciels Libres
// ========================================

function selectPath(zone, choice) {
    const options = document.querySelectorAll('#puzzle-1 .choice-option');
    options.forEach(opt => opt.classList.remove('selected', 'wrong'));
    
    const selected = event.target.closest('.choice-option');
    
    if (choice === 'C') {
        // Bonne réponse
        selected.classList.add('selected');
        showFeedback(1, true, `
            <div class="feedback positive">
                <h3>✅ Excellent choix !</h3>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    LibreOffice, Nextcloud et Moodle sont des outils <strong>100% libres</strong> !
                    Ils garantissent l'autonomie du village, sans abonnement ni dépendance.
                </p>
                <div class="artifact">🔓 Artefact obtenu : Talisman du Logiciel Libre</div>
            </div>
        `);
        
        questProgress.artifacts.push('logiciel-libre');
        unlockArtifact(1);
        document.getElementById('btn-zone-1').style.display = 'inline-block';
        
    } else {
        // Mauvaise réponse
        selected.classList.add('wrong');
        
        let message = choice === 'A' ? 
            "Microsoft te rend dépendant avec des abonnements coûteux et des licences propriétaires." :
            "Google collecte tes données et les stocke hors d'Europe (Cloud Act).";
        
        showFeedback(1, false, `
            <div class="feedback negative">
                <h3>❌ Mauvais chemin !</h3>
                <p style="font-size: 1.1rem;">
                    ${message}
                    <br><br>
                    <strong>Agent Cloudox apparaît :</strong><br>
                    <em>"Mouahahaha ! Reste dans notre écosystème, c'est tellement... pratique !"</em>
                </p>
                <p style="margin-top: 1rem;">Réessaye de choisir la voie de l'autonomie !</p>
            </div>
        `);
    }
}

// ========================================
// ZONE 2: Décharge des Machines Fatiguées
// ========================================

function completeZone(zoneNum) {
    questProgress[`zone${zoneNum}`] = true;
    
    // Marquer l'étape comme complétée
    document.getElementById(`step-${zoneNum}`).classList.add('completed');
    
    // Déverrouiller la zone suivante
    if (zoneNum < 3) {
        const nextZone = document.getElementById(`zone-${zoneNum + 1}`);
        nextZone.classList.remove('locked');
        nextZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Activer l'étape suivante
        document.getElementById(`step-${zoneNum + 1}`).classList.add('active');
        
        // Afficher le puzzle de la zone suivante
        document.getElementById(`puzzle-${zoneNum + 1}`).style.display = 'block';
    }
    
    // Marquer la zone actuelle comme complétée
    document.getElementById(`zone-${zoneNum}`).classList.add('completed');
}

// Drag and Drop pour Zone 2
document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('repair-zone');
    
    if (!dropZone) return;
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('over');
        
        const dragging = document.querySelector('.dragging');
        if (dragging) {
            const item = dragging.dataset.item;
            
            // Éviter les doublons
            if (!droppedItems.includes(item)) {
                droppedItems.push(item);
                
                // Cloner l'élément dans la zone
                const clone = dragging.cloneNode(true);
                clone.classList.remove('dragging');
                clone.setAttribute('draggable', 'false');
                clone.style.display = 'inline-block';
                clone.style.margin = '0.5rem';
                
                dropZone.appendChild(clone);
            }
        }
    });
});

function checkRepair() {
    const correctItems = ['tournevis', 'spray', 'ssd'];
    const hasAllCorrect = correctItems.every(item => droppedItems.includes(item));
    const hasPoubelle = droppedItems.includes('poubelle');
    
    if (hasAllCorrect && !hasPoubelle) {
        // Succès !
        showFeedback(2, true, `
            <div class="feedback positive">
                <h3>✅ PC reconditionné avec succès !</h3>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    Bravo ! Avec un tournevis, de l'air sec et un SSD, tu as redonné vie à cet ordinateur !
                    <br><br>
                    <strong>Impact :</strong> Un PC reconditionné émet <strong>10 fois moins de CO2</strong> qu'un PC neuf.
                    La fabrication représente 80% de l'empreinte carbone totale !
                </p>
                <div class="artifact">♻️ Artefact obtenu : Cœur du Reconditionnement</div>
            </div>
        `);
        
        questProgress.artifacts.push('reconditionnement');
        unlockArtifact(2);
        document.getElementById('btn-zone-2').style.display = 'inline-block';
        
    } else if (hasPoubelle) {
        // Erreur poubelle
        showFeedback(2, false, `
            <div class="feedback negative">
                <h3>❌ Non ! Ne jette pas ce PC !</h3>
                <p style="font-size: 1.1rem;">
                    Jeter un ordinateur qui fonctionne encore, c'est du <strong>gâchis électronique</strong> !
                    <br><br>
                    <strong>Agent Cloudox ricane :</strong><br>
                    <em>"Parfait ! Jette tout et rachète du neuf... avec NOS abonnements !"</em>
                </p>
                <p style="margin-top: 1rem;">Réessaye sans la poubelle !</p>
            </div>
        `);
        
        // Reset
        document.getElementById('repair-zone').innerHTML = `
            <p style="text-align: center; color: var(--text-secondary);">
                Glisse les outils nécessaires ici<br>
                <small>(3 outils sur 4 sont corrects)</small>
            </p>
        `;
        droppedItems = [];
        
    } else {
        // Pas assez d'outils
        showFeedback(2, false, `
            <div class="feedback">
                <h3>⚠️ Il manque des outils !</h3>
                <p>Tu as besoin de <strong>3 outils</strong> pour reconditionner ce PC. Continue de glisser les bons éléments !</p>
            </div>
        `);
    }
}

// ========================================
// ZONE 3: Tour du Cloud Obscur
// ========================================

function toggleOption(optionNum) {
    const option = document.querySelector(`[data-option="${optionNum}"]`);
    
    if (option.classList.contains('selected')) {
        // Désélectionner
        option.classList.remove('selected');
        questProgress.selectedOptions = questProgress.selectedOptions.filter(o => o !== optionNum);
    } else {
        // Sélectionner si moins de 2
        if (questProgress.selectedOptions.length < 2) {
            option.classList.add('selected');
            questProgress.selectedOptions.push(optionNum);
        } else {
            showNotification('Tu ne peux sélectionner que 2 options !', 'warning');
        }
    }
    
    // Mettre à jour le compteur
    document.getElementById('selection-count').textContent = questProgress.selectedOptions.length;
}

function checkSovereignty() {
    const correctOptions = [1, 4]; // Serveur UE + Auto-hébergement
    const selected = questProgress.selectedOptions.sort();
    
    if (selected.length !== 2) {
        showNotification('Sélectionne exactement 2 options !', 'warning');
        return;
    }
    
    const isCorrect = selected.every(opt => correctOptions.includes(opt)) && selected.length === 2;
    
    if (isCorrect) {
        // Succès !
        showFeedback(3, true, `
            <div class="feedback positive">
                <h3>✅ Souveraineté assurée !</h3>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    Excellent choix ! En combinant un <strong>hébergement européen</strong> conforme au RGPD
                    et de l'<strong>auto-hébergement chiffré</strong>, tu garantis la maîtrise totale des données !
                    <br><br>
                    <strong>Pourquoi éviter les autres ?</strong><br>
                    - Cloud US : soumis au Cloud Act (accès FBI/NSA)<br>
                    - Cloud chinois : gouvernance opaque
                </p>
                <div class="artifact">🌍 Artefact obtenu : Clé de la Souveraineté</div>
            </div>
        `);
        
        questProgress.artifacts.push('souverainete');
        unlockArtifact(3);
        document.getElementById('btn-zone-3').style.display = 'inline-block';
        
    } else {
        // Erreur
        let errorMsg = '';
        if (selected.includes(2)) {
            errorMsg = 'Les clouds américains sont soumis au <strong>Cloud Act</strong> : le gouvernement US peut accéder à tes données !';
        } else if (selected.includes(3)) {
            errorMsg = 'Le cloud chinois ne garantit pas la protection des données personnelles selon les standards européens.';
        } else {
            errorMsg = 'Cette combinaison ne garantit pas une souveraineté optimale !';
        }
        
        showFeedback(3, false, `
            <div class="feedback negative">
                <h3>❌ Attention aux données !</h3>
                <p style="font-size: 1.1rem;">
                    ${errorMsg}
                    <br><br>
                    <strong>Agent Cloudox murmure :</strong><br>
                    <em>"Laisse-nous tes données... on en prendra soin... à notre façon !"</em>
                </p>
                <p style="margin-top: 1rem;">Réessaye en pensant RGPD et autonomie !</p>
            </div>
        `);
        
        // Reset sélection
        document.querySelectorAll('[data-option]').forEach(opt => opt.classList.remove('selected'));
        questProgress.selectedOptions = [];
        document.getElementById('selection-count').textContent = '0';
    }
}

// ========================================
// VICTOIRE
// ========================================

function showVictory() {
    // Masquer toutes les zones
    document.querySelectorAll('.zone-card').forEach(zone => zone.style.display = 'none');
    document.querySelector('.progress-tracker').parentElement.style.display = 'none';
    
    // Afficher l'écran de victoire
    document.getElementById('victory-screen').style.display = 'block';
    document.getElementById('victory-screen').scrollIntoView({ behavior: 'smooth' });
    
    // Animation des artefacts
    setTimeout(() => {
        document.querySelectorAll('.server-part').forEach((part, i) => {
            setTimeout(() => {
                part.style.animation = 'float 3s ease-in-out infinite, pulse 1s ease-in-out';
            }, i * 500);
        });
    }, 500);
    
    // Sauvegarder dans session (optionnel, pour bonus dans le jeu principal)
    try {
        fetch('/api/complete_quest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artifacts: questProgress.artifacts })
        });
    } catch (e) {
        console.log('Quest completed locally');
    }
}

// ========================================
// UTILITAIRES
// ========================================

function showFeedback(zone, success, html) {
    const feedback = document.getElementById(`feedback-${zone}`);
    feedback.innerHTML = html;
    feedback.style.display = 'block';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function unlockArtifact(num) {
    const artifact = document.getElementById(`artifact-${num}`);
    artifact.style.opacity = '1';
    artifact.style.animation = 'pulse 1s ease-in-out 3';
    
    setTimeout(() => {
        artifact.style.animation = '';
    }, 3000);
}

function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>${type === 'warning' ? '⚠️' : 'ℹ️'}</strong> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Activer la première zone
    document.getElementById('step-1').classList.add('active');
    
    // Animation d'entrée
    document.querySelectorAll('.zone-card').forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.2}s`;
    });
});
