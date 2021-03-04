const proxyKeys = [
    "proxy1",
    "proxy2",
    "proxy3",
    "proxy4",
    "proxy5",
    "proxy6",
    "proxy7",
    "proxy8",
    "proxy9",
    "proxy10",
];

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
};