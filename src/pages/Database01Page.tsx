import fakeData from "./FAKEDATA.json";
import * as React from "react";
import { useTable, useRowSelect } from "react-table";
import MainWrapper from "../components/ContentWrapper";
import LinkButton from "../components/LinkButton";
import ActionButton from "../components/ActionButton";
import Checkbox from "../components/Checkbox";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*the below code was part of my attempt to debug the type error in line 55, but I didn't manage to use it successfully
interface Data {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    university: number;
   }
*/
interface Data {
    UserID: number,
    FirstName: string,
    Surname: string,
    Email: string,
    ProblemID: string,
    RawScore: number,
    Percentile: number,
    Invited: boolean
}


const Database01Page = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        console.log("loading scores");
        getScores();
    }, []);

    const data: Data[] = React.useMemo(() => scores, [scores]);

    async function getScores() {
        const result = await fetch("/api/database");
        const json = await result.json();
        console.log(json);
        setScores(json);
    }

    const columns= React.useMemo(() => [ 
        {
            Header: "Candidate ID",
            id: "UserID",
            accessor: (row: Data) => row.UserID
        },
        {
            Header: "First Name",
            id:"FirstName",
            accessor: (row: Data) => row.FirstName
        },
        {
            Header: "Last Name",
            id: "Surname",
            accessor: (row: Data) => row.Surname
        },
        {
            Header: "Email",
            id: "Email",
            accessor: (row: Data) => row.Email
        },
        {
            Header: "Problem ID",
            id: "ProblemID",
            accessor: (row:Data) => row.ProblemID
        },
        {
            Header: "Raw Score",
            id: "RawScore",
            accessor: (row: Data) => row.RawScore
        },
        {
            Header: "Percentile",
            id: "Percentile",
            accessor: (row: Data) => row.Percentile
        },
        {
            Header: "Invited?",
            id: "Invited",
            accessor: (row: Data) => row.Invited
        }
    ], []);

    //@ts-ignore
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, selectedFlatRows} = useTable({columns, data}, useRowSelect, (hooks) => {hooks.visibleColumns.push((columns)=> {
        return [
            /*T23 - checkboxes being added to the rows */
            {
                id: 'selection',
                //@ts-ignore
                Header: ({ getToggleAllRowsSelectedProps}) => (
                    <Checkbox {...getToggleAllRowsSelectedProps()}/>

                ),
                //@ts-ignore
                Cell: ({row})=> (
                    //@ts-ignore
                    <Checkbox {...row.getToggleRowSelectedProps()}/>

                )
            },
            ...columns
        ]
    })});
    const navigate = useNavigate();
    const auth = getAuth();

    
    return (
        //console.log(fakeData),
        //console.log(selectedFlatRows), /*logs the rows selected at any given time*/
        console.log(data),
        <>
        
        <div className = "navBar">
            <LinkButton target="/" text="back button" image="/back.svg" />

            <div className = "popup" onClick = {(_)=> {
                var popup = document.getElementById("InvitePopup")!;
                var numSelected = selectedFlatRows.length;
                if (numSelected > 0) {popup.innerHTML = numSelected + " selected candidates invited";} else {popup.innerHTML = "None selected"}
            popup?.classList.toggle("show");
                setTimeout(() => {popup?.classList.toggle("show");}, 3000);

                }}
            > 
            Invite Selected
            <span className = "popuptext" id = "InvitePopup"> None selected!</span>
            </div>
            <ActionButton
            text="Log out"
            onClick={() => {
                auth.signOut();
                navigate("/");
            }}
            />
        </div>
        
        

        <MainWrapper flexDirection = "column">
            <body id = "databasePage">
                <div className = "databaseContainer">
                    <h1> Candidates </h1>

                    <div className="database"> 
                        <table {...getTableProps()}>
                            <thead>
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map((row) => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <td {...cell.getCellProps()}>
                                                    {cell.render("Cell")}
                                                </td>
                                            ))}

                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>
                    </div>
                </div>
            </body>
        </MainWrapper>
        </>
    );
}

export default Database01Page;