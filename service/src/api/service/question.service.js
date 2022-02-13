const { Question } = require("../model/Question.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");
const { uploadFile } = require("./file.service");

async function getAll(page, limit) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
        populate: "subject",
    };
    let paginated = await Question.paginate({status: 'active'}, paginationOptions);
    const question = [];
    paginated.docs.forEach((e) => {
        let questionObj = {
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
        questionObj.resource = resource;
        question.push(questionObj);
    });
    return (result = {
        items: question,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin(page, limit) {
    let paginated = await Question.find({}).populate({path: "subject"});
    const question = [];
    paginated.forEach((e) => {
        let questionObj = {
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
        questionObj.resource = resource;
        question.push(questionObj);
    });
    return (result = {
        items: question,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Question");
    let question = await Question.find({ _id: id }).populate({
        path: "subject",
    });
    if (!question) {
        throw { message: `Question with slug: ${slug} does not exist.` };
    }
    question = question[0];

    // * Normalizing data for _id to id
    const subject = {
        id: question.subject._id,
        name: question.subject.name,
        description: question.subject.description,
        level: question.subject.level,
        faculty: question.subject.faculty,
        slug: question.subject.slug,
    };
    const resource = [];
    question.resource.forEach((e) => {
        resource.push({
            id: e._id,
            name: e.name,
            description: e.description,
            path: `http://localhost:5000/api/${e.path}`,
            resourceType: e.resourceType,
        });
    });
    // * Normalization end

    question = {
        id: question._id,
        name: question.name,
        slug: question.slug,
        description: question.description,
        year: question.year,
        subject: subject,
        resource: resource,
    };
    return question;
}

async function insert(data, filename) {
    let { name, description, subject, year, resource } = data;
    let slug = slugMaker(name);
    const oldQuestion = await Question.findOne({ slug: slug });
    if (oldQuestion) {
        slug = `${slug}-${randomNumber()}`;
    }
    const newQuestion = {
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
        newQuestion.resource = newResource;
    }
    const question = new Question(newQuestion);
    let savedQuestion = await question.save();
    savedQuestion = {
        id: savedQuestion._id,
        name: savedQuestion.name,
        description: savedQuestion.description,
        slug: savedQuestion.slug,
        resource: savedQuestion.resource,
        year: savedQuestion.year,
        subject: savedQuestion.subject,
    };
    savedQuestion.resource[0].path = `http://localhost:5000/api/${savedQuestion.resource[0].path}`;
    return savedQuestion;
}

async function updateStatus(slug, status) {
    const id = await slugToId(slug, "Question");
    const value = await Question.findOne({id: id, status: 'active'});
    if (!value) {
        throw { message: `Question with slug: ${slug} not found.` };
    }
    if(status === 'deactive'){
        await Question.findByIdAndUpdate(id, {status: 'deactive'});
        return { id, slug };
    }
    else if(status === 'active'){
        await Question.findByIdAndUpdate(id, {status: 'active'});
        return { id, slug };
    }
}

async function deleteResource(slug, id) {
    const Id = await slugToId(slug, 'Question');
    const check = await Question.findById(Id);
    if(!check){
        throw { message: `Question with slug: ${slug} not found.` };
    }
    let resources = check.resource;
    let resource = [];
    [resource, _] = resources.filter((e) => e.id == id);
    if(resource){
        await Question.findByIdAndUpdate(Id, {
            $pull: { resource: resource },
        });
    }
    return await Question.findById(Id);
}

async function addResources(slug, data, filename) {
    let { addResource } = data;
    let id = await slugToId(slug, "Question");
    const check = await Question.findById(id);
    if(!check){
        throw { message: `Question with slug: ${slug} not found.` };
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
    await Question.findByIdAndUpdate(id, {
        $push: { resource: newResource },
    });
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    updateStatus,
    deleteResource,
    addResources,
};
