//  =====================
//    Puerto
//  ====================

process.env.PORT = process.env.PORT || 3000;


//  =====================
//    Entorno
//  =====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

//  =====================
//    Seed
//  =====================
process.env.SEED = process.env.SEED || 'dEste es el seed de dev';

//  =====================
//    Base de datos
//  =====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
//  =====================
//    Google Client ID
//  =====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '791902632022-b80lv1u8g84r0qb24t4ntl9sqg3ggnmr.apps.googleusercontent.com';