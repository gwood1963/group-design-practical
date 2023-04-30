import express from "express";
import {getRecentScores, invite, deleteSelected, register, addAttempt, isAdmin, getProblem, addProblem, addRound2Attempt} from "../database";

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
    const {email, name, uid} = req.body;
    await register(email, name, uid);
})

router.post('/attempt', async (req, res, next) => {
    const {uid, score, seed} = req.body;
    const id = await addAttempt(uid, seed, score);
    res.json(id);
})

router.get('/isadmin/:uid', async (req, res, next) => {
    const uid = req.params.uid;
    res.json(await isAdmin(uid));
})

router.get('/getproblem/:round', async (req, res, next) => {
    const round = req.params.round;
    res.json(await getProblem(parseInt(round)));
})

router.put('/addproblem', async (req, res, next) => {
    const {seed, round} = req.body;
    const added = await addProblem(seed, round);
    res.json(added);
})

router.put('/attempt2', async (req, res, next) => {
    const {attemptID, score, pid} = req.body;
    await addRound2Attempt(attemptID, score, pid)
})

export default router;