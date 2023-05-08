
export interface OrganizationEntity {
    id: String,
    hierarchy: String,
    name: String,
    leadEhid: String
}

export interface ProfileEntity {
    name: String,
    ehid: String,
    employeeId: String,
    emailAddress: String,
    dob: String
}

export interface TenureEntity {
    id: Number,
    employeeId: String,
    startDate: String,
    endDate: String,
    employmentType: String,
    organizationId: String,
    organizationName: String
}