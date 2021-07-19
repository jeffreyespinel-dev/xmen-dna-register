'use strict';

var { uniqBy, sortBy, get } = require('lodash');
const { getSuccessResponse } = require('../helper/success');
const { getErrorResponse } = require('../helper/error');

const { MeliMutansModel } = require('../model/mutant');
const { MeliDnaStatsModel } = require('../model/dnaStats');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const queryFields = Object.keys(MeliMutansModel.schemas[0].schemaObject);
const queryStatsFields = Object.keys(MeliDnaStatsModel.schemas[0].schemaObject);

const addMutant = async (event) => {
    try {
        const bodyStr =event.Records[0].body;
        const body = JSON.parse(bodyStr);
        console.log('>>>>event.body', body);
        const isMutant = body.isMutant || false;

        const mutants = await getMutantByMutantId(body);
        const mutantsSelected = JSON.parse(mutants.body);
        if (mutantsSelected.data.length > 0) return getSuccessResponse(body);

        const result = await MeliMutansModel.create(body);
        await addDnaToStats(isMutant);
        
        return getSuccessResponse(result);
    } catch (error) {
        console.log('error', error);
        return getErrorResponse(error);
    }
};


const getMutantByMutantId = async (body) => {
    try {
        const { mutantId } = body;
        const result = await MeliMutansModel.query({ mutantId })
            .attributes(queryFields)
            .exec();
        return getSuccessResponse(result);
    } catch (error) {
        return getErrorResponse(error);
    }
};

const addDnaToStats = async (isMutant) => {
    try {
        
        const result = await MeliDnaStatsModel.query({ statsId: "0" })
            .attributes(queryStatsFields)
            .exec();

        const DEFAULT_STATS = {
            count_mutant_dna: 0,
            count_human_dna: 0,
            ratio: 0
        };

        const { count_mutant_dna, count_human_dna, ratio } = result.length > 0 ? result[0] : DEFAULT_STATS;

        const newCountMutantDna = isMutant ? (count_mutant_dna + 1) : count_mutant_dna;
        const newCountHumanDna = count_human_dna + 1;
        const newRatio = newCountMutantDna / newCountHumanDna;

        const newStats = {
            statsId: "0",
            count_mutant_dna: newCountMutantDna,
            count_human_dna: newCountHumanDna,
            ratio: newRatio
        }

        const statsDocument = new MeliDnaStatsModel(newStats);
        const resultSave = await statsDocument.save();
        return resultSave;
    } catch (error) {
        console.log('result>error', error);
        return getErrorResponse(error);
    }
};

module.exports = {
    addMutant,
    getMutantByMutantId
};