
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').unsigned().primary();
        t.string('name');
        t.string('email');
        t.string('username');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};