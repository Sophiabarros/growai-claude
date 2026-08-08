const db = require("../config/db");
const { generateWeeklySeries, WEEKDAYS } = require("../services/mockSensor");

// Agrega leituras reais dos últimos 7 dias, agrupadas por dia da semana.
// Se ainda não houver leituras suficientes (comum em modo mock/demo), cai
// para uma série simulada coerente com o alvo cadastrado na estação.
async function getWeekly(req, res, next) {
  try {
    const { rows: stations } = await db.query(
      "SELECT * FROM stations WHERE user_id = $1 ORDER BY created_at",
      [req.user.id]
    );

    const reports = await Promise.all(
      stations.map(async (station) => {
        const { rows } = await db.query(
          `SELECT to_char(recorded_at, 'Dy') AS day,
                  avg(humidity)::int AS health,
                  avg(humidity)::int AS environment
           FROM sensor_readings
           WHERE station_id = $1 AND recorded_at > now() - interval '7 days'
           GROUP BY day
           ORDER BY min(recorded_at)`,
          [station.id]
        );

        const hasEnoughData = rows.length >= WEEKDAYS.length;
        const series = hasEnoughData
          ? {
              health: rows.map((r) => ({ day: r.day, value: r.health })),
              environment: rows.map((r) => ({ day: r.day, value: r.environment })),
            }
          : generateWeeklySeries(station);

        return {
          station_id: station.id,
          station_name: station.name,
          plant: station.plant,
          ...series,
        };
      })
    );

    res.json(reports);
  } catch (err) {
    next(err);
  }
}

module.exports = { getWeekly };
