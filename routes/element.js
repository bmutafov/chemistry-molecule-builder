const router = require('express').Router();

const Element = require('../model/Element');

const { elementValidation, errorMessage } = require('../utils/validation');
const authMiddleware = require('../middleware/verify-jwt');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const elements = await Element.find();
        return res.status(200).send({ error: false, data: elements });
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { name, sign, bgColor, labelColor } = req.body;

    // Validate input
    const validationError = elementValidation(req.body);
    if (validationError) return res.status(400).send(validationError);

    const element = new Element({ name, sign, bgColor, labelColor });

    try {
        const savedElement = await element.save();
        return res.status(200).send({ error: false, data: savedElement });
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    console.log(id);

    const existingElement = await Element.findById(id);
    if (!existingElement) return res.status(400).send(errorMessage('ID not found'));

    try {
        const result = await Element.deleteOne(existingElement);
        if (result.deletedCount > 0) return res.status(200).send({ error: false, data: result.deletedCount });
        else throw Error(result);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
