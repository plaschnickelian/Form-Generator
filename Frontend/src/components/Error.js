import { toast } from 'react-toastify';

export const Error = ({ children, ...props }) => {
  return (
    <div
      style={{ color: '#f23838', textAlign: 'center', margin: '0.5rem 0' }}
      {...props}
    >
      {children}
    </div>
  )
}



function logErrors(response, responseCode) {
  console.log(`Error: ${responseCode}`)
  console.log(response)
}

export function responseNotifyHandling(response, responseCode, customMessage) {
  switch (responseCode) {
    case 200: //Übertragung erfolgreich (OK)
      return toast.success(customMessage)
    case 201: //Neues Element wurde erstellt
      return toast.success(customMessage)
    case 204: //Element wurde gelöscht
      return toast.success(customMessage)
    case 400: //Bad request
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 401: //Nicht authorisiert (alternativ auch 403)
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 404: //Not found
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 408: //Timeout
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 409: //Konflikt
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 429: //Too Many Requests
      logErrors(response, responseCode)
      return toast.error(customMessage)
    case 509: //Service nicht erreichbar (z.B. Backend offline)
      logErrors(response, responseCode)
      return toast.error(customMessage)
    default:
      logErrors(response, responseCode)
      //return toast.error("Es ist ein unerwarteter Fehler aufgetreten");
      return;
  }
}