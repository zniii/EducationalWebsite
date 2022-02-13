const {
    getAll,
    getAllAdmin,
    getOne,
    insert,
    updateStatus,
    addResources,
    deleteResource,
} = require("../service/note.service");

async function getAllNote(page, limit) {
    return await getAll(page, limit);
}

async function getAllNoteAdmin() {
    return await getAllAdmin();
}

async function getNoteBySlug(slug) {
    return await getOne(slug);
}

async function insertNote(data, filename) {
    return await insert(data, filename);
}

async function addNoteResource(slug, data, filename) {
    return await addResources(slug, data, filename);
}

async function updateStatusBySlug(slug, status) {
    return await updateStatus(slug, status);
}

async function deleteResourceBySlug(slug, id) {
    return await deleteResource(slug, id);
}

module.exports = {
    getAllNote,
    getAllNoteAdmin,
    getNoteBySlug,
    insertNote,
    addNoteResource,
    updateStatusBySlug,
    deleteResourceBySlug
};
