const mongoose = require('mongoose');
const Car = require('./models/Car');

const sampleCars = [
    {
        title: "Mercedes-Benz E-Class 2023",
        make: "Mercedes-Benz",
        model: "E-Class",
        year: 2023,
        price: 65000,
        mileage: "1,200 Miles",
        fuelType: "Petrol",
        transmission: "Automatic",
        description: "The 2023 Mercedes-Benz E-Class exemplifies luxury and performance. This model comes with advanced driver assistance systems, premium interior finishes, and state-of-the-art technology features.",
        features: [
            "Automatic Climate Control",
            "Navigation System",
            "Leather Seats",
            "Panoramic Sunroof",
            "LED Headlights",
            "Wireless Charging",
            "360-Degree Camera",
            "Blind Spot Monitoring"
        ],
        images: [
            "assets/images/portfolio/30.webp",
            "assets/images/portfolio/31.webp",
            "assets/images/portfolio/32.webp",
            "assets/images/portfolio/33.webp",
            "assets/images/portfolio/34.webp"
        ],
        seats: 5,
        engineDetails: {
            type: "V6 Turbo",
            displacement: "3.0L",
            horsepower: "362 hp",
            torque: "369 lb-ft",
            cylinders: 6,
            engineLayout: "Front-Engine"
        },
        seller: {
            name: "Jonathan Doe",
            phone: "+1-654-452-1505",
            email: "jonathan@autovault.com",
            location: "280 Augusta Avenue, Toronto"
        },
        status: "Available"
    },
    {
        title: "BMW 7 Series 2023",
        make: "BMW",
        model: "7 Series",
        year: 2023,
        price: 95000,
        mileage: "500 Miles",
        fuelType: "Hybrid",
        transmission: "Automatic",
        description: "The all-new BMW 7 Series represents the pinnacle of luxury and innovation. Experience first-class comfort with executive lounge seating and cutting-edge technology.",
        features: [
            "Executive Lounge Seating",
            "31-inch Theatre Screen",
            "BMW Curved Display",
            "Panoramic Sky Lounge LED Roof",
            "Automatic Doors",
            "Crystal Headlights",
            "Massage Seats",
            "Air Suspension"
        ],
        images: [
            "assets/images/portfolio/04.webp",
            "assets/images/portfolio/05.webp",
            "assets/images/portfolio/07.webp",
            "assets/images/portfolio/08.webp"
        ],
        seats: 5,
        engineDetails: {
            type: "Hybrid Inline-6",
            displacement: "3.0L",
            horsepower: "483 hp",
            torque: "516 lb-ft",
            cylinders: 6,
            engineLayout: "Front-Engine"
        },
        seller: {
            name: "Sarah Wilson",
            phone: "+1-654-452-1506",
            email: "sarah@autovault.com",
            location: "280 Augusta Avenue, Toronto"
        },
        status: "Available"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/autovault', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing cars
        await Car.deleteMany({});
        console.log('Cleared existing cars');

        // Insert sample cars
        const cars = await Car.insertMany(sampleCars);
        console.log('Sample cars inserted:', cars);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
