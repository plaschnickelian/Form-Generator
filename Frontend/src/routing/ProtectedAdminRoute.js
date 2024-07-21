import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import '../css/App.css'
import '../css/breadcrumb.css'
import '../css/layout/admin.css'
import '../css/components/navigation.css'
import '../css/pages/adminspace.css';
import Navigation from '../components/Navigation'
import BreadcrumbComponent from '../components/Breadcrumb'

const adminPaths = {
  "admin": { "path": "/admin", "text": "Home", "id": "1" },
  "users": { "path": "/admin/users", "text": "Benutzerverwaltung", "id": "2" },
  "users-create": { "path": "/admin/users/create", "text": "Benutzer erstellen", "id": "3" },
  "add": { "path": "/admin/add", "text": "Benutzer anlegen", "id": "4" },
  "projects": { "path": "/admin/projects", "text": "Projektverwaltung", "id": "5" },
  "projects-create": { "path": "/admin/projects/create", "text": "Projekt erstellen", "id": "6" },
  "offer-types": { "path": "/admin/offer-types", "text": "Angebotstypenverwaltung", "id": "7" },
  "export": { "path": "/admin/export", "text": "Datenverwaltung", "id": "8" }
}

const ProtectedAdminRoute = () => {
  //define global admin panel layout
  const AdminLayout = ({ children }) => (
    <div className="row" style={{ height: '100%' }}>
      <div className="col-2" id='isp-navi'>
        <Navigation panel={"admin"} />
      </div>
      <div className="col">
        <div id="breadcrumb-container" className="row">
          <BreadcrumbComponent paths={adminPaths} />
        </div>
        <div className='row'>
          <div className="col-1"></div>
          <div className="col">
            <div id="admin-content-container" className="container-fluid admin-content" style={{ height: '100%' }}>
              {children}
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </div>
  );

  const userInfo = useSelector((state) => state.user.userInfo)
  
  //check ob user aktiviert und admin berechtigungen hat
  if (userInfo !== null) {
      if (userInfo?.isActive) {
        if (userInfo?.isAdministrator) {
          //weiterleitung zum Adminpanel
          return <AdminLayout children={<Outlet />}></AdminLayout>
        } else {
          return (
            <div className='protRouteError'>
              <h1>Keine Berechtigung :(</h1>
              <span>
                Wenden Sie sich an den Systemadministrator.
              </span>
            </div>
          )
        }
      } else if (userInfo?.isActive === false) {
        return (
          <div className='protRouteError'>
            <h1>Benutzer deaktiviert :(</h1>
            <span>
              Zur <NavLink to='/'>Startseite</NavLink> oder wenden Sie sich an den Systemadministrator.
            </span>
          </div>
        )
      } else {
        return (
          <div className='protRouteError'>
            <h1>Benutzer hat keinen Aktivitätsstatus :(</h1>
            <span>
              Zur <NavLink to='/'>Startseite</NavLink> oder wenden Sie sich an den Systemadministrator.
            </span>
          </div>
        )
      }
    }
  //wenn user nicht angemeldet
  else {
    return (
      <div className='protRouteError'>
        <h1>Nicht angemeldet :(</h1>
        <span>
          Klicken Sie hier zum <NavLink to='/login'>Login</NavLink>.
        </span>
      </div>
    )
  }
  //wenn nutzer deaktiviert
  
}

export default ProtectedAdminRoute