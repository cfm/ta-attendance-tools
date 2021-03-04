const { DirectedGraph } = require('@datastructures-js/graph');

const { PROXY_KEYS } = require('../../src/constants');

const convertAttendanceToGraph = (memberList, presentList) => {
  const g = new DirectedGraph();
  var unresolvable = [];

  // Add ALL members as vertices
  memberList.forEach(member => {
    g.addVertex(member.lastName, {
      ...member,
      present: presentList.includes(member.lastName),
    });
  });

  // Add PRESENT proxies as edges
  g._vertices.forEach(member => {
    PROXY_KEYS.forEach(k => {
      const proxyKey = member.value[k];
      if (proxyKey == "") return;

      const proxy = g._vertices.get(proxyKey);
      if (!proxy) {
        console.error(`Skipped unresolvable proxy=${proxyKey} for member=${member.key}`);
        unresolvable.push({ member: member.key, proxy: proxyKey });
        return;
      }
      if (!proxy.value.present) {
        console.debug(`Skipped absent proxy=${proxy.key} for member=${member.key}`);
        return;
      }

      const idx = k.replace('proxy', '');
      const weight = 1 / idx;
      g.addEdge(member.key, proxy.key, weight);
      console.debug(`Added proxy=${proxy.key} for member=${member.key} with weight=${weight}`);
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

    const { graph, unresolvable } = convertAttendanceToGraph(memberList, presentList);

    return {
      statusCode: 200,
      body: JSON.stringify({
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
