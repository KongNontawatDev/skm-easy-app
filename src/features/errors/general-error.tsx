import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function GeneralError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>เกิดข้อผิดพลาด</CardTitle>
          <CardDescription>
            เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.reload()
            }
          }}>
            ลองใหม่
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}