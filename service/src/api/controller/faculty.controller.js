const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    remove,
    update,
    getInstitute,
    getSubject,
    getAffiliation,
} = require("../service/faculty.service");

async function getAllFaculty(page, limit) {
    return await getAll(page, limit);
}

async function getAllFacultyAdmin(){
    return await getAllAdmin();
}

// async function getFacultyBySlug(slug) {
async function getFacultyBySlug(page, limit, slug) {
    //return await getOne(slug);
    return await getSubject(page, limit, instituteSlug, slug);
}

async function insertFaculty(data) {
    return await insert(data);
}

async function updateFaculty(slug, data) {
    return await update(slug, data);
}

async function deleteFaculty(slug, status) {
    return await remove(slug, status);
}

async function getInstituteByFaculty(page, limit, slug) {
    return await getInstitute(page, limit, slug);
}

async function getSubjectByFaculty(page, limit, instituteSlug, slug) {
    return await getSubject(page, limit, instituteSlug, slug);
}

async function getAffiliationByFaculty(slug){
    return await getAffiliation(slug);
}

module.exports = {
    getAllFaculty,
    getAllFacultyAdmin,
    insertFaculty,
    deleteFaculty,
    getFacultyBySlug,
    updateFaculty,
    getInstituteByFaculty,
    getSubjectByFaculty,
    getAffiliationByFaculty,
};
