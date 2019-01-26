// example config
// 
// const config = [
//     {
//         resource: 'healthcheck',
//         controller: 'healthCheck',
//         path: '/healthcheck',
//         operations: [
//             'index'
//         ],
//         middleware: ['someMiddleware']
//     }
// ];

const operationVerbMap = {
    index: {
        verb: 'get',
        pathId: false
    },    
    show: {
        verb: 'get',
        pathId: true
    },
    create: {
        verb: 'post',
        pathId: false,
    },
    update: {
        verb: 'put',
        pathId: true,
    },
    remove: {
        verb: 'delete',
        pathId: true,
    }
};

/**
 * apply middleware to the route
 */
const applyMiddleware = (middleware = []) => {
    const appliedMiddleware = [];

    if(middleware.length < 1) {
        return appliedMiddleware;
    }

    middleware.map(item => {
        const ware = require(`../middleware/${item}.js`);

        appliedMiddleware.push(ware);
    });

    return appliedMiddleware;
};

/**
 * Lets register all the routes to the application based on config
 */
const registerRoutes = (config, app) => {
    config.forEach(route => {
        route.operations.forEach(operation => {
            const controller = require(`../controllers/${route.controller}.js`);
            const pathMap = operationVerbMap[operation];

            app[pathMap.verb](
                pathMap.pathId ? `${route.path}/:id` : route.path,
                applyMiddleware(route.middleware ? route.middleware[operation] : []), 
                controller[operation]
            );
        });
    });
};

module.exports = registerRoutes;