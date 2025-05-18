// controllers/testreportController.js
import TestReport from '../models/TestReport.js';

export const getTestReports = async (req, res) => {
    try {
        const { customer, partName, material, startDate, endDate, page = 1 } = req.query;

        const query = {};

        // Case-insensitive partial matches
        if (customer) {
            query.customer = { $regex: customer, $options: 'i' };
        }

        if (partName) {
            query.partName = { $regex: partName, $options: 'i' };
        }

        if (material) {
            query.material = { $regex: material, $options: 'i' };
        }

        // Date range filtering
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const limit = 5;
        const skip = (page - 1) * limit;

        const reports = await TestReport.find(query)
            .sort({ createdAt: -1 }) // Recent first
            .skip(skip)
            .limit(limit);

        const total = await TestReport.countDocuments(query);
        const hasMore = page * limit < total;

        res.json({
            reports,
            totalReports: total,
            hasMore,
        });
    } catch (error) {
        console.error('Error fetching test reports:', error);
        res.status(500).json({ message: error.message || 'An unexpected error occurred' });
    }
};

export const insertDummyReports = async (req, res) => {
    try {
        const customers = ['Gurunanak Trans. Pvt. Ltd.', 'S R Auto Parts', 'Tata Motors', 'Bajaj Auto', 'Mahindra Gears'];
        const partNames = ['ARB-PM10', 'Input Shaft Z-19', 'Clutch Housing', 'Gear Wheel', 'Drive Shaft'];
        const materials = ['20MnCr5', 'SAE 8620', 'EN353', '16MnCr5'];

        const dummyReports = [];

        for (let i = 1; i <= 1000; i++) {
            const customer = customers[i % customers.length];
            const partName = partNames[i % partNames.length];
            const material = materials[i % materials.length];
            const qty = Math.floor(Math.random() * 200) + 20;

            dummyReports.push({
                testCertNo: `JHTPL/DUMMY/${i}`,
                customer,
                partName,
                material,
                partNoQty: [{ partNo: `PART-${1000 + i}`, qty }],
                parameters: [
                    {
                        name: 'Surface Hardness',
                        specified: '58-62 HRC',
                        actual: `${60 + (i % 3)} HRC`
                    },
                    {
                        name: 'Core Hardness',
                        specified: '25-38 HRC',
                        actual: `${35 + (i % 4)} HRC`
                    },
                    {
                        name: 'Case Depth OD',
                        specified: '0.50 mm @ 550 HV1',
                        actual: `${(0.50 + (i % 5) * 0.02).toFixed(2)} mm @ 550 HV1`
                    }
                ],
                surfaceHardnessTraverse: [
                    {
                        distance: 0.1,
                        hardness: { A: 724 + (i % 10), B: 740 - (i % 8) }
                    },
                    {
                        distance: 0.2,
                        hardness: { A: 709, B: 715 }
                    }
                ],
                threadHardnessTraverse: [
                    { distance: 0.1, hardnessHV1: 720, hardnessHRC: 60 },
                    { distance: 0.2, hardnessHV1: 700, hardnessHRC: 58 }
                ],
                hardnessSamples: Array.from({ length: 5 }, (_, j) => ({
                    sampleNo: j + 1,
                    surfaceHardness: 61 + (j % 2)
                })),
                remarks: 'Accepted',
                preparedBy: 'Mahesh Pawar'
            });
        }

        await TestReport.insertMany(dummyReports);

        res.status(201).json({ message: '✅ 1000 realistic dummy test reports inserted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message || '❌ Error inserting dummy reports.' });
    }
};

export const deleteAllTestReports = async (req, res) => {
    try {
        await TestReport.deleteMany({});
        res.status(200).json({ message: '🗑️ All test reports deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getParameters = async (req, res) => {
    try {
        const { customer, partName, material } = req.query;

        // Input validation
        if (!customer || !partName || !material) {
            return res.status(400).json({ error: 'customer, partName, and material are required' });
        }

        // Find the test report
        const report = await TestReport.findOne({
            customer,
            partName,
            material
        });

        if (report) {
            return res.json({
                parameters: report.parameters,
                message: `This type of test report of ${customer} with ${partName} and ${material} already exists in the database.`
            });
        } else {
            return res.json({
                parameters: [],
                message: `This type of test report of ${customer} with ${partName} and ${material} not exists in the database.`
            });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message || 'An error occurred' });
    }
}

// Create a new test report
export const createTestReport = async (req, res) => {
    try {
        const testReport = new TestReport(req.body);
        await testReport.save();
        res.status(201).json({ message: 'Test report created successfully', testReport });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create test report' });
    }
};

// Delete a test report by ID
export const deleteTestReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TestReport.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Test report not found' });
        }
        res.json({ message: 'Test report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to delete test report' });
    }
};

// Edit a test report by ID
export const editTestReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await TestReport.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ error: 'Test report not found' });
        }
        res.json({ message: 'Test report updated successfully', testReport: updated });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to update test report' });
    }
};

// customer name suggestions
export const customerSuggestions = async (req, res) => {
    try {
        const { customer = '' } = req.query;

        if (!customer.trim()) {
            return res.json([]); // Return empty list if no input
        }

        const suggestions = await TestReport.find({
            customer: new RegExp('^' + customer, 'i'),
        }).limit(10);

        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching first name suggestions:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch first name suggestions' });
    }
}

// part name suggestions
export const partNameSuggestions = async (req, res) => {
    try {
        const { partName = '' } = req.query;

        if (!partName.trim()) {
            return res.json([]); // Return empty list if no input
        }

        const suggestions = await TestReport.find({
            partName: new RegExp('^' + partName, 'i'),
        }).limit(10);

        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching first name suggestions:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch first name suggestions' });
    }
}

// material name suggestions
export const materialSuggestions = async (req, res) => {
    try {
        const { material = '' } = req.query;

        if (!material.trim()) {
            return res.json([]); // Return empty list if no input
        }

        const suggestions = await TestReport.find({
            material: new RegExp('^' + material, 'i'),
        }).limit(10);

        res.json(suggestions);
    } catch (error) {
        console.error('Error fetching first name suggestions:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch first name suggestions' });
    }
}

// get all distinct customers
export const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 5;

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid page or limit value'
            });
        }

        // Get all distinct customers
        const customers = await TestReport.distinct('customer');
        const totalCustomers = customers.length;

        // Paginate
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const paginatedCustomers = customers.slice(startIndex, endIndex);

        // Check if more customers are available
        const hasMore = endIndex < totalCustomers;

        res.json({
            success: true,
            totalCustomers,
            customers: paginatedCustomers,
            hasMore
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch customers'
        });
    }
}

// get unique pairs of partName and material for a customer
export const getParts = async (req, res) => {
    try {
        const { customer } = req.query;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 5;

        if (!customer) {
            return res.status(400).json({
                success: false,
                error: 'Customer name is required'
            });
        }
        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid page or limit value'
            });
        }

        // Find all test reports for the given customer
        const reports = await TestReport.find({ customer }, 'partName material');

        // Create unique pairs of partName and material
        const pairSet = new Set();
        const pairs = [];

        for (const report of reports) {
            const key = `${report.partName}||${report.material}`;
            if (!pairSet.has(key)) {
                pairSet.add(key);
                pairs.push({ partName: report.partName, material: report.material });
            }
        }

        const totalParts = pairs.length;
        const startIndex = page * limit;
        const endIndex = startIndex + limit;
        const paginatedPairs = pairs.slice(startIndex, endIndex);
        const hasMore = endIndex < totalParts;

        res.json({
            success: true,
            totalParts,
            pairs: paginatedPairs,
            hasMore
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch part-material pairs'
        });
    }
}

export const getReportsByParts = async (req, res) => {
    try {
        const { customer, partName, material } = req.query;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 5;

        // Validate input
        if (!customer || !partName || !material) {
            return res.status(400).json({
                success: false,
                error: 'customer, partName, and material are required'
            });
        }
        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid page or limit value'
            });
        }

        // Find total count first
        const totalReports = await TestReport.countDocuments({ customer, partName, material });

        // Find paginated test reports matching the criteria
        const reports = await TestReport.find({ customer, partName, material })
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit);

        const hasMore = (page + 1) * limit < totalReports;

        res.json({
            success: true,
            totalReports,
            reports,
            hasMore
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch test reports'
        });
    }
}

export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate presence of ID
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Report ID is required'
            });
        }

        // Find the report by ID
        const report = await TestReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                error: 'Test report not found'
            });
        }

        res.json({
            success: true,
            report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch test report'
        });
    }
};
