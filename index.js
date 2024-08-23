console.log('\nStart Microservices Order Manager.');
const now = new Date();
const options = { timeZone: 'America/Sao_Paulo' };
const dateBr = now.toLocaleString('pt-BR', options);
console.log(dateBr);

console.log('\nStarting MOM Service.');
const now1 = new Date();
const options1 = { timeZone: 'America/Sao_Paulo' };
const dateBr1 = now1.toLocaleString('pt-BR', options1);
console.log(dateBr1);
const server = require('./src/server');

console.log('\nStarting MOM Solicitation Route.');
const now2 = new Date();
const options2 = { timeZone: 'America/Sao_Paulo' };
const dateBr2 = now2.toLocaleString('pt-BR', options2);
console.log(dateBr2);
require('./src/routes/rt_solicitation')(server);