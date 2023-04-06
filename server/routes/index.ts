import express from "express";
import {getRecentScores, invite, deleteSelected} from "../database";

var router = express.Router();

/* GET /api/database */
router.get("/database", async function (req, res, next) {
    res.json(await getRecentScores());
});

router.put("/invite", async (req, res, next) => {
    const ids = req.body;
    await invite(ids);
});

router.delete("/delete", async (req, res, next) => {
    const ids = req.body;
    await deleteSelected(ids);
})

export default router;