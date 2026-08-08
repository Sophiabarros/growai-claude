const db = require("../config/db");

async function list(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT sg.*, st.name AS station_name, st.plant
       FROM suggestions sg
       JOIN stations st ON st.id = sg.station_id
       WHERE st.user_id = $1
       ORDER BY sg.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function apply(req, res, next) {
  try {
    const { rows } = await db.query(
      `UPDATE suggestions sg SET applied = true
       FROM stations st
       WHERE sg.id = $1 AND sg.station_id = st.id AND st.user_id = $2
       RETURNING sg.*`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Sugestão não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, apply };
