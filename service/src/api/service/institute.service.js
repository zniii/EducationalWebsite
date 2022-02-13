const { Institute } = require("../model/Institute.model");
const { Logger } = require("../lib/logger");
const { slugMaker, slugToId, randomNumber } = require("../lib/slug");
const mongoose = require("mongoose");

async function getAll(page, limit, type) {
    const paginationOptions = {
        page: page || 1,
        limit: limit || 10,
        populate: [
            {
                path: "affiliation",
            },
            {
                path: "faculty",
            },
        ],
    };
    let paginated;
    if (type) {
        paginated = await Institute.paginate({ type, status: 'active' }, paginationOptions);
    } else {
        paginated = await Institute.paginate({status: "active"}, paginationOptions);
    }
    const institute = [];
    paginated.docs.forEach((e) => {
        institute.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty,
            affiliation: e.affiliation,
            image: e.image,
        });
    });
    return (result = {
        items: institute,
        total: paginated.totalDocs,
        totalPages: paginated.totalPages,
        hasNext: paginated.hasNextPage,
    });
}

async function getAllAdmin(type){
    let paginated;
    if (type) {
        paginated = await Institute.find({type: type}).populate([{path: "affiliation"}, {path: "faculty"}]);
    } else {
        paginated = await Institute.find({}).populate([{path: "affiliation"}, {path: "faculty"}]);
    }
    const institute = [];
    paginated.forEach((e) => {
        institute.push({
            id: e._id,
            name: e.name,
            slug: e.slug,
            description: e.description,
            faculty: e.faculty,
            affiliation: e.affiliation.name,
            image: e.image,
            status: e.status,
            type: e.type,
        });
    });
    return (result = {
        items: institute,
        total: paginated.length,
        totalPages: 1,
        hasNext: 1,
    });
}

async function getOne(slug) {
    const id = await slugToId(slug, "Institute");
    let institute = await Institute.find({ _id: id })
        .populate({ path: "faculty" })
        .populate({ path: "affiliation" });
    if (!institute) {
        throw { message: `Institute with slug: ${slug} does not exist.` };
    }
    institute = institute[0];

    // * Normalizing data for _id to id
    const faculty = [];
    institute.faculty.forEach((e) => {
        faculty.push({
            id: e._id,
            name: e.name,
            description: e.description,
            slug: e.slug,
            abbreviation: e.abbreviation,
        });
    });
    const affiliation = {
        id: institute.affiliation._id,
        name: institute.affiliation.name,
        slug: institute.affiliation.slug,
        description: institute.affiliation.description,
        image: institute.affiliation.image
    };
    // * Normalization end

    institute = {
        id: institute._id,
        name: institute.name,
        slug: institute.slug,
        description: institute.description,
        image: institute.image,
        faculty: faculty,
        affiliation: affiliation,
    };
    if (institute.image) {
        institute.image = institute.image;
    }
    return institute;
}

async function insert(data) {
    const { name, description, type, address, affiliation, faculty, image } =
        data;
    let slug = slugMaker(name);
    const oldInstitute = await Institute.findOne({ slug: slug });
    if (oldInstitute) {
        slug = `${slug}-${randomNumber}`;
    }
    const newInstitute = {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        description: description,
        slug: slug,
        type: type,
        address: address,
        affiliation: affiliation,
        faculty: faculty,
        status: "active,",
    };
    if (image) {
        newInstitute.image = image;
    }
    const institute = new Institute(newInstitute);
    const savedInstitute = await institute.save();
    return savedInstitute;
}

async function update(slug, data) {
    let { name, description, type, faculty, affiliation, address, image } =
        data;
    const id = await slugToId(slug, "Institute");
    if (!id) {
        throw { message: `Institute with slug: ${slug} not found.` };
    }
    let newSlug;
    if (name) {
        newSlug = slugMaker(name);
    }
    const oldData = await Institute.findOne();
    if (name === oldData.name) {
        newSlug = `${newSlug}-${randomNumber}`;
    }
    name = name || oldData.name;
    type = type || oldData.type;
    description = description || oldData.description;
    faculty = faculty || oldData.faculty;
    affiliation = affiliation || oldData.affiliation;
    address = address || oldData.address;
    image = image || oldData.image;
    // * do the operation of filtering old date and adding new list..
    await Institute.findByIdAndUpdate(id, {
        name: name,
        description: description,
        type: type,
        slug: newSlug,
        faculty: faculty,
        affiliation: affiliation,
        address: address,
        image: image,
    });
    return {
        name,
        description,
        image,
        type,
        faculty,
        affiliation,
        address,
        newSlug,
    };
}

async function remove(slug, status) {
    const id = await slugToId(slug, "Institute");
    const check = await Institute.findById( id );
    if (!check) {
        throw { message: `Institute with slug: ${slug} not found.` };
    }
    if(status === 'deactive'){
        const data = await Institute.findByIdAndUpdate(id, { status: "deactive" });
        return { id, slug, status: "deactive" };
    }else if (status === 'active'){
        const data = await Institute.findByIdAndUpdate( id , { status: "active"});
        return { id, slug, status: "active"};   
    }
}

module.exports = {
    insert,
    getAll,
    getAllAdmin,
    getOne,
    update,
    remove,
};
