const router = require('express').Router();
const isEqual = require('lodash.isequal');
const xorWith = require('lodash.xorwith');
const isEmpty = require('lodash.isempty');

const Molecule = require('../model/Molecule');

const { moleculeValidation, errorMessage } = require('../utils/validation');
const authMiddleware = require('../middleware/verify-jwt');

// Returns a list with all available molecules
router.get('/', async (req, res) => {
    try {
        const allMolecules = await Molecule.find();
        return res.status(200).send({ error: false, data: allMolecules });
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Adds a new level (formula)
router.post('/', authMiddleware, async (req, res) => {
    const { name, formula, solution } = req.body;

    // Validate input
    const validationError = moleculeValidation(req.body);
    if (validationError) return res.status(400).send(validationError);

    const molecule = new Molecule({ name, formula, solution });

    try {
        const savedMolecule = await molecule.save();
        return res.status(200).send({ error: false, data: savedMolecule });
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Modifies an existing level (formula)
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, formula, solution } = req.body;
    const { id } = req.params;

    const existingMolecule = await Molecule.findById(id);
    if (!existingMolecule)
        return res.status(400).send(errorMessage('ID not found'));

    try {
        if (name) existingMolecule.name = name;

        if (formula) existingMolecule.formula = formula;

        if (solution) existingMolecule.solution = solution;

        const updatedMolecule = await existingMolecule.save();
        return res.status(200).send({ error: false, data: updatedMolecule });
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Deletes an existing level (formula)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const existingMolecule = await Molecule.findById(id);
    if (!existingMolecule)
        return res.status(400).send(errorMessage('ID not found'));

    try {
        const result = await Molecule.deleteOne(existingMolecule);
        if (result.deletedCount > 0)
            return res
                .status(200)
                .send({ error: false, data: result.deletedCount });
        else throw Error(result);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/check', async (req, res) => {
    const { formula, solution } = req.body;

    try {
        const molecule = await Molecule.findOne({ formula });

        const isArrayEqual = function (x, y) {
            return isEmpty(xorWith(x, y, isEqual));
        };

        const correct = isArrayEqual(molecule.solution, solution);
        return res.status(200).send({ error: false, data: { correct } });
    } catch (error) {
        return res.status(400).send({ error: true, data: { correct: false } });
    }
});

module.exports = router;
