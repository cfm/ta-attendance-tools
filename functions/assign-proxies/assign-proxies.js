const Graph = require('graph-data-structure');
const _ = require('lodash');

const { MAX_PROXIES, MAX_PROXY_ASSIGNMENTS, PROXY_KEYS } = require('../../src/constants');


const ProxyGraph = function () {
  const g = new Graph();

  g.proxiesOverassigned = () => g.nodes().filter(node => g.indegree(node) > MAX_PROXY_ASSIGNMENTS);
  g.targets = () => g.nodes().filter(node => g.indegree(node) == 0);
  g.targetsUnrepresented = () => g.nodes().filter(node => g.outdegree(node) == 0);

  g.resetCandidates = function () {
    g.candidates = _.fromPairs(g.targets().map(target => {
      return [target, {
        [g.adjacent(target)]: false,
      }];
    }));
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
  const unresolvable = [];

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
        unresolvable.push({ member: member.lastName, proxy: proxyKey });
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

  g.resetCandidates();
  return {
    graph: g,
    unresolvable: unresolvable,
  }
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
    console.info(`Need to solve proxies for targets=${JSON.stringify(proxySpace.graph.candidates)}`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        graph: proxySpace.graph.serialize(),
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
