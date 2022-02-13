const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    remove,
    update,
    getNote,
    getQuestion,
    getAffiliation,
} = require("../service/subject.service");

async function getAllSubject(page, limit) {
    return await getAll(page, limit);
}

async function getAllSubjectAdmin() {
    return await getAllAdmin();
}

async function getSubjectBySlug(slug) {
    return await getOne(slug);
}

async function insertSubject(data) {
    return await insert(data);
}

async function updateSubject(slug, data) {
    return await update(slug, data);
}

async function deleteSubject(slug, status) {
    return await remove(slug, status);
}

async function getNoteBySubject(page, limit, instituteSlug, slug) {
    return await getNote(page, limit, instituteSlug, slug);
}

async function getQuestionBySubject(page, limit, instituteSlug, slug) {
    return await getQuestion(page, limit, instituteSlug, slug);
}

async function getAffiliationBySubject(slug){
    return await getAffiliation(slug);
}

module.exports = {
    getAllSubject,
    getAllSubjectAdmin,
    getSubjectBySlug,
    updateSubject,
    insertSubject,
    deleteSubject,
    getNoteBySubject,
    getQuestionBySubject,
    getAffiliationBySubject,
};
