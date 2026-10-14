const mysql = require("mysql2/promise");

class Database {
  constructor(config) {
    this.pool = mysql.createPool(config);
  }

  async ping() {
    const connection = await this.pool.getConnection();
    try {
      await connection.ping();
    } finally {
      connection.release();
    }
  }

  async call(procedureName, parameters = []) {
    if (!/^sp_[a-z0-9_]+$/.test(procedureName)) {
      throw new Error("Nombre de procedimiento no permitido");
    }

    const placeholders = parameters.map(() => "?").join(", ");
    const [rawResult] = await this.pool.query(
      `CALL ${procedureName}(${placeholders})`,
      parameters,
    );

    return this.#normalizeProcedureResult(rawResult);
  }

  async close() {
    await this.pool.end();
  }

  #normalizeProcedureResult(rawResult) {
    const parts = Array.isArray(rawResult) ? rawResult : [rawResult];
    const resultSets = parts.filter(Array.isArray);
    const headers = parts.filter(
      (part) => part && !Array.isArray(part) && typeof part === "object",
    );

    return {
      rows: resultSets[0] ?? [],
      resultSets,
      affectedRows: headers.reduce(
        (total, header) => total + (header.affectedRows ?? 0),
        0,
      ),
    };
  }
}

module.exports = { Database };
