import { OrganizationEntity, OrganizationMemberEntity, OrganizationTreeEntity, ProfileEntity, TemplateEntity, TenureEntity } from "./Entity"

export interface OrganizationDto {
  organization: OrganizationEntity,
  status: string
}

export interface ProfileDto {
  profile: ProfileEntity,
  status: string
}

export interface TenureDto {
  tenures: TenureEntity[],
  status: string
}

export interface OrganizationMemberDto {
  members: OrganizationMemberEntity[],
  status: string
}

export interface TreeDto {
  tree: OrganizationTreeEntity,
  status: string
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
