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


const Database01Page = () => {
    const data = React.useMemo(() => fakeData, []); /*TO-DO: link to actual data from SQL databse*/
    const columns= React.useMemo(() => [ 
        {
            Header: "Candidate ID",
            accessor: "id",

        },
        {
            Header: "First Name",
            accessor: "first_name",
        },
        {
            Header: "Last Name",
            accessor: "last_name",
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "Gender",
            accessor: "gender",
        },
        {
            Header: "University",
            accessor: "university",
        },
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
        console.log(selectedFlatRows), /*logs the rows selected at any given time*/
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
