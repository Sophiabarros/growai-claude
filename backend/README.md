# GrowAI API

Backend do GrowAI (produto da TrackLink) — Node.js + Express + PostgreSQL.
Os dados de sensor/câmera são **simulados** nesta fase (ver `services/mockSensor.js`);
a API já está desenhada para receber leituras reais do ESP32 depois sem mudar contrato.

## Estrutura

```
backend/
  server.js              ponto de entrada, monta rotas e middlewares
  config/db.js            pool de conexão PostgreSQL
  middleware/auth.js       valida JWT (requireAuth)
  services/mockSensor.js   gera leituras/série semanal simuladas
  controllers/             lógica de cada recurso (auth, stations, reports, suggestions, settings)
  routes/                  mapeamento HTTP -> controller
  db/schema.sql            criação das tabelas
  db/seed.sql               dados de demonstração (usuário demo@growai.com / senha123)
```

## Setup

1. **Instalar dependências**
   ```
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente**
   ```
   cp .env.example .env
   ```
   Edite `.env` com a `DATABASE_URL` do seu Postgres (local, Docker ou um serviço
   gratuito como Neon/Supabase/Railway) e um `JWT_SECRET` próprio. Para o formulário
   de contato funcionar, preencha também `RESEND_API_KEY` com uma chave gerada em
   https://resend.com/api-keys (o remetente usado é o sandbox `onboarding@resend.dev`,
   que só entrega para o e-mail da própria conta Resend).

3. **Criar as tabelas**
   ```
   npm run db:schema
   ```

4. **(Opcional) Popular com dados de demonstração**
   ```
   npm run db:seed
   ```
   Cria o usuário `demo@growai.com` / `senha123` com as duas estações (Camomila
   e Hortelã) e sugestões já usadas nas telas do app.

5. **Rodar em desenvolvimento**
   ```
   npm run dev
   ```
   API sobe em `http://localhost:3000`.

## Rotas

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/health` | não | healthcheck |
| POST | `/api/contact` | não | envia e-mail do formulário "Contate-nos" via Resend |
| POST | `/api/auth/register` | não | cria usuário |
| POST | `/api/auth/login` | não | retorna `{ user, token }` |
| GET | `/api/auth/me` | sim | usuário logado |
| GET | `/api/stations` | sim | lista estações |
| POST | `/api/stations` | sim | cria estação |
| GET | `/api/stations/:id` | sim | detalhe |
| PUT | `/api/stations/:id` | sim | edita rotina (rega/luz/umidade/pH) |
| DELETE | `/api/stations/:id` | sim | remove estação |
| GET | `/api/stations/:id/readings/latest` | sim | gera e retorna leitura simulada |
| GET | `/api/stations/:id/photos/latest` | sim | último snapshot + status de saúde |
| GET | `/api/reports/weekly` | sim | série semanal (saúde + condições) por estação |
| GET | `/api/suggestions` | sim | lista sugestões de otimização |
| PATCH | `/api/suggestions/:id/apply` | sim | marca sugestão como aplicada |
| GET | `/api/settings/notifications` | sim | preferências de notificação |
| PATCH | `/api/settings/notifications` | sim | atualiza preferências |

Rotas autenticadas esperam header `Authorization: Bearer <token>`.

## Próximos passos sugeridos

- Trocar `services/mockSensor.js` por leitura real do ESP32 (HTTP callback ou
  broker MQTT) — nenhum controller precisa mudar, só a origem do dado.
- Adicionar upload real de imagem (S3/Cloudinary) para `station_photos.image_url`.
- Conectar o front-end estático (`js/api.js` na raiz do projeto) a este backend.
