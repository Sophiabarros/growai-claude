// Simula leituras de sensor enquanto não há hardware (ESP32) real conectado.
// Quando o dispositivo real existir, troque as chamadas a este módulo pela
// leitura publicada por ele (HTTP ou MQTT) - o formato retornado é o mesmo,
// então nenhum controller/rota precisa mudar.

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// pg returns NUMERIC columns as strings (to avoid float precision loss),
// so `base` must be coerced before doing arithmetic with it.
function jitter(base, spread) {
  return +(Number(base) + (Math.random() - 0.5) * spread).toFixed(1);
}

function generateReading(station) {
  return {
    humidity: jitter(station.humidity_target, 6),
    ph: jitter(station.ph_target, 0.4),
    light_h: Number(station.light_hours),
    temperature: jitter(24, 3),
  };
}

// Série semanal para os gráficos de Relatórios quando ainda não há 7 dias
// de leituras reais acumuladas no banco.
function generateWeeklySeries(station) {
  const health = WEEKDAYS.map((day) => ({
    day,
    value: Math.round(jitter(88, 12)),
  }));
  const environment = WEEKDAYS.map((day) => ({
    day,
    value: Math.round(jitter(station.humidity_target, 10)),
  }));
  return { health, environment };
}

module.exports = { generateReading, generateWeeklySeries, WEEKDAYS };
