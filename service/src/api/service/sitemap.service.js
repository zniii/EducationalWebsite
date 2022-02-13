const { Affiliation } = require("../model/Affiliation.model");
const { Faculty } = require("../model/Faculty.model");
const { Subject } = require("../model/Subject.model");
const { Institute } = require("../model/Institute.model");
const { Question } = require("../model/Question.model");
const { Note } = require("../model/Note.model");
const { level } = require("winston");

async function get() {
    const affiliation = await Affiliation.find({status: "active"});
    const faculty = await Faculty.find({status: "active"});
    const sub = await Subject.find({status: "acitve"});
    const institute = await Institute.find({}).populate([
        { path: "affiliation" },
        { path: "faculty" },
    ]);
    let data = [];

    for (let i = 0; i < affiliation.length; i++) {
        let item = {
            url: affiliation[i].slug,
            name: affiliation[i].name,
            changefreq: "daily",
            priority: 0.3,
            date: Date.now(),
        };
        data.push(item);
    }

    for (let i = 0; i < faculty.length; i++) {
        let item = {
            url: faculty[i].slug,
            name: faculty[i].name,
            changefreq: "daily",
            priority: 0.3,
            date: Date.now(),
        };
        data.push(item);
    }
    
    for (let i = 0; i < sub.length; i++) {
        let item = {
            url: sub[i].slug,
            name: sub[i].name,
            changefreq: "daily",
            priority: 0.3,
            date: Date.now(),
        };
        data.push(item);
    }

    for (let i = 0; i < institute.length; i++) {
        let aff = institute[i].affiliation;
        let item = {
            url: `${aff.slug}/${institute[i].slug}`,
            name: institute[i].name,
            changefreq: "daily",
            priority: 0.3,
            date: Date.now(),
        };
        data.push(item);
    }
    
    for (let i = 0; i < institute.length; i++) {
        let aff = institute[i].affiliation;
        let fac = institute[i].faculty;
        for (let k = 0; k < fac.length; k++) {
            let item = {
                url: `${aff.slug}/${institute[i].slug}/${fac[k].slug}`,
                name: fac[k].name,
                changefreq: "daily",
                priority: 0.3,
                date: Date.now(),
            };
            data.push(item);
        }
    }
    
    for (let i = 0; i < institute.length; i++) {
        let aff = institute[i].affiliation;
        let fac = institute[i].faculty;
        for(let k = 0; k < fac.length; k++){
            let subject = await Subject.find({'faculty': fac[k].id});
            for(let l = 0; l < subject.length; l++){
                let question = await Question.find({'subject': subject[l].id})
                for(let m = 0; m < question.length; m++){
                    let resource = question[m].resource;
                    for(let n = 0; n<resource.length; n++){
                        let item = {
                            url: `${aff.slug}/${institute[i].slug}/${fac[k].slug}/questions/${subject[l].name}/${resource[n].path}`,
                            name: question[m].name,
                            changefreq: "daily",    
                            priority: 0.3,
                            date: Date.now(),
                        }
                        data.push(item)
                    }
                }
            }
        }
    }

    for (let i = 0; i < institute.length; i++) {
        let aff = institute[i].affiliation;
        let fac = institute[i].faculty;
        for(let k = 0; k < fac.length; k++){
            let subject = await Subject.find({'faculty': fac[k].id});
            for(let l = 0; l < subject.length; l++){
                let note = await Note.find({'subject': subject[l].id})
                for(let m = 0; m < note.length; m++){
                    let resource = note[m].resource;
                    for(let n = 0; n<resource.length; n++){
                        let item = {
                            url: `${aff.slug}/${institute[i].slug}/${fac[k].slug}/note/${subject[l].name}/${resource[n].path}`,
                            name: note[m].name,
                            changefreq: "daily",    
                            priority: 0.3,
                            date: Date.now(),
                        }
                        data.push(item)
                    }
                }
            }
        }
    }

    return data;
}

module.exports = {
    get,
};
