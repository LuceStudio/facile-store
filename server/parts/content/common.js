import {constants, mongo, hasItemByType} from '../../utils/db.js';
import boom from '@hapi/boom';

const create = async (tc, payload) => {
  return mongo(async db => {
    const {type, icon, tags, regions} = payload;
    const collection = db.collection(tc);

    if (await hasItemByType(collection, type)) {
      return boom.badRequest(`${tc} already exists`, {type, icon, tags, regions});
    }
    return await collection.insertOne({
      meta: {
        type,
        tags,
        icon
      },
      regions
    });
  });
};

const getAll = async (tc, query = {}) => {
  return mongo(async db => {
    const collection = db.collection(tc);
    return await collection.find(query).toArray();
  });
};

const get = async (tc, type) => {
  return getAll(tc, {'meta.type': type});
};

const update = async (tc, payload) => {
  return mongo(async db => {
    const {type, icon, tags, regions} = payload;
    const collection = db.collection(tc);
    // TODO: to updaty stuff here.
    return await collection.find({}).toArray();
  });
};

const del = async (tc, type) => {
  return mongo(async db => {
    const collection = db.collection(tc);
    return await collection.deleteOne({'meta.type': type});
  });
};

export const createTemplate = async payload => create(constants.templates, payload);
export const createComponent = async payload => create(constants.components, payload);

export const updateTemplate = async payload => update(constants.templates, payload);
export const updateComponent = async payload => update(constants.components, payload);

export const deleteTemplate = async type => del(constants.templates, type);
export const deleteComponent = async type => del(constants.components, type);

export const getTemplates = async () => getAll(constants.templates);
export const getComponents = async () => getAll(constants.components);

export const getTemplate = async type => get(constants.templates, type);
export const getComponent = async type => get(constants.components, type);
