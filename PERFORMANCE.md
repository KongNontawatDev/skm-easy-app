# Performance Optimization & PWA Guide

## 🚀 Performance Optimizations

### 1. Bundle Optimization
- **Code Splitting**: Automatic code splitting by features and routes
- **Tree Shaking**: Removes unused code from bundles
- **Manual Chunks**: Optimized vendor chunking for better caching
- **SWC Compiler**: Fast compilation with Rust-based SWC

### 2. Caching Strategy
- **API Cache**: 5-minute TTL for API responses
- **Image Cache**: 30-minute TTL for images
- **User Data Cache**: 10-minute TTL for user data
- **Service Worker Cache**: Offline-first caching strategy

### 3. Lazy Loading
- **Route-based**: Lazy loading for all routes
- **Component-based**: Lazy loading for heavy components
- **Image Lazy Loading**: Intersection Observer-based image loading
- **Dynamic Imports**: On-demand loading of modules

### 4. Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Custom Metrics**: Render time, API response time
- **Memory Usage**: Real-time memory monitoring
- **Performance Score**: Color-coded performance indicators

## 📱 PWA Features

### 1. Progressive Web App
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen, standalone mode
- **Push Notifications**: Real-time notifications support

### 2. Service Worker
- **Cache First**: Static assets cached for fast loading
- **Network First**: API calls with cache fallback
- **Background Sync**: Offline actions synced when online
- **Update Management**: Automatic app updates

### 3. Manifest Configuration
```json
{
  "name": "SKM Easy App",
  "short_name": "SKM Easy",
  "description": "แอปพลิเคชันสำหรับการผ่อนชำระรถยนต์",
  "theme_color": "#EC1B2E",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait"
}
```

## 🛠️ Development Tools

### Performance Monitoring
```typescript
import { usePerformanceTracking } from '@/components/performance'

function MyComponent() {
  const { renderTime } = usePerformanceTracking('MyComponent')
  // Component implementation
}
```

### Analytics Tracking
```typescript
import { useAnalytics } from '@/lib/analytics'

function MyComponent() {
  const { trackEvent, trackPageView } = useAnalytics()
  
  const handleClick = () => {
    trackEvent('button_click', { button: 'submit' })
  }
}
```

### Caching
```typescript
import { apiCache, userDataCache } from '@/lib/cache'

// Cache API response
apiCache.set('users', userData)

// Get cached data
const cachedUsers = apiCache.get('users')
```

## 📊 Performance Metrics

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Custom Metrics
- **Render Time**: < 100ms per component
- **API Response Time**: < 1000ms
- **Memory Usage**: < 50MB heap size

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Custom chunking logic
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router']
  }
})
```

### PWA Configuration
```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      // Custom caching strategies
    ]
  }
})
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Real-time performance metrics
- Memory usage tracking
- Render time measurement
- API response time monitoring

### Analytics Events
- Page views
- User interactions
- Feature usage
- Error tracking
- Performance metrics

### Error Tracking
- Global error handling
- API error tracking
- Performance error monitoring
- User experience metrics

## 🚀 Deployment

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Analyze bundle
npm run analyze

# Performance audit
npm run perf:audit
```

### PWA Deployment
1. Build the application: `npm run build`
2. Deploy to HTTPS server
3. Service Worker will auto-register
4. Users can install from browser

## 📱 Mobile Optimization

### Touch Optimization
- Touch-friendly button sizes (44px minimum)
- Swipe gestures support
- Mobile-first responsive design
- Thumb-friendly navigation

### Performance on Mobile
- Optimized images for mobile
- Reduced bundle size
- Efficient caching strategy
- Offline-first approach

## 🔍 Debugging

### Development Tools
- Performance Monitor (dev mode only)
- Bundle Analyzer
- Lighthouse audits
- Chrome DevTools integration

### Common Issues
1. **Slow Initial Load**: Check bundle size and code splitting
2. **Poor Performance**: Monitor Core Web Vitals
3. **Offline Issues**: Check Service Worker registration
4. **Cache Issues**: Clear browser cache and Service Worker

## 📚 Best Practices

### Performance
1. Use lazy loading for non-critical components
2. Optimize images (WebP format, proper sizing)
3. Implement proper caching strategies
4. Monitor Core Web Vitals regularly
5. Use performance budgets

### PWA
1. Always serve over HTTPS
2. Implement proper offline fallbacks
3. Use appropriate caching strategies
4. Test on real devices
5. Monitor installation rates

### Code Organization
1. Feature-based folder structure
2. Consistent naming conventions
3. Proper TypeScript usage
4. Error boundary implementation
5. Performance monitoring integration
