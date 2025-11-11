require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await mongoose.connect(process.env.COSMOS_DB_CONNECTION_STRING);
    console.log('✅ Conectado a la base de datos');

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ email: 'admin@energym.com' });
    if (existingAdmin) {
      console.log('⚠️  Ya existe un administrador con el email admin@energym.com');
      console.log('¿Deseas actualizar la contraseña? (S/N)');
      process.exit(0);
    }

    console.log('👤 Creando usuario administrador...');
    const admin = new User({
      email: 'admin@energym.com',
      password: 'admin123', // Se hasheará automáticamente
      role: 'admin',
      name: 'Administrador Principal',
    });

    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('');
    console.log('📧 Credenciales:');
    console.log('   Email: admin@energym.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('   El email ya está en uso');
    }
    process.exit(1);
  }
};

createAdmin();

