import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import '../css/App.css'
import Navigation from '../components/Navigation'
import BreadcrumbComponent from '../components/Breadcrumb'

const userPaths = {
  "user": { "path": "/user", "text": "Home", "id": "1", "icon": "FaHome" },
  "dataCollection": { "path": "/user/dataCollection", "text": "Datenerfassung", "id": "2" },
  "anonymousCollection": { "path": "/user/anonymousCollection", "text": "nicht-personenbezogene Leistungen", "id": "3" },
  "clientView": { "path": "user/clientView", "text": "Klient*innenübersicht", "id": "4" },
  "project": { "path": "user/project", "text": "Projektdaten", "id": "5" },
  "excel-export": { "path": "user/excel-export", "text": "Excel-Dateien für QSD speichern", "id": "6" },
  "event": { "path": "user/event", "text": "Events", "id": "7" }
}

const ProtectedRoute = () => {
  const userInfo = useSelector((state) => state.user.userInfo)
  if (userInfo?.isActive) {
    return <UserLayout children={<Outlet />}></UserLayout>
  }
  //wenn user nicht in db vorhanden oder nicht angemeldet war, dann ist das die fehlerseite
  else if (!userInfo) {
    return (
      <div className='protRouteError'>
        <h1>Nicht angemeldet :(</h1>
        <span>
          <NavLink to='/login'>Login</NavLink> zum anmelden.
        </span>
      </div>
    )
  }
  //wenn nutzer deaktiviert
  else {
    return (
      <div className='protRouteError'>
        <h1>Benutzer deaktiviert :(</h1>
        <span>
          Zur <NavLink to='/'>Startseite</NavLink> oder wenden Sie sich an den Systemadministrator.
        </span>
      </div>
    )
  }
}

const UserLayout = ({ children }) => {
  return (
  <div className="row" style={{ height: '100%' }}>
    <div className="col-2" id='isp-navi' style={{display: "none"}}>
      <Navigation panel={"user"} />
    </div>
    <div className="col">
      <div id="breadcrumb-container" className="row">
         <BreadcrumbComponent paths={userPaths} />
      </div>
      <div className='row'>
        <div style={{zIndex: "-3"}} className="col-2"></div>
        <div className="col-8">
          <div id="user-content-container" className="container-fluid user-content" style={{ height: '100%' }}>
            {children}
          </div>
        </div>
        <div style={{zIndex: "-3"}} className="col-2"></div>
      </div>
    </div>
  </div>
)};

export default ProtectedRoute