import { OrganizationEntity, OrganizationMemberEntity, OrganizationTreeEntity, ProfileEntity, TenureEntity } from "./Entity"

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
