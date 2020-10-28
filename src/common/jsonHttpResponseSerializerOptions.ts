export const jsonHttpResponseSerializerOptions = {
    serializers: [
        {
            regex: /^application\/json$/,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            serializer: ({ body }) => JSON.stringify(body)
        },            
    ], 
    default: 'application/json'
};

export default jsonHttpResponseSerializerOptions;