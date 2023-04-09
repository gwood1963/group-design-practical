import {connect, IRecordSet, Int, Float} from "mssql"
import { json } from "stream/consumers";

const connection = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:recruitment-server.database.windows.net,1433;Database=recruitment-db;Uid=CloudSAe040e98e;Pwd=FMR93qpa;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;";

interface RecentScores {
    UserID: number,
    FirstName: string,
    Surname: string,
    Email: string,
    ProblemID: string,
    RawScore: number,
    Percentile: number,
    Invited: boolean
}

export const getRecentScores = async () => {
    // Returns an IRecordSet containing each user's name, email, and the details of their most recent attempt at a problem
    // Data can then be extracted by e.g. resultSet[0].UserID
    var poolConnection = await connect(connection);
    var resultSet: IRecordSet<RecentScores> = await poolConnection.request().query(
        `select users.UserID UserID, FirstName, Surname, Email, ProblemID, RawScore, Percentile, Invited from [dbo].[Users] users
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

export const register = async (email: string, name: string) => {
    var poolConnection = await connect(connection);
    const user = await poolConnection.request().input('email', email)
        .query('select * from [dbo].[Users] where Email = @email')
        .then(res => res.recordset)
    if (user.length === 0) {
        const [firstName, surname] = name?.split(' ')
        await poolConnection.request()
            .input('firstName', firstName).input('surname', surname).input('email', email)
            .query(`insert into [dbo].[Users] (FirstName, Surname, Email, Invited) 
                    values (@firstName, @surname, @email, 0)`)
    }
}

export const addAttempt = async (email: string, seed: string, score: number) => {
    var poolConnection = await connect(connection);
    const user = await poolConnection.request().input('email', email)
        .query('select UserID from [dbo].[Users] where Email = @email')
        .then(res => res.recordset[0].UserID)
    const problem = await poolConnection.request().input('seed', seed)
        .query('select ProblemID from [dbo].[Problems] where Email = @seed')
        .then(res => res.recordset[0].ProblemID)
    await poolConnection.request()
        .input('uid', user).input('pid', problem).input('score', Float, score)
        .query(`insert into [dbo].[Attempts] (UserID, ProblemID, RawScore, AttemptDate)
                values (@uid, @pid, @score, getdate())`)
    await updatePercentiles(problem)
    await poolConnection.request().input('pid', problem)
        .query(`update [dbo].[Problems] set NumPlayed = NumPlayed + 1 where ProblemID = @pid`)
}

export const isAdmin = async (email: string) => {
    var poolConnection = await connect(connection);
    const result: boolean = await poolConnection.request().input('email', email)
        .query(`select IsAdmin from [dbo].[Users] where Email = @email`)
        .then(res => res.recordset[0].IsAdmin)
    return result
}

interface Scores {
    AttemptID: number,
    RawScore: number,
    Percentile: number
}

const updatePercentiles = async (problemID: number) => {
    var poolConnection = await connect(connection);

    // load scores and percentiles
    const scores: IRecordSet<Scores> = await poolConnection.request()
        .input('problem', problemID)
        .query(
            `select AttemptID, RawScore, Percentile from [dbo].[Attempts] 
            where PromlemID = @problem order by RawScore`
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
}
