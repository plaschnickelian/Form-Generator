import { useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../features/user/userActions'
import { logout, setLogoutNavigate, setRequestLogout, setUserInfo } from '../features/user/userSlice'
import { FaUserAlt } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/components/header.css'
import { FormState, getFormState, setFormState } from '../features/form/formSlice'
import { unstable_useBlocker as useBlocker } from 'react-router-dom';
import { disabledTime } from 'rsuite/esm/utils/dateUtils'
import { useParams } from 'react-router-dom'

const Header = () => {
  const { resetToken } = useParams();
  const location = useLocation();
  const { userInfo, userToken } = useSelector((state) => state.user);
  const logoutNavigate = useSelector((state) => state.user.logoutNavigate);
  const formState = useSelector(getFormState);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // automatischer login wenn usertoken vorhanden
  useEffect(() => {
    if (userToken) {
      dispatch(getUserDetails())
    }
  }, [userToken, dispatch, navigate])

  useEffect(() => {
    if (logoutNavigate) {
      navigate('/login');
      dispatch(setLogoutNavigate(false));
    }
  }, [logoutNavigate])

  useEffect(() => {
    if (!userToken && !resetToken) {
      navigate('/login');
    }
    else if (location.pathname == "/") {
      if (userInfo?.isAdministrator) {
        navigate('/admin');
      }
      else {
        navigate('/user');
      }
    }
  }, []);

  const handleLogout = () => {
    if (formState === "UNCHANGED") {
      dispatch(logout());
      navigate('/login');
    }
    else {
      dispatch(setRequestLogout(true));
      dispatch(setLogoutNavigate(true));
    }
  }

  return (
    <header className="ispHeader">
      <Prompt
        when={formState !== FormState.UNCHANGED}
        message="Seite verlassen? Ihre Änderungen wurden eventuell noch nicht gespeichert."
      />
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-4 no-padding">
            <Link to={Object.keys(userInfo).length === 0 ? '/login' : (userInfo.isAdministrator ? '/admin' : '/user')}>
              <img
                src="/logo.svg"
                width="182"
                height="51"
                alt="DWBO-Logo"
                className="float-left margin-8" />
            </Link>
          </div>
          <div className="col-4">
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
          <div className="col-4 pe-4">
            <div className="row align-items-center d-flex flex-column">
              <div id="header-user-info" className="mb-2 d-flex justify-content-end align-items-center">
                <div className='me-2'><FaUserAlt size={18} /></div>
                <p>{!userToken || !userInfo ? "Sie sind nicht angemeldet" : `Angemeldet als ${userInfo.email}`}</p>
              </div>
              {!userToken || !userInfo ?
                <div style={{ marginTop: "2rem" }}></div>
                : <div className='d-flex justify-content-end'>
                  <button className='cl_header_button' onClick={() => { handleLogout() }}>
                    Logout
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Prompt(props) {
  const dispatch = useDispatch();
  const requestLogout = useSelector(state => state.user.requestLogout);
  const block = props.when

  useBlocker(() => {
    if (block) {
      const selection = window.confirm(props.message);
      if (selection === true) {
        dispatch(setFormState(FormState.UNCHANGED));
      }
      if (requestLogout) {
        if (selection === true) {
          dispatch(logout());
        }
        dispatch(setRequestLogout(false));
      }
      return !selection
    }
    return false
  })

  return (
    <div key={block} />
  )
}

export default Header
