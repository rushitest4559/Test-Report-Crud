import { Schema, model } from 'mongoose'

const partNoQtySchema = new Schema({
    partNo: String,
    qty: Number
}, {_id: false})

const parameterSchema = new Schema({
    name: String,
    specified: String,
    actual: String
}, {_id: false})

const surfaceHardnessTraverseSchema = new Schema({
    distance: Number,
    hardness: { type: Map, of: Number }
}, {_id: false})

const threadHardnessTraverseSchema = new Schema({
    distance: Number,
    hardnessHV1: Number,
    hardnessHRC: Number
}, {_id: false})

const hardnessSampleSchema = new Schema({
    sampleNo: Number,
    surfaceHardness: Number,
}, {_id: false})

const testReportSchema = new Schema({
    testCertNo: String,
    customer: String,
    partName: String,
    material: String,
    partNoQty: [partNoQtySchema],
    parameters: [parameterSchema],
    surfaceHardnessTraverse: {type: [surfaceHardnessTraverseSchema], required: false, default: undefined},
    threadHardnessTraverse: {type: [threadHardnessTraverseSchema], required: false, default: undefined},
    hardnessSamples: [hardnessSampleSchema],
    remarks: String,
    preparedBy: String
}, { timestamps: true })

const TestReport = model('TestReport', testReportSchema)

export default TestReport