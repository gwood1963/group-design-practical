import express from "express";
import {getRecentScores, invite, deleteSelected, register, addAttempt, isAdmin, getProblem, addProblem} from "../database";

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
    await addAttempt(uid, seed, score);
})

router.get('/isadmin/:uid', async (req, res, next) => {
    const uid = req.params.uid;
    res.json(await isAdmin(uid));
})

router.get('/getproblem', async (req, res, next) => {
    res.json(await getProblem());
})

router.put('/addproblem', async (req, res, next) => {
    const {seed} = req.body;
    const added = await addProblem(seed);
    res.json(added);
})

export default router;