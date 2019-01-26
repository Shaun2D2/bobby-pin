# bobby-pin

example config
```
import server from 'bobby-pin';

const config = {
    routes: [
        { ... }
    ],
    middleware: {
        before: [

        ],
        after: [

        ]
    },
    port: 9999,
    staticRoutes: [
        'public'
    ]
} 

server(config)
```