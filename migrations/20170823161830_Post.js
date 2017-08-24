exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', function(t) {
        t.increments('id').unsigned().primary();
        t.string('title');
        t.string('body');
        t.integer('author');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('posts');
};
