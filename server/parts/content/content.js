import {constants, mongo, hasItemByName} from '../../utils/db.js';
import boom from '@hapi/boom';

export const create = async ({payload}) => {
  return mongo(async db => {
    const content = db.collection(constants.content);
    const {meta, values, regions} = payload;
    const {name} = meta;
    if (await hasItemByName(content, name)) {
      return boom.badRequest(`${name} already exists`, {meta, values, regions});
    }
    return await content.insertOne({meta, values, regions});
  });
};

export const query = async (q = {}) => {
  return mongo(async db => {
    const content = db.collection(constants.content);
    return await content.find(q).toArray();
  });
};

export const getAll = async () => query();

export const get = async ({params}) => {
  const {name} = params;
  return query({'meta.name': name});
};

export const update = async ({payload}) => {
  return mongo(async db => {
    const {meta, values, regions} = payload;
    const {name} = meta;
    const content = db.collection(constants.content);

    return await content.replaceOne({'meta.name': name}, {meta, values, regions});
  });
};

export const del = async ({payload}) => {
  return mongo(async db => {
    const {name} = payload;
    const content = db.collection(constants.content);
    return await content.deleteOne({'meta.name': name});
  });
};

/*

Content structure - the filled out templates and components
{
  meta: {
    name: string
    type: string (template key)
    path: string
    tags: [string]
    publish_date: 
    status: [draft, scheduled, published]
    approvals: {
      editor: {userID, date}
      designer: {userID, date}
      translator: {userID, date}
    }
  },
  values: {}, // a template may have values, they would be, title, social stuff, non presented data.
  regions: [{
    meta: {
      type: string
    },
    values: {

    },
    regions: []
  }], 
  versions: [] ?
}
*/
