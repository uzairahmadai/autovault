const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid']
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual']
    },
    description: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    images: [{
        type: String,
        required: true
    }],
    seats: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        enum: ['Black', 'White', 'Red', 'Silver', 'Blue']
    },
    engineDetails: {
        type: {
            type: String
        },
        displacement: String,
        horsepower: String,
        torque: String,
        cylinders: Number,
        engineLayout: String
    },
    seller: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['Available', 'Sold', 'Reserved'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add text index for search functionality
carSchema.index({
    title: 'text',
    make: 'text',
    model: 'text',
    description: 'text'
});

// Virtual for car's full name (make + model)
carSchema.virtual('fullName').get(function() {
    return `${this.make} ${this.model}`;
});

// Method to check if car is available
carSchema.methods.isAvailable = function() {
    return this.status === 'Available';
};

// Static method to find similar cars
carSchema.statics.findSimilar = function(car) {
    return this.find({
        make: car.make,
        _id: { $ne: car._id },
        price: {
            $gte: car.price * 0.8,
            $lte: car.price * 1.2
        }
    }).limit(3);
};

module.exports = mongoose.model('Car', carSchema);
