import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MobileCard, MobileButton, MobileInput } from '@/components/mobile'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useCreditCheckSubmit } from '../hooks'

// ข้อมูลอ้างอิง — static constants
const occupations = [
  'พนักงานบริษัท', 'ข้าราชการ', 'เจ้าของธุรกิจ', 'ฟรีแลนซ์', 'เกษตรกร',
  'ครู/อาจารย์', 'แพทย์/พยาบาล', 'วิศวกร', 'ทนายความ', 'นักบัญชี', 'อื่นๆ',
]
const provinces = [
  'กรุงเทพมหานคร', 'เชียงใหม่', 'เชียงราย', 'นครราชสีมา', 'ขอนแก่น',
  'อุดรธานี', 'อุบลราชธานี', 'สงขลา', 'ภูเก็ต', 'พัทยา', 'อื่นๆ',
]
import type { CreditCheckForm, CreditCheckResponse } from '../types'

const creditCheckSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
    phone: z.string().min(10, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'),
    email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
    idCard: z.string().min(13, 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง'),
    birthDate: z.string().min(1, 'กรุณาเลือกวันเกิด')
  }),
  addressInfo: z.object({
    currentAddress: z.string().min(1, 'กรุณากรอกที่อยู่'),
    province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ'),
    postalCode: z.string().min(5, 'กรุณากรอกรหัสไปรษณีย์'),
    residenceType: z.enum(['owned', 'rented', 'family']),
    residenceDuration: z.number().min(1, 'กรุณากรอกระยะเวลาอยู่อาศัย')
  }),
  employmentInfo: z.object({
    occupation: z.string().min(1, 'กรุณาเลือกอาชีพ'),
    company: z.string().min(1, 'กรุณากรอกชื่อบริษัท'),
    workDuration: z.number().min(1, 'กรุณากรอกระยะเวลาทำงาน'),
    monthlyIncome: z.number().min(1, 'กรุณากรอกรายได้ต่อเดือน'),
    incomeSource: z.enum(['salary', 'business', 'freelance', 'other']),
    additionalIncome: z.number().optional()
  }),
  financialInfo: z.object({
    monthlyExpenses: z.number().min(1, 'กรุณากรอกค่าใช้จ่ายต่อเดือน'),
    existingLoans: z.number().min(0, 'กรุณากรอกยอดหนี้คงเหลือ'),
    creditCards: z.number().min(0, 'กรุณากรอกจำนวนบัตรเครดิต'),
    bankAccounts: z.array(z.string()).min(1, 'กรุณากรอกบัญชีธนาคาร')
  }),
  vehicleInfo: z.object({
    brand: z.string().min(1, 'กรุณากรอกยี่ห้อรถ'),
    model: z.string().min(1, 'กรุณากรอกรุ่นรถ'),
    year: z.number().min(2000, 'กรุณากรอกปีที่ผลิต'),
    price: z.number().min(1, 'กรุณากรอกราคารถ'),
    downPayment: z.number().min(0, 'กรุณากรอกเงินดาวน์')
  })
})

type CreditCheckFormData = z.infer<typeof creditCheckSchema>

interface CreditCheckFormProps {
  onSuccess?: (data: CreditCheckResponse) => void
  onCancel?: () => void
}

export function CreditCheckForm({ onSuccess, onCancel }: CreditCheckFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bankAccounts, setBankAccounts] = useState<string[]>([''])
  
  const creditCheckMutation = useCreditCheckSubmit()
  
  const form = useForm<CreditCheckFormData>({
    resolver: zodResolver(creditCheckSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        idCard: '',
        birthDate: ''
      },
      addressInfo: {
        currentAddress: '',
        province: '',
        district: '',
        postalCode: '',
        residenceType: 'owned',
        residenceDuration: 0
      },
      employmentInfo: {
        occupation: '',
        company: '',
        workDuration: 0,
        monthlyIncome: 0,
        incomeSource: 'salary',
        additionalIncome: 0
      },
      financialInfo: {
        monthlyExpenses: 0,
        existingLoans: 0,
        creditCards: 0,
        bankAccounts: ['']
      },
      vehicleInfo: {
        brand: '',
        model: '',
        year: 2024,
        price: 0,
        downPayment: 0
      }
    }
  })

  const { handleSubmit, formState: { errors }, watch, setValue } = form

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, ''])
  }

  const removeBankAccount = (index: number) => {
    const newAccounts = bankAccounts.filter((_, i) => i !== index)
    setBankAccounts(newAccounts)
    setValue('financialInfo.bankAccounts', newAccounts)
  }

  const updateBankAccount = (index: number, value: string) => {
    const newAccounts = [...bankAccounts]
    newAccounts[index] = value
    setBankAccounts(newAccounts)
    setValue('financialInfo.bankAccounts', newAccounts)
  }

  const onSubmit = (data: CreditCheckFormData) => {
    const formData: CreditCheckForm = {
      ...data,
      financialInfo: {
        ...data.financialInfo,
        bankAccounts: bankAccounts.filter(account => account.trim() !== '')
      }
    }

    creditCheckMutation.mutate(formData, {
      onSuccess: (response) => {
        onSuccess?.(response)
      }
    })
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ข้อมูลส่วนตัว
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <MobileInput
                label="ชื่อ"
                placeholder="กรอกชื่อ"
                {...form.register('personalInfo.firstName')}
                error={errors.personalInfo?.firstName?.message}
              />
              <MobileInput
                label="นามสกุล"
                placeholder="กรอกนามสกุล"
                {...form.register('personalInfo.lastName')}
                error={errors.personalInfo?.lastName?.message}
              />
            </div>

            <MobileInput
              label="เบอร์โทรศัพท์"
              placeholder="081-234-5678"
              {...form.register('personalInfo.phone')}
              error={errors.personalInfo?.phone?.message}
            />

            <MobileInput
              label="อีเมล"
              placeholder="example@email.com"
              type="email"
              {...form.register('personalInfo.email')}
              error={errors.personalInfo?.email?.message}
            />

            <MobileInput
              label="เลขบัตรประชาชน"
              placeholder="1234567890123"
              {...form.register('personalInfo.idCard')}
              error={errors.personalInfo?.idCard?.message}
            />

            <MobileInput
              label="วันเกิด"
              type="date"
              {...form.register('personalInfo.birthDate')}
              error={errors.personalInfo?.birthDate?.message}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ข้อมูลที่อยู่
            </h3>

            <MobileInput
              label="ที่อยู่ปัจจุบัน"
              placeholder="กรอกที่อยู่"
              {...form.register('addressInfo.currentAddress')}
              error={errors.addressInfo?.currentAddress?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  จังหวัด
                </Label>
                <Select onValueChange={(value) => setValue('addressInfo.province', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกจังหวัด" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.addressInfo?.province && (
                  <p className="text-red-500 text-sm mt-1">{errors.addressInfo.province.message}</p>
                )}
              </div>

              <MobileInput
                label="อำเภอ"
                placeholder="กรอกอำเภอ"
                {...form.register('addressInfo.district')}
                error={errors.addressInfo?.district?.message}
              />
            </div>

            <MobileInput
              label="รหัสไปรษณีย์"
              placeholder="10110"
              {...form.register('addressInfo.postalCode')}
              error={errors.addressInfo?.postalCode?.message}
            />

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                ประเภทที่อยู่อาศัย
              </Label>
              <RadioGroup
                value={watch('addressInfo.residenceType')}
                onValueChange={(value) =>
                  setValue(
                    'addressInfo.residenceType',
                    value as CreditCheckFormData['addressInfo']['residenceType'],
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owned" id="owned" />
                  <Label htmlFor="owned">เป็นเจ้าของ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rented" id="rented" />
                  <Label htmlFor="rented">เช่า</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family">อยู่กับครอบครัว</Label>
                </div>
              </RadioGroup>
            </div>

            <MobileInput
              label="ระยะเวลาอยู่อาศัย (เดือน)"
              type="number"
              placeholder="12"
              {...form.register('addressInfo.residenceDuration', { valueAsNumber: true })}
              error={errors.addressInfo?.residenceDuration?.message}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ข้อมูลการทำงาน
            </h3>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                อาชีพ
              </Label>
              <Select onValueChange={(value) => setValue('employmentInfo.occupation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกอาชีพ" />
                </SelectTrigger>
                <SelectContent>
                  {occupations.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      {occupation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employmentInfo?.occupation && (
                <p className="text-red-500 text-sm mt-1">{errors.employmentInfo.occupation.message}</p>
              )}
            </div>

            <MobileInput
              label="ชื่อบริษัท/องค์กร"
              placeholder="กรอกชื่อบริษัท"
              {...form.register('employmentInfo.company')}
              error={errors.employmentInfo?.company?.message}
            />

            <MobileInput
              label="ระยะเวลาทำงาน (เดือน)"
              type="number"
              placeholder="12"
              {...form.register('employmentInfo.workDuration', { valueAsNumber: true })}
              error={errors.employmentInfo?.workDuration?.message}
            />

            <MobileInput
              label="รายได้ต่อเดือน (บาท)"
              type="number"
              placeholder="25000"
              {...form.register('employmentInfo.monthlyIncome', { valueAsNumber: true })}
              error={errors.employmentInfo?.monthlyIncome?.message}
            />

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                แหล่งรายได้หลัก
              </Label>
              <RadioGroup
                value={watch('employmentInfo.incomeSource')}
                onValueChange={(value) =>
                  setValue(
                    'employmentInfo.incomeSource',
                    value as CreditCheckFormData['employmentInfo']['incomeSource'],
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="salary" id="salary" />
                  <Label htmlFor="salary">เงินเดือน</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">ธุรกิจส่วนตัว</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelance" id="freelance" />
                  <Label htmlFor="freelance">ฟรีแลนซ์</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">อื่นๆ</Label>
                </div>
              </RadioGroup>
            </div>

            <MobileInput
              label="รายได้เพิ่มเติม (บาท)"
              type="number"
              placeholder="0"
              {...form.register('employmentInfo.additionalIncome', { valueAsNumber: true })}
              error={errors.employmentInfo?.additionalIncome?.message}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ข้อมูลทางการเงิน
            </h3>

            <MobileInput
              label="ค่าใช้จ่ายต่อเดือน (บาท)"
              type="number"
              placeholder="15000"
              {...form.register('financialInfo.monthlyExpenses', { valueAsNumber: true })}
              error={errors.financialInfo?.monthlyExpenses?.message}
            />

            <MobileInput
              label="ยอดหนี้คงเหลือ (บาท)"
              type="number"
              placeholder="0"
              {...form.register('financialInfo.existingLoans', { valueAsNumber: true })}
              error={errors.financialInfo?.existingLoans?.message}
            />

            <MobileInput
              label="จำนวนบัตรเครดิต"
              type="number"
              placeholder="0"
              {...form.register('financialInfo.creditCards', { valueAsNumber: true })}
              error={errors.financialInfo?.creditCards?.message}
            />

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                บัญชีธนาคาร
              </Label>
              {bankAccounts.map((account, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="กรอกหมายเลขบัญชี"
                    value={account}
                    onChange={(e) => updateBankAccount(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  {bankAccounts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBankAccount(index)}
                    >
                      ลบ
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBankAccount}
                className="w-full"
              >
                เพิ่มบัญชีธนาคาร
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ข้อมูลรถที่ต้องการผ่อน
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <MobileInput
                label="ยี่ห้อ"
                placeholder="Honda"
                {...form.register('vehicleInfo.brand')}
                error={errors.vehicleInfo?.brand?.message}
              />
              <MobileInput
                label="รุ่น"
                placeholder="Wave 125"
                {...form.register('vehicleInfo.model')}
                error={errors.vehicleInfo?.model?.message}
              />
            </div>

            <MobileInput
              label="ปีที่ผลิต"
              type="number"
              placeholder="2024"
              {...form.register('vehicleInfo.year', { valueAsNumber: true })}
              error={errors.vehicleInfo?.year?.message}
            />

            <MobileInput
              label="ราคารถ (บาท)"
              type="number"
              placeholder="45000"
              {...form.register('vehicleInfo.price', { valueAsNumber: true })}
              error={errors.vehicleInfo?.price?.message}
            />

            <MobileInput
              label="เงินดาวน์ (บาท)"
              type="number"
              placeholder="5000"
              {...form.register('vehicleInfo.downPayment', { valueAsNumber: true })}
              error={errors.vehicleInfo?.downPayment?.message}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <MobileCard className="p-4">
        {renderStep()}
      </MobileCard>

      {/* Step Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          ขั้นตอน {currentStep} จาก 5
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {currentStep < 5 ? (
          <MobileButton
            type="button"
            onClick={nextStep}
            className="w-full"
          >
            ถัดไป
          </MobileButton>
        ) : (
          <MobileButton
            type="submit"
            disabled={creditCheckMutation.isPending}
            className="w-full"
          >
            {creditCheckMutation.isPending ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูล'}
          </MobileButton>
        )}
      </div>

      {onCancel && (
        <MobileButton
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full"
        >
          ยกเลิก
        </MobileButton>
      )}
    </form>
  )
}
