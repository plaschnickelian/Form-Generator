import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'
import * as Icons from "react-icons/fa";

function BreadcrumbComponent(props) {

  //function parameter with breadcrumb informations in json structure
  const paths = props.paths;
  
  //get actual router location
  const location = useLocation();

  //remove first "/" from location path
  const cLocation = location.pathname.substring(1);

  //split string path by "/"
  const actLocation = cLocation.split('/');

  //create structure: controller, model, action
  let controller = '';
  let model = '';
  let action = '';

  if (actLocation.length >= 1) {
    controller = actLocation[0];
  }
  if (actLocation.length >= 2) {
    model = actLocation[1];
  }
  if (actLocation.length >= 3) {
    action = actLocation[2];
  }

  let breadcrumbItems = actLocation.map((subpath, index) => {
    const lastItem = index === actLocation.length-1;

    if (index < 2) {
      return (<Breadcrumb.Item linkAs="span" key={paths[subpath].id}>{lastItem ? <span>{paths[subpath].icon ? <span><Icons.FaHome size={30} className='breadcrumb-icon' /></span>:""}{paths[subpath].text}</span> : <Link to={paths[subpath].path}>{paths[subpath].icon ? <span><Icons.FaHome size={30} className='breadcrumb-icon' /></span>:""}{paths[subpath].text}</Link>}</Breadcrumb.Item>);
    } else if (index === 2) {
      return (<Breadcrumb.Item linkAs="span" key={paths[model + '-' + subpath].id}>{lastItem ? <span>{paths[model + '-' + subpath].text}l1</span> : <Link to={paths[model + '-' + subpath].path}>{paths[model + '-' + subpath].text}</Link>}l2</Breadcrumb.Item>);
    } else return "";
  });

  return (
    <Breadcrumb className="breadcrumb">
      {breadcrumbItems}
    </Breadcrumb>
  );
}

export default BreadcrumbComponent;