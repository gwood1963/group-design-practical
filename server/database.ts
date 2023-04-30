import {connect, IRecordSet, Int, Float} from "mssql"
import { json } from "stream/consumers";

const connection = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:recruitment-server.database.windows.net,1433;Database=recruitment-db;Uid=CloudSAe040e98e;Pwd=FMR93qpa;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;";

interface RecentScores {
    UserID: number,
    FirstName: string,
    Surname: string,
    Email: string,
    ProblemID: number,
    RawScore: number,
    Percentile: number,
    Invited: boolean,
    Problem2ID: number,
    RawScore2: number,
    Percentile2: number
}

export const getRecentScores = async () => {
    // Returns an IRecordSet containing each user's name, email, and the details of their most recent attempt at a problem
    // Data can then be extracted by e.g. resultSet[0].UserID
    var poolConnection = await connect(connection);
    var resultSet: IRecordSet<RecentScores> = await poolConnection.request().query(
        `select users.UserID UserID, FirstName, Surname, Email, ProblemID, RawScore, Percentile, Invited, Problem2ID, RawScore2, Percentile2 from [dbo].[Users] users
        inner join [dbo].[Attempts] attempts on attempts.UserID=users.UserID
        join (select UserID, max(AttemptDate) most_recent from attempts group by UserID) t 
            on t.most_recent = attempts.AttemptDate and t.UserID = users.UserID
        where users.UserID != 0
        order by users.UserID`
    ).then(res => res.recordset);

    return resultSet;
}

export const invite = async (ids: Array<number>) => {
    var poolConnection = await connect(connection);
    ids.forEach(async id => {
        await poolConnection.request()
            .input('id', Int, id)
            .query(`update [dbo].[Users] set Invited = 1 where UserID = @id`)
    });
}

export const deleteSelected = async (ids: Array<number>) => {
    var poolConnection = await connect(connection);
    ids.forEach(async id => {
        await poolConnection.request()
            .input('id', Int, id)
            .query(`delete from [dbo].[Users] where UserID = @id`)
        await poolConnection.request()
            .input('id', Int, id)
            .query('update [dbo].[Attempts] set UserID = 0 where UserID = @id')
    });
}

export const register = async (email: string, name: string, uid: string) => {
    var poolConnection = await connect(connection);
    const user = await poolConnection.request().input('uid', uid)
        .query('select * from [dbo].[Users] where AuthId = @uid')
        .then(res => res.recordset)
    if (user.length === 0) {
        const [firstName, surname] = name?.split(' ')
        await poolConnection.request()
            .input('firstName', firstName).input('surname', surname).input('email', email).input('uid', uid)
            .query(`insert into [dbo].[Users] (FirstName, Surname, Email, Invited, AuthId) 
                    values (@firstName, @surname, @email, 0, @uid)`)
    }
}

export const addAttempt = async (uid: string, seed: string, score: number) => {
    var poolConnection = await connect(connection);
    const user = await poolConnection.request().input('uid', uid)
        .query('select UserID from [dbo].[Users] where AuthID = @uid')
        .then(res => res.recordset[0].UserID)
    const problem = await poolConnection.request().input('seed', seed)
        .query('select ProblemID from [dbo].[Problems] where Seed = @seed')
        .then(res => res.recordset[0].ProblemID)
    const id = await poolConnection.request()
        .input('uid', user).input('pid', problem).input('score', Float, score)
        .query(`insert into [dbo].[Attempts] (UserID, ProblemID, RawScore, AttemptDate)
                values (@uid, @pid, @score, getdate());
                select SCOPE_IDENTITY() as id`)
        .then(res => res.recordset[0].id)
    await updatePercentiles(problem, 1)
    await poolConnection.request().input('pid', problem)
        .query(`update [dbo].[Problems] set NumPlayed = NumPlayed + 1 where ProblemID = @pid`)
    return id
}

export const isAdmin = async (uid: string) => {
    var poolConnection = await connect(connection);
    const result: boolean = await poolConnection.request().input('uid', uid)
        .query(`select IsAdmin from [dbo].[Users] where AuthID = @uid`)
        .then(res => res.recordset[0].IsAdmin)
    return result
}

export const getProblem = async (round: number) => {
    const attemptCap = 5 // low value for testing
    var poolConnection = await connect(connection)
    const active = await poolConnection.request().input('cap', attemptCap)
        .input('round', round)
        .query(`select Seed from [dbo].[Problems] where IsActive = 1 and NumPlayed < @cap and Round = @round`)
        .then(res => res.recordset)
    if (active.length === 0) {
        await poolConnection.request()
            .input('round', round)
            .query(`update [dbo].[Problems] set IsActive = 0 where ProblemID = (
                select top 1 ProblemID from [dbo].[Problems] where IsActive = 1 and Round = @round
            )`)
        return "NONE"
    } else {
        const i = Math.floor(Math.random() * active.length)
        return active[i].Seed
    }
}

export const addProblem = async (seed: string, round: number) => {
    var poolConnection = await connect(connection)
    const duplicates = await poolConnection.request().input('seed', seed).input('round', round)
        .query(`select * from [dbo].[Problems] where Seed = @seed and Round = @round`)
        .then(res => res.recordset)
    if (duplicates.length === 0) {
        await poolConnection.request().input('seed', seed).input('round', round)
            .query(`insert into [dbo].[Problems] (Seed, Round) values (@seed, @round)`)
        return true
    }
    return false
}

export const addRound2Attempt = async (attemptID: number, score: number, seed: string) => {
    var poolConnection = await connect(connection);
    const problem = await poolConnection.request().input('seed', seed)
        .query('select ProblemID from [dbo].[Problems] where Seed = @seed and Round = 2')
        .then(res => res.recordset[0].ProblemID)
    await poolConnection.request()
        .input('aid', attemptID).input('pid', problem).input('score', Float, score)
        .query(`update [dbo].[Attempts] 
               set Problem2ID = @pid, RawScore2 = @score, AttemptDate = getdate()
               where AttemptID = @aid`)
    await updatePercentiles(problem, 2)
    await poolConnection.request().input('pid', problem)
        .query(`update [dbo].[Problems] set NumPlayed = NumPlayed + 1 where ProblemID = @pid`)
}

interface Scores {
    AttemptID: number,
    RawScore: number,
    Percentile: number
}

const updatePercentiles = async (problemID: number, round: number) => {
    var poolConnection = await connect(connection);

    if (round === 1) {
        // load scores and percentiles
        const scores: IRecordSet<Scores> = await poolConnection.request()
            .input('problem', problemID)
            .query(
                `select AttemptID, RawScore, Percentile from [dbo].[Attempts] 
                where ProblemID = @problem order by RawScore`
            ).then(res => res.recordset)

        // calculate new percentiles
        for (let i = 0, j = 0; i <= scores.length; i++) {
            if (i === scores.length || scores[i].RawScore !== scores[j].RawScore) {
                const percent = i / scores.length * 100;
                while (j < i) {
                    scores[j].Percentile = percent;
                    j++;
                }
            }
        }

        // update percentiles in database
        scores.forEach(async score => {
            await poolConnection.request()
                .input('percent', score.Percentile)
                .input('attempt', score.AttemptID)
                .query(
                    `update [dbo].[Attempts] set Percentile = @percent where AttemptID = @attempt`
                )
        })
    } else if (round === 2) {
        // load scores and percentiles
        const scores: IRecordSet<Scores> = await poolConnection.request()
            .input('problem', problemID)
            .query(
                `select AttemptID, RawScore2 RawScore, Percentile2 Percentile from [dbo].[Attempts] 
                where Problem2ID = @problem order by RawScore2`
            ).then(res => res.recordset)

        // calculate new percentiles
        for (let i = 0, j = 0; i <= scores.length; i++) {
            if (i === scores.length || scores[i].RawScore !== scores[j].RawScore) {
                const percent = i / scores.length * 100;
                while (j < i) {
                    scores[j].Percentile = percent;
                    j++;
                }
            }
        }

        // update percentiles in database
        scores.forEach(async score => {
            await poolConnection.request()
                .input('percent', score.Percentile)
                .input('attempt', score.AttemptID)
                .query(
                    `update [dbo].[Attempts] set Percentile2 = @percent where AttemptID = @attempt`
                )
        })
    }
}
