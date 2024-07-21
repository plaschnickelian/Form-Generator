//import node modules and react modules
import { Form, Button, ButtonGroup, FloatingLabel } from 'react-bootstrap';
import PasswordChecklist from "react-password-checklist"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import * as Icons from "react-icons/fa";
//import DWBO Sources
import { createUser, updateUser } from '../userManagementActions';
import { responseNotifyHandling } from '../../../components/Error';
import { useSelector } from 'react-redux';
import { getToken } from '../../user/userSlice';
import { getProjects } from '../projectManagementActions';

let initCurrentUser = {
  userFirstName: "",
  userLastName: "",
  userMail: "",
  userPassword: "",
  userPasswordConfirm: "",
  isActive: true,
  isAdministrator: false,
  userProject: ""
};

const UserForm = ({ onEdit, show, setShow, getUsers, userData }) => {
  const userToken = useSelector(getToken);

  const [selectedProjects, setSelectedProjects] = useState('');

  if (onEdit === "1") {
    initCurrentUser = userData;
  } else {
    initCurrentUser = {
      userFirstName: "",
      userLastName: "",
      userMail: "",
      userPassword: "",
      userPasswordConfirm: "",
      isActive: true,
      isAdministrator: false,
      userProject: ""
    };
  }
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(initCurrentUser.isAdministrator);
  const [isActiveUser, setIsActiveUser] = useState(initCurrentUser.isActive);
  const [newUser, setNewUser] = useState(initCurrentUser);
  const [projects, setProjects] = useState({});

  //validation string formats
  const lastnameFormat = /^[A-Za-z\x7f-\xff-]+$/;
  const firstnameFormat = /^[A-Za-z\x7f-\xff- \s]+$/;
  const emailFormat = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}";
  //const passwordFormatCharacter = /[~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_]/;
  //const passwordFormatNumber = "/\d/g";

  let navigate = useNavigate();

  const onFocus = () => setShowResults(true);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    getProjects(userToken).then((response) => {
      const projectsWithString = response.data.map(project => ({ ...project, projectString: `[${project.projectNumber}] ${project.projectName}` }));
      setProjects(projectsWithString);
      if (newUser.userProject) {
        setSelectedProjects(newUser.userProject.projectID);
      }
    });
  }

  /**
   * change event handler for input fields
   * @param {*} e 
   */
  function handleChange(e) {
    //set form values
    setForm({
      ...form,
      [e.target.id]: e.target.value
    })
    //check for validation errors
    const newErrors = findLiveFormErrors(e.target.form, e);
  }

  /**
   * users form LIVE validation
   * @param {*} form 
   * @param {*} event 
   * @returns 
   */
  const findLiveFormErrors = (form, event) => {
    const { userLastname, userFirstname, userMail, userProject, isAdministrator } = form;
    const eventElement = event.target.id;
    const newErrors = {};

    // users lastname errors: userLastname cannot be empty, contains only character and "-"
    if (eventElement === 'userLastname' && (!userLastname.value || userLastname.value === '' || !userLastname.value.match(lastnameFormat))) {
      newErrors.userLastname = 'Der Nachname ist ein Pflichtfeld. Bitte geben Sie einen Nachnamen ein. Der Nachname darf keine Sonderzeichen oder Leerzeichen enthalten. Erlaubt ist nur ein Bindestrich.';
    }

    // users firstname errors: userFirstname cannot be empty, contains only character, spaces and "-"
    if (eventElement === 'userFirstname' && (!userFirstname.value || userFirstname.value === '' || !userFirstname.value.match(firstnameFormat))) {
      newErrors.userFirstname = 'Der Vorname ist ein Pflichtfeld. Bitte geben Sie einen Vornamen ein. Der Vorname darf keine Sonderzeichen enthalten. Erlaubt sind nur Leerzeichen und Bindestriche.';
    }

    // users email errors: userMail cannot be empty, contains e-mail format
    if (eventElement === 'userMail' && (!userMail.value || userMail.value === '' || !userMail.value.match(emailFormat))) {
      newErrors.userMail = 'Die E-Mail-Adresse ist ein Pflichtfeld. Bitte geben Sie eine E-Mail-Adresse in einem validen E-Mail-Format ein.';
    }

    // users project errors: userProject cannot be empty
    if (eventElement === 'userProject' && (!userProject.value || userMail.value === '') && isAdministrator === false) {
      newErrors.userMail = 'Das Benutzer Projekt ist ein Pflichtfeld. Bitte weisen sie dem Benutzer ein Projekt zu.';
    }

    setErrors(newErrors);
    return newErrors
  }

  const checkFormValidity = (newUser, responseErrors) => {
    const newErrors = {};

    if (newUser) {
      // users lastname errors: userLastname cannot be empty, contains only character and "-"
      if (!newUser.userLastName || newUser.userLastName === '' || !newUser.userLastName.match(lastnameFormat)) {
        newErrors.userLastname = 'Der Nachname ist ein Pflichtfeld. Bitte geben Sie einen Nachnamen ein. Der Nachname darf keine Sonderzeichen oder Leerzeichen enthalten. Erlaubt ist nur ein Bindestrich.';
      }

      // users firstname errors: userFirstname cannot be empty, contains only character, spaces and "-"
      if (!newUser.userFirstName || newUser.userFirstName === '' || !newUser.userFirstName.match(firstnameFormat)) {
        newErrors.userFirstname = 'Der Vorname ist ein Pflichtfeld. Bitte geben Sie einen Vornamen ein. Der Vorname darf keine Sonderzeichen enthalten. Erlaubt sind nur Leerzeichen und Bindestriche.';
      }

      // users email errors: userMail cannot be empty, contains e-mail format
      if (!newUser.userMail || newUser.userMail === '' || !newUser.userMail.match(emailFormat)) {
        newErrors.userMail = 'Die E-Mail-Adresse ist ein Pflichtfeld. Bitte geben Sie eine E-Mail-Adresse in einem validen E-Mail-Format ein.';
      }

      // users password errors: userPassword cannot be empty, min 8 characters, one number, one special character
      // eslint-disable-next-line no-useless-escape
      if (onEdit === "0" && (!newUser.userPassword || newUser.userPassword === '' || !/[~`¿¡!#$%\^&*€£@+÷=\-\[\]\\';,/{}\(\)|\\":<>\?\.\_]/g.test(newUser.userPassword) || newUser.userPassword.length < 8 || newUser.userPassword !== newUser.userPasswordConfirm || !/\d/g.test(newUser.userPassword))) {
        newErrors.userPassword = 'Das Passwort ist ein Pflichtfeld. Es muss mindestens 8 Zeichen lang sein und sowohl ein Sonderzeichen als auch eine Zahl enthalten. Das Passwort und die Passwort Wiederholung müssen identisch sein.';
      }

      // users project errors: userProject cannot be empty
      if ((!newUser.userProject || newUser.userProject === '') && newUser.isAdministrator === false) {
        newErrors.userProject = 'Das Benutzer Projekt ist ein Pflichtfeld. Bitte weisen sie dem Benutzer ein Projekt zu.';
      }
    }

    if (responseErrors) {
      if (responseErrors.userMail) {
        newErrors.userMail = responseErrors.userMail;
      }
    }

    setErrors(newErrors);
    return newErrors;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newErrors = checkFormValidity(newUser);
    //if form is not valid cancel submit
    if (Object.keys(newErrors).length === 0) {
      let newUserObject = newUser;
      if(newUser.isAdministrator) {
        newUserObject = { ...newUser, userProject: null }
      }

      if (onEdit === "1") {
        updateUser(newUserObject, userToken)
          .then((res) => {

            if (res.status == 200) {
              getUsers();

              setShow(false);
              show = false;

              responseNotifyHandling(res, res.status, `Benutzer: [${newUser.userMail}] wurde aktualisiert`)
            }
          })
          .catch((err) => {
            checkFormValidity(null, err.response.data.message);
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim aktualisieren von Benutzer [${newUser.userMail}].`)
          })
      } else {
        createUser(newUserObject, userToken)
          .then((res) => {

            if (res.status == 201) {
              getUsers();
              responseNotifyHandling(res, res.status, `Benutzer: [${newUser.userLastName}] wurde erstellt`);
              setShow(false);
            }
          })
          .catch(function (err) {
            checkFormValidity(null, err.response.data.message)
            responseNotifyHandling(err.response, err.response.status, `Fehler [${err.response.status}] beim erstellen von Benutzer ${newUser.userLastName}: ${err.response.message}`)
          });
      }
    }
  };

  let defaultProject;
  if (onEdit == "1") {
    if (userData.userProject) {
      defaultProject = Object.values(projects).filter(project => { return project._id == userData.userProject._id });
    }
  }

  function getProject(id) {
    if(typeof id === "object") {
      id = id._id
    }
    return Object.values(projects).filter(project => { return project._id == id });
  }

  return (
    <Form className='mt-4' noValidate validated={validated} onSubmit={handleSubmit}>
      <FloatingLabel
        controlId="userLastname"
        label="Nachname"
        className="mb-3">
        <Form.Control required type="text" placeholder="Nachname" isInvalid={!!errors.userLastname} value={newUser.userLastName}
          onChange={(e) => {
            setNewUser({ ...newUser, userLastName: e.target.value });
            handleChange(e)
          }
          } />
        <Form.Control.Feedback type="invalid">
          {errors.userLastname}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        controlId="userFirstname"
        label="Vorname"
        className="mb-3">
        <Form.Control required type="text" placeholder="Vorname" isInvalid={!!errors.userFirstname} value={newUser.userFirstName}
          onChange={(e) => {
            setNewUser({ ...newUser, userFirstName: e.target.value });
            handleChange(e)
          }
          } />
        <Form.Control.Feedback type="invalid">
          {errors.userFirstname}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        controlId="userMail"
        label="E-Mail"
        className="mb-3">
        <Form.Control required type="email" placeholder="E-Mail" isInvalid={!!errors.userMail} value={newUser.userMail}
          onChange={(e) => {
            setNewUser({ ...newUser, userMail: e.target.value });
            handleChange(e);
          }
          } />
        <Form.Control.Feedback type="invalid">
          {errors.userMail}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        controlId="userPassword"
        label="Passwort"
        className={`mb-3 ${onEdit === "1" ? "btn-invisible" : ""}`}>
        <Form.Control required type="password" placeholder="Passwort" isInvalid={!!errors.userPassword} onFocus={onFocus}
          onChange={(e) => {
            setNewUser({ ...newUser, userPassword: e.target.value })
            handleChange(e);
          }
          } />
        <Form.Control.Feedback type="invalid">
          {errors.userPassword}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        controlId="userPasswordConfirmation"
        label="Passwort Wiederholung"
        className={`mb-3 ${onEdit === "1" ? "btn-invisible" : ""}`}>
        <Form.Control required type="password" placeholder="Passwort Wiederholung"
          onChange={(e) => {
            setNewUser({ ...newUser, userPasswordConfirm: e.target.value });
            handleChange(e);
          }
          } />
        <Form.Control.Feedback type="invalid">
          {errors.userPassword}
        </Form.Control.Feedback>
      </FloatingLabel>
      {showResults && onEdit === "0" ?
        <PasswordChecklist
          rules={["minLength", "specialChar", "number", "match"]}
          minLength={8}
          value={newUser.userPassword}
          valueAgain={newUser.userPasswordConfirm}
          onChange={(isValid) => { }}
          messages={{
            minLength: "Das Passwort muss mindestens 8 Zeichen lang sein.",
            specialChar: "Das Passwort muss ein Sonderzeichen enthalten.",
            number: "Das Passwort muss eine Zahl enthalten.",
            match: "Die Passwort Wiederholung muss identisch zum Passwort sein."
          }}
          controlId="password-rules"
          className="password-rules"
          style={{ lineHeight: "1em" }}
          iconComponents={{ ValidIcon: <Icons.FaCheck size={20} />, InvalidIcon: <Icons.FaTimes size={20} /> }}
          invalidColor="#dc3545"
        /> : null}
      <Form.Group className="mb-3 btn-group-full-width" controlId="formBasicIsAdmin">
        <Form.Label className="label-full-width">Ist der Benutzer ein Administrator? </Form.Label>
        <ButtonGroup>
          <Button className={"btn-group-2 " + (isAdministrator === true ? "active " : "inactive")} variant="secondary" value="true"
            onClick={(e) => {
              setIsAdministrator(true);
              setNewUser({ ...newUser, isAdministrator: true });
              handleChange(e);
            }
            }>ja</Button>
          <Button className={"btn-group-2 " + (isAdministrator === false ? "active " : "inactive")} variant="secondary" value="false"
            onClick={(e) => {
              setIsAdministrator(false);
              setNewUser({ ...newUser, isAdministrator: false });
              handleChange(e);
            }
            }>nein</Button>
        </ButtonGroup>
      </Form.Group>
      {onEdit === "0" &&
        <Form.Group className="mb-3 btn-group-full-width" controlId="formBasicIsActive">
          <Form.Label className="label-full-width">Ist der neue Benutzer aktiviert? </Form.Label>
          <ButtonGroup>
            <Button className={"btn-group-2 " + (isActiveUser === true ? "active" : "inactive")} variant="secondary" value="true"
              onClick={(e) => {
                setIsActiveUser(true);
                setNewUser({ ...newUser, isActive: true });
                handleChange(e)
              }
              }>aktiv</Button>
            <Button className={"btn-group-2 " + (isActiveUser === false ? "active" : "inactive")} variant="secondary" value="false"
              onChange={(e) => {
                setNewUser({ ...newUser, isActive: false });
                handleChange(e)
              }
              }
              onClick={(e) => {
                setIsActiveUser(false);
                setNewUser({ ...newUser, isActive: false });
                handleChange(e);
              }
              }>deaktiviert</Button>
          </ButtonGroup>
        </Form.Group>
      }
      <Form.Group className="mb-3 mt-4" controlId="formBasicProject">
        <div key={projects}>
          <Typeahead
            id="userProject"
            controlId="userProject"
            onChange={(element) => {
              setErrors({ ...errors, userProject: null });
              if (element.length !== 0) {
                setNewUser({ ...newUser, userProject: element[0]._id });
              }
              else {
                setNewUser({ ...newUser, userProject: '' });
              }
            }}
            onInputChange={(text, e) => {
              handleChange(e);
            }}
            options={Object.values(projects)}
            labelKey="projectString"
            disabled={newUser.isAdministrator}
            placeholder="--Projekt zuweisen--"
            selected={newUser.isAdministrator ? [] : newUser.userProject !== null ? getProject(newUser.userProject) : []}
            dropup={true}
            className={!!errors.userProject ? "is-invalid" : ""}
            isInvalid={!!errors.userProject}
          />
          <Form.Control.Feedback type="invalid">
            {errors.userProject}
          </Form.Control.Feedback>
        </div>
      </Form.Group>
      <div className="button-row">
        <Button variant="secondary" style={{ marginRight: '3.25em' }} onClick={(e) => {
          if (onEdit === "1") { setShow(false); }
          navigate('/admin/users');
        }}>
          Abbrechen
        </Button>
        <Button variant="primary" type="submit">
          {onEdit === '1' ? "Benutzer speichern" : "Benutzer anlegen"}
        </Button>
      </div>
    </Form>
  );
};
export default UserForm