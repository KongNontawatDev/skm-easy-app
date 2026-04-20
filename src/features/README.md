# API Structure Documentation

โครงสร้าง API ที่พร้อมใช้งานกับ mockup data และสามารถเปลี่ยนไปใช้ API จริงได้ง่ายๆ

## โครงสร้างไฟล์

```
src/features/
├── {feature-name}/
│   ├── api/
│   │   └── {feature-name}-api.ts     # API service functions
│   ├── hooks/
│   │   ├── use{FeatureName}Query.ts   # Query hooks
│   │   ├── use{FeatureName}Mutation.ts # Mutation hooks
│   │   └── index.ts                   # Export all hooks
│   ├── types/
│   │   └── index.ts                   # TypeScript types
│   └── data/
│       └── mock-data.ts               # Mock data
```

## การใช้งาน

### 1. Query Hooks (ดึงข้อมูล)

```typescript
import { useContracts, useContract } from '@/features/contract/hooks'

// ดึงรายการสัญญาทั้งหมด
const { data, isLoading, error } = useContracts({
  search: 'search term',
  page: 1,
  limit: 10
})

// ดึงสัญญาเฉพาะ ID
const { data: contract } = useContract('contract-id')
```

### 2. Mutation Hooks (บันทึก/แก้ไข/ลบ)

```typescript
import { useCreateContract, useUpdateContract, useDeleteContract } from '@/features/contract/hooks'

// สร้างสัญญาใหม่
const createContract = useCreateContract()
createContract.mutate({
  contractNumber: 'CT001',
  vehicleInfo: { ... }
})

// แก้ไขสัญญา
const updateContract = useUpdateContract()
updateContract.mutate({
  id: 'contract-id',
  data: { ... }
})

// ลบสัญญา
const deleteContract = useDeleteContract()
deleteContract.mutate('contract-id')
```

## การเปลี่ยนไปใช้ API จริง

### 1. เปลี่ยน Environment Variables

```env
# .env.local
VITE_USE_MOCK_API=false
VITE_REAL_API_BASE_URL=https://api.yourdomain.com
```

### 2. อัปเดต API Service

แทนที่ MockApiService ด้วย axios instance จริง:

```typescript
// src/features/contract/api/contract-api.ts
import { apiClient } from '@/lib/api-client' // Real API client

export class ContractApiService {
  static async getContracts(params?: QueryParams) {
    const response = await apiClient.get('/contracts', { params })
    return response.data
  }
}
```

## API Response Format

ทุก API จะส่งกลับข้อมูลในรูปแบบนี้:

```typescript
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  statusCode: number
  pagination?: {
    page: number
    pageSize: number
    total: number
    pageCount: number
  }
}
```

## Features ที่มี API Structure

- ✅ Contract (สัญญา)
- ✅ Coupon (คูปอง)
- ✅ Profile (โปรไฟล์)
- ✅ Notification (การแจ้งเตือน)
- ✅ Auth (การยืนยันตัวตน)

## ตัวอย่างการใช้งานใน Component

```typescript
import { useContracts, useCreateContract } from '@/features/contract/hooks'

export function ContractPage() {
  const { data: contractsResponse, isLoading, error } = useContracts({
    search: searchQuery,
    page: 1,
    limit: 20
  })
  
  const createContract = useCreateContract()
  
  const contracts = contractsResponse?.data || []
  
  const handleCreateContract = (data) => {
    createContract.mutate(data, {
      onSuccess: () => {
        // Show success message
        toast.success('สร้างสัญญาสำเร็จ')
      }
    })
  }
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <div>
      {contracts.map(contract => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  )
}
```
