const Recruits = require('../models/Recruits');

const RecruitController = {
    getRecruitList: async (req, res, next) => {
        let recruits = await Recruits.find({})
            .select({ content: 0 })
            .sort({ createdAt: -1 })
            .limit(10)

        return res.render('recruits', {
            data: recruits,
            layout: 'main',
            position: req.session.possition,
            pageName: 'Tuyển dụng'
        })
    },

    getRecruitDetail: async (req, res, next) => {
        const slug = req.params.slug;
        let recruit = await Recruits.findOne({slug})
    
        return res.render('recruitDetail', {
            data: recruit,
            pageName: recruit.location,
            layout: 'main',
            position: req.session.position
        })   
    },
}

module.exports = RecruitController;