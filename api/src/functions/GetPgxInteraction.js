const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});

app.http('GetPgxInteraction', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const drug = request.query.get('drug');
            const gene = request.query.get('gene');

            const container = client
                .database('bigbang-bedside')
                .container('pgx-interactions');

            let query = 'SELECT * FROM c';
            const parameters = [];
            const conditions = [];

            if (drug) {
                conditions.push('c.drug = @drug');
                parameters.push({ name: '@drug', value: drug });
            }
            if (gene) {
                conditions.push('c.gene = @gene');
                parameters.push({ name: '@gene', value: gene });
            }
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            const { resources } = await container.items
                .query({ query, parameters })
                .fetchAll();

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(resources)
            };
        } catch (error) {
            context.log('Error:', error.message);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: error.message })
            };
        }
    }
});