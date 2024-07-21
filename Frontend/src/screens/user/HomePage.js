//import node modules and react modules
import React from 'react';
import Card from 'react-bootstrap/Card';
import * as Icons from "react-icons/fa";
import { BsTable, BsCalendar3 } from "react-icons/bs";
import { BsDatabaseFillX } from "react-icons/bs";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { Link } from 'react-router-dom';
//import DWBO sources
import Headline from '../../components/Headline';
import { useSelector } from 'react-redux';
import { getUser, logout } from '../../features/user/userSlice';

function HomePage() {
    const user = useSelector(getUser);
    const projectModel = user.userProject.projectType.id;
    const projectType = user.userProject.projectType.projectTypeDescription;
    //const projectOfferType = user.userProjectprojectOffer.projectOfferTypeID;

    switch (projectModel) {
        //WLH
        case 1:
            return (
                <div id="menu-options">
                    <Headline name='Startseite' area={projectType} />
                    <div>
                        <div className='row'>
                            <Link className="card-link" to="/user/dataCollection">
                                <Card className='dwbo-card' style={{ width: '100%' }}>
                                    <Card.Header>Datenerfassung</Card.Header>
                                    <Card.Body>
                                        <Card.Title><Icons.FaDatabase size={70} /></Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                        <div className='row' style={{ marginTop: '1.25em' }}>
                            <Link className="card-link" to="/user/project">
                                <Card className='dwbo-card' style={{ width: '100%' }}>
                                    <Card.Header>Projektdaten</Card.Header>
                                    <Card.Body>
                                        <Card.Title><Icons.FaProjectDiagram size={70} /></Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        //BH
        case 2:
            return (
                <div id="menu-options" className='bh-menu'>
                    <Headline name='Startseite' area={projectType} />
                    <div className='row menu-data-collect'>
                        <Link className="card-link" to="/user/dataCollection" style={{width: '100%'}}>
                            <Card className='dwbo-card' style={{ width: '100%' }}>
                                <Card.Header>Datenerfassung</Card.Header>
                                <Card.Body>
                                    <Card.Title><BsDatabaseFillCheck size={70} /></Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div>
                    <div className='row' style={{ marginTop: '1.25em' }}>
                        <Link className="card-link" to="/user/event">
                            <Card className='dwbo-card'>
                                <Card.Header>Veranstaltungen</Card.Header>
                                <Card.Body>
                                    <Card.Title><BsCalendar3 size={68} /></Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div>
                    <div className='row' style={{ marginTop: '1.25em' }}>
                        <Link className="card-link" to="/user/project">
                            <Card className='dwbo-card'>
                                <Card.Header>Projektdaten</Card.Header>
                                <Card.Body>
                                    <Card.Title><Icons.FaProjectDiagram size={70} /></Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div>
                </div>
            );

        // SFH
        case 3:
            return (
                <div id="menu-options">
                    <Headline name='Startseite' area={projectType} />
                    <div>
                        <div className='row'>
                            <Link className="card-link" to="/user/dataCollection">
                                <Card className='dwbo-card' style={{ width: '100%' }}>
                                    <Card.Header>Datenerfassung</Card.Header>
                                    <Card.Body>
                                        <Card.Title><Icons.FaDatabase size={70} /></Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                        <div className='row' style={{ marginTop: '1.25em' }}>
                            <Link className="card-link" to="/user/project">
                                <Card className='dwbo-card'>
                                    <Card.Header>Projektdaten</Card.Header>
                                    <Card.Body>
                                        <Card.Title><Icons.FaProjectDiagram size={70} /></Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            );

        default: return null;
    }
}

export default HomePage;