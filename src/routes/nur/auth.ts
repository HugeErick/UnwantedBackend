import { Router, Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { getMDBClient } from "../../db/mdb_client";

const nurAuthRouter = Router();

// register route
nurAuthRouter.post("/nur-register", async (req: Request, res: Response) => {
  const pool = getMDBClient();
  const mdb = await pool.getConnection();
  const { username, password, email } = req.body;

  try {
    await mdb.beginTransaction();
    const [ouserResult]: any = await mdb.execute(
      "insert into ouser (platform_origin) values (?)",
      ["nur"]
    );
    const globalUserId = ouserResult.insertId;
    const hashedPassword = await bcrypt.hash(password, 10);

    await mdb.execute(
      "insert into nurusers (ouser_id, username, password, email) values (?, ?, ?, ?)",
      [globalUserId, username, hashedPassword, email]
    );

    await mdb.commit();
    res.json({ success: true, ouser_id: globalUserId });
  } catch (error: any) {
    await mdb.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    mdb.release();
  }
});

// login route
nurAuthRouter.post("/nur-login", (async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const pool = getMDBClient();

  try {
    const [rows]: any = await pool.execute(
      "select * from nurusers where username = ?",
      [username]
    );

    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}) as RequestHandler);

export default nurAuthRouter;
