const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120,
    useClones: false
});

const stats = {
    hits: 0,
    misses: 0
};

const tasksKey = (userId) => `tasks:${userId}`;
const taskKey = (userId, taskId) => `task:${userId}:${taskId}`;

function get(key) {
    const value = cache.get(key);

    if (value === undefined) {
        stats.misses += 1;
        return undefined;
    }

    stats.hits += 1;
    return value;
}

function set(key, value) {
    cache.set(key, value);
}

function invalidateTaskList(userId) {
    cache.del(tasksKey(userId));
}

function invalidateTask(userId, taskId) {
    cache.del([tasksKey(userId), taskKey(userId, taskId)]);
}

function getStats() {
    const total = stats.hits + stats.misses;

    return {
        hits: stats.hits,
        misses: stats.misses,
        hitRate: total ? Number(((stats.hits / total) * 100).toFixed(2)) : 0,
        keys: cache.keys().length,
        ttlSeconds: cache.options.stdTTL
    };
}

module.exports = {
    get,
    set,
    tasksKey,
    taskKey,
    invalidateTaskList,
    invalidateTask,
    getStats
};
