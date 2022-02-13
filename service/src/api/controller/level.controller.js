const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    remove,
    update,
    getSubject,
} = require("../service/level.service");

async function getAllLevel(page, limit, type) {
    return await getAll(page, limit, type);
}

async function getAllLevelAdmin(type) {
    return await getAllAdmin(type);
}

async function getLevelBySlug(slug) {
    return await getOne(slug);
}

async function insertLevel(data) {
    return await insert(data);
}

async function updateLevel(slug, data) {
    return await update(slug, data);
}

async function deleteLevel(slug, status) {
    return await remove(slug, status);
}

async function getSubjectByLevel(page, limit, slug) {
    return await getSubject(page, limit, slug);
}

module.exports = {
    deleteLevel,
    getAllLevel,
    getAllLevelAdmin,
    insertLevel,
    updateLevel,
    getLevelBySlug,
    getSubjectByLevel,
};
