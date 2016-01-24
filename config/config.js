var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'englishman_mysql'
    },
    port: 3000,
    db: 'mysql://root@localhost/englishman_dev',
    sequelizeConnURL: 'mysql://root@localhost:3306/englishman_dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'englishman-mysql'
    },
    port: 3000,
    db: 'mysql://root@localhost/englishman_mysql_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'englishman-mysql'
    },
    port: 3000,
    db: 'mysql://root@localhost/englishman_mysql_production'
  }
};

module.exports = config[env];
