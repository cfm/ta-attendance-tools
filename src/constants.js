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
};