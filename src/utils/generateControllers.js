const { objectKeyFilter } = require('../utils/objectFilter');

/**
 * Create index resource
 */
const createIndex = async (req, res, next, model) => {
    const { query } = req;
    const filters = objectKeyFilter(query, Object.keys(model.rawAttributes));

    console.log(filters);
    /**
     * working on adding custom filtering for params passed.
     * need to loop through the keys from the filters about then remove any keys that should not
     * be used.  Also need to add a limit / offset
     */

    try {
        const models = await model.findAll({
            where: filters,
            limit: (parseInt(query.limit) || 10),
            offset: (parseInt(query.offset) || 0)
        });

        return res.status(200).json(models);
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: 'opps... something went wrong!' });
    }
};

/**
 * Create single resource
 */
const createShow = async (req, res, next, model) => {
    const { id } = req.params;

    try {
        const resource = await model.findByPk(id);

        if (resource) {
            return res.status(200).json(resource);
        }

        return res.status(404).json({ code: 404, message: 'resource not found.' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: 'opps... something went wrong!' });
    }
};

/**
 * Create create resource
 */
const createCreate = async (req, res, next, model) => {
    const { body } = req;

    try {
        const resource = await model.create({ ...body });

        return res.status(201).json(resource);
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: 'opps... something went wrong!' });
    }
};

/**
 * Create update resource
 */
const createUpdate =  async (req, res, next, model) => {
    const { id } = req.params;

    try {
        const resource = await model.findByPk(id);

        if (resource) {
            await resource.update({ ...req.body });

            return res.status(200).json(resource);
        }
        
        return res.status(404).json({ code: 404, message: 'resource not found.' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: 'opps... something went wrong!' });
    }
};

/**
 * Create remove resource
 */
const createRemove = async (req, res, next, model) => {
    const { id } = req.params;

    try {
        const resource = await model.findByPk(id);

        if (resource) {
            await resource.destroy();

            return res.status(200).json({ code: 200, message: 'resource deleted' });
        }
        
        return res.status(404).json({ code: 404, message: 'resource not found.' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ code: 500, message: 'opps... something went wrong!' });
    }
};

/**
 * create controller
 */
const createController = (model, options = {}) => {
    const controller = {
        index: (req, res, next) => createIndex(req, res, next, model),
        show: (req, res, next) => createShow(req, res, next, model),
        create: (req, res, next) => createCreate(req, res, next, model),
        update: (req, res, next) => createUpdate(req, res, next, model),
        remove: (req, res, next) => createRemove(req, res, next, model),
    };

    if (options.only) {
        Object.entries(controller).forEach(([key]) => {
            if (!options.only.find(item => item === key)) {
                delete controller[key];
            }
        });
    }

    if (options.extend) {
        Object.entries(options.extend).forEach(([key, func]) => {
            controller[key] = (req, res, next) => func(req, res, next, model);
        });
    }

    return controller;
};

module.exports = createController;