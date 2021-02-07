const express = require('express');

const userRouter = require('./routes/user.routes');
const authorityRouter = require('./routes/authority.routes');
const studioRouter = require('./routes/studios.routes');
const filmRouter = require('./routes/films.routes');
const logbookRouter = require('./routes/logbook.routes');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', authorityRouter);
app.use('/api', studioRouter);
app.use('/api', filmRouter);
app.use('/api', logbookRouter);

app.listen(PORT, ()=>{
    console.log(`server started on port:${PORT}...`);
})