const { Faculty } = require("../model/Faculty.model");
const { Institute } = require("../model/Institute.model");
const { Subject } = require("../model/Subject.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");
const { Level } = require("../model/Level.model");

async function getAll(page, limit) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const paginated = await Faculty.paginate(
        {status: 'active'},
        { paginationOptions, populate: { path: "affiliation" } }
    );
    const faculty = [];
    paginated.docs.forEach((e) => {
        faculty.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            abbreviation: e.abbreviation,
            affiliation: e.affiliation,
        });
    });
    return (result = {
        items: faculty,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin() {
    const paginated = await Faculty.find({}).populate({path: "affiliation"});
    const faculty = [];
    paginated.forEach((e) => {
        faculty.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            abbreviation: e.abbreviation,
            affiliation: e.affiliation.name,
            status: e.status,
        });
    });
    return (result = {
        items: faculty,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    // this function is unused as of now ...
    const id = await slugToId(slug, "Faculty");
    let faculty = await Faculty.findById(id).populate({ path: "affiliation" });
    if (!faculty) {
        throw { message: `Faculty with slug: ${slug} does not exist.` };
    }
    faculty = {
        id: faculty._id,
        name: faculty.name,
        slug: faculty.slug,
        description: faculty.description,
        abbreviation: faculty.abbreviation,
        affiliation: faculty.affiliation,
    };
    return faculty;
}

async function insert(data) {
    const { name, description, abbreviation, affiliation } = data;
    const slug = slugMaker(name);
    const oldFaculty = await Faculty.findOne({ slug: slug });
    if (oldFaculty) {
        throw { message: `Faculty Already exists with name: ${name}` };
    }
    const newFaculty = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        abbreviation: abbreviation,
        affiliation: affiliation,
        status: "active",
    };
    const faculty = new Faculty(newFaculty);
    const savedFaculty = await faculty.save();
    return savedFaculty;
}

async function update(slug, data) {
    let { name, description, abbreviation, affiliation } = data;
    const id = await slugToId(slug, "Faculty");
    if (!id) {
        throw { message: `Faculty with slug: ${slug} not found.` };
    }
    const oldData = await Faculty.findOne();
    name = name || oldData.name;
    abbreviation = abbreviation || oldData.abbreviation;
    description = description || oldData.description;
    affiliation = affiliation || oldData.affiliation;
    const newSlug = slugMaker(name);
    await Faculty.findByIdAndUpdate(id, {
        name: name,
        description: description,
        abbreviation: abbreviation,
        slug: newSlug,
        affiliation: affiliation,
    });
    return { name, description, abbreviation, newSlug, affiliation };
}

async function remove(slug, status) {
    const id = await slugToId(slug, "Faculty");
    const check = await Faculty.findOne({ _id: id});
    if (!check) {
        throw { message: `Faculty with slug: ${slug} not found.` };
    }
    if(status === 'deactive'){
        const data = await Faculty.findByIdAndUpdate(id, { status: "deactive" });
        return { id, slug, status: "deactive" };
    }else if (status === 'active'){
        const data = await Faculty.findByIdAndUpdate(id, { status: 'active' });
        return { id, slug, status: "active" };
    }
}

async function getInstitute(page, limit, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    let paginated;
    const id = await slugToId(slug, "Faculty");
    paginated = await Institute.paginate({ faculty: id }, paginationOptions);
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
    let faculty = await Faculty.findById(id);
    if (!faculty) {
        throw { message: `Faculty with slug: ${slug} does not exist.` };
    }
    item.faculty = {
        id: faculty._id,
        name: faculty.name,
        slug: faculty.slug,
        description: faculty.description,
        abbreviation: faculty.abbreviation,
        affiliation: faculty.affiliation,
    };
    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getSubject(page, limit, instituteSlug, slug) {
    //also used for getfacultyBySlug ... ie. getOne
    const id = await slugToId(slug, "Faculty");
    let faculty = await Faculty.findById(id).populate({
        path: "affiliation",
    });
    let newFaculty
    const affiliation = faculty.affiliation;
    const institute = await Institute.find({ id: affiliation.id });
    const levels = await Level.find({ faculty: id });
    let data = [];
    let dataData = {};
    for (let i = 0; i < levels.length; i++) {
        const subject = await Subject.find({ level: levels[i].id });
        let level = {
            title: levels[i].name,
            subjects: subject,
        };
        let sem = {
            level: level,
        };
        data.push(sem);
    }
    if(instituteSlug){
        const [nestedInstitute, _] = await Institute.find({"slug": instituteSlug});
        faculty.institute = nestedInstitute;
        newFaculty = {
            id: faculty._id,
            name: faculty.name,
            slug: faculty.slug,
            description: faculty.description,
            abbreviation: faculty.abbreviation,
            affiliation: faculty.affiliation,
            institute: nestedInstitute
        }
    }
    dataData = {
        affiliation: affiliation,
        institute: institute,
        faculty: (instituteSlug)?newFaculty:faculty,
        level: data,
    };
    return dataData;
}

async function getAffiliation(slug){
    const id = await slugToId(slug, 'Faculty');
    const faculty = await Faculty.findById(id).populate({path: 'affiliation'});
    const result = {
        id: faculty.id,
        name: faculty.name,
        slug: faculty.slug,
        abbreviation: faculty.abbreviation,
        status: faculty.status,
    }
    const res = {
        faculty: result,
        aff : [faculty.affiliation],
    }
    let data = []
    data.push(res);
    return data;
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    update,
    remove,
    getInstitute,
    getSubject,
    getAffiliation,
};
