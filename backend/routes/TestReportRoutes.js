// routes/testreportRoutes.js
import express from 'express';
import { createTestReport, customerSuggestions, deleteAllTestReports, deleteTestReport, editTestReport, getCustomers, getParameters, getParts, getReportById, getReportsByParts, getTestReports, insertDummyReports, materialSuggestions, partNameSuggestions } from '../controllers/TestReportController.js';

const router = express.Router();

// GET /api/testreports?customer=&partName=&material=&startDate=&endDate=&page=
router.get('/', getTestReports);
router.get('/parameters', getParameters)
router.get('/suggestions/customer', customerSuggestions)
router.get('/suggestions/part-name', partNameSuggestions)
router.get('/suggestions/material', materialSuggestions)
router.get('/customers', getCustomers)
router.get('/parts', getParts)
router.get('/reports', getReportsByParts)
router.get('/report/:id', getReportById)

router.post('/insert-dummy', insertDummyReports)
router.post('/', createTestReport);

router.put('/:id', editTestReport);

router.delete('/delete-all', deleteAllTestReports);
router.delete('/:id', deleteTestReport);

export default router;
