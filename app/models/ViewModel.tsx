
export interface CareerViewModel {
  row_id:              number,
  start_date:          string,
	end_date:            string,
	grade:               string,
	organization_node:   string,
	title:               string,
  organization_name:   string
}

export interface OrganizationMemberViewModel {
  ehid: string,
  name: string,
  email_address: string,
  role: string
}
