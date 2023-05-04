import axios from "axios";
import { useEffect, useState } from "react"

interface Profile {
  name: String,
  ehid: String,
  dob: String
}

export default function AccountsMe() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    ehid: "",
    dob: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  function fetchProfile() {
    axios.defaults.withCredentials = true
    axios.get(
      'http://localhost:8080/accounts/me/profile'
    ).then(
      (response) => {
        setProfile(response.data)
      }
    )
  }

  return (
    <main>
      <h1>Hi {profile.name}</h1>
    </main>
  );
}
