import { timeStamp } from 'console';
import { Router } from 'express';
import os from 'os';

const router = Router();

router.get('/', (req, res) => {
  res.send('oracle its trash & Unwanted backend');
});


router.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    load: os.loadavg(),
    memory: {
      free: os.freemem(),
      total: os.totalmem()
    }
  })
})


export default router;
