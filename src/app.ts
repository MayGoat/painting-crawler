// app.ts 或 server.ts
import express from 'express';
import cors from 'cors';
import artworkRouter from './routers/artwork';
import vangoghRouter from './routers/vangogh';
import userRouter from './routers/user'

const app = express();
app.use(cors());

// 使用 artwork 路由
app.use('/artworks', artworkRouter);
app.use('/artworks/vincent', vangoghRouter);
app.use('/user',userRouter);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app