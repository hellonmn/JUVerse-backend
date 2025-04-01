const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.log('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
