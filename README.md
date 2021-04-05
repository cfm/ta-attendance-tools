# ta-attendance-tools

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Graph representation of proxy candidates and assignments

If member X lists members A, B, and C as their possible proxies and is ultimately represented by C, then we say that:

1. X is the target, who is initially unrepresented;
2. A, B, and C are the candidates; and
3. C is the proxy ultimately assigned to represent X.

X, A, B, and C are all nodes.  Links are defined as

    {
        u: target,
        v: candidate,
        w: weight,
    }

such that the adjacent-node list for target `u` is the set of candidates `v` to represent it.

Therefore, a node's

* indegree = number of members it could represent; and
* outdegree = number of candidates that could represent it.