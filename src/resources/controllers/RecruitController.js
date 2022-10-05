const Recruits = require('../models/Recruits');

const RecruitController = {
    getRecruitList: async (req, res, next) => {
        let recruits = await Recruits.find({})
            .select({ content: 0 })
            .sort({ updatedAt: -1 })
            .limit(10)
            .then((recruits) => {
                return recruits.map((r) => {
                    return {
                        _id: r._id.toString(),
                        position: r.position,
                        location: r.location,
                        salary: r.salary,
                        content: r.content,
                        image: r.image,
                        slug: r.slug,
                        updatedAt: r.updatedAt.toLocaleString('vi-vn'),
                    };
                });
            });

        return res.render('recruits', {
            data: recruits,
            layout: 'main',
            position: req.session.possition,
            pageName: 'Tuyển dụng',
        });
    },

    getRecruitDetail: async (req, res, next) => {
        const slug = req.params.slug;
        let recruit = await Recruits.findOne({ slug }).then((r) => {
            return {
                position: r.position,
                slug: r.slug,
                content: r.content,
                updatedAt: r.updatedAt.toLocaleString('vi-vn'),
            };
        });

        return res.render('recruitDetail', {
            data: recruit,
            pageName: recruit.position,
            layout: 'main',
            position: req.session.position,
        });
    },
};

module.exports = RecruitController;
