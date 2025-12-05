# 🔒 Guide de Test des Garde-fous de Sécurité

## Démarrage Rapide

### Prérequis
1. Le serveur NIRD doit être lancé: `pnpm dev`
2. Ollama doit être actif: `ollama serve`
3. `curl` doit être installé

### Lancer les tests

```bash
# Rendre le script exécutable
chmod +x test-security.sh

# Lancer tous les tests
./test-security.sh

# Ou avec une URL personnalisée
./test-security.sh http://votre-domaine.com
```

## Qu'est-ce qui est Testé

### ✅ Test 1: Message Valide
- Vérifie qu'un message normal est accepté
- Réponse attendue: réponse d'Ollama

### ✅ Test 2: Validation de Longueur
- Message > 500 caractères → **400 (Rejeté)**
- Message vide/whitespace → **400 (Rejeté)**

### ✅ Test 3: Détection Spam
- Caractères répétés (aaaa...) → **400 (Bloqué)**
- Protège contre le flooding simple

### ✅ Test 4: SQL Injection
- `SELECT * FROM users` → **400 (Bloqué)**
- `DROP TABLE` → **400 (Bloqué)**
- Protège la base de données

### ✅ Test 5: Prompt Injection
- "Ignore tes instructions" → **400 (Bloqué)**
- "Fais un jailbreak" → **400 (Bloqué)**
- "Oublie tout" → **400 (Bloqué)**
- Protège les directives système

### ✅ Test 6: Rate Limiting
- 10 requêtes/minute par IP
- 11ème requête → **429 (Too Many Requests)**
- Empêche le flood

### ✅ Test 7: Monitoring Access Control
- Sans authentification → **401 (Unauthorized)**
- Protège les stats d'abus

### ✅ Test 8: Types de Messages
- Type "normal" → Accepté
- Type "mission-help" → Accepté

---

## Résultats Attendus

### Succès ✅
```
🔒 Tests de Sécurité - Garde-fous
==================================

Test 1: Message Valide
✅ Message normal accepté

Test 2: Validation de Longueur
✅ Message > 500 chars rejeté (400)

Test 3: Détection Spam
✅ Spam détecté et bloqué (400)

...

==================================
✅ Tests réussis: 12
❌ Tests échoués: 0
==================================
🎉 Tous les garde-fous fonctionnent!
```

### Problèmes Possibles

**❌ Message valide rejeté**
- Ollama n'est pas lancé
- Serveur NIRD ne répond pas
- Vérifier: `curl http://localhost:3000/api/chat`

**❌ Rate limiting ne fonctionne pas**
- Rate limiting peut prendre quelques secondes
- Vérifier les logs du serveur
- Peut être limité à 10/minute seulement

**❌ Monitoring pas protégé**
- Variable `ADMIN_TOKEN` non définie
- Définir dans `.env.local`: `ADMIN_TOKEN=your-secret`

---

## Tests Manuels Avancés

### 1️⃣ Tester directement avec curl

```bash
# Message valide
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Aide moi","type":"mission-help"}'

# SQL Injection bloquée (400)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"SELECT * FROM users","type":"mission-help"}'

# Rate limiting (429 après 10 req)
for i in {1..15}; do curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Test $i\",\"type\":\"mission-help\"}"; done
```

### 2️⃣ Surveiller les Abus

```bash
# Vérifier les stats d'abus (avec auth)
curl -X GET "http://localhost:3000/api/abuse-monitoring?action=stats" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

# Voir les logs récents
curl -X GET "http://localhost:3000/api/abuse-monitoring?action=logs&limit=20" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 3️⃣ Stress Test

```bash
# Test de 100 requêtes rapides
for i in {1..100}; do 
  curl -s -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Stress test $i\",\"type\":\"mission-help\"}" &
done
wait

# Vérifier les stats
curl -X GET "http://localhost:3000/api/abuse-monitoring?action=stats" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 4️⃣ Tester le Cache

```bash
# Envoyer le même message 2 fois
msg='{"message":"Qu'\''est-ce que c'\''est?","type":"mission-help"}'

# 1ère fois (pas en cache)
time curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "$msg"

# 2ème fois (devrait être plus rapide - en cache)
time curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "$msg"
```

---

## Modifier les Seuils

Pour ajuster les paramètres de sécurité, éditer `/src/lib/abusePreventionMiddleware.ts`:

```typescript
const RATE_LIMIT = {
  maxRequests: 10,          // ← Changer ici (req/min)
  windowMs: 60000,          // ← Changer ici (millisecondes)
  maxMessageLength: 500,    // ← Changer ici (caractères)
  cacheExpiry: 300000,      // ← Changer ici (5 min en ms)
  minTimeBetweenRequests: 500, // ← Délai min entre requêtes
};
```

Exemples:
- Rate limit plus strict: `maxRequests: 5` (5 req/min)
- Messages plus longs: `maxMessageLength: 1000`
- Cache plus court: `cacheExpiry: 60000` (1 min)

---

## Logs de Sécurité

Le système enregistre automatiquement les abus:

**Types de logs:**
- `rate-limit` - Dépassement du rate limit
- `invalid-content` - Contenu invalide détecté
- `injection-attempt` - Tentative d'injection
- `cache-hit` - Réponse servie du cache

**Accès aux logs:**
```bash
curl -X GET "http://localhost:3000/api/abuse-monitoring?action=logs&limit=50" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Sortie:**
```json
{
  "logs": [
    {
      "timestamp": "2025-12-05T10:23:45.123Z",
      "clientId": "192.168.1.1:session-xyz",
      "type": "rate-limit",
      "message": "Exceeded 10 requests per minute"
    }
  ],
  "timestamp": "2025-12-05T10:24:00.000Z"
}
```

---

## Dépannage

| Problème | Cause | Solution |
|----------|-------|----------|
| `Connection refused` | Serveur pas lancé | `pnpm dev` |
| `curl: command not found` | curl non installé | `brew install curl` |
| Rate limit ne fonctionne pas | Timeout trop court | Augmenter `windowMs` |
| Tests lents | Ollama occupé | Laisser buffer quelques sec |
| 401 Unauthorized | Pas d'auth token | Définir `ADMIN_TOKEN` |

---

## Checklist de Sécurité

- [ ] ✅ Messages normaux acceptés
- [ ] ✅ Rate limiting activé (429)
- [ ] ✅ SQL injections bloquées (400)
- [ ] ✅ Prompt injections bloquées (400)
- [ ] ✅ Spam détecté (400)
- [ ] ✅ Monitoring protégé (401)
- [ ] ✅ Cache fonctionne
- [ ] ✅ Logs d'abus générés

---

## Support

Pour signaler des failles de sécurité ou des faux positifs:
1. Vérifier le fichier `SECURITY.md`
2. Consulter les logs: `/api/abuse-monitoring?action=logs`
3. Contacter l'équipe dev avec les détails
