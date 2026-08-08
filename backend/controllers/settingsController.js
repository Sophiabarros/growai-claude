const db = require("../config/db");

async function getNotifications(req, res, next) {
  try {
    const { rows } = await db.query(
      "SELECT * FROM notification_settings WHERE user_id = $1",
      [req.user.id]
    );
    if (rows[0]) return res.json(rows[0]);

    const { rows: created } = await db.query(
      `INSERT INTO notification_settings (user_id) VALUES ($1) RETURNING *`,
      [req.user.id]
    );
    res.json(created[0]);
  } catch (err) {
    next(err);
  }
}

async function updateNotifications(req, res, next) {
  try {
    const { health_alerts, watering_updates, weekly_reports } = req.body;
    const { rows } = await db.query(
      `INSERT INTO notification_settings (user_id, health_alerts, watering_updates, weekly_reports)
       VALUES ($1, COALESCE($2, true), COALESCE($3, true), COALESCE($4, false))
       ON CONFLICT (user_id) DO UPDATE SET
         health_alerts    = COALESCE($2, notification_settings.health_alerts),
         watering_updates = COALESCE($3, notification_settings.watering_updates),
         weekly_reports   = COALESCE($4, notification_settings.weekly_reports)
       RETURNING *`,
      [req.user.id, health_alerts, watering_updates, weekly_reports]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications, updateNotifications };
