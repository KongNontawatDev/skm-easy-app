# SKM Easy App

แอปพลิเคชันสำหรับการผ่อนชำระรถยนต์ พัฒนาด้วย React + TypeScript + Vite

## 🚀 Features

### หน้าหลัก
- **หน้าหลัก**: แสดงข้อมูลสรุป, สัญญา, เมนูด่วน, โปรโมชั่น
- **Contract Cards Carousel**: แสดงสัญญาแบบ carousel พร้อมรูปรถ
- **Quick Menu**: เมนูด่วน 3 คอลัมน์
- **Promotion Banner**: แบนเนอร์โปรโมชั่น

### ระบบค่างวดรถ
- **ข้อมูลสัญญา** (`/contract`): รายการสัญญาทั้งหมด
- **รายละเอียดสัญญา** (`/contract/:id`): ข้อมูลสัญญาเต็มรูปแบบ
- **ใบแจ้งหนี้** (`/invoice`): รายการใบแจ้งหนี้
- **รายละเอียดใบแจ้งหนี้** (`/invoice/:id`): ข้อมูลใบแจ้งหนี้เต็มรูปแบบ
- **ประวัติการชำระ** (`/receipt`): รายการใบเสร็จ
- **รายละเอียดใบเสร็จ** (`/receipt/:id`): ข้อมูลใบเสร็จเต็มรูปแบบ
- **ชำระค่างวด** (`/installment`): รายการค่างวดที่ต้องชำระ
- **สรุปค่างวด** (`/installment/:id`): ข้อมูลค่างวดเต็มรูปแบบ
- **QR Code ชำระ** (`/installment/:id/qrcode`): หน้าชำระด้วย QR Code

### ระบบแจ้งเตือน
- **แจ้งเตือน** (`/notification`): รายการแจ้งเตือนทั้งหมด
- **รายละเอียดแจ้งเตือน** (`/notification/:id`): ข้อมูลแจ้งเตือนเต็มรูปแบบ

### ระบบโปรไฟล์
- **โปรไฟล์** (`/profile`): ข้อมูลผู้ใช้
- **ตั้งค่า** (`/settings`): ตั้งค่าระบบ
- **ข่าวสาร/บทความ** (`/blog`): รายการบทความ
- **รายละเอียดบทความ** (`/blog/:id`): เนื้อหาบทความ
- **แจ้งปัญหา** (`/ticket`): ฟอร์มแจ้งปัญหา
- **ประวัติการแจ้ง** (`/ticket/history`): รายการปัญหา
- **ติดต่อบริษัท** (`/contact`): ข้อมูลติดต่อ
- **โปรโมชั่น** (`/promotion`): รายการโปรโมชั่น
- **วิธีใช้งาน** (`/guide`): คู่มือการใช้งาน
- **รายละเอียดวิธีใช้งาน** (`/guide/:id`): เนื้อหาคู่มือ
- **คูปองส่วนลด** (`/coupon`): รายการคูปอง
- **รายละเอียดคูปอง** (`/coupon/:id`): ข้อมูลคูปอง
- **QR Code คูปอง** (`/coupon/qrcode`): สแกนคูปอง

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TanStack Router** - Routing
- **TanStack Query** - Data Fetching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **Embla Carousel** - Carousel

### State Management
- **React Context** - Global State
- **TanStack Query** - Server State
- **Local Storage** - Persistence

### Development Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript** - Type Checking

## 📁 Project Structure

```
src/
├── components/          # Shared Components
│   ├── mobile/         # Mobile-specific Components
│   └── shared/         # Reusable Components
├── contexts/           # React Contexts
├── features/           # Feature-based Modules
│   ├── auth/          # Authentication
│   ├── home/          # Home Page
│   ├── contract/      # Contract Management
│   ├── invoice/       # Invoice Management
│   ├── receipt/       # Receipt Management
│   ├── installment/   # Installment Management
│   ├── notification/  # Notification System
│   ├── blog/          # Blog System
│   ├── ticket/        # Ticket System
│   ├── contact/       # Contact System
│   ├── promotion/     # Promotion System
│   ├── guide/         # Guide System
│   ├── coupon/        # Coupon System
│   └── profile/       # Profile System
├── hooks/             # Custom Hooks
├── lib/               # Utilities & Constants
├── routes/            # Route Definitions
├── services/          # API Services
└── styles/            # Global Styles
```

## 🎨 Design System

### Colors
- **Primary**: #EC1B2E (แดง)
- **Secondary**: #C20010 (แดงเข้ม)
- **Success**: #10B981 (เขียว)
- **Warning**: #F59E0B (เหลือง)
- **Error**: #EF4444 (แดง)
- **Info**: #3B82F6 (น้ำเงิน)

### Typography
- **Font Family**: Kanit (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Minimalism & Flat Design**
- **Rounded Corners**: 2xl (16px)
- **Shadows**: Subtle shadows
- **Spacing**: Consistent spacing scale
- **Mobile-First**: Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skm-easy-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Mobile App Features

### PWA Ready
- **Service Worker**: Offline support
- **Manifest**: App-like experience
- **Responsive**: Mobile-first design

### Navigation
- **Bottom Navigation**: 5 main sections
- **Breadcrumbs**: Navigation context
- **Back Button**: Consistent navigation

### User Experience
- **Loading States**: Skeleton loaders
- **Empty States**: Helpful empty states
- **Error Handling**: Graceful error handling
- **Toast Notifications**: User feedback
- **Search & Filter**: Advanced filtering

## 🔧 Development

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Conventional Commits**: Commit messages

### File Naming
- **Components**: PascalCase (e.g., `ContractCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSearch.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `Contract.ts`)

### Component Structure
```typescript
// Component file structure
interface ComponentProps {
  // Props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
```

## 📊 Performance

### Optimization
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Optimized images
- **Bundle Analysis**: Bundle size monitoring

### Metrics
- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🧪 Testing

### Test Structure
- **Unit Tests**: Component testing
- **Integration Tests**: Feature testing
- **E2E Tests**: User journey testing

### Test Commands
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=SKM Easy App
VITE_APP_VERSION=1.0.0
```

### Deployment Platforms
- **Vercel**: Recommended
- **Netlify**: Alternative
- **GitHub Pages**: Static hosting

## 📝 API Documentation

### Base URL
```
https://api.example.com
```

### Authentication
```typescript
// Headers
Authorization: Bearer <token>
Content-Type: application/json
```

### Endpoints
- `GET /contracts` - Get contracts
- `POST /contracts` - Create contract
- `GET /invoices` - Get invoices
- `GET /receipts` - Get receipts
- `GET /installments` - Get installments
- `GET /notification` - Get notifications

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React + TypeScript
- **UI/UX Designer**: Mobile-first design
- **Backend Developer**: API development

## 📞 Support

For support, email support@example.com or create an issue in the repository.

---

Made with ❤️ by SKM Team