const { Note } = require("../model/Note.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const { Question } = require("../model/Question.model");

async function getAll(page, limit) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
        populate: "subject",
    };
    let paginated = await Note.paginate({status: 'active'}, paginationOptions);

    const note = [];
    paginated.docs.forEach((e) => {
        let noteObj = {
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            year: e.year,
            subject: e.subject,
        };
        let resource = [];
        e.resource.forEach((r) => {
            resource.push({
                id: r._id,
                name: r.name,
                description: r.description,
                path: `http://localhost:5000/api/${r.path}`,
                resourceType: r.resourceType,
            });
        });
        noteObj.resource = resource;
        note.push(noteObj);
    });
    // * Normalization end
    return (result = {
        items: note,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin(page, limit) {
    let paginated = await Note.find({}).populate({path: "subject"});

    const note = [];
    paginated.forEach((e) => {
        let noteObj = {
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            year: e.year,
            subjectname: e.subject.name,
            status: e.status,
        };
        let resource = [];
        e.resource.forEach((r) => {
            resource.push({
                id: r._id,
                name: r.name,
                description: r.description,
                path: `http://localhost:5000/api/${r.path}`,
                resourceType: r.resourceType,
            });
        });
        noteObj.resource = resource;
        note.push(noteObj);
    });
    // * Normalization end
    return (result = {
        items: note,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Note");
    let note = await Note.find({ _id: id }).populate({ path: "subject" });
    if (!note) {
        throw { message: `Note with slug: ${slug} does not exist.` };
    }
    note = note[0];

    // * Normalizing data for _id to id
    const subject = {
        id: note.subject._id,
        name: note.subject.name,
        description: note.subject.description,
        level: note.subject.level,
        faculty: note.subject.faculty,
        slug: note.subject.slug,
    };
    const resource = [];
    note.resource.forEach((e) => {
        resource.push({
            id: e._id,
            name: e.name,
            description: e.description,
            path: `http://localhost:5000/api/${e.path}`,
            resourceType: e.resourceType,
        });
    });
    // * Normalization end

    note = {
        id: note._id,
        name: note.name,
        slug: note.slug,
        description: note.description,
        year: note.year,
        subject: subject,
        resource: resource,
    };
    return note;
}

async function insert(data, filename) {
    let { name, description, subject, year, resource } = data;
    let slug = slugMaker(name);
    const oldNote = await Note.findOne({ slug: slug });
    if (oldNote) {
        slug = `${slug}-${randomNumber()}`;
    }
    const newNote = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        subject: subject,
        year: year,
        status: 'active',
    };
    const newResource = [];
    if (resource) {
        resource = JSON.parse(resource);
        let filePath = `file/${filename}`;
        newResource.push({
            _id: new mongoose.Types.ObjectId(),
            name: resource.name,
            description: resource.description,
            path: filePath,
            resourceType: resource.resourceType,
        });
        newNote.resource = newResource;
    }
    const note = new Note(newNote);
    let savedNote = await note.save();
    savedNote = {
        id: savedNote._id,
        name: savedNote.name,
        description: savedNote.description,
        slug: savedNote.slug,
        resource: savedNote.resource,
        year: savedNote.year,
        subject: savedNote.subject,
    };
    savedNote.resource[0].path = `http://localhost:5000/api/${savedNote.resource[0].path}`;
    return savedNote;
}

async function updateStatus(slug, status) {
    const id = await slugToId(slug, "Note");
    const value = await Note.findById(id);
    if (!value) {
        throw { message: `Note with slug: ${slug} not found.` };
    }
    if(status === 'deactive'){
        await Note.findByIdAndUpdate(id, {status: 'deactive'});
        return { id, slug };
    }
    else if(status === 'active'){
        await Note.findByIdAndUpdate(id, {status: 'active'});
        return { id, slug };
    }
}

async function deleteResource(slug, id) {
    const Id = await slugToId(slug, 'Note');
    const check = await Note.findById(Id);
    if(!check){
        throw { message: `Note with slug: ${slug} not found.` };
    }
    let resources = check.resource;
    let resource = [];
    [resource, _] = resources.filter((e) => e.id == id);
    if(resource){
        await Note.findByIdAndUpdate(Id, {
            $pull: { resource: resource },
        });
    }
    return await Note.findById(Id);
}

async function addResources(slug, data, filename) {
    let { addResource } = data;
    let id = await slugToId(slug, "Note");
    const check = await Note.findById(id);
    if(!check){
        throw { message: `Note with slug: ${slug} not found.` };
    }
    const newResource = [];
    if (filename) {
        addResource = JSON.parse(addResource);
        let filePath = `file/${filename}`;
        newResource.push({
            _id: new mongoose.Types.ObjectId(),
            name: addResource.name,
            description: addResource.description,
            path: filePath,
            resourceType: addResource.resourceType,
        });
    }
    await Note.findByIdAndUpdate(id, {
        $push: { resource: newResource },
    });
}


module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    updateStatus,
    addResources,
    deleteResource,
};
