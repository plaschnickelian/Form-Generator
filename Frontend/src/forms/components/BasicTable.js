import React, { useState } from 'react';
import * as Icons from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../features/user/userActions';
import { responseNotifyHandling } from '../../components/Error';
import { Button, Form } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { updateProject } from '../../features/admin/projectManagementActions';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { inputTypes } from '../../config/configEnums';

const BasicTable = ({ databaseObject, setDatabaseObject, container }) => {

    const handleChange = (e) => {
        setDatabaseObject({ ...databaseObject, [e.target.name]: e.target.value });
    }

    return (
        <div style={{ position: "relative" }}>
            {container.header && (
                <div className='table-header'>
                    <h5>{container.header}</h5>
                </div>
            )}
            <Paper className={`mt-3 basic-table ${container.cssClass}`} variant='outlined' square elevation={0}>
                <TableContainer sx={{ overflowY: "hidden" }}>
                    <Table sx={{ minWidth: 500 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {container.tableHead.map((element) => (
                                    <TableCell align={element.align} key={element.name}>
                                        {element.name}
                                    </TableCell>
                                ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {container.elements.map((element, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    {element.map(cell => {
                                        switch (cell.inputType) {
                                            case inputTypes.DISPLAY:
                                                return (
                                                    <TableCell key={cell.name} scope="row">
                                                        {cell.name}
                                                    </TableCell>
                                                )

                                            case inputTypes.NUMBER:
                                                return (
                                                    <TableCell key={cell.value} sx={{ width: "7vw" }} align="center">
                                                        {cell.value !== null &&
                                                            <input
                                                                type="number"
                                                                className='default-input'
                                                                onWheel={(e) => e.target.blur()}
                                                                value={databaseObject[cell.value] || ""}
                                                                name={cell.value}
                                                                onChange={handleChange}
                                                            />
                                                        }
                                                    </TableCell>
                                                )

                                            default: return null;
                                        }
                                    })
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );

}

export default BasicTable;