/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Create the extension if it doesn't exist
    pgm.createExtension('vector', { ifNotExists: true });

    // Create the embeddings table
    pgm.createTable('ai_embeddings', {
        id: 'id',
        content: { type: 'text', notNull: true },
        metadata: { type: 'jsonb', notNull: false },
        embedding: { type: 'vector(1536)', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    });

    // Add indexes
    pgm.createIndex('ai_embeddings', 'embedding', {
        method: 'ivfflat',
        name: 'ai_embeddings_embedding_idx'
    });
    
    pgm.createIndex('ai_embeddings', 'created_at');
};

exports.down = pgm => {
    pgm.dropIndex('ai_embeddings', 'ai_embeddings_embedding_idx');
    pgm.dropTable('ai_embeddings');
    pgm.dropExtension('vector');
};
