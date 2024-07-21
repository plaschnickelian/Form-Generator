import React from "react";
import Table from "../../../components/table/Table";
import { Button } from "react-bootstrap";
import * as Icons from "react-icons/fa";
import axios from 'axios';
import { useState, useEffect } from 'react';
import configuration from '../../../config/config';

function OfferTypeTable(props) {
    console.log('PROPS');
    console.log(props);
    const data = props.meindata.offerTypes;
/*
    useEffect(() => {
        //setLoading(true);
        axios.get(configuration.rest+":"+configuration.port+"/admin/listProjectOfferTypes").then((response) => {
            data = response.data;
            //setLoading(false);
        }).catch(
            console.log("ERROR on getting all offerTypes")
            );
    }, []);
    */

    const columns = React.useMemo(
        () => [
            {
                Header: 'Angebotstypen',
                columns: [
                    {
                        Header: 'ID (PK)',
                        accessor: 'projectOfferTypeID',
                    },
                    {
                        Header: 'ID (DWBO)',
                        accessor: 'dwboOfferTypeID'
                    },
                    {
                        Header: 'Name',
                        accessor: 'projectOfferType'
                    },
                    {
                        Header: 'ist aktiv',
                        accessor: 'isActive'
                    },
                    {
                        Header: 'Aktionen',
                        Cell: ({ original }) => (
                            <div>
                                <Button
                                variant="info"
                                title="Bearbeiten"
                                className="btn-primary btn-sm">
                                <Icons.FaPencilAlt /></Button>{" "}
                                <Button
                                variant="warning"
                                title="Deaktivieren"
                                className="btn-warning btn-sm">
                                <Icons.FaBan /></Button>{" "}
                                <Button
                                variant="danger"
                                title="Löschen"
                                className="btn-danger btn-sm">
                                <Icons.FaTrashAlt /></Button>
                            </div>
                        )
                    }
                ],
            }
        ],
        []
    )
/*
    const data = [
        {
            "projectOfferTypeID": "1",
            "dwboOfferTypeID": "1",
            "projectOfferType": "blabla1",
            "isActive": 'nein'
        },
        {
            "projectOfferTypeID": "2",
            "dwboOfferTypeID": "2",
            "projectOfferType": "blabla2",
            "isActive": 'ja'
        }
    ]
*/
    return (
        <Table columns={columns} data={data} />
    )
}

export default OfferTypeTable;