const { deactive } = require("../service/note.service");
const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    updateStatus,
    deleteResource,
    addResources,
} = require("../service/question.service");

async function getAllQuestion(page, limit) {
    return await getAll(page, limit);
}

async function getAllQuestionAdmin() {
    return await getAllAdmin();
}

async function getQuestionBySlug(slug) {
    return await getOne(slug);
}

async function insertQuestion(data, filename) {
    return await insert(data, filename);
}

async function updateStatusQuestion(slug, status) {
    return await updateStatus(slug, status);
}

async function deleteResourceBySlug(slug, id) {
    return await deleteResource(slug, id);
}

async function addResourceBySlug(slug, data, filename) {
    return await addResources(slug, data, filename);
}

module.exports = {
    getAllQuestion,
    getAllQuestionAdmin,
    getQuestionBySlug,
    insertQuestion,
    updateStatusQuestion,
    deleteResourceBySlug,
    addResourceBySlug,
};
