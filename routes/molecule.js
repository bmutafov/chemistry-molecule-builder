const router = require('express').Router();
const isEqual = require('lodash.isequal');
const xorWith = require('lodash.xorwith');
const isEmpty = require('lodash.isempty');

const Molecule = require('../model/Molecule');
const Element = require('../model/Element');

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

// Checks if a solution is correct
router.post('/check', async (req, res) => {
        const molecule = await Molecule.findOne({ formula });

        const byLengthAndElement = (a, b) => {
            if (a.connections.length === b.connections.length) {
                return a.el < b.el ? 1 : -1;
            }
            return a.connections.length < b.connections.length ? 1 : -1;
        };

        const isArrayEqual = function (x, y) {
            if (x.length !== y.length) return false;

            for (let i = 0; i < x.length; i++) {
                if (x[i].el !== y[i].el) return false;
                if (!isEmpty(xorWith(x[i].connections, y[i].connections, isEqual))) return false;
            }
            return true;
            // return isEmpty(xorWith(x, y, isEqual));
        };

        solution.sort(byLengthAndElement);

        molecule.solution.sort(byLengthAndElement);

        const correct = isArrayEqual(solution, molecule.solution) && molecule.solution.length === solution.length;
        return res.status(200).send({ error: false, data: { correct } });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, data: { correct: false } });
    }
});

// Gives the elements used in a formula
router.get('/elements/:formula', async (req, res) => {
    const { formula } = req.params;

    const molecule = await Molecule.findOne({ formula });

    if (!molecule) {
        return res.status(400).send({
            error: true,
            data: { message: 'This formula does not exist' },
        });
    }

    const elementLabels = [...new Set(molecule.solution.map(e => e.el))];
    const elements = await Element.find({ sign: { $in: elementLabels } });
    return res.status(200).send({ error: false, data: elements });
});

router.get('/:formula', async (req, res) => {
    const { formula } = req.params;

    let molecule = await Molecule.findOne({ formula });
    if (!molecule) {
        return res.status(400).send({
            error: true,
            data: { message: 'This formula does not exist' },
        });
    }
    molecule.solution = undefined;

    return res.status(200).send({ error: false, data: molecule });
});

module.exports = router;
