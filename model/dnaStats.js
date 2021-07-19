const dynamoose = require('dynamoose');

const schema = new dynamoose.Schema(
    {
        "statsId": {
            "type": String,
            "hashKey": true
        },
        "count_mutant_dna": {
            "type": Number,
            "required": true
        },
        "count_human_dna": {
            "type": Number,
            "required": true
        },
        "ratio": {
            "type": Number,
            "required": true
        }
    },
    {
        "saveUnknown": true,
        "timestamps": true
    }
);

const MeliDnaStatsModel = dynamoose.model('meliDnaStats', schema, {
    create: true
});
module.exports = { MeliDnaStatsModel };