const Report = require('../models/report')
const _ = require('lodash')

exports.getReportById = (req,res,next,id) => {
    try {
        Report.findById(id).populate('reporter').then(report => {
            if(!report){
                return res.status(404).json({error: true,message: ['Faild to get report!','']})
            }

            req.report = report
            next()
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while fetching report!',err]})
        })        
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.getReport = (req,res) => {
    if(req.report){
        return res.status(200).json({success: true,data: req.report})
    }

    return res.status(404).json({error: true,message: ['Not Found!','']})
}

exports.getAllReports = (req,res) => {
    let type = 'Open'

    if(req.query.type){
        let query = req.query.type
        if(query === 'Open' || query === 'Solved' || query === 'Processing'){
            type = query
        }
    }

    try{
        Report.find({reportStatus: type})
        .select('-reporter')
        .then((reports) => {
            if(!reports){
                return res.status(404).json({error: true,message: ['Faild to get reports!','']})
            }

            return res.status(200).json({success: true,data: reports})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while fetching reports!',err]})
        })
    }catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.createReport = (req,res) => {
    const {reportType,reportedItem} = req.body
    if(reportType === '' || !reportType || reportedItem === '' || !reportedItem) {
        return res.status(400).json({error: true, message: ['Can not create report without without necessary fields!','']})
    }

    try {
        const report = new Report(req.body)
        report.reporter = req.profile._id

        report.save().then(createdReport => {
            if(!createdReport){
                return res.status(400).json({error: true,message:['Faild to create report!','']})
            }

            return res.status(200).json({success: true,data: report.reportStatus})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while creating report!',err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}

exports.updateReport = (req,res) => {
    try {
        let report = req.report
        report = _.extend(report,req.body)

        report.save().then(updatedReport => {
            if(!updatedReport){
                return res.status(400).json({error: true,message:['Faild to update report!','']})
            }

            return res.status(200).json({success: true,data: report.reportStatus})
        }).catch(err => {
            return res.status(400).json({error: true,message: ['Error while updating report!',err]})
        })
    } catch (error) {
        return res.status(500).json({error: true,message: ["Something went wrong!",error]})
    }
}