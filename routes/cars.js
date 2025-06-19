const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars with optional filtering and counts
router.get('/', async (req, res) => {
    try {
        const { make, model, minPrice, maxPrice, fuelType, color, seats } = req.query;
        let query = {};

        // Apply filters if provided
        if (make) query.make = new RegExp('^' + make + '$', 'i');
        if (model) query.model = new RegExp('^' + model + '$', 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }
        if (fuelType) query.fuelType = new RegExp('^' + fuelType + '$', 'i');
        if (color) query.color = new RegExp('^' + color + '$', 'i');
        if (seats) query.seats = parseInt(seats);

        // Get cars matching query
        const cars = await Car.find(query);

        // Get filter counts using aggregation
        const [makes, models, fuelTypes, colors, seatCounts] = await Promise.all([
            Car.aggregate([
                { $group: { _id: '$make', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Car.aggregate([
                { $group: { _id: '$model', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Car.aggregate([
                { $group: { _id: '$fuelType', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Car.aggregate([
                { $group: { _id: '$color', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Car.aggregate([
                { $group: { _id: '$seats', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ]);

        res.json({
            cars,
            filters: {
                makes: makes.map(m => ({ value: m._id, count: m.count })),
                models: models.map(m => ({ value: m._id, count: m.count })),
                fuelTypes: fuelTypes.map(f => ({ value: f._id, count: f.count })),
                colors: colors.map(c => ({ value: c._id, count: c.count })),
                seats: seatCounts.map(s => ({ value: s._id, count: s.count }))
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new car listing
router.post('/', async (req, res) => {
    const car = new Car({
        title: req.body.title,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price,
        mileage: req.body.mileage,
        fuelType: req.body.fuelType,
        transmission: req.body.transmission,
        description: req.body.description,
        features: req.body.features,
        images: req.body.images,
        seats: req.body.seats,
        engineDetails: {
            type: req.body.engineDetails?.type,
            displacement: req.body.engineDetails?.displacement,
            horsepower: req.body.engineDetails?.horsepower,
            torque: req.body.engineDetails?.torque
        },
        seller: {
            name: req.body.seller?.name,
            phone: req.body.seller?.phone,
            email: req.body.seller?.email,
            location: req.body.seller?.location
        }
    });

    try {
        const newCar = await car.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a car listing
router.patch('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (req.body[key] != null) {
                car[key] = req.body[key];
            }
        });

        const updatedCar = await car.save();
        res.json(updatedCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a car listing
router.delete('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        await car.remove();
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
