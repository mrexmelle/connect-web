
export interface OrganizationEntity {
    id: string,
    hierarchy: string,
    name: string,
    email_address: string
}

export interface MembershipViewEntity {
    id:         number,
    ehid:       string,
    start_date: string,
    end_date:   string,
    node_id:    string
}

export interface TreeNodeEntity {
    data: OrganizationEntity,
    children: TreeNodeEntity[]
}

export interface DesignationEntity {
    id: number,
    ehid: string,
    node_id: string,
    role_id: string
}

export interface FieldEntity {
    type: string,
    key: string,
    label: string,
    required: boolean
}

export interface TemplateEntity {
    index: number,
    label: string,
    code: string,
    description: string,
    reviewers: string[],
    fields: FieldEntity[]
}

export interface OptionEntity {
    label: string,
    value: string
}

export interface ProposalEntity {
    id: string,
    author: string,
    templateCode: string,
    reviewers: string[][],
    fields: Map<string, string>
}


