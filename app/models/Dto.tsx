import { OrganizationEntity, ProfileEntity, TenureEntity } from "./Entity"

export interface OrganizationDto {
  organization: OrganizationEntity,
  status: String
}

export interface ProfileDto {
  profile: ProfileEntity,
  status: String
}

export interface TenureDto {
  tenures: TenureEntity[],
  status: String
}
