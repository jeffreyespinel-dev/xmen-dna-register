const dynamoose = require('dynamoose');

const schema = new dynamoose.Schema(
    {
        "mutantId": {
            "type": String,
            "hashKey": true
        },
        "dna": {
            "type": Array,
            "required": true
        }
    },
    {
        "saveUnknown": true,
        "timestamps": true
    }
);

const MeliMutansModel = dynamoose.model('meliMutants', schema, {
    create: true,
    throughput: {
        read: 5,
        write: 5,
    },
});
module.exports = { MeliMutansModel };