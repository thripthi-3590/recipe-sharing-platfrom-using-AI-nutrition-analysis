const fs = require('fs');

console.log('Testing requires...');

try { require('express'); console.log('express ok'); } catch (e) { console.error('express missing', e); }
try { require('dotenv'); console.log('dotenv ok'); } catch (e) { console.error('dotenv missing', e); }
try { require('socket.io'); console.log('socket.io ok'); } catch (e) { console.error('socket.io missing', e); }
try { require('cors'); console.log('cors ok'); } catch (e) { console.error('cors missing', e); }
try { require('mongoose'); console.log('mongoose ok'); } catch (e) { console.error('mongoose missing', e); }
try { require('bcryptjs'); console.log('bcryptjs ok'); } catch (e) { console.error('bcryptjs missing', e); }
try { require('jsonwebtoken'); console.log('jsonwebtoken ok'); } catch (e) { console.error('jsonwebtoken missing', e); }
try { require('multer'); console.log('multer ok'); } catch (e) { console.error('multer missing', e); }
try { require('@google/generative-ai'); console.log('generative-ai ok'); } catch (e) { console.error('generative-ai missing', e); }
try { require('axios'); console.log('axios ok'); } catch (e) { console.error('axios missing', e); }

console.log('Dependencies check complete.');

try { require('./server.js'); console.log('server.js loaded (mock run)'); } catch (e) { console.error('server.js failed', e); }
