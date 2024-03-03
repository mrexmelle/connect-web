
export interface ProfileAggregate {
  ehid:              string,
	employee_id:       string,
	name:              string,
	email_address:     string,
	dob:               string,
	grade:             string,
	title:             string,
	organization_node: string
}

export interface CareerAggregate {
  start_date:          string,
	end_date:            string,
	grade:               string,
	organization_node:   string,
	title:               string
}
