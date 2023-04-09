import express from "express";
import {getRecentScores, invite, deleteSelected, register, addAttempt, isAdmin} from "../database";

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

router.put('/register', async (req, res, next) => {
    const {email, name} = req.body;
    await register(email, name);
})

router.post('/attempt', async (req, res, next) => {
    const {email, score, seed} = req.body;
    await addAttempt(email, seed, score);
})

router.get('/isadmin/:email', async (req, res, next) => {
    const email = req.params.email;
    res.json(await isAdmin(email));
})

export default router;