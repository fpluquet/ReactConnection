import React, {useEffect, useState} from 'react';
import {useToken} from '../App/useToken';
import {Link} from "react-router-dom";

export default function Dashboard() {

  const [user, setUser] = useState()
  const {token, clearToken} = useToken()
  const [error, setError] = useState()

  useEffect(() => {
        fetch('http://localhost:8080/me', {
          headers: {
            Authorization: `Bearer ${token}` // par convention, on envoie le token dans le header Authorization avec le préfixe Bearer
          },
        }).then(async response => {
          if(!response.ok) {
            setError('Could not fetch the user')
          }
          setUser(await response.json())
        }).catch(() => {
          setError('Could not fetch the user')
        })
  }, [])

  if(error) {
    return <div>{error}
      <button onClick={clearToken}>Retour à la connexion</button></div>
  }
  if(!user) {
    return <div>Loading...</div>
  }
    return (
      <>
        <h2>Bienvenue {user.username} !</h2>
        <button onClick={clearToken}>Se déconnecter</button>
        <h3>Personal data :</h3>
        <table>
          {Object.keys(user.personalData).map((key, index) => (
            <tr key={index}>
              <td>{key}</td>
              <td>{user.personalData[key]}</td>
            </tr>
          ))}
        </table>
      </>
    );
  }
