import type { PageInfo } from '@/dto/PageInfo'

export interface WebResponse<T> {
  data: T
  errors: string
  pageInfo: PageInfo
}
