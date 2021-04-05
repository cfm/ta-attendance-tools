const product = require('big-cartesian');
const Graph = require('graph-data-structure');
const { mean } = require('mathjs');


const ProxyGraph = function () {
    // NB.  See readme for a conceptual and terminological overview.

    const g = new Graph();

    // A target is a node that needs representation (indegree 0).
    g.targets = () => g.nodes().filter(node => g.indegree(node) == 0);

    // An unrepresented target has outdegree 0.
    g.targetsUnrepresented = () => g.targets().filter(node => g.outdegree(node) == 0);

    // A candidate is a node adjacent to a target (by definition, indegree > 0).
    g.candidates = () => g.targets().map(u => g.adjacent(u).map(v => {
        const w = g.getEdgeWeight(u, v);
        return { u, v, w };
    }));
    // An overassigned candidate represents more than MAX_PROXY_ASSIGNMENTS
    // targets.
    g.candidatesOverassigned = () => g.nodes().filter(node => g.indegree(node) > MAX_PROXY_ASSIGNMENTS);

    // A slate is a particular permutation of targets and candidates.
    g.slates = () => product(g.candidates());

    // TODO
    g.preference = () => mean.apply(null, g.candidates().flat().map(x => x.w - MAX_PROXIES));
    g.score = function () {
        // TODO: compute single composite score
        return {
            overassigned: g.proxiesOverassigned().length,
            preference: g.preference(),
            unrepresented: g.targetsUnrepresented().length,
        }
    };
    // END TODO

    g.solve = function () {
        let best = null;
        let best_score = 0;

        for (const slate of g.slates()) {
            const sg = new ProxyGraph();
            slate.forEach(x => {
                const { u, v, w } = x;
                sg.addEdge(u, v, w);
            });

            // TODO:
            // 1. score slate
            // 2. compare/memoize for best
            // 3. return best
            //
            // Does this need to be delegated to a worker/queue/parallelization?

            return sg;
        }

    };

    return g;
}

module.exports = ProxyGraph;