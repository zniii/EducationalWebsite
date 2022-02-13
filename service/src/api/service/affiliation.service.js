const { Affiliation } = require("../model/Affiliation.model");
const { Institute } = require("../model/Institute.model");
const { Faculty } = require("../model/Faculty.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId } = require("../lib/slug");
const mongoose = require("mongoose");
const { Subject } = require("../model/Subject.model");
const { Question } = require("../model/Question.model");
const { Note } = require("../model/Note.model");

async function getAll(page, limit) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const paginated = await Affiliation.paginate({status: 'active'}, paginationOptions);
    const affiliation = [];
    paginated.docs.forEach((e) => {
        affiliation.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            image: e.image,
        });
    });
    return (result = {
        items: affiliation,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin() {
    const paginated = await Affiliation.find({});
    const affiliation = [];
    paginated.forEach((e) => {
        affiliation.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            image: e.image,
            status: e.status,
        });
    });
    return (result = {
        items: affiliation,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Affiliation");
    let affiliation = await Affiliation.findOne({ _id: id, status: 'active' });
    if (!affiliation) {
        throw { message: `Affiliation with slug: ${slug} does not exist.` };
    }
    affiliation = {
        id: affiliation._id,
        name: affiliation.name,
        slug: affiliation.slug,
        description: affiliation.description,
        image: affiliation.image,
    };
    return affiliation;
}

async function insert(data) {
    const { name, description, image } = data;
    const slug = slugMaker(name);
    const oldAffiliation = await Affiliation.findOne({ slug: slug });
    if (oldAffiliation) {
        throw { message: `Affiliation Already exists with name: ${name}` };
    }
    const newAffiliation = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        status: "active",
    };
    if (image) {
        newAffiliation.image = image;
    }
    const affiliation = new Affiliation(newAffiliation);
    const savedAffiliation = await affiliation.save();
    return savedAffiliation;
}

async function update(slug, data) {
    let { name, description, image } = data;
    const id = await slugToId(slug, "Affiliation");
    if (!id) {
        throw { message: `Affiliation with slug: ${slug} not found.` };
    }
    const oldData = await Affiliation.findOne();
    name = name || oldData.name;
    description = description || oldData.description;
    image = image || oldData.image;
    const newSlug = slugMaker(name);
    await Affiliation.findByIdAndUpdate(id, {
        name,
        description,
        slug: newSlug,
        image: image,
    });
    return { name, description, newSlug, image };
}

async function remove(slug, status) {
    const id = await slugToId(slug, "Affiliation");
    const check = await Affiliation.findById(id);
    if(!check){
        throw { message: `Affiliation with slug ${slug} not found.`}
    }
    if(status === 'deactive'){
        const data = await Affiliation.findByIdAndUpdate(id, {
            status: "deactive",
        });
        return { id, slug, status: "deactive" };
    }else if( status === 'active'){
        const data = await Affiliation.findByIdAndUpdate(id, {
            status: 'active',
        });
        return { id, slug, status: 'active'};
    }
}

async function getInstitute(page, limit, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    let paginated;
    const id = await slugToId(slug, "Affiliation");
    paginated = await Institute.paginate(
        { affiliation: id },
        paginationOptions
    );
    const item = {
        institute: [],
    };
    paginated.docs.forEach((e) => {
        item.institute.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty,
            affiliation: e.affiliation,
            image: e.image,
        });
    });
    let affiliation = await Affiliation.findById(id);
    if (!affiliation) {
        throw { message: `Affiliation with slug: ${slug} does not exist.` };
    }
    item.affiliation = {
        id: affiliation._id,
        name: affiliation.name,
        slug: affiliation.slug,
        description: affiliation.description,
        image: affiliation.image
    };

    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getFaculty(page, limit, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const id = await slugToId(slug, "Affiliation");
    const paginated = await Faculty.paginate(
        { affiliation: id },
        paginationOptions
    );
    const item = {
        faculty: [],
    };
    paginated.docs.forEach((e) => {
        item.faculty.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            abbreviation: e.abbreviation,
            affiliation: e.affiliation,
        });
    });
    let affiliation = await Affiliation.findById(id);
    if (!affiliation) {
        throw { message: `Affiliation with slug: ${slug} does not exist.` };
    }
    item.affiliation = {
        id: affiliation._id,
        name: affiliation.name,
        slug: affiliation.slug,
        description: affiliation.description,
        image: affiliation.image,
    };
    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getQuestionAndNote(slug, sub) {
    const id = await slugToId(slug, 'Affiliation');
    const subId = await slugToId(sub, 'Subject');
    const affiliation = await Affiliation.findById(id);
    const fac = await Faculty.find({affiliation: id});
    let result = {}
    for(let i =0; i< fac.length; i++){
        const subject = await Subject.find({_id: subId, faculty: fac[i]._id});
        for(let j = 0; j < subject.length; j++) {
            const question = await Question.find({subject: subject[j]._id});
            const note = await Note.find({subject: subject[j]._id});
            result = {
                affiliation: affiliation,
                subject: subject,
                question: [question],
                note: [note],
            }
        }
    }

    return result;
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    update,
    remove,
    getInstitute,
    getFaculty,
    getQuestionAndNote,
};
