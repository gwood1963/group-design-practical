import {connect, IRecordSet, Int} from "mssql"
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

interface Scores {
    AttemptID: number,
    RawScore: number,
    Percentile: number
}

const updatePercentiles = async (problemID: string) => {
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
