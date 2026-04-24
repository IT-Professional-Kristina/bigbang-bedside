const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
});

app.http('GetGenomicVariants', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const gene = request.query.get('gene');

            const container = client
                .database('bigbang-bedside')
                .container('genomic-variants');

            let query = 'SELECT * FROM c';
            const parameters = [];

            if (gene) {
                query += ' WHERE c.gene = @gene';
                parameters.push({ name: '@gene', value: gene });
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