
export interface OrganizationEntity {
    id: string,
    hierarchy: string,
    name: string,
    leadEhid: string,
    emailAddress: string
}

export interface ProfileEntity {
    name: string,
    ehid: string,
    employeeId: string,
    emailAddress: string,
    dob: string
}

export interface TenureEntity {
    id: number,
    employeeId: string,
    startDate: string,
    endDate: string,
    employmentType: string,
    organizationId: string,
    titleGrade: string,
    titleName: string,
    organizationName: string
}

export interface OrganizationMemberEntity {
    ehid: string,
    employeeId: string,
    name: string,
    emailAddress: string,
    titleName: string,
    isLead: string,
    employmentType: string,
    organizationRole: string
}

export interface OrganizationTreeEntity {
    organization: OrganizationEntity,
    children: OrganizationTreeEntity[]
}

export interface FieldEntity {
    type: string,
    key: string,
    label: string,
    required: boolean
}

export interface TemplateEntity {
    index: number,
    code: string,
    description: string,
    reviewers: string[],
    fields: FieldEntity[]
}
