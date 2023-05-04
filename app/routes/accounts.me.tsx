import axios from "axios";
import { useEffect, useState } from "react"

interface Profile {
  name: String,
  ehid: String,
  dob: String
}

export default function AccountsMe() {
  const [profile, getProfile] = useState<Profile>({
    name: "",
    ehid: "",
    dob: ""
  })

  useEffect(() => {
    fetchProfile()
  })

  function fetchProfile() {
    axios.get(
      'http://localhost:8080/accounts/me/profile',
      {
        withCredentials: true
      }
    ).then(
      function (response) {
        getProfile(response.data)
      }
    )
  }

  return (
    <main>
      <h1>Hi {profile.name} with DOB {profile.dob}</h1>
    </main>
  );
}
