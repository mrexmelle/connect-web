interface ProfileEntity {
  name: String,
  ehid: String,
  employeeId: String,
  emailAddress: String,
  dob: String
}

export interface ProfileDto {
  profile: ProfileEntity,
  status: String
}
