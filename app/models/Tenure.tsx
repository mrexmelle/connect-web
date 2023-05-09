interface TenureEntity {
  id: Number,
  employeeId: String,
  startDate: String,
  endDate: String,
  employmentType: String,
  organizationId: String,
  organizationName: String
}

export interface TenureDto {
  tenures: TenureEntity[],
  status: String
}
