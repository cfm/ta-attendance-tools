const maxProxies = 10;
const proxyKeys = [];
for (let i = 1; i <= maxProxies; i++) {
    const proxyKey = `proxy${i}`;
    proxyKeys.push(proxyKey);
}

const keys = [
    "lastName",
    "firstName",
    "padding",
    "lastModified",
    ...proxyKeys,
];

module.exports = {
    KEYS: keys,
    PROXY_KEYS: proxyKeys,

    MAX_PROXIES: maxProxies,

    // Legislated parameters (ProxyConstants.java)
    MAX_HOLDABLE_PROXIES: 2,
    QUORUM_PRESENT: 1/3,
    QUORUM_TOTAL: 0.5,
    TARP_MARGIN: 0.5,
    BYLAWS_MARGIN: 2/3,

    // Algorithmic parameters (ProxyConstants.java)
    MULTIPLE_PROXY_PENALTY: 0,
    REPRESENTED_BONUS: 50,
    RANK_SCORE: [15,13,11,9,7,6,5,4,3,2,1,0,0,0,0,0],
};