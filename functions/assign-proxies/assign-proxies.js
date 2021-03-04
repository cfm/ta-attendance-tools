const Graph = require('graph-data-structure');

const { PROXY_KEYS } = require('../../src/constants');

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

const deriveAbsentGraph = (members) => {
  const g = new Graph();
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
      const weight = 1 / idx;
      console.debug(`Adding proxy=${proxy.lastName} for member=${member.lastName} with weight=${weight}`);
      g.addEdge(member.lastName, proxy.lastName, weight);
    });
  })

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
    const { graph, unresolvable } = deriveAbsentGraph(members);

    return {
      statusCode: 200,
      body: JSON.stringify({
        graph: graph.serialize(),
        unresolvable,
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
