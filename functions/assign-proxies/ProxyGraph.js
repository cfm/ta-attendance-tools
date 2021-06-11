const product = require('big-cartesian');
const Graph = require('graph-data-structure');
const { mean } = require('mathjs');

const { MAX_HOLDABLE_PROXIES, MAX_PROXIES, REPRESENTED_BONUS } = require('../../src/constants');


const ProxyGraph = function () {
    // NB.  See readme for a conceptual and terminological overview.

    const g = new Graph();

    // A target is a node that needs representation (indegree 0).
    g.targets = () => g.nodes().filter(node => g.indegree(node) == 0);

    // A represented target has outdegree 1.
    g.targetsRepresented = () => g.nodes().filter(node => g.outdegree(node) == 1);

    // An unrepresented target has outdegree 0.
    g.targetsUnrepresented = () => g.targets().filter(node => g.outdegree(node) == 0);

    // A candidate is a node adjacent to a target (by definition, indegree > 0).
    g.candidates = () => g.targets().map(u => g.adjacent(u).map(v => {
        const w = g.getEdgeWeight(u, v);
        return { u, v, w };
    }));
    // An overassigned candidate represents more than MAX_HOLDABLE_PROXIES
    // targets.
    g.candidatesOverassigned = () => g.nodes().filter(node => g.indegree(node) > MAX_HOLDABLE_PROXIES);
    g.hasCandidatesOverassigned = () => g.candidatesOverassigned().length > 0

    // A slate is a particular permutation of targets and candidates.
    g.slates = () => product(g.candidates());

    g.preference = () => mean.apply(null, g.candidates().flat().map(x => x.w - MAX_PROXIES));
    g.scoreInputs = () => {
        let preference = g.preference();
        return {
            targetsRepresented: g.targetsRepresented().length,
            REPRESENTED_BONUS: REPRESENTED_BONUS,

            preference: preference,
            weightedBonus: REPRESENTED_BONUS * (1 + preference),
        };
    }
    g.score = () => {
        let inputs = g.scoreInputs();
        return inputs.targetsRepresented * inputs.weightedBonus;
    }

    g.solve = function () {
        let bestSlate = null;
        let bestSlateIndex = 0;
        let bestSlateScore = 0;

        let i = 0;
        for (let slate of g.slates()) {
            let idx = i++;
            let sg = new ProxyGraph();
            slate.forEach(x => {
                const { u, v, w } = x;
                sg.addEdge(u, v, w);
            });

            if (sg.hasCandidatesOverassigned()) {
                continue;
            }

            let score = sg.score();
            if (score > bestSlateScore) {
                console.debug(`New best slate=${idx} has score=${score} from inputs=${JSON.stringify(sg.scoreInputs())}`);
                bestSlate = sg;
                bestSlateIndex = idx;
                bestSlateScore = score;
            }

            // Does this need to be delegated to a worker/queue/parallelization?

        }

        console.log(`Found best slate=${bestSlateIndex} with score=${bestSlateScore}`);
        return bestSlate;
    };

    return g;
}

module.exports = ProxyGraph;