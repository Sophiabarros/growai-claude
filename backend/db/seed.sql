-- GrowAI (TrackLink) - dados de demonstração
-- Rode DEPOIS do schema.sql: npm run db:seed
-- Usuário de teste: demo@growai.com / senha123

INSERT INTO users (name, email, password_hash)
VALUES ('Usuária Demo', 'demo@growai.com', crypt('senha123', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

WITH demo_user AS (
  SELECT id FROM users WHERE email = 'demo@growai.com'
),
station_1 AS (
  INSERT INTO stations (user_id, name, plant, tag, water_interval_h, light_hours, humidity_target, ph_target)
  SELECT id, 'Estação 1', 'Camomila', 'Anti-inflamatória', 8, 12, 75, 6.5 FROM demo_user
  RETURNING id
),
station_2 AS (
  INSERT INTO stations (user_id, name, plant, tag, water_interval_h, light_hours, humidity_target, ph_target)
  SELECT id, 'Estação 2', 'Hortelã', 'Calmante', 6, 10, 65, 6.0 FROM demo_user
  RETURNING id
)
INSERT INTO suggestions (station_id, message, growth_pct, health_pct)
SELECT id, 'Manter rotina atual. Planta respondendo bem aos parâmetros.', 12, 92 FROM station_1
UNION ALL
SELECT id, 'Aumentar iluminação em 2h/dia. Detectada redução na taxa de fotossíntese.', 5, 78 FROM station_2;

INSERT INTO notification_settings (user_id, health_alerts, watering_updates, weekly_reports)
SELECT id, true, true, false FROM users WHERE email = 'demo@growai.com'
ON CONFLICT (user_id) DO NOTHING;

-- Latest snapshot per station, used by the Home dashboard and Câmera page.
INSERT INTO station_photos (station_id, image_url, health_status, analysis_text, captured_at)
SELECT s.id, 'assets/images/app/img-app-camomila.png', 'saudavel',
       'Planta saudável, crescimento normal.', now() - interval '2 minutes'
FROM stations s WHERE s.name = 'Estação 1'
UNION ALL
SELECT s.id, 'assets/images/app/img-app-hortela.png', 'atencao',
       'Folhas com coloração levemente amarelada, possível deficiência de nitrogênio.', now() - interval '5 minutes'
FROM stations s WHERE s.name = 'Estação 2';
