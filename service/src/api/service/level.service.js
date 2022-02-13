const { Level } = require("../model/Level.model");
const { Subject } = require("../model/Subject.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");

async function getAll(page, limit, type) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
        populate: { path: "faculty" },
    };
    let paginated;
    if (type) {
        paginated = await Level.paginate({ type, status: 'active' }, paginationOptions);
    } else {
        paginated = await Level.paginate({status: 'active'}, paginationOptions);
    }
    const level = [];
    paginated.docs.forEach((e) => {
        level.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            type: e.type,
            faculty: e.faculty,
        });
    });
    return (result = {
        items: level,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin(type){
    let paginated;
    if (type) {
        paginated = await Level.find({ type: type }).populate({path: "faculty"});
    } else {
        paginated = await Level.find({}).populate({path: "faculty"});
    }
    const level = [];
    paginated.forEach((e) => {
        level.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            type: e.type,
            faculty: e.faculty.name,
            status: e.status,
        });
    });
    return (result = {
        items: level,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Level");
    let level = await Level.findById(id);
    if (!level) {
        throw { message: `Level with slug: ${slug} does not exist.` };
    }
    level = {
        id: level._id,
        name: level.name,
        slug: level.slug,
        description: level.description,
        type: level.type,
        faculty: level.faculty,
    };
    return level;
}

async function insert(data) {
    const { name, description, type, faculty } = data;
    const slug = slugMaker(name);
    const oldLevel = await Level.findOne({ slug: slug });
    if (oldLevel) {
        throw { message: `Level Already exists with name: ${name}` };
    }
    const newLevel = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        type: type,
        status: "active",
        faculty: faculty,
    };
    const level = new Level(newLevel);
    const savedLevel = await level.save();
    return savedLevel;
}

async function update(slug, data) {
    let { name, description, type, faculty } = data;
    const id = await slugToId(slug, "Level");
    if (!id) {
        throw { message: `Level with slug: ${slug} not found.` };
    }
    const oldData = await Level.findOne();
    if (name === oldData.name) {
        throw { message: `Level name conflict: ${name}` };
    }
    name = name || oldData.name;
    type = type || oldData.type;
    description = description || oldData.description;
    faculty = faculty || oldData.faculty;
    const newSlug = slugMaker(name);
    await Level.findByIdAndUpdate(id, {
        name: name,
        description: description,
        type: type,
        slug: newSlug,
        faculty: faculty,
    });
    return { name, description, type, newSlug, faculty };
}

async function remove(slug, status) {
    const id = await slugToId(slug, "Level");
    const check = await Level.findById( id );
    if (!check) {
        throw { message: `Level with slug: ${slug} not found.` };
    }
    if( status === "deactive"){
        const data = await Level.findByIdAndUpdate(id, { status: "deactive" });
        return { id, slug, status: "deactive" };
    }else if ( status === "active"){
        const data = await Level.findByIdAndUpdate(id, {status: 'active'});
        return { id, slug, status: 'active'};
    }
}

async function getSubject(page, limit, slug) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
    };
    const id = await slugToId(slug, "Level");
    let paginated = await Subject.paginate({ level: id }, paginationOptions);
    const item = {
        subject: [],
    };
    paginated.docs.forEach((e) => {
        item.subject.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty,
            level: e.level,
        });
    });
    let level = await Level.findById(id);
    if (!level) {
        throw { message: `Level with slug: ${slug} does not exist.` };
    }
    item.level = {
        id: level._id,
        name: level.name,
        slug: level.slug,
        description: level.description,
        type: level.type,
        faculty: level.faculty,
    };
    return (result = {
        items: item,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    update,
    remove,
    getSubject,
};
