const router = require('express').Router();

const Molecule = require('../model/Molecule');

const { moleculeValidation } = require('../utils/validation');

// Adds a new level (formula)
router.post('/', async (req, res) => {
    const { name, formula, solution } = req.body;

    // Validate input
    const validationError = moleculeValidation(req.body);
    if (validationError) return res.status(400).send(validationError);

    const molecule = new Molecule({
        name,
        formula,
        solution,
    });

    try {
        const savedMolecule = await molecule.save();
        return res.status(200).send(savedMolecule);
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Modifies an existing level (formula)
router.put('/', (req, res) => {});

// Deletes an existing level (formula)
router.delete('/', (req, res) => {});

module.exports = router;
