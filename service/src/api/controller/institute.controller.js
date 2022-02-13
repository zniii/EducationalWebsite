const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    remove,
    update,
} = require("../service/institute.service");

async function getAllInstitute(page, limit, type) {
    return await getAll(page, limit, type);
}

async function getAllInstituteAdmin(type) {
    return await getAllAdmin(type);
}

async function getInstituteBySlug(slug) {
    return await getOne(slug);
}

async function insertInstitute(data) {
    return await insert(data);
}

async function updateInstitute(slug, data) {
    return await update(slug, data);
}

async function deleteInstitute(slug, status) {
    return await remove(slug, status);
}

module.exports = {
    getAllInstitute,
    getAllInstituteAdmin,
    getInstituteBySlug,
    insertInstitute,
    updateInstitute,
    deleteInstitute,
};
