const product = require('big-cartesian');
const Graph = require('graph-data-structure');
const _ = require('lodash');
const { mean } = require('mathjs');

const { MAX_PROXIES, MAX_PROXY_ASSIGNMENTS, PROXY_KEYS } = require('../../src/constants');


const ProxyGraph = function () {
  const g = new Graph();

  g.candidates = () => g.targets().map(u => g.adjacent(u).map(v => {
    const w = g.getEdgeWeight(u, v);
    return { u, v, w };
  }));
  g.preference = () => mean.apply(null, g.candidates().flat().map(x => x.w - MAX_PROXIES));
  g.proxiesOverassigned = () => g.nodes().filter(node => g.indegree(node) > MAX_PROXY_ASSIGNMENTS);
  g.score = function () {
    return {
      overassigned: g.proxiesOverassigned().length,
      preference: g.preference(),
      unrepresented: g.targetsUnrepresented().length,
    }
  };
  g.slates = () => product(g.candidates());

  g.targets = () => g.nodes().filter(node => g.indegree(node) == 0);
  g.targetsUnrepresented = () => g.targets().filter(node => g.outdegree(node) == 0);

  g.solve = function () {
    let best = null;
    let best_score = 0;

    for (const slate of g.slates()) {
      const sg = new ProxyGraph();
      slate.forEach(x => {
        const { u, v, w } = x;
        sg.addEdge(u, v, w);
      });

      return sg;
    }

  };

  return g;
}


const memberListToMap = (memberList, presentList) => {
  const map = new Map();
  memberList.forEach(member => {
    map.set(member.lastName, {
      ...member,
      present: presentList.includes(member.lastName),
    });
  });

  return map;
};

const resetProxySpace = (members) => {
  const g = new ProxyGraph();
  g.unresolvable = [];

  // Add ALL members as nodes.
  members.forEach(member => {
    g.addNode(member.lastName);
  });

  // Add PRESENT proxies for ABSENT members as edges.
  members.forEach(member => {
    if (member.present) return;

    PROXY_KEYS.forEach(k => {
      const proxyKey = member[k];
      if (proxyKey == "") return;

      const proxy = members.get(proxyKey);
      if (!proxy) {
        console.error(`Skipping unresolvable proxy=${proxyKey} for member=${member.lastName}`);
        g.unresolvable.push({ member: member.lastName, proxy: proxyKey });
        return;
      }
      if (!proxy.present) {
        console.debug(`Skipping absent proxy=${proxy.lastName} for member=${member.lastName}`);
        return;
      }

      const idx = k.replace('proxy', '');
      const weight = MAX_PROXIES - idx + 1;
      console.debug(`Adding proxy=${proxy.lastName} for member=${member.lastName} with weight=${weight}`);
      g.addEdge(member.lastName, proxy.lastName, weight);
    });
  })

  // Prune members we don't need to solve for, because they are both
  // (a) present and (b) not connected to any absent members.
  members.forEach(member => {
    const degrees = [
      g.indegree(member.lastName),
      g.outdegree(member.lastName),
    ];
    if (Math.max(...degrees) == 0) {
      console.debug(`Pruning irrelevant member=${member.lastName} from proxy space`);
      g.removeNode(member.lastName);
    }
  });

  return g;
};

const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params = JSON.parse(event.body);
    const memberList = params.memberList;
    const presentList = params.presentList;

    console.debug(`Received memberList of size=${memberList.length}`);
    console.debug(`Received presentList of size=${presentList.length}`);

    const members = memberListToMap(memberList, presentList);
    const proxySpace = resetProxySpace(members);
    console.debug("Need to solve the following proxy space:")
    console.debug(proxySpace.serialize());

    const solution = proxySpace.solve();
    console.log(solution.serialize());
    console.log("^^^ Found solution")

    return {
      statusCode: 200,
      body: JSON.stringify({
        graph: proxySpace.serialize(),
        unresolvable: proxySpace.unresolvable,
      }),
    }
  }
  catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.toString(),
    }
  }
}

module.exports = { handler }
