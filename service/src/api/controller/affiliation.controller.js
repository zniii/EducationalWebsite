const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    remove,
    update,
    getFaculty,
    getInstitute,
    getQuestionAndNote,
} = require("../service/affiliation.service");

async function getAllAffiliation(page, limit) {
    return await getAll(page, limit);
}

async function getAllAffiliationAdmin(){
    return await getAllAdmin();
}

async function getAffiliationBySlug(slug) {
    return await getOne(slug);
}

async function insertAffiliation(data) {
    return await insert(data);
}

async function updateAffiliation(slug, data) {
    return await update(slug, data);
}

async function deleteAffiliation(slug, status) {
    return await remove(slug, status);
}

async function getFacultyByAffiliation(page, limit, slug) {
    return await getFaculty(page, limit, slug);
}

async function getInstituteByAffiliation(page, limit, slug) {
    return await getInstitute(page, limit, slug);
}

async function getNotesAndQuestionByAffiliation(slug, sub) {
    return await getQuestionAndNote(slug, sub);
}

module.exports = {
    getAffiliationBySlug,
    insertAffiliation,
    getAllAffiliation,
    getAllAffiliationAdmin,
    updateAffiliation,
    deleteAffiliation,
    getFacultyByAffiliation,
    getInstituteByAffiliation,
    getNotesAndQuestionByAffiliation,
};
