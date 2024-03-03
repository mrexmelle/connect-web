import {
  DesignationEntity,
  MembershipViewEntity,
  OrganizationEntity,
  ProposalEntity,
  TemplateEntity,
  TreeNodeEntity
} from "./Entity"

export interface ServiceError {
  code: string,
  message: string
}

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

export interface ProfileDto {
  data: ProfileAggregate,
  error: ServiceError
}

export interface CareerDto {
  data: CareerAggregate[],
  error: ServiceError
}

export interface OrganizationDto {
  data: OrganizationEntity,
  error: ServiceError
}

export interface CareerViewModel {
  row_id:              number,
  start_date:          string,
	end_date:            string,
	grade:               string,
	organization_node:   string,
	title:               string,
  organization_name:   string
}

export interface OrganizationMemberDto {
  data: MembershipViewEntity[],
  error: ServiceError
}

export interface OrganizationMemberViewModel {
  ehid: string,
  name: string,
  email_address: string,
  role: string
}

export interface OrganizationChildrenDto {
  data: OrganizationEntity[],
  error: ServiceError
}

export interface OrganizationTreeDto {
  data: TreeNodeEntity,
  error: ServiceError
}

export interface OrganizationOfficerDto {
  data: DesignationEntity[],
  error: ServiceError
}

export interface MultipleTemplateDto {
  templates: TemplateEntity[],
  status: string
}

export interface SingleTemplateDto {
  template: TemplateEntity,
  status: string
}

export interface PatchPasswordRequestDto {
  currentPassword: string,
  newPassword: string
}

export interface PatchPasswordResponseDto {
  status: string
}

export interface SingleProposalDto {
  proposal: ProposalEntity,
  status: string
}
