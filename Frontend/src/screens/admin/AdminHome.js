//import node modules and react modules
import React from 'react';
import Card from 'react-bootstrap/Card';
import * as Icons from "react-icons/fa";
import { Link } from 'react-router-dom';
//import DWBO sources
import Headline from '../../components/Headline';

const AdminHome = () => {
    return (
        <div>
            <Headline name='Administration' />
            <div className='row'>
                <div className='col'>
                    <Link className="card-link" to="/admin/users">
                        <Card className='dwbo-card'>
                        <Card.Header>Benutzerverwaltung</Card.Header>
                            <Card.Body>
                                <Card.Title><Icons.FaUsers size={70} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
                <div className='col'>
                    <Link className="card-link" to="/admin/projects">
                        <Card className='dwbo-card'>
                            <Card.Header>Projektverwaltung</Card.Header>
                            <Card.Body>
                                <Card.Title><Icons.FaProjectDiagram size={70} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
            </div>
            <div className='row' style={{marginTop: '1.25em'}}>
                <div className='col'>
                    <Link className="card-link" to="/admin/offer-types">
                        <Card className='dwbo-card'>
                        <Card.Header>Angebotsverwaltung</Card.Header>
                            <Card.Body>
                                <Card.Title><Icons.FaHandsHelping size={70} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
                <div className='col'>
                    <Link className="card-link" to="/admin/export">
                        <Card className='dwbo-card'>
                        <Card.Header>Datenexport</Card.Header>
                            <Card.Body>
                                <Card.Title><Icons.FaDatabase size={70} /></Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default AdminHome;