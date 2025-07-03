// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();

// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes'); // ← tambahkan ini

// app.use(cors()); //mengizikan semua origin
// app.use(express.json());

// app.use('/api/user', userRoutes);
// app.use('/api/product', productRoutes); // ← ubah jadi seperti ini (disatukan lewat '/api')

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ← middleware cors
const path = require('path'); // ← tambahkan ini untuk menjalandan middleware multer
const app = express();

const userRoutes = require('./routes/userRoutes');

app.use(cors()); // ← jalankan corsnya
app.use(express.json());

app.use('/api', userRoutes);

// Serve folder public agar file bisa diakses langsung
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));