import {connect} from "mssql"

const connection = "Driver={ODBC Driver 18 for SQL Server};Server=tcp:recruitment-server.database.windows.net,1433;Database=recruitment-db;Uid=CloudSAe040e98e;Pwd=FMR93qpa;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;";

const getRecentScores = async () => {
    // Returns an IRecordSet containing each user's name, email, and the details of their most recent attempt at a problem
    // Data can then be extracted by e.g. resultSet[0].UserID
    var poolConnection = await connect(connection);
    var resultSet = await poolConnection.request().query(
        `select users.UserID UserID, FirstName, Surname, Email, ProblemID, RawScore, Percentile, Invited from [dbo].[Users] users
        inner join [dbo].[Attempts] attempts on attempts.UserID=users.UserID
        join (select UserID, max(AttemptDate) most_recent from attempts group by UserID) t 
            on t.most_recent = attempts.AttemptDate and t.UserID = users.UserID
        order by users.UserID`
    ).then(res => res.recordset);
    poolConnection.close();

    return resultSet;
}

export default getRecentScores;
