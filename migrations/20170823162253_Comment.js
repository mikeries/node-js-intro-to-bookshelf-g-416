exports.up = function(knex, Promise) {
    return knex.schema.createTable('comments', function(t) {
        t.increments('id').unsigned().primary();
        t.integer('user_id');
        t.integer('post_id');
        t.text('body');
        t.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('comments');
};