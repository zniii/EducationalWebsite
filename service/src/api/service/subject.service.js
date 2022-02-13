const { Subject } = require("../model/Subject.model");
const { Affiliation } = require("../model/Affiliation.model");
const { Note } = require("../model/Note.model");
const { Question } = require("../model/Question.model");
const { Institute } = require("../model/Institute.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");
const { Faculty } = require("../model/Faculty.model");

async function getAll(page, limit) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
        populate: [
            {
                path: "level",
            },
            {
                path: "faculty",
            },
        ],
    };
    let paginated = await Subject.paginate({status: 'active'}, paginationOptions);
    const subject = [];
    paginated.docs.forEach((e) => {
        subject.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty,
            level: e.level,
        });
    });
    return (result = {
        items: subject,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin(page, limit) {
    let paginated = await Subject.find({}).populate([{path: "level"}, {path: "faculty"}]);
    const subject = [];
    paginated.forEach((e) => {
        subject.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty.name,
            level: e.level.name,
            status: e.status,
        });
    });
    return (result = {
        items: subject,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Subject");
    let subject = await Subject.find({ _id: id })
        .populate({ path: "level" })
        .populate({ path: "faculty" });
    if (!subject) {
        throw { message: `Subject with slug: ${slug} does not exist.` };
    }
    subject = subject[0];

    // * Normalizing data for _id to id
    const faculty = {
        id: subject.faculty._id,
        name: subject.faculty.name,
        description: subject.faculty.description,
        slug: subject.faculty.slug,
        abbreviation: subject.faculty.abbreviation,
        affiliation: subject.faculty.affiliation,
    };
    const level = {
        id: subject.level._id,
        name: subject.level.name,
        slug: subject.level.slug,
        description: subject.level.description,
        type: subject.level.type,
    };
    // * Normalization end

    subject = {
        id: subject._id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        faculty: faculty,
        level: level,
    };
    return subject;
}

async function insert(data) {
    const { name, description, level, faculty } = data;
    const slug = slugMaker(name);
    const oldSubject = await Subject.findOne({ slug: slug });
    if (oldSubject) {
        slug = `${slug}-${randomNumber}`;
    }
    const newSubject = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        level: level,
        faculty: faculty,
        status: "active",
    };
    let subject = new Subject(newSubject);
    const savedSubject = await subject.save();
    return savedSubject;
}

async function update(slug, data) {
    let { name, description, level, faculty } = data;
    const id = await slugToId(slug, "Subject");
    if (!id) {
        throw { message: `Subject with slug: ${slug} not found.` };
    }
    let newSlug;
    if (name) {
        newSlug = slugMaker(name);
    }
    const oldData = await Subject.findOne();
    if (name === oldData.name) {
        newSlug = `${newSlug}-${randomNumber}`;
    }
    name = name || oldData.name;
    level = level || oldData.level;
    description = description || oldData.description;
    faculty = faculty || oldData.faculty;
    // * do the operation of filtering old date and adding new list..
    await Subject.findByIdAndUpdate(id, {
        name: name,
        description: description,
        level: level,
        slug: newSlug,
        faculty: faculty,
    });
    return { name, description, level, faculty, newSlug };
}

async function remove(slug, status) {
    const id = await slugToId(slug, "Subject");
    const check = await Subject.findById( id );
    if (!check) {
        throw { message: `Subject with slug: ${slug} not found.` };
    }
    if( status === "deactive"){
        await Subject.findByIdAndUpdate(id, { status: "deactive" });
        return { id, slug, status: "deactive" };
    }else if ( status === 'active'){
        await Subject.findByIdAndUpdate(id, { status : "active"});
        return { id, slug, status: "active"};
    }
}

async function getNote(page, limit, instituteSlug, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const id = await slugToId(slug, "Subject");
    let subject = await Subject.findById(id).populate({path: "level"}).populate({path: "faculty"});
    let institute;
    if(instituteSlug){
        [institute, _] = await Institute.find({slug: instituteSlug});
        institute = {
            id: institute._id,
            name: institute.name,
            slug: institute.slug,
            description: institute.description,
            faculty: institute.faculty,
            affiliation: institute.affiliation,
            image: institute.image, 
        }
    }
    let paginated = await Note.paginate({ subject: id }, paginationOptions);
    const item = {
        note: [],
    };
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
                path: r.path,
                resourceType: r.resourceType,
            });
        });
        noteObj.resource = resource;
        item.note.push(noteObj);
    });
    const affiliation = await Affiliation.findById(subject.faculty.affiliation);
    
    item.subject = {
        id: subject._id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        faculty: subject.faculty,
        level: subject.level,
        institute: institute,
        affiliation: affiliation
    };
    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getQuestion(page, limit, instituteSlug, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const id = await slugToId(slug, "Subject");
    let subject = await Subject.findById(id).populate({path: "level"}).populate({path: "faculty"});
    let institute;
    if(instituteSlug){
        [institute, _] = await Institute.find({slug: instituteSlug});
        institute = {
            id: institute._id,
            name: institute.name,
            slug: institute.slug,
            description: institute.description,
            faculty: institute.faculty,
            affiliation: institute.affiliation,
            image: institute.image, 
        }
    }
    let paginated = await Question.paginate({ subject: id }, paginationOptions);
    const item = {
        question: [],
    };
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
                path: r.path,
                resourceType: r.resourceType,
            });
        });
        questionObj.resource = resource;
        item.question.push(questionObj);
    });
    const affiliation = await Affiliation.findById(subject.faculty.affiliation);
    item.subject = {
        id: subject._id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        faculty: subject.faculty,
        level: subject.level,
        institute: institute,
        affiliation: affiliation
    };

    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAffiliation(slug) {
    const id = await slugToId(slug, 'Subject');
    const subject = await Subject.findById(id);
    const sub = {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        level: subject.level,
        faculty: subject.faculty,
        status: subject.status,
    }
    const facId = subject.faculty;
    const faculty = await Faculty.findById(facId).populate({path: 'affiliation'});
    let data = []
    let info = {
        subject: sub,
        affiliation: [faculty.affiliation]
    }
    data.push(info);
    return data;
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    update,
    remove,
    getNote,
    getQuestion,
    getAffiliation,
};
