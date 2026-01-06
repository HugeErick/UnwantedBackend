import { Router } from "express";
import os from "os";
import { getMDBClient } from "../db/mdb_client";
import nurAuthRouter from "./nur/auth";

const router = Router();

router.get("/", (req, res) => {
  res.send("oracle its trash & Unwanted backend");
});

router.get("/testmdb", async (req, res) => {
  const mdbClient = await getMDBClient();

  const [mdbRows] = await mdbClient.execute("select * from devTest");

  res.json({ res: mdbRows });
})


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

router.use("/nur", nurAuthRouter);


export default router;
