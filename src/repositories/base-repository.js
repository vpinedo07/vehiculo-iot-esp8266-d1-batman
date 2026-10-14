class BaseRepository {
  constructor(database) {
    this.database = database;
  }

  call(procedureName, parameters = []) {
    return this.database.call(procedureName, parameters);
  }
}

module.exports = { BaseRepository };
