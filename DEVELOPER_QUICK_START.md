# 🚀 Developer Quick Start - Live Signals

## 📋 Prerequisites

```bash
# Node.js 18+ and npm
node --version  # v18.0.0+
npm --version   # 9.0.0+

# Git
git --version
```

## 🏗️ Setup (5 minutes)

### 1. Run Setup Script

```powershell
# Windows PowerShell
.\setup-live-signals.ps1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Download Sound Files

See `public/sounds/README.md` for links to free sound effects.

### 4. Start Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/signals/     # UI components
├── hooks/                  # Custom React hooks
├── services/              # Business logic
├── utils/                 # Helper functions
└── __tests__/            # Test files

public/sounds/            # Audio files
```

---

## 🎯 Development Workflow

### Phase 1: Core Features (Days 1-3)

```bash
# Create component
touch src/components/signals/LivePatternDisplay.tsx
touch src/components/signals/LivePatternDisplay.scss

# Create tests
touch src/components/signals/__tests__/LivePatternDisplay.test.tsx

# Run tests
npm test LivePatternDisplay

# Check coverage
npm run test:coverage
```

### Phase 2: Entry Signals (Days 4-5)

```bash
# Create service
touch src/services/entry-point-detector.service.ts
touch src/services/__tests__/entry-point-detector.test.ts

# Run tests
npm test entry-point-detector
```

### Phase 3: Auto-Trading (Days 6-8)

```bash
# Create auto-trader
touch src/services/auto-trader.service.ts
touch src/services/__tests__/auto-trader.test.ts

# Integration test
touch src/__tests__/integration/auto-trading.test.tsx
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run specific test
npm test LivePatternDisplay

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration

# Performance tests
npm run test:performance

# E2E tests
npm run test:e2e
```

---

## 🎨 Component Template

```tsx
// src/components/signals/MyComponent.tsx
import React from 'react';
import './MyComponent.scss';

interface MyComponentProps {
    data: any;
    onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
    return <div className='my-component'>{/* Component content */}</div>;
};
```

```scss
// src/components/signals/MyComponent.scss
.my-component {
    background: rgba(15, 23, 42, 0.95);
    border-radius: 16px;
    padding: 20px;
}
```

```tsx
// src/components/signals/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent data={{}} />);
        expect(screen.getByText(/content/i)).toBeInTheDocument();
    });
});
```

---

## 🪝 Hook Template

```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export const useMyHook = (param: string) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Hook logic
    }, [param]);

    return { data };
};
```

```typescript
// src/hooks/__tests__/useMyHook.test.ts
import { renderHook } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
    it('returns data', () => {
        const { result } = renderHook(() => useMyHook('test'));
        expect(result.current.data).toBeDefined();
    });
});
```

---

## 🔧 Service Template

```typescript
// src/services/my-service.service.ts
export class MyService {
    private static instance: MyService;

    private constructor() {}

    public static getInstance(): MyService {
        if (!MyService.instance) {
            MyService.instance = new MyService();
        }
        return MyService.instance;
    }

    public async doSomething(param: string): Promise<any> {
        // Service logic
        return {};
    }
}

export const myService = MyService.getInstance();
```

```typescript
// src/services/__tests__/my-service.test.ts
import { myService } from '../my-service.service';

describe('MyService', () => {
    it('does something', async () => {
        const result = await myService.doSomething('test');
        expect(result).toBeDefined();
    });
});
```

---

## 🎯 Common Tasks

### Add New Feature

```bash
# 1. Create component
touch src/components/signals/NewFeature.tsx
touch src/components/signals/NewFeature.scss

# 2. Create tests
touch src/components/signals/__tests__/NewFeature.test.tsx

# 3. Implement feature
code src/components/signals/NewFeature.tsx

# 4. Write tests
code src/components/signals/__tests__/NewFeature.test.tsx

# 5. Run tests
npm test NewFeature

# 6. Check coverage
npm run test:coverage -- --collectCoverageFrom="src/components/signals/NewFeature.tsx"
```

### Debug WebSocket

```typescript
// Enable debug logging
localStorage.setItem('debug', 'websocket:*');

// In component
useEffect(() => {
    console.log('WebSocket state:', isConnected);
    console.log('Latest tick:', latestTick);
}, [isConnected, latestTick]);
```

### Profile Performance

```typescript
// Use React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
}}>
    <MyComponent />
</Profiler>
```

### Optimize Renders

```typescript
// Use React.memo
export const MyComponent = React.memo(
    ({ data }) => {
        // Component
    },
    (prevProps, nextProps) => {
        return prevProps.data === nextProps.data;
    }
);

// Use useMemo
const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(data);
}, [data]);

// Use useCallback
const handleClick = useCallback(() => {
    doSomething(data);
}, [data]);
```

---

## 🐛 Debugging Tips

### WebSocket Issues

```typescript
// Check connection
console.log('WebSocket state:', connection.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED

// Monitor messages
connection.onmessage = event => {
    console.log('Received:', event.data);
};

// Check errors
connection.onerror = error => {
    console.error('WebSocket error:', error);
};
```

### Performance Issues

```bash
# Use React DevTools Profiler
# Chrome DevTools > Performance tab
# Record interaction
# Look for long tasks (> 50ms)
```

### Memory Leaks

```typescript
// Always cleanup
useEffect(() => {
    const subscription = subscribe();

    return () => {
        subscription.unsubscribe();
    };
}, []);

// Check for leaks
// Chrome DevTools > Memory tab
// Take heap snapshot before/after
```

---

## 📊 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Run Stylelint
npm run stylelint

# Fix CSS issues
npm run stylelint:fix
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Watch mode
npm run type-check:watch
```

### Formatting

```bash
# Format with Prettier
npm run format

# Check formatting
npm run format:check
```

---

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Preview build
npm run preview

# Analyze bundle size
npm run analyze
```

### Environment Variables

```bash
# .env.local
VITE_DERIV_APP_ID=your_app_id
VITE_DERIV_API_URL=wss://ws.derivws.com/websockets/v3
VITE_ENABLE_ANALYTICS=true
```

---

## 📚 Resources

### Documentation

-   [React Docs](https://react.dev/)
-   [TypeScript Docs](https://www.typescriptlang.org/docs/)
-   [Deriv API Docs](https://api.deriv.com/)
-   [Testing Library Docs](https://testing-library.com/)

### Tools

-   [React DevTools](https://react.dev/learn/react-developer-tools)
-   [Redux DevTools](https://github.com/reduxjs/redux-devtools)
-   [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Community

-   [GitHub Issues](https://github.com/your-repo/issues)
-   [Discord Server](https://discord.gg/your-server)
-   [Stack Overflow](https://stackoverflow.com/questions/tagged/react)

---

## 🎓 Learning Path

### Week 1: Core Features

1. Study `useLiveTickData.ts` hook
2. Understand WebSocket connection
3. Learn pattern analysis logic
4. Build simple components

### Week 2: Advanced Features

1. Study prediction algorithms
2. Understand auto-trading logic
3. Learn risk management
4. Build complex features

### Week 3: Testing & Optimization

1. Write comprehensive tests
2. Profile performance
3. Optimize renders
4. Fix bugs

---

## 💡 Pro Tips

1. **Use TypeScript strictly** - Enable `strict: true` in tsconfig.json
2. **Write tests first** - TDD helps catch bugs early
3. **Profile early** - Don't wait for performance issues
4. **Keep components small** - Single responsibility principle
5. **Use custom hooks** - Extract reusable logic
6. **Memoize expensive calculations** - Use useMemo/useCallback
7. **Clean up effects** - Always return cleanup function
8. **Handle errors gracefully** - Use error boundaries
9. **Log important events** - But not too much
10. **Document complex logic** - Future you will thank you

---

## 🆘 Getting Help

### Before Asking

1. Check documentation
2. Search existing issues
3. Read error messages carefully
4. Try debugging yourself

### When Asking

1. Provide minimal reproducible example
2. Include error messages
3. Show what you've tried
4. Be specific about the problem

### Where to Ask

-   GitHub Issues (bugs/features)
-   Discord (quick questions)
-   Stack Overflow (general questions)

---

## ✅ Daily Checklist

-   [ ] Pull latest changes: `git pull`
-   [ ] Install dependencies: `npm install`
-   [ ] Run tests: `npm test`
-   [ ] Check types: `npm run type-check`
-   [ ] Lint code: `npm run lint`
-   [ ] Commit changes: `git commit -m "feat: ..."`
-   [ ] Push to remote: `git push`

---

**Happy coding! 🚀**
