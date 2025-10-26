# AGENTS.md

## Dev environment tips

### General setup
- Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
- Run `pnpm install --filter <project_name>` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
- Use `pnpm create vite@latest <project_name> -- --template react-ts` to spin up a new React + Vite package with TypeScript checks ready.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

### MongoDB best practices
- Always use connection pooling with proper `maxPoolSize` and `minPoolSize` configuration.
- Enable `retryWrites: true` and `retryReads: true` for automatic retry logic.
- Use indexes strategically: create them for frequently queried fields and compound indexes for multi-field queries.
- Always validate schemas using Mongoose schemas or MongoDB JSON Schema validation.
- Use projection to retrieve only necessary fields: `db.collection.find({}, { field1: 1, field2: 1 })`.
- Implement proper error handling for connection failures and query timeouts.
- Use transactions for operations that need ACID guarantees across multiple documents.
- Monitor slow queries with MongoDB profiler and optimize them.
- Set appropriate TTL indexes for time-sensitive data.

### Redis best practices
- Configure connection pool with `maxRetriesPerRequest` and proper timeout settings.
- Use Redis key naming conventions: `<namespace>:<entity>:<id>` (e.g., `user:profile:123`).
- Set expiration times (TTL) on all cache keys to prevent unbounded growth.
- Use Redis pipelines for bulk operations to reduce network round trips.
- Implement proper error handling and fallback mechanisms when Redis is unavailable.
- Use Redis transactions (MULTI/EXEC) for atomic operations on multiple keys.
- Monitor memory usage and configure `maxmemory` policy appropriately (e.g., `allkeys-lru`).
- Use Redis pub/sub for real-time messaging but be aware it's not persistent.
- Leverage Redis data structures: use hashes for objects, sets for unique values, sorted sets for rankings.

### PostgreSQL best practices
- Always use connection pooling (pg-pool or similar) with appropriate pool size limits.
- Use prepared statements or parameterized queries to prevent SQL injection.
- Create indexes on foreign keys and frequently queried columns.
- Use transactions for operations that require atomicity across multiple queries.
- Implement proper error handling for constraint violations and connection errors.
- Use database migrations (e.g., TypeORM, Prisma, or node-pg-migrate) to manage schema changes.
- Enable query logging in development to identify slow queries.
- Use `EXPLAIN ANALYZE` to understand and optimize query performance.
- Normalize data properly but denormalize strategically for read-heavy operations.
- Set appropriate `statement_timeout` and `idle_in_transaction_session_timeout`.

### RabbitMQ best practices
- Always confirm message publication with publisher confirms for critical messages.
- Use acknowledgments (ack/nack) properly to ensure messages are processed correctly.
- Implement prefetch limits to prevent consumers from being overwhelmed.
- Set appropriate message TTL and dead letter exchanges for failed messages.
- Use durable queues and persistent messages for important data.
- Implement idempotent message handlers to handle duplicate deliveries.
- Monitor queue depth and implement backpressure mechanisms.
- Use topic or headers exchanges for flexible routing patterns.
- Implement proper error handling and retry logic with exponential backoff.
- Close channels and connections gracefully on application shutdown.

### Node.js best practices
- Use async/await instead of callbacks for cleaner asynchronous code.
- Implement proper error handling with try-catch blocks and error middleware.
- Use environment variables for configuration (never hardcode secrets).
- Leverage streams for handling large files or data to avoid memory issues.
- Use clustering or PM2 for production deployments to utilize multiple CPU cores.
- Implement graceful shutdown to close database connections and finish pending requests.
- Use logging libraries (Winston, Pino) instead of console.log.
- Monitor event loop lag and memory usage in production.
- Keep dependencies updated and audit them regularly with `npm audit` or `pnpm audit`.
- Use ESLint and Prettier for consistent code formatting.

**Error handling patterns:**
```typescript
// ✅ Good: Centralized error handling
// middleware/error.middleware.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message
      }
    })
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: err.message
      }
    })
  }
  
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred"
    }
  })
}

// Usage in routes
app.use("/api", routes)
app.use(errorHandler)
```

**Async error wrapper:**
```typescript
// ✅ Good: Async error wrapper to avoid try-catch in every route
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Usage
app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)
  res.json({ success: true, data: user })
}))
```

**Graceful shutdown:**
```typescript
// ✅ Good: Handle shutdown signals
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server")
  
  server.close(() => {
    console.log("HTTP server closed")
  })
  
  await database.close()
  await redisClient.quit()
  
  process.exit(0)
})
```

### TypeScript best practices
- Enable strict mode in tsconfig.json (`"strict": true`).
- Define explicit return types for functions to catch errors early.
- Use interfaces for object shapes and types for unions/primitives.
- Leverage utility types (Partial, Pick, Omit, Record) to avoid repetition.
- Use enums sparingly; prefer union types for better type safety.
- Avoid `any` type; use `unknown` when type is truly unknown and narrow it down.
- Use discriminated unions for handling different response types.
- Organize types in separate files or directories for better maintainability.
- Use path aliases in tsconfig to avoid relative import hell.
- Run type checking as part of CI/CD pipeline.

**Additional TypeScript standards:**
- Follow functional programming principles where possible.
- Prefer immutable data: use `const`, `readonly`, and `as const`.
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators.
- Prefer `type` for unions and primitives, `interface` for object shapes that may be extended.
- Use generics for reusable, type-safe functions and components.
- Avoid type assertions (`as`) unless absolutely necessary; prefer type guards.
- Use `satisfies` operator (TS 4.9+) to validate types without widening.
- Never use `@ts-ignore`; use `@ts-expect-error` with explanation if needed.

**Type organization:**
```typescript
// ✅ Good: Organized types
// types/user.types.ts
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type UserId = string
export type UserRole = "admin" | "user" | "guest"
export type CreateUserDto = Omit<User, "id">
export type UpdateUserDto = Partial<Pick<User, "firstName" | "lastName">>

// ❌ Avoid: Mixing concerns
// user-service.ts with all types inline
```

**Utility types examples:**
```typescript
// Use built-in utility types
type PartialUser = Partial<User>              // All props optional
type ReadonlyUser = Readonly<User>            // All props readonly
type UserName = Pick<User, "firstName" | "lastName">
type UserWithoutEmail = Omit<User, "email">
type UserRecord = Record<string, User>        // { [key: string]: User }

// Combine utilities
type CreateUserRequest = Omit<User, "id" | "createdAt">
type UserResponse = Pick<User, "id" | "firstName" | "email"> & { 
  fullName: string 
}
```

**Type guards:**
```typescript
// ✅ Good: Type guards for narrowing
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj
  )
}

function assertUser(obj: unknown): asserts obj is User {
  if (!isUser(obj)) {
    throw new Error("Not a valid user")
  }
}

// Usage
const data: unknown = fetchData()
if (isUser(data)) {
  console.log(data.email) // TypeScript knows it's User
}
```

**Discriminated unions:**
```typescript
// ✅ Good: Type-safe result handling
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.data  // TypeScript knows data exists
  } else {
    throw new Error(result.error)  // TypeScript knows error exists
  }
}
```

**Const assertions and immutability:**
```typescript
// ✅ Good: Const assertions for type safety
const ROUTES = {
  HOME: "/",
  USERS: "/users",
  PROFILE: "/profile"
} as const

type Route = typeof ROUTES[keyof typeof ROUTES]

// Readonly arrays
const items = [1, 2, 3] as const  // readonly [1, 2, 3]

// Readonly objects
interface Config {
  readonly apiUrl: string
  readonly timeout: number
}
```

### Angular best practices
- Use standalone components (Angular 14+) for better tree-shaking and modularity.
- Implement lazy loading for feature modules to improve initial load time.
- Use OnPush change detection strategy for better performance.
- Unsubscribe from observables in ngOnDestroy or use async pipe to prevent memory leaks.
- Use trackBy with ngFor to optimize list rendering.
- Organize code by feature rather than by type (components, services, etc.).
- Use smart/container components for logic and dumb/presentational components for UI.
- Implement proper error handling with HttpInterceptors.
- Use Angular signals (Angular 16+) for reactive state management.
- Follow the official Angular style guide for consistent code structure.

### React best practices
- Use functional components with hooks over class components.
- Follow the rules of hooks: only call at top level, only in React functions.
- Use custom hooks to extract and reuse component logic.
- Implement proper key props in lists (avoid using index as key).
- Use React.memo for expensive components to prevent unnecessary re-renders.
- Leverage useCallback and useMemo to optimize performance (but don't over-optimize).
- Keep components small and focused (single responsibility).
- Use composition over prop drilling; consider Context API for deeply nested props.
- Handle errors with Error Boundaries.
- Use TypeScript for type safety in props and state.

**Component structure:**
```typescript
// ✅ Good: Well-structured component
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUpdate 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { data: user } = useUserData(userId)
  
  const handleSave = useCallback(async (data: UpdateUserDto) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await userService.updateUser(userId, data)
      onUpdate?.(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [userId, onUpdate])
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!user) return null
  
  return <div>{/* Component JSX */}</div>
}
```

**Custom hooks:**
```typescript
// ✅ Good: Reusable custom hook
function useUserData(userId: string) {
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    let cancelled = false
    
    const fetchUser = async () => {
      try {
        setLoading(true)
        const user = await userService.getUserById(userId)
        if (!cancelled) setData(user)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    
    fetchUser()
    
    return () => { cancelled = true }
  }, [userId])
  
  return { data, loading, error }
}
```

## Frontend security best practices

### Cookies security

**Always use secure cookie flags:**

```typescript
// ✅ Good: Secure cookie configuration
// Backend (Node.js/Express)
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',  // Don't use default names like 'connect.sid'
  cookie: {
    httpOnly: true,    // Prevents XSS attacks (JavaScript can't access)
    secure: true,      // Only sent over HTTPS
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 3600000,   // 1 hour
    domain: '.example.com', // Restrict to domain
    path: '/'
  },
  resave: false,
  saveUninitialized: false
}))

// Setting authentication cookie
res.cookie('authToken', token, {
  httpOnly: true,     // CRITICAL: Prevents XSS
  secure: true,       // CRITICAL: HTTPS only
  sameSite: 'strict', // CRITICAL: Prevents CSRF
  maxAge: 86400000,   // 24 hours
  path: '/'
})

// ❌ Bad: Insecure cookies
res.cookie('authToken', token)  // No security flags
res.cookie('authToken', token, {
  httpOnly: false,    // JavaScript can steal token
  secure: false,      // Can be sent over HTTP (insecure)
  sameSite: 'none'    // Vulnerable to CSRF
})
```

**Cookie flags explained:**

```typescript
/**
 * httpOnly: true
 * - Prevents JavaScript from accessing the cookie via document.cookie
 * - Protects against XSS (Cross-Site Scripting) attacks
 * - Server-only access
 * - MUST BE TRUE for authentication tokens
 */

/**
 * secure: true
 * - Cookie only sent over HTTPS connections
 * - Prevents man-in-the-middle attacks
 * - MUST BE TRUE in production
 * - Can be false in local development (http://localhost)
 */

/**
 * sameSite: 'strict' | 'lax' | 'none'
 * - 'strict': Cookie never sent in cross-site requests (most secure)
 * - 'lax': Cookie sent in top-level navigation (GET requests)
 * - 'none': Cookie sent in all cross-site requests (requires secure: true)
 * - Prevents CSRF (Cross-Site Request Forgery) attacks
 * - Use 'strict' for authentication, 'lax' for general use
 */

/**
 * maxAge: number (milliseconds)
 * - Cookie expiration time
 * - Short expiration for sensitive data
 * - Consider refresh token pattern for long sessions
 */

/**
 * domain: string
 * - Restricts cookie to specific domain
 * - '.example.com' allows subdomains
 * - 'example.com' restricts to exact domain
 */

/**
 * path: string
 * - Restricts cookie to specific URL path
 * - '/' makes it available to entire site
 * - '/admin' restricts to admin routes only
 */
```

### XSS (Cross-Site Scripting) Prevention

```typescript
// ✅ Good: Sanitize user input
import DOMPurify from 'dompurify'

// React component
function UserComment({ comment }: { comment: string }) {
  // Sanitize HTML before rendering
  const sanitized = DOMPurify.sanitize(comment, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}

// ❌ Bad: Direct HTML injection
function UserComment({ comment }: { comment: string }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />
  // Allows: <script>alert('XSS')</script>
}

// ✅ Good: Escape user input by default (React does this automatically)
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>  {/* Automatically escaped */}
      <p>{user.bio}</p>
    </div>
  )
}

// ✅ Good: Validate and sanitize on backend too
app.post('/api/comments', (req, res) => {
  const { comment } = req.body
  
  // Server-side validation
  if (!comment || comment.length > 1000) {
    return res.status(400).json({ error: 'Invalid comment' })
  }
  
  // Sanitize
  const sanitized = DOMPurify.sanitize(comment)
  
  // Save sanitized version
  await db.comments.create({ text: sanitized })
})
```

### CSRF (Cross-Site Request Forgery) Prevention

```typescript
// ✅ Good: CSRF token implementation
// Backend
import csrf from 'csurf'

const csrfProtection = csrf({ cookie: true })

app.get('/api/form', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

app.post('/api/submit', csrfProtection, (req, res) => {
  // CSRF token automatically validated
  // Process request
})

// Frontend (React)
function PaymentForm() {
  const [csrfToken, setCsrfToken] = useState('')
  
  useEffect(() => {
    // Fetch CSRF token
    fetch('/api/form')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
  }, [])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken  // Include token
      },
      body: JSON.stringify({ amount: 100 })
    })
  }
  
  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}

// ✅ Good: SameSite cookies (simpler alternative)
res.cookie('authToken', token, {
  sameSite: 'strict',  // Prevents CSRF without tokens
  httpOnly: true,
  secure: true
})
```

### Content Security Policy (CSP)

```typescript
// ✅ Good: CSP headers
// Backend
import helmet from 'helmet'

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}))

// ✅ Good: Meta tag in HTML
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' https://cdn.example.com" />
```

### Local Storage vs Session Storage vs Cookies

```typescript
// ❌ NEVER store sensitive data in localStorage or sessionStorage
// They are accessible via JavaScript (XSS vulnerable)
localStorage.setItem('authToken', token)  // DON'T DO THIS
sessionStorage.setItem('userId', id)      // DON'T DO THIS

// ✅ Good: Use localStorage for non-sensitive data only
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'en')
localStorage.setItem('lastVisited', new Date().toISOString())

// ✅ Good: Use httpOnly cookies for authentication
// Set on backend only
res.cookie('authToken', token, {
  httpOnly: true,  // JavaScript cannot access
  secure: true,
  sameSite: 'strict'
})

// ✅ Good: Use sessionStorage for temporary UI state
sessionStorage.setItem('currentStep', '2')
sessionStorage.setItem('formData', JSON.stringify(formData))
```

### Authentication best practices

```typescript
// ✅ Good: JWT in httpOnly cookie
// Backend
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  
  const user = await authenticateUser(email, password)
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  
  // Set in httpOnly cookie
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000  // 1 hour
  })
  
  // Don't send token in response body
  res.json({ success: true, user: { id: user.id, email: user.email } })
})

// ✅ Good: Auto-send cookie with requests (Frontend)
// Cookies are automatically sent with every request to same domain
fetch('/api/user/profile', {
  credentials: 'include'  // Include cookies in request
})

// ✅ Good: Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })
  res.json({ success: true })
})

// ❌ Bad: Token in localStorage
// Frontend
localStorage.setItem('authToken', token)  // XSS vulnerable

fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
```

### Additional security headers

```typescript
// ✅ Good: Use helmet for security headers
import helmet from 'helmet'

app.use(helmet())  // Sets multiple security headers:

// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=15552000; includeSubDomains

// Custom headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Enable HTTPS only
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  next()
})
```

### Input validation

```typescript
// ✅ Good: Validate all inputs
import validator from 'validator'

function validateUserInput(data: any) {
  const errors: string[] = []
  
  // Email validation
  if (!validator.isEmail(data.email)) {
    errors.push('Invalid email format')
  }
  
  // Password strength
  if (!validator.isStrongPassword(data.password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    errors.push('Password not strong enough')
  }
  
  // Sanitize strings
  data.name = validator.escape(data.name)
  data.bio = validator.escape(data.bio)
  
  return { isValid: errors.length === 0, errors }
}

// ✅ Good: Backend validation (never trust client)
app.post('/api/users', (req, res) => {
  const { isValid, errors } = validateUserInput(req.body)
  
  if (!isValid) {
    return res.status(400).json({ errors })
  }
  
  // Process valid data
})
```

### Security checklist

**Cookies:**
- [ ] Use `httpOnly: true` for authentication cookies
- [ ] Use `secure: true` in production (HTTPS only)
- [ ] Use `sameSite: 'strict'` or `'lax'` to prevent CSRF
- [ ] Set appropriate `maxAge` (short expiration for sensitive data)
- [ ] Use custom cookie names (not defaults)

**XSS Prevention:**
- [ ] Sanitize user input with DOMPurify
- [ ] Use React/Vue/Angular default escaping (don't bypass)
- [ ] Validate input on backend
- [ ] Use Content Security Policy headers
- [ ] Never use `eval()` or `Function()` with user input

**CSRF Prevention:**
- [ ] Use CSRF tokens for state-changing operations
- [ ] Use `sameSite` cookie attribute
- [ ] Validate `Origin` and `Referer` headers
- [ ] Require authentication for sensitive operations

**Authentication:**
- [ ] Store tokens in httpOnly cookies (NOT localStorage)
- [ ] Implement token expiration and refresh
- [ ] Use HTTPS in production
- [ ] Hash passwords with bcrypt/argon2
- [ ] Implement rate limiting for login attempts

**General:**
- [ ] Use helmet for security headers
- [ ] Validate and sanitize all inputs (client and server)
- [ ] Keep dependencies updated
- [ ] Use HTTPS everywhere
- [ ] Implement proper error handling (don't leak information)
- [ ] Use environment variables for secrets
- [ ] Regular security audits

## OWASP Top 10 security practices

Follow OWASP (Open Web Application Security Project) guidelines to prevent the most critical security risks.

### 1. Broken Access Control

**Problem:** Users can access resources they shouldn't.

```typescript
// ❌ Bad: Insecure direct object reference
app.get('/api/orders/:orderId', async (req, res) => {
  const order = await db.orders.findById(req.params.orderId)
  res.json(order)  // Any user can access any order
})

// ✅ Good: Verify ownership
app.get('/api/orders/:orderId', authenticateUser, async (req, res) => {
  const order = await db.orders.findById(req.params.orderId)
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' })
  }
  
  // Check if user owns this order or is admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  
  res.json(order)
})

// ✅ Good: Role-based access control
function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    next()
  }
}

// Usage
app.delete('/api/users/:id', requireRole('admin'), async (req, res) => {
  // Only admins can delete users
})

app.get('/api/reports', requireRole('admin', 'manager'), async (req, res) => {
  // Admins and managers can view reports
})
```

### 2. Cryptographic Failures

**Problem:** Sensitive data exposed due to weak or missing encryption.

```typescript
// ❌ Bad: Storing passwords in plain text
await db.users.create({
  email: 'user@example.com',
  password: 'password123'  // Plain text!
})

// ✅ Good: Hash passwords with bcrypt
import bcrypt from 'bcrypt'

async function createUser(email: string, password: string) {
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  
  await db.users.create({
    email,
    password: hashedPassword
  })
}

async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// ✅ Good: Encrypt sensitive data at rest
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY  // 32 bytes
const IV_LENGTH = 16

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(text: string): string {
  const parts = text.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encryptedText = parts[1]
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Store credit card securely
const encryptedCard = encrypt(creditCardNumber)
await db.payments.create({ cardNumber: encryptedCard })

// ✅ Good: Use HTTPS everywhere
// In production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`)
    }
    next()
  })
}
```

### 3. Injection (SQL, NoSQL, Command)

**Problem:** Untrusted data sent to interpreter as part of command.

```typescript
// ❌ Bad: SQL Injection vulnerable
app.get('/api/users', async (req, res) => {
  const { email } = req.query
  const query = `SELECT * FROM users WHERE email = '${email}'`
  const users = await db.query(query)
  // Attacker can send: email=' OR '1'='1
})

// ✅ Good: Parameterized queries
app.get('/api/users', async (req, res) => {
  const { email } = req.query
  const users = await db.query('SELECT * FROM users WHERE email = ?', [email])
  res.json(users)
})

// ✅ Good: ORM with proper escaping
app.get('/api/users', async (req, res) => {
  const { email } = req.query
  const users = await User.findAll({ where: { email } })  // Sequelize
  res.json(users)
})

// ❌ Bad: NoSQL Injection (MongoDB)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
  // Attacker can send: { "email": {"$ne": null}, "password": {"$ne": null} }
})

// ✅ Good: Validate and sanitize input
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  
  // Validate types
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' })
  }
  
  const user = await User.findOne({ email })
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  // Success
})

// ❌ Bad: Command Injection
import { exec } from 'child_process'

app.post('/api/convert', (req, res) => {
  const { filename } = req.body
  exec(`convert ${filename} output.pdf`, (error, stdout) => {
    // Attacker can send: filename='; rm -rf / #'
  })
})

// ✅ Good: Use libraries, validate input, avoid shell execution
import sharp from 'sharp'

app.post('/api/convert', async (req, res) => {
  const { filename } = req.body
  
  // Validate filename
  if (!/^[a-zA-Z0-9_-]+\.(jpg|png|jpeg)$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' })
  }
  
  // Use library instead of shell command
  await sharp(filename).toFormat('pdf').toFile('output.pdf')
})
```

### 4. Insecure Design

**Problem:** Missing or ineffective security controls by design.

```typescript
// ✅ Good: Rate limiting to prevent brute force
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
})

app.post('/api/login', loginLimiter, async (req, res) => {
  // Login logic
})

// ✅ Good: Account lockout after failed attempts
async function handleLogin(email: string, password: string) {
  const user = await User.findOne({ email })
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' }
  }
  
  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutes = Math.ceil((user.lockUntil - Date.now()) / 60000)
    return { success: false, error: `Account locked for ${minutes} minutes` }
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    user.failedLoginAttempts += 1
    
    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000  // 30 minutes
    }
    
    await user.save()
    return { success: false, error: 'Invalid credentials' }
  }
  
  // Reset failed attempts on successful login
  user.failedLoginAttempts = 0
  user.lockUntil = null
  await user.save()
  
  return { success: true, user }
}

// ✅ Good: Implement proper session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,  // 1 hour
    sameSite: 'strict'
  },
  rolling: true  // Reset expiration on activity
}))
```

### 5. Security Misconfiguration

**Problem:** Insecure default configurations, incomplete setups.

```typescript
// ❌ Bad: Verbose error messages in production
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack  // Exposes internal details!
  })
})

// ✅ Good: Generic errors in production, detailed in development
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error'  // Generic message
    })
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    })
  }
})

// ✅ Good: Disable unnecessary features
app.disable('x-powered-by')  // Don't expose Express

// ✅ Good: CORS configuration
import cors from 'cors'

// ❌ Bad: Allow all origins
app.use(cors())

// ✅ Good: Whitelist specific origins
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ✅ Good: Security headers with helmet
import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))
```

### 6. Vulnerable and Outdated Components

**Problem:** Using libraries with known vulnerabilities.

```typescript
// ✅ Good: Regular dependency audits
// Run these commands regularly:
// npm audit
// npm audit fix
// npm outdated

// package.json - Use specific versions, not ranges
{
  "dependencies": {
    "express": "4.18.2",      // ✅ Specific version
    "bcrypt": "^5.1.0"        // ❌ Could auto-update to vulnerable version
  }
}

// ✅ Good: Automated dependency scanning
// Use tools like:
// - Dependabot (GitHub)
// - Snyk
// - npm audit
// - OWASP Dependency-Check

// ✅ Good: Remove unused dependencies
// Regularly review and remove packages you don't use
npm uninstall unused-package

// ✅ Good: Check vulnerability databases
// Before adding new dependencies, check:
// - NPM Advisory Database
// - Snyk Vulnerability Database
// - GitHub Security Advisories
```

### 7. Identification and Authentication Failures

**Problem:** Weak authentication implementation.

```typescript
// ✅ Good: Strong password requirements
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number')
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special character')
  }
  
  return { valid: errors.length === 0, errors }
}

// ✅ Good: Implement MFA (Multi-Factor Authentication)
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

async function setupMFA(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `MyApp (${userId})`
  })
  
  await db.users.update(userId, {
    mfaSecret: secret.base32
  })
  
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url)
  
  return { secret: secret.base32, qrCode: qrCodeUrl }
}

async function verifyMFA(userId: string, token: string): Promise<boolean> {
  const user = await db.users.findById(userId)
  
  return speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token,
    window: 2  // Allow 2 time steps variance
  })
}

// ✅ Good: Secure password reset flow
import crypto from 'crypto'

async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email })
  
  if (!user) {
    // Don't reveal if email exists
    return { success: true }
  }
  
  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  
  user.resetPasswordToken = hashedToken
  user.resetPasswordExpires = Date.now() + 3600000  // 1 hour
  await user.save()
  
  // Send email with token
  await sendEmail(email, `Reset link: https://example.com/reset/${resetToken}`)
  
  return { success: true }
}

async function resetPassword(token: string, newPassword: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  })
  
  if (!user) {
    throw new Error('Invalid or expired token')
  }
  
  user.password = await bcrypt.hash(newPassword, 12)
  user.resetPasswordToken = null
  user.resetPasswordExpires = null
  await user.save()
}
```

### 8. Software and Data Integrity Failures

**Problem:** Code or infrastructure without integrity verification.

```typescript
// ✅ Good: Verify file uploads
import crypto from 'crypto'

async function verifyFileIntegrity(file: Buffer, expectedHash: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(file).digest('hex')
  return hash === expectedHash
}

// ✅ Good: Sign and verify JWTs
import jwt from 'jsonwebtoken'

function createToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  })
}

function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// ✅ Good: Use Subresource Integrity (SRI) for CDN scripts
// In HTML
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>

// ✅ Good: Verify dependencies with lock files
// Use package-lock.json (npm) or yarn.lock
// Commit lock files to version control
```

### 9. Security Logging and Monitoring Failures

**Problem:** Insufficient logging and monitoring.

```typescript
// ✅ Good: Comprehensive logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// Log authentication events
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  
  try {
    const user = await authenticateUser(email, password)
    
    logger.info('Login successful', {
      userId: user.id,
      email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    })
    
    res.json({ success: true })
  } catch (error) {
    logger.warn('Login failed', {
      email,
      ip: req.ip,
      reason: error.message,
      timestamp: new Date().toISOString()
    })
    
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// ✅ Good: Log security events
function logSecurityEvent(event: string, details: object) {
  logger.warn('Security event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  })
}

// Usage
logSecurityEvent('SUSPICIOUS_ACTIVITY', {
  userId: user.id,
  action: 'multiple_failed_logins',
  attempts: 10,
  ip: req.ip
})

// ✅ Good: Monitor for anomalies
async function detectAnomalies(userId: string) {
  const recentLogins = await getRecentLogins(userId, 24)  // Last 24 hours
  
  // Check for login from new location
  const uniqueIPs = new Set(recentLogins.map(l => l.ip))
  if (uniqueIPs.size > 5) {
    logSecurityEvent('MULTIPLE_LOCATIONS', {
      userId,
      ipCount: uniqueIPs.size,
      ips: Array.from(uniqueIPs)
    })
  }
  
  // Check for rapid login attempts
  const loginIntervals = recentLogins.map((l, i, arr) => 
    i > 0 ? l.timestamp - arr[i-1].timestamp : 0
  )
  
  if (loginIntervals.some(interval => interval < 1000)) {  // < 1 second
    logSecurityEvent('RAPID_LOGIN_ATTEMPTS', { userId })
  }
}
```

### 10. Server-Side Request Forgery (SSRF)

**Problem:** Server fetches remote resources without validation.

```typescript
// ❌ Bad: SSRF vulnerable
app.post('/api/fetch', async (req, res) => {
  const { url } = req.body
  const response = await fetch(url)  // Can access internal services!
  res.send(response.data)
})

// ✅ Good: Validate and whitelist URLs
app.post('/api/fetch', async (req, res) => {
  const { url } = req.body
  
  // Validate URL format
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' })
  }
  
  // Whitelist allowed domains
  const allowedDomains = ['api.example.com', 'cdn.example.com']
  if (!allowedDomains.includes(parsedUrl.hostname)) {
    return res.status(400).json({ error: 'Domain not allowed' })
  }
  
  // Blacklist private IP ranges
  const hostname = parsedUrl.hostname
  if (
    hostname === 'localhost' ||
    hostname.startsWith('127.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.16.')
  ) {
    return res.status(400).json({ error: 'Private IPs not allowed' })
  }
  
  // Only allow HTTPS
  if (parsedUrl.protocol !== 'https:') {
    return res.status(400).json({ error: 'Only HTTPS allowed' })
  }
  
  const response = await fetch(url)
  res.send(response.data)
})
```

### OWASP Security Checklist

**Access Control:**
- [ ] Implement proper authorization checks
- [ ] Use role-based access control (RBAC)
- [ ] Validate ownership of resources
- [ ] Deny by default

**Cryptography:**
- [ ] Use bcrypt/argon2 for password hashing
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS everywhere
- [ ] Secure key management

**Injection Prevention:**
- [ ] Use parameterized queries
- [ ] Validate and sanitize all inputs
- [ ] Use ORMs properly
- [ ] Avoid shell command execution

**Security Design:**
- [ ] Implement rate limiting
- [ ] Account lockout after failed attempts
- [ ] Secure session management
- [ ] Principle of least privilege

**Configuration:**
- [ ] Remove default accounts
- [ ] Disable unnecessary features
- [ ] Configure CORS properly
- [ ] Use security headers (helmet)

**Dependencies:**
- [ ] Regular security audits (npm audit)
- [ ] Keep dependencies updated
- [ ] Remove unused packages
- [ ] Use lock files

**Authentication:**
- [ ] Strong password requirements
- [ ] Implement MFA
- [ ] Secure password reset flow
- [ ] Session timeout

**Logging:**
- [ ] Log authentication events
- [ ] Log security events
- [ ] Monitor for anomalies
- [ ] Protect log files

**References:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

## Testing instructions

### Running tests
- Find the CI plan in the .github/workflows folder.
- Run `npm test` (or `pnpm turbo run test --filter <project_name>` / `yarn test`) to run every check defined for that package.
- The commit should pass all tests before you merge.
- **Jest commands:**
  - `npm test` - Run all tests
  - `npm test -- --watch` - Run tests in watch mode
  - `npm test -- --coverage` - Run tests with coverage report
  - `npm test -- -t "<test name>"` - Run specific test by name
  - `npm test -- <file-path>` - Run tests in specific file
  - `npm test -- --detectOpenHandles` - Debug hanging tests
- **With other package managers:**
  - pnpm: `pnpm test`, `pnpm test -- --watch`, etc.
  - yarn: `yarn test`, `yarn test --watch`, etc.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `npm run lint` (or `pnpm lint --filter <project_name>` / `yarn lint`) to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

### Testing strategies
- **Jest configuration:**
  - Configure `jest.config.js` with appropriate test environment (node/jsdom).
  - Use `setupFilesAfterEnv` for global test setup.
  - Set `collectCoverageFrom` to track coverage on relevant files only.
  - Use `testMatch` or `testRegex` to define test file patterns.
- Write unit tests for pure functions and business logic.
- Write integration tests for API endpoints and database interactions.
- Mock external dependencies (databases, APIs) in unit tests using `jest.mock()`.
- Test error scenarios and edge cases, not just happy paths.
- Use test fixtures and factories to create consistent test data.
- Keep test coverage above 80% for critical business logic.
- Run tests in CI/CD before merging any PR.
- Use `beforeEach`/`afterEach` for proper test isolation.
- Use `describe` blocks to organize related tests.
- Use descriptive test names: `it('should return 404 when user is not found', ...)`.

### Jest best practices
- Use `jest.spyOn()` instead of manual mocking when possible.
- Clear mocks between tests with `jest.clearAllMocks()` in `afterEach`.
- Use `expect.assertions(n)` to ensure async tests run all expectations.
- Prefer `toEqual()` for object/array comparison, `toBe()` for primitives.
- Use snapshot testing sparingly and review snapshot changes carefully.
- Mock timers with `jest.useFakeTimers()` for time-dependent code.
- Test async code with async/await instead of callbacks.
- Use `beforeAll`/`afterAll` for expensive setup (like DB connections).

## PR instructions

### Commit conventions
Follow **Conventional Commits** format: `<type>[scope]: <description>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting (no code change)
- `refactor`: Code restructuring (no behavior change)
- `perf`: Performance improvement
- `test`: Add/update tests
- `chore`: Dependencies, maintenance
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**
```bash
feat(auth): add Google login
fix(api): resolve timeout on large requests
docs: update installation instructions
refactor(utils): simplify email validation
```

**Commit rules:**
- One commit = one purpose (atomic commits)
- Use imperative mood: "add" not "added"
- Keep first line under 50 characters
- Never commit broken code or failing tests
- Review your changes before committing: `git diff` and `git diff --staged`
- Use `git add -p` for selective staging

### Pull request workflow
- Title format: `[<project_name>] <type>: <description>`
- **Before committing:** Always run `npm run lint` and `npm test` (or `pnpm`/`yarn` equivalents)
- Keep PRs small and focused on a single feature or fix
- Include tests for new features and bug fixes
- Update documentation if behavior changes
- Request reviews from at least one team member
- Address all review comments before merging
- Squash commits if the history is messy
- Delete branch after merging

### Pre-commit checklist
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Reviewed diff with `git diff` and `git diff --staged`
- [ ] Removed console.logs and debuggers
- [ ] Code follows project conventions
- [ ] Complex changes are documented
- [ ] No unnecessary files included
- [ ] `.gitignore` configured properly (no node_modules, .env, dist/, etc.)

## Git workflow

### Branching strategy
```
main/master     → Production code (protected)
  ↓
develop         → Integration branch
  ↓
feature/descriptive-name
hotfix/critical-bug
release/v1.2.0
```

### Daily workflow
```bash
# 1. Create feature branch
git checkout -b feature/descriptive-name

# 2. Make small, atomic commits
git add -p  # Interactive staging (recommended)
git commit -m "feat(module): add input validation"

# 3. Keep branch updated
git fetch origin
git rebase origin/develop

# 4. Push and create PR
git push origin feature/descriptive-name
```

### Commit anti-patterns to avoid
- ❌ "WIP" commits - commit complete changes only
- ❌ Giant commits - break into smaller units
- ❌ `git push --force` on shared branches
- ❌ Mixing formatting with logic changes
- ❌ Vague messages: "fix", "changes", "update"
- ❌ Committing broken code or failing tests

### Recommended tools
- **Commitizen**: `npm install -g commitizen` then use `git cz` instead of `git commit`
- **Husky + lint-staged**: Pre-commit hooks for linting and formatting
- **Commitlint**: Enforce commit message conventions

## Common npm scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix auto-fixable lint errors
- `npm run type-check` - Run TypeScript compiler check
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

**Alternative package managers:**
- Replace `npm run` with `pnpm` or `yarn` accordingly
- Examples: `pnpm dev`, `yarn build`, `pnpm lint`, etc.

## Design principles priority

Apply these principles in order of priority. When principles conflict, follow this hierarchy:

### 1. **Correctness & Security** (Highest Priority)
- Code must work correctly and be secure
- Never sacrifice correctness for performance or elegance
- Validate inputs, sanitize outputs, handle edge cases
- No hardcoded secrets, proper authentication/authorization

### 2. **Readability & Maintainability**
Code is read 10x more than written. Prioritize clarity over cleverness.

**Clear Naming:**
```typescript
// ✅ Good: Self-documenting
function calculateTotalPriceWithTax(items: CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return subtotal * (1 + taxRate)
}

// ❌ Bad: Unclear names
function calc(i: any[], r: number): number {
  const s = i.reduce((a, b) => a + b.p * b.q, 0)
  return s * (1 + r)
}
```

**Small, Focused Functions:**
```typescript
// ✅ Good: Single responsibility
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): boolean {
  return password.length >= 8
}

function validateUserInput(email: string, password: string): ValidationResult {
  const errors: string[] = []
  
  if (!validateEmail(email)) {
    errors.push("Invalid email format")
  }
  
  if (!validatePassword(password)) {
    errors.push("Password must be at least 8 characters")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// ❌ Bad: Doing too much
function validateAndCreateUser(email: string, password: string, name: string): User | null {
  // Validation logic
  // Password hashing
  // Database insertion
  // Email sending
  // All in one function (100+ lines)
}
```

### 3. **Early Return Pattern**
Reduce nesting, improve readability.

```typescript
// ✅ Good: Early returns
function processUser(user: User | null): string {
  if (!user) {
    return "User not found"
  }
  
  if (!user.isActive) {
    return "User is inactive"
  }
  
  if (!user.email) {
    return "User has no email"
  }
  
  // Main logic here with minimal nesting
  return sendEmail(user.email)
}

// ❌ Bad: Nested conditionals
function processUser(user: User | null): string {
  if (user) {
    if (user.isActive) {
      if (user.email) {
        return sendEmail(user.email)
      } else {
        return "User has no email"
      }
    } else {
      return "User is inactive"
    }
  } else {
    return "User not found"
  }
}
```

### 4. **DRY (Don't Repeat Yourself)**
Eliminate duplication, but don't over-abstract prematurely.

```typescript
// ✅ Good: Extracted common logic
function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount)
}

function displayProductPrice(product: Product): string {
  return `${product.name}: ${formatCurrency(product.price)}`
}

function displayOrderTotal(order: Order): string {
  return `Total: ${formatCurrency(order.total)}`
}

// ❌ Bad: Repeated formatting logic
function displayProductPrice(product: Product): string {
  return `${product.name}: ${product.price.toFixed(2)}`
}

function displayOrderTotal(order: Order): string {
  return `Total: ${order.total.toFixed(2)}`
}
```

**Warning**: Don't abstract too early. Wait until you have 3+ similar cases before extracting.

### 5. **SOLID Principles**

**S - Single Responsibility Principle:**
```typescript
// ✅ Good: Each class has one reason to change
class UserRepository {
  async findById(id: string): Promise<User> {
    // Database access only
  }
}

class UserService {
  constructor(private repository: UserRepository) {}
  
  async getUser(id: string): Promise<User> {
    // Business logic only
    return this.repository.findById(id)
  }
}

class UserController {
  constructor(private service: UserService) {}
  
  async handleGetUser(req: Request, res: Response): Promise<void> {
    // HTTP handling only
    const user = await this.service.getUser(req.params.id)
    res.json(user)
  }
}

// ❌ Bad: God class doing everything
class UserManager {
  async getUser(req: Request, res: Response): Promise<void> {
    // Database access
    // Business logic
    // HTTP handling
    // Email sending
    // Logging
    // All in one class
  }
}
```

**O - Open/Closed Principle:**
```typescript
// ✅ Good: Open for extension, closed for modification
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>
}

class StripePaymentProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    // Stripe implementation
  }
}

class PayPalPaymentProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    // PayPal implementation
  }
}

class PaymentService {
  constructor(private processor: PaymentProcessor) {}
  
  async processPayment(amount: number): Promise<PaymentResult> {
    return this.processor.process(amount)
  }
}

// ❌ Bad: Modifying existing code for new features
class PaymentService {
  async processPayment(amount: number, method: string): Promise<PaymentResult> {
    if (method === "stripe") {
      // Stripe logic
    } else if (method === "paypal") {
      // PayPal logic
    } else if (method === "bitcoin") {
      // Need to modify this function for each new method
    }
  }
}
```

**L - Liskov Substitution Principle:**
```typescript
// ✅ Good: Subtypes can replace base types
class Bird {
  eat(): void {
    console.log("Eating...")
  }
}

class FlyingBird extends Bird {
  fly(): void {
    console.log("Flying...")
  }
}

class Penguin extends Bird {
  swim(): void {
    console.log("Swimming...")
  }
}

// ❌ Bad: Penguin can't fly, breaks LSP
class Bird {
  fly(): void {
    console.log("Flying...")
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!")
  }
}
```

**I - Interface Segregation Principle:**
```typescript
// ✅ Good: Small, focused interfaces
interface Readable {
  read(): string
}

interface Writable {
  write(data: string): void
}

interface Deletable {
  delete(): void
}

class File implements Readable, Writable, Deletable {
  read(): string { /* ... */ }
  write(data: string): void { /* ... */ }
  delete(): void { /* ... */ }
}

class ReadOnlyFile implements Readable {
  read(): string { /* ... */ }
  // No need to implement write/delete
}

// ❌ Bad: Fat interface
interface FileOperations {
  read(): string
  write(data: string): void
  delete(): void
  compress(): void
  encrypt(): void
}

class ReadOnlyFile implements FileOperations {
  read(): string { /* ... */ }
  write(): void { throw new Error("Not supported") }
  delete(): void { throw new Error("Not supported") }
  compress(): void { throw new Error("Not supported") }
  encrypt(): void { throw new Error("Not supported") }
}
```

**D - Dependency Inversion Principle:**
```typescript
// ✅ Good: Depend on abstractions
interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>
}

class SendGridEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // SendGrid implementation
  }
}

class UserService {
  constructor(private emailService: IEmailService) {}
  
  async registerUser(user: User): Promise<void> {
    // Save user
    await this.emailService.send(user.email, "Welcome", "Welcome to our platform")
  }
}

// ❌ Bad: Depend on concrete implementations
class UserService {
  private emailService = new SendGridEmailService()
  
  async registerUser(user: User): Promise<void> {
    // Tightly coupled to SendGrid
    await this.emailService.send(user.email, "Welcome", "Welcome")
  }
}
```

### Dependency Injection with InversifyJS

**Why use InversifyJS:**
- Enforces SOLID principles (especially Dependency Inversion)
- Makes testing easier with mock/stub injection
- Centralized dependency configuration
- Automatic dependency resolution
- Better separation of concerns

**Setup:**
```typescript
// types.ts - Define injection tokens
export const TYPES = {
  UserRepository: Symbol.for("UserRepository"),
  EmailService: Symbol.for("EmailService"),
  PaymentService: Symbol.for("PaymentService"),
  Logger: Symbol.for("Logger"),
  Cache: Symbol.for("Cache")
}

// interfaces.ts - Define contracts
export interface IUserRepository {
  findById(id: string): Promise<User>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}

export interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>
}

export interface ILogger {
  info(message: string): void
  error(message: string, error?: Error): void
}
```

**Implementation:**
```typescript
// implementations/user.repository.ts
import { injectable } from "inversify"
import { IUserRepository } from "../interfaces"

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User> {
    // Database implementation
  }
  
  async save(user: User): Promise<void> {
    // Database implementation
  }
  
  async delete(id: string): Promise<void> {
    // Database implementation
  }
}

// implementations/email.service.ts
import { injectable } from "inversify"
import { IEmailService } from "../interfaces"

@injectable()
export class SendGridEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // SendGrid implementation
  }
}

// services/user.service.ts
import { injectable, inject } from "inversify"
import { TYPES } from "../types"
import { IUserRepository, IEmailService, ILogger } from "../interfaces"

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.EmailService) private emailService: IEmailService,
    @inject(TYPES.Logger) private logger: ILogger
  ) {}
  
  async registerUser(user: User): Promise<void> {
    this.logger.info(`Registering user: ${user.email}`)
    
    await this.userRepository.save(user)
    await this.emailService.send(
      user.email,
      "Welcome",
      "Welcome to our platform"
    )
    
    this.logger.info(`User registered: ${user.id}`)
  }
  
  async getUser(id: string): Promise<User> {
    return this.userRepository.findById(id)
  }
}
```

**Container configuration:**
```typescript
// inversify.config.ts
import { Container } from "inversify"
import { TYPES } from "./types"
import {
  IUserRepository,
  IEmailService,
  ILogger,
  ICache
} from "./interfaces"
import {
  UserRepository,
  SendGridEmailService,
  WinstonLogger,
  RedisCache
} from "./implementations"
import { UserService, OrderService } from "./services"

const container = new Container()

// Bind interfaces to implementations
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<IEmailService>(TYPES.EmailService).to(SendGridEmailService)
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope()
container.bind<ICache>(TYPES.Cache).to(RedisCache).inSingletonScope()

// Bind services
container.bind<UserService>(UserService).toSelf()
container.bind<OrderService>(OrderService).toSelf()

export { container }
```

**Usage in Express:**
```typescript
// controllers/user.controller.ts
import { injectable, inject } from "inversify"
import { Request, Response } from "express"
import { UserService } from "../services/user.service"

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}
  
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUser(req.params.id)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(404).json({ success: false, error: error.message })
    }
  }
  
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.registerUser(req.body)
      res.status(201).json({ success: true })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}

// routes/user.routes.ts
import { Router } from "express"
import { container } from "../inversify.config"
import { UserController } from "../controllers/user.controller"

const router = Router()
const userController = container.get(UserController)

router.get("/users/:id", (req, res) => userController.getUser(req, res))
router.post("/users", (req, res) => userController.registerUser(req, res))

export { router }
```

**Testing with InversifyJS:**
```typescript
// user.service.test.ts
import { Container } from "inversify"
import { TYPES } from "../types"
import { UserService } from "../services/user.service"
import { IUserRepository, IEmailService, ILogger } from "../interfaces"

describe("UserService", () => {
  let container: Container
  let userService: UserService
  let mockRepository: jest.Mocked<IUserRepository>
  let mockEmailService: jest.Mocked<IEmailService>
  let mockLogger: jest.Mocked<ILogger>
  
  beforeEach(() => {
    // Create test container
    container = new Container()
    
    // Create mocks
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    }
    
    mockEmailService = {
      send: jest.fn()
    }
    
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    }
    
    // Bind mocks to container
    container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(mockRepository)
    container.bind<IEmailService>(TYPES.EmailService).toConstantValue(mockEmailService)
    container.bind<ILogger>(TYPES.Logger).toConstantValue(mockLogger)
    container.bind<UserService>(UserService).toSelf()
    
    // Get service instance
    userService = container.get(UserService)
  })
  
  it("should register user and send welcome email", async () => {
    const user: User = {
      id: "123",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe"
    }
    
    await userService.registerUser(user)
    
    expect(mockRepository.save).toHaveBeenCalledWith(user)
    expect(mockEmailService.send).toHaveBeenCalledWith(
      user.email,
      "Welcome",
      "Welcome to our platform"
    )
    expect(mockLogger.info).toHaveBeenCalledTimes(2)
  })
})
```

**Scopes in InversifyJS:**
```typescript
// Transient (default): New instance every time
container.bind<IEmailService>(TYPES.EmailService).to(SendGridEmailService)

// Singleton: Single instance shared across application
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger).inSingletonScope()

// Request: Single instance per request (useful in web apps)
container.bind<ICache>(TYPES.Cache).to(RedisCache).inRequestScope()
```

**Factory pattern with InversifyJS:**
```typescript
// Factory for creating multiple payment processors
container.bind<interfaces.Factory<IPaymentProcessor>>(TYPES.PaymentProcessorFactory)
  .toFactory<IPaymentProcessor>((context: interfaces.Context) => {
    return (type: string) => {
      if (type === "stripe") {
        return context.container.get<IPaymentProcessor>(TYPES.StripePaymentProcessor)
      } else if (type === "paypal") {
        return context.container.get<IPaymentProcessor>(TYPES.PayPalPaymentProcessor)
      }
      throw new Error(`Unknown payment processor: ${type}`)
    }
  })

// Usage
@injectable()
export class PaymentService {
  constructor(
    @inject(TYPES.PaymentProcessorFactory) 
    private paymentProcessorFactory: (type: string) => IPaymentProcessor
  ) {}
  
  async processPayment(type: string, amount: number): Promise<void> {
    const processor = this.paymentProcessorFactory(type)
    await processor.process(amount)
  }
}
```

**Best practices with InversifyJS:**
- Use symbols for injection tokens (avoid magic strings)
- Keep container configuration in one place
- Use interfaces for all dependencies
- Prefer constructor injection over property injection
- Use appropriate scopes (singleton for stateless services)
- Create separate containers for testing
- Document why dependencies are injected

## Design patterns

Apply design patterns when they solve real problems, not for the sake of patterns. Recognize when a pattern fits naturally, but avoid over-engineering.

### Creational patterns

**Factory Pattern** - Create objects without specifying exact classes

When to use:
- Object creation logic is complex
- Need to create different types based on conditions
- Want to centralize object creation

```typescript
// ✅ Good: Factory for creating payment processors
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>
}

class StripePaymentProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    // Stripe implementation
  }
}

class PayPalPaymentProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    // PayPal implementation
  }
}

class CryptoPaymentProcessor implements PaymentProcessor {
  async process(amount: number): Promise<PaymentResult> {
    // Crypto implementation
  }
}

class PaymentProcessorFactory {
  static create(type: string): PaymentProcessor {
    switch (type) {
      case "stripe":
        return new StripePaymentProcessor()
      case "paypal":
        return new PayPalPaymentProcessor()
      case "crypto":
        return new CryptoPaymentProcessor()
      default:
        throw new Error(`Unknown payment processor: ${type}`)
    }
  }
}

// Usage
const processor = PaymentProcessorFactory.create("stripe")
await processor.process(100)

// ❌ Anti-pattern: Factory for everything
class UserFactory {
  static create(name: string): User {
    return new User(name)  // Unnecessary, just use: new User(name)
  }
}
```

**Builder Pattern** - Construct complex objects step by step

When to use:
- Object has many optional parameters
- Construction process has multiple steps
- Want to create different representations

```typescript
// ✅ Good: Builder for complex query
class QueryBuilder {
  private query: string = ""
  private params: any[] = []
  private whereClause: string = ""
  private orderClause: string = ""
  private limitValue: number | null = null
  
  select(table: string, columns: string[] = ["*"]): this {
    this.query = `SELECT ${columns.join(", ")} FROM ${table}`
    return this
  }
  
  where(condition: string, ...params: any[]): this {
    this.whereClause = condition
    this.params.push(...params)
    return this
  }
  
  orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderClause = `ORDER BY ${column} ${direction}`
    return this
  }
  
  limit(count: number): this {
    this.limitValue = count
    return this
  }
  
  build(): { query: string; params: any[] } {
    let fullQuery = this.query
    
    if (this.whereClause) {
      fullQuery += ` WHERE ${this.whereClause}`
    }
    
    if (this.orderClause) {
      fullQuery += ` ${this.orderClause}`
    }
    
    if (this.limitValue) {
      fullQuery += ` LIMIT ${this.limitValue}`
    }
    
    return { query: fullQuery, params: this.params }
  }
}

// Usage
const { query, params } = new QueryBuilder()
  .select("users", ["id", "name", "email"])
  .where("age > ?", 18)
  .orderBy("name", "ASC")
  .limit(10)
  .build()

// ❌ Anti-pattern: Builder for simple objects
class UserBuilder {
  private name: string
  private email: string
  
  setName(name: string): this {
    this.name = name
    return this
  }
  
  setEmail(email: string): this {
    this.email = email
    return this
  }
  
  build(): User {
    return new User(this.name, this.email)
  }
}
// Just use: new User(name, email) or object literal
```

**Singleton Pattern** - Ensure only one instance exists

When to use:
- Need exactly one instance (database connection, config)
- Want global access point
- Control access to shared resource

```typescript
// ✅ Good: Singleton for database connection
class DatabaseConnection {
  private static instance: DatabaseConnection
  private connection: any
  
  private constructor() {
    // Private constructor prevents direct instantiation
  }
  
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
      DatabaseConnection.instance.connect()
    }
    return DatabaseConnection.instance
  }
  
  private connect(): void {
    // Establish database connection
  }
  
  async query(sql: string, params: any[]): Promise<any> {
    // Execute query
  }
}

// Usage
const db = DatabaseConnection.getInstance()
await db.query("SELECT * FROM users WHERE id = ?", [123])

// ❌ Anti-pattern: Singleton for testability issues
class UserService {
  private static instance: UserService
  private repository = new UserRepository()  // Hard to mock
  
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }
  
  // Hard to test, prefer dependency injection
}
```

### Structural patterns

**Decorator Pattern** - Add behavior to objects dynamically

When to use:
- Need to add responsibilities without modifying code
- Want to combine behaviors flexibly
- Inheritance would create too many subclasses

```typescript
// ✅ Good: Decorator for adding features to services
interface NotificationService {
  send(message: string): Promise<void>
}

class BasicNotificationService implements NotificationService {
  async send(message: string): Promise<void> {
    console.log(`Sending notification: ${message}`)
  }
}

// Decorator: Add logging
class LoggingNotificationDecorator implements NotificationService {
  constructor(private wrapped: NotificationService) {}
  
  async send(message: string): Promise<void> {
    console.log(`[LOG] Sending notification at ${new Date().toISOString()}`)
    await this.wrapped.send(message)
    console.log(`[LOG] Notification sent successfully`)
  }
}

// Decorator: Add retry logic
class RetryNotificationDecorator implements NotificationService {
  constructor(
    private wrapped: NotificationService,
    private maxRetries: number = 3
  ) {}
  
  async send(message: string): Promise<void> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.wrapped.send(message)
        return
      } catch (error) {
        if (attempt === this.maxRetries) throw error
        console.log(`Retry attempt ${attempt} failed, retrying...`)
      }
    }
  }
}

// Decorator: Add rate limiting
class RateLimitedNotificationDecorator implements NotificationService {
  private lastSentTime: number = 0
  private minInterval: number = 1000  // 1 second
  
  constructor(private wrapped: NotificationService) {}
  
  async send(message: string): Promise<void> {
    const now = Date.now()
    const timeSinceLastSent = now - this.lastSentTime
    
    if (timeSinceLastSent < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastSent)
      )
    }
    
    await this.wrapped.send(message)
    this.lastSentTime = Date.now()
  }
}

// Usage: Combine decorators
let service: NotificationService = new BasicNotificationService()
service = new LoggingNotificationDecorator(service)
service = new RetryNotificationDecorator(service, 3)
service = new RateLimitedNotificationDecorator(service)

await service.send("Hello, World!")

// ❌ Anti-pattern: Deep decorator chains without clear purpose
let service = new Decorator1(
  new Decorator2(
    new Decorator3(
      new Decorator4(
        new Decorator5(new BasicService())
      )
    )
  )
)  // Too complex, hard to understand
```

**Adapter Pattern** - Make incompatible interfaces work together

When to use:
- Need to use a class with incompatible interface
- Want to create reusable code that works with unrelated classes
- Integrating third-party libraries

```typescript
// ✅ Good: Adapter for third-party payment gateways
interface PaymentGateway {
  processPayment(amount: number, currency: string): Promise<PaymentResult>
}

// Third-party Stripe SDK (different interface)
class StripeSDK {
  async charge(amountInCents: number, options: any): Promise<any> {
    // Stripe implementation
  }
}

// Adapter to match our interface
class StripeAdapter implements PaymentGateway {
  constructor(private stripe: StripeSDK) {}
  
  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    // Convert dollars to cents
    const amountInCents = amount * 100
    
    const result = await this.stripe.charge(amountInCents, {
      currency: currency.toLowerCase()
    })
    
    return {
      success: result.status === "succeeded",
      transactionId: result.id,
      amount
    }
  }
}

// Third-party PayPal SDK (different interface)
class PayPalSDK {
  async createPayment(data: { amount: string; currency: string }): Promise<any> {
    // PayPal implementation
  }
}

// Adapter for PayPal
class PayPalAdapter implements PaymentGateway {
  constructor(private paypal: PayPalSDK) {}
  
  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    const result = await this.paypal.createPayment({
      amount: amount.toFixed(2),
      currency: currency.toUpperCase()
    })
    
    return {
      success: result.state === "approved",
      transactionId: result.id,
      amount
    }
  }
}

// Usage: Same interface for all gateways
async function processOrder(gateway: PaymentGateway, amount: number) {
  const result = await gateway.processPayment(amount, "USD")
  return result
}

const stripeGateway = new StripeAdapter(new StripeSDK())
const paypalGateway = new PayPalAdapter(new PayPalSDK())

await processOrder(stripeGateway, 100)
await processOrder(paypalGateway, 100)
```

**Facade Pattern** - Provide simplified interface to complex subsystem

When to use:
- Complex subsystem with many classes
- Want to reduce dependencies on subsystem
- Need to provide simple API for common tasks

```typescript
// ✅ Good: Facade for complex order processing
class InventoryService {
  checkStock(productId: string, quantity: number): boolean {
    // Check inventory
    return true
  }
  
  reserveStock(productId: string, quantity: number): void {
    // Reserve items
  }
}

class PaymentService {
  processPayment(amount: number, method: string): Promise<PaymentResult> {
    // Process payment
    return Promise.resolve({ success: true })
  }
}

class ShippingService {
  calculateShipping(address: Address): number {
    // Calculate shipping cost
    return 10
  }
  
  createShipment(orderId: string, address: Address): Promise<string> {
    // Create shipment
    return Promise.resolve("SHIP123")
  }
}

class NotificationService {
  sendOrderConfirmation(email: string, orderId: string): Promise<void> {
    // Send email
    return Promise.resolve()
  }
}

// Facade: Simplifies the complex process
class OrderFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private shipping: ShippingService,
    private notification: NotificationService
  ) {}
  
  async placeOrder(order: OrderData): Promise<OrderResult> {
    // 1. Check inventory
    const hasStock = this.inventory.checkStock(
      order.productId,
      order.quantity
    )
    
    if (!hasStock) {
      throw new Error("Product out of stock")
    }
    
    // 2. Calculate total
    const shippingCost = this.shipping.calculateShipping(order.address)
    const total = order.productPrice * order.quantity + shippingCost
    
    // 3. Process payment
    const paymentResult = await this.payment.processPayment(
      total,
      order.paymentMethod
    )
    
    if (!paymentResult.success) {
      throw new Error("Payment failed")
    }
    
    // 4. Reserve inventory
    this.inventory.reserveStock(order.productId, order.quantity)
    
    // 5. Create shipment
    const trackingNumber = await this.shipping.createShipment(
      order.orderId,
      order.address
    )
    
    // 6. Send confirmation
    await this.notification.sendOrderConfirmation(
      order.email,
      order.orderId
    )
    
    return {
      orderId: order.orderId,
      trackingNumber,
      total
    }
  }
}

// Usage: Simple one-line call instead of managing 4 services
const orderFacade = new OrderFacade(
  inventoryService,
  paymentService,
  shippingService,
  notificationService
)

const result = await orderFacade.placeOrder(orderData)
```

### Behavioral patterns

**Strategy Pattern** - Define family of algorithms, make them interchangeable

When to use:
- Have multiple algorithms for a specific task
- Need to switch algorithms at runtime
- Want to eliminate conditional statements

```typescript
// ✅ Good: Strategy for different pricing calculations
interface PricingStrategy {
  calculatePrice(basePrice: number): number
}

class RegularPricingStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice
  }
}

class StudentDiscountStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice * 0.8  // 20% discount
  }
}

class SeniorDiscountStrategy implements PricingStrategy {
  calculatePrice(basePrice: number): number {
    return basePrice * 0.7  // 30% discount
  }
}

class SeasonalDiscountStrategy implements PricingStrategy {
  constructor(private discountPercentage: number) {}
  
  calculatePrice(basePrice: number): number {
    return basePrice * (1 - this.discountPercentage / 100)
  }
}

class PriceCalculator {
  constructor(private strategy: PricingStrategy) {}
  
  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy
  }
  
  calculate(basePrice: number): number {
    return this.strategy.calculatePrice(basePrice)
  }
}

// Usage
const calculator = new PriceCalculator(new RegularPricingStrategy())
console.log(calculator.calculate(100))  // 100

calculator.setStrategy(new StudentDiscountStrategy())
console.log(calculator.calculate(100))  // 80

calculator.setStrategy(new SeasonalDiscountStrategy(15))
console.log(calculator.calculate(100))  // 85

// ❌ Anti-pattern: If-else chains
class PriceCalculator {
  calculate(basePrice: number, customerType: string): number {
    if (customerType === "regular") {
      return basePrice
    } else if (customerType === "student") {
      return basePrice * 0.8
    } else if (customerType === "senior") {
      return basePrice * 0.7
    } else if (customerType === "seasonal") {
      return basePrice * 0.85
    }
    // Adding new customer types requires modifying this function
  }
}
```

**Observer Pattern** - Notify multiple objects about state changes

When to use:
- One object change should trigger updates in others
- Don't know how many objects need updates
- Want loose coupling between objects

```typescript
// ✅ Good: Observer for event system
interface Observer {
  update(data: any): void
}

interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(data: any): void
}

class OrderEventPublisher implements Subject {
  private observers: Observer[] = []
  
  attach(observer: Observer): void {
    this.observers.push(observer)
  }
  
  detach(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer)
  }
  
  notify(data: any): void {
    this.observers.forEach(observer => observer.update(data))
  }
  
  createOrder(order: Order): void {
    // Create order logic
    this.notify({ type: "ORDER_CREATED", order })
  }
}

class EmailNotificationObserver implements Observer {
  update(data: any): void {
    if (data.type === "ORDER_CREATED") {
      console.log(`Sending email for order: ${data.order.id}`)
      // Send email
    }
  }
}

class InventoryObserver implements Observer {
  update(data: any): void {
    if (data.type === "ORDER_CREATED") {
      console.log(`Updating inventory for order: ${data.order.id}`)
      // Update inventory
    }
  }
}

class AnalyticsObserver implements Observer {
  update(data: any): void {
    if (data.type === "ORDER_CREATED") {
      console.log(`Tracking order event: ${data.order.id}`)
      // Send to analytics
    }
  }
}

// Usage
const publisher = new OrderEventPublisher()
publisher.attach(new EmailNotificationObserver())
publisher.attach(new InventoryObserver())
publisher.attach(new AnalyticsObserver())

publisher.createOrder(order)  // All observers notified
```

**Chain of Responsibility** - Pass request through chain of handlers

When to use:
- Multiple objects can handle request
- Handler isn't known in advance
- Want to decouple sender from receiver

```typescript
// ✅ Good: Chain for request validation and processing
interface Handler {
  setNext(handler: Handler): Handler
  handle(request: Request): Response | null
}

abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null
  
  setNext(handler: Handler): Handler {
    this.nextHandler = handler
    return handler
  }
  
  handle(request: Request): Response | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request)
    }
    return null
  }
}

class AuthenticationHandler extends AbstractHandler {
  handle(request: Request): Response | null {
    if (!request.headers.authorization) {
      return { status: 401, message: "Unauthorized" }
    }
    
    // Valid token, pass to next handler
    return super.handle(request)
  }
}

class ValidationHandler extends AbstractHandler {
  handle(request: Request): Response | null {
    if (!request.body || !request.body.email) {
      return { status: 400, message: "Invalid request" }
    }
    
    return super.handle(request)
  }
}

class RateLimitHandler extends AbstractHandler {
  private requests: Map<string, number> = new Map()
  
  handle(request: Request): Response | null {
    const ip = request.ip
    const count = this.requests.get(ip) || 0
    
    if (count > 100) {
      return { status: 429, message: "Too many requests" }
    }
    
    this.requests.set(ip, count + 1)
    return super.handle(request)
  }
}

class ProcessHandler extends AbstractHandler {
  handle(request: Request): Response | null {
    // Actually process the request
    return { status: 200, data: { success: true } }
  }
}

// Usage: Build chain
const auth = new AuthenticationHandler()
const validation = new ValidationHandler()
const rateLimit = new RateLimitHandler()
const process = new ProcessHandler()

auth.setNext(validation).setNext(rateLimit).setNext(process)

// All requests go through the chain
const response = auth.handle(request)
```

**Composite Pattern** - Compose objects into tree structures

When to use:
- Need to represent part-whole hierarchies
- Want to treat individual objects and compositions uniformly
- Building tree-like structures (UI components, file systems, org charts)

```typescript
// ✅ Good: Composite for file system structure
interface FileSystemComponent {
  getName(): string
  getSize(): number
  print(indent: string): void
}

class File implements FileSystemComponent {
  constructor(
    private name: string,
    private size: number
  ) {}
  
  getName(): string {
    return this.name
  }
  
  getSize(): number {
    return this.size
  }
  
  print(indent: string = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.size}KB)`)
  }
}

class Directory implements FileSystemComponent {
  private children: FileSystemComponent[] = []
  
  constructor(private name: string) {}
  
  add(component: FileSystemComponent): void {
    this.children.push(component)
  }
  
  remove(component: FileSystemComponent): void {
    this.children = this.children.filter(child => child !== component)
  }
  
  getName(): string {
    return this.name
  }
  
  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0)
  }
  
  print(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name}`)
    this.children.forEach(child => child.print(indent + "  "))
  }
}

// Usage: Build tree structure
const root = new Directory("root")
const documents = new Directory("documents")
const images = new Directory("images")

documents.add(new File("resume.pdf", 150))
documents.add(new File("cover-letter.pdf", 50))
images.add(new File("photo1.jpg", 2048))
images.add(new File("photo2.jpg", 1856))

root.add(documents)
root.add(images)
root.add(new File("readme.txt", 5))

root.print()
// 📁 root
//   📁 documents
//     📄 resume.pdf (150KB)
//     📄 cover-letter.pdf (50KB)
//   📁 images
//     📄 photo1.jpg (2048KB)
//     📄 photo2.jpg (1856KB)
//   📄 readme.txt (5KB)

console.log(`Total size: ${root.getSize()}KB`)  // 4109KB

// Another example: UI components
interface UIComponent {
  render(): string
  addEventListener(event: string, handler: Function): void
}

class Button implements UIComponent {
  constructor(private text: string) {}
  
  render(): string {
    return `<button>${this.text}</button>`
  }
  
  addEventListener(event: string, handler: Function): void {
    // Add event listener to button
  }
}

class Panel implements UIComponent {
  private children: UIComponent[] = []
  
  add(component: UIComponent): void {
    this.children.push(component)
  }
  
  render(): string {
    const childrenHtml = this.children.map(c => c.render()).join("\n")
    return `<div class="panel">\n${childrenHtml}\n</div>`
  }
  
  addEventListener(event: string, handler: Function): void {
    this.children.forEach(child => child.addEventListener(event, handler))
  }
}

// Usage
const panel = new Panel()
panel.add(new Button("Save"))
panel.add(new Button("Cancel"))
panel.add(new Button("Delete"))

console.log(panel.render())
// <div class="panel">
//   <button>Save</button>
//   <button>Cancel</button>
//   <button>Delete</button>
// </div>
```

**Proxy Pattern** - Provide surrogate or placeholder for another object

When to use:
- Control access to an object
- Add lazy initialization
- Implement caching, logging, or validation
- Remote objects (API calls)

```typescript
// ✅ Good: Proxy for lazy loading and caching
interface ImageService {
  display(imageId: string): Promise<void>
}

class RealImageService implements ImageService {
  private cache: Map<string, Buffer> = new Map()
  
  async display(imageId: string): Promise<void> {
    console.log(`Loading image ${imageId} from disk...`)
    // Simulate expensive operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    const imageData = Buffer.from("image-data")
    console.log(`Displaying image ${imageId}`)
  }
}

class ImageServiceProxy implements ImageService {
  private realService: RealImageService | null = null
  private cache: Map<string, boolean> = new Map()
  
  async display(imageId: string): Promise<void> {
    // Lazy initialization
    if (!this.realService) {
      console.log("Initializing real image service...")
      this.realService = new RealImageService()
    }
    
    // Check cache
    if (this.cache.has(imageId)) {
      console.log(`Using cached image ${imageId}`)
      return
    }
    
    // Load and cache
    await this.realService.display(imageId)
    this.cache.set(imageId, true)
  }
}

// Usage
const imageService = new ImageServiceProxy()
await imageService.display("img1")  // Loads from disk
await imageService.display("img1")  // Uses cache
await imageService.display("img2")  // Loads from disk

// Protection Proxy: Access control
interface BankAccount {
  withdraw(amount: number): void
  deposit(amount: number): void
  getBalance(): number
}

class RealBankAccount implements BankAccount {
  constructor(private balance: number = 0) {}
  
  withdraw(amount: number): void {
    this.balance -= amount
  }
  
  deposit(amount: number): void {
    this.balance += amount
  }
  
  getBalance(): number {
    return this.balance
  }
}

class BankAccountProxy implements BankAccount {
  constructor(
    private realAccount: RealBankAccount,
    private userRole: string
  ) {}
  
  withdraw(amount: number): void {
    if (this.userRole !== "owner") {
      throw new Error("Only owner can withdraw")
    }
    this.realAccount.withdraw(amount)
  }
  
  deposit(amount: number): void {
    // Anyone can deposit
    this.realAccount.deposit(amount)
  }
  
  getBalance(): number {
    if (this.userRole !== "owner" && this.userRole !== "accountant") {
      throw new Error("Insufficient permissions to view balance")
    }
    return this.realAccount.getBalance()
  }
}

// Usage
const account = new RealBankAccount(1000)
const ownerProxy = new BankAccountProxy(account, "owner")
const guestProxy = new BankAccountProxy(account, "guest")

ownerProxy.withdraw(100)  // OK
guestProxy.deposit(50)     // OK
guestProxy.withdraw(50)    // Error: Only owner can withdraw

// Virtual Proxy: Expensive object creation
interface ExpensiveReport {
  generate(): Promise<string>
}

class RealExpensiveReport implements ExpensiveReport {
  constructor(private data: any[]) {
    console.log("Creating expensive report object...")
  }
  
  async generate(): Promise<string> {
    console.log("Generating report (expensive operation)...")
    await new Promise(resolve => setTimeout(resolve, 2000))
    return "Report content"
  }
}

class ReportProxy implements ExpensiveReport {
  private realReport: RealExpensiveReport | null = null
  private cachedResult: string | null = null
  
  constructor(private data: any[]) {}
  
  async generate(): Promise<string> {
    if (this.cachedResult) {
      console.log("Returning cached report")
      return this.cachedResult
    }
    
    if (!this.realReport) {
      this.realReport = new RealExpensiveReport(this.data)
    }
    
    this.cachedResult = await this.realReport.generate()
    return this.cachedResult
  }
}

// Usage: Report only created when needed
const report = new ReportProxy(bigDataSet)
// RealExpensiveReport not created yet

await report.generate()  // Now it's created and executed
await report.generate()  // Uses cached result
```

**Flyweight Pattern** - Share common state to support large numbers of objects

When to use:
- Need many similar objects
- Objects share common state (intrinsic state)
- Memory usage is critical
- Most object state can be made extrinsic

```typescript
// ✅ Good: Flyweight for rendering thousands of particles
/**
 * Flyweight stores intrinsic state (shared between particles).
 * Particle type, sprite, and color are shared.
 */
class ParticleType {
  constructor(
    public readonly sprite: string,
    public readonly color: string,
    public readonly size: number
  ) {}
  
  render(x: number, y: number): void {
    console.log(
      `Rendering ${this.sprite} at (${x}, ${y}) ` +
      `with color ${this.color} and size ${this.size}`
    )
  }
}

/**
 * Factory manages flyweight objects and ensures reuse.
 */
class ParticleTypeFactory {
  private types: Map<string, ParticleType> = new Map()
  
  getParticleType(
    sprite: string,
    color: string,
    size: number
  ): ParticleType {
    const key = `${sprite}-${color}-${size}`
    
    if (!this.types.has(key)) {
      console.log(`Creating new particle type: ${key}`)
      this.types.set(key, new ParticleType(sprite, color, size))
    }
    
    return this.types.get(key)!
  }
  
  getTotalTypes(): number {
    return this.types.size
  }
}

/**
 * Particle stores extrinsic state (unique to each particle).
 * Position and velocity are unique per particle.
 */
class Particle {
  constructor(
    public x: number,
    public y: number,
    public velocityX: number,
    public velocityY: number,
    private type: ParticleType
  ) {}
  
  update(): void {
    this.x += this.velocityX
    this.y += this.velocityY
  }
  
  render(): void {
    this.type.render(this.x, this.y)
  }
}

class ParticleSystem {
  private particles: Particle[] = []
  private factory = new ParticleTypeFactory()
  
  addParticle(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    sprite: string,
    color: string,
    size: number
  ): void {
    const type = this.factory.getParticleType(sprite, color, size)
    this.particles.push(new Particle(x, y, velocityX, velocityY, type))
  }
  
  update(): void {
    this.particles.forEach(p => p.update())
  }
  
  render(): void {
    this.particles.forEach(p => p.render())
  }
  
  getStats(): void {
    console.log(`Total particles: ${this.particles.length}`)
    console.log(`Unique particle types: ${this.factory.getTotalTypes()}`)
  }
}

// Usage: Create thousands of particles with minimal memory
const system = new ParticleSystem()

// Create 10,000 particles with only 3 unique types
for (let i = 0; i < 10000; i++) {
  const types = [
    { sprite: "star", color: "yellow", size: 5 },
    { sprite: "circle", color: "red", size: 3 },
    { sprite: "square", color: "blue", size: 4 }
  ]
  const type = types[i % 3]
  
  system.addParticle(
    Math.random() * 800,
    Math.random() * 600,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    type.sprite,
    type.color,
    type.size
  )
}

system.getStats()
// Total particles: 10000
// Unique particle types: 3
// Only 3 ParticleType objects in memory instead of 10,000

// Another example: Text editor with character formatting
interface CharacterStyle {
  font: string
  size: number
  color: string
  bold: boolean
  italic: boolean
}

class CharacterStyleFlyweight {
  private styles: Map<string, CharacterStyle> = new Map()
  
  getStyle(
    font: string,
    size: number,
    color: string,
    bold: boolean,
    italic: boolean
  ): CharacterStyle {
    const key = `${font}-${size}-${color}-${bold}-${italic}`
    
    if (!this.styles.has(key)) {
      this.styles.set(key, { font, size, color, bold, italic })
    }
    
    return this.styles.get(key)!
  }
  
  getTotalStyles(): number {
    return this.styles.size
  }
}

class Character {
  constructor(
    public char: string,
    public position: number,
    private style: CharacterStyle
  ) {}
  
  render(): string {
    let output = this.char
    if (this.style.bold) output = `<b>${output}</b>`
    if (this.style.italic) output = `<i>${output}</i>`
    return `<span style="font:${this.style.font};size:${this.style.size}px;color:${this.style.color}">${output}</span>`
  }
}

class TextEditor {
  private characters: Character[] = []
  private styleFactory = new CharacterStyleFlyweight()
  
  insertCharacter(
    char: string,
    position: number,
    font: string,
    size: number,
    color: string,
    bold: boolean,
    italic: boolean
  ): void {
    const style = this.styleFactory.getStyle(font, size, color, bold, italic)
    this.characters.push(new Character(char, position, style))
  }
  
  getStats(): void {
    console.log(`Total characters: ${this.characters.length}`)
    console.log(`Unique styles: ${this.styleFactory.getTotalStyles()}`)
  }
}

// Usage: Large document with few unique styles
const editor = new TextEditor()

// Insert 1000 characters with only 5 different styles
for (let i = 0; i < 1000; i++) {
  const styles = [
    { font: "Arial", size: 12, color: "black", bold: false, italic: false },
    { font: "Arial", size: 12, color: "black", bold: true, italic: false },
    { font: "Arial", size: 14, color: "blue", bold: false, italic: false },
    { font: "Times", size: 12, color: "black", bold: false, italic: true },
    { font: "Courier", size: 10, color: "gray", bold: false, italic: false }
  ]
  const style = styles[i % 5]
  
  editor.insertCharacter("a", i, style.font, style.size, style.color, style.bold, style.italic)
}

editor.getStats()
// Total characters: 1000
// Unique styles: 5
// Massive memory savings: 5 style objects instead of 1000

// ❌ Anti-pattern: Not using Flyweight when needed
class ParticleWithoutFlyweight {
  constructor(
    public x: number,
    public y: number,
    public sprite: string,      // Duplicated across all particles
    public color: string,        // Duplicated across all particles
    public size: number,         // Duplicated across all particles
    public velocityX: number,
    public velocityY: number
  ) {}
}

// Creating 10,000 particles = 10,000 copies of sprite, color, size
// Uses significantly more memory
```

### Pattern selection guide

**When you have:**
- Complex object creation → **Factory** or **Builder**
- Need single instance → **Singleton** (use with caution)
- Incompatible interfaces → **Adapter**
- Add behavior dynamically → **Decorator**
- Complex subsystem → **Facade**
- Tree structures → **Composite**
- Control access/lazy loading → **Proxy**
- Many similar objects → **Flyweight**
- Multiple algorithms → **Strategy**
- Event system → **Observer**
- Request processing pipeline → **Chain of Responsibility**

**Anti-patterns to avoid:**
- Using patterns when simple code would work
- Factory for trivial object creation
- Singleton for everything (prevents testing)
- Deep decorator chains without clear benefit
- Observer with too many subscribers (performance)
- Strategy with only one implementation
- Flyweight for few objects (unnecessary complexity)

### 6. **Law of Demeter (Principle of Least Knowledge)**
Only talk to immediate friends, don't reach through objects.

```typescript
// ✅ Good: Tell, don't ask
class Order {
  private items: OrderItem[]
  
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0)
  }
}

class OrderItem {
  constructor(
    private product: Product,
    private quantity: number
  ) {}
  
  getTotalPrice(): number {
    return this.product.getPrice() * this.quantity
  }
}

// Usage
const total = order.getTotalPrice()

// ❌ Bad: Reaching through objects
const total = order.getItems()
  .reduce((sum, item) => 
    sum + item.getProduct().getPrice() * item.getQuantity(), 0
  )
```

### 7. **YAGNI (You Aren't Gonna Need It)**
Don't build features you don't need yet.

```typescript
// ✅ Good: Implement what's needed now
class UserService {
  async getUser(id: string): Promise<User> {
    return this.repository.findById(id)
  }
}

// ❌ Bad: Speculative generality
class UserService {
  async getUser(
    id: string,
    options?: {
      includeDeleted?: boolean
      includeDrafts?: boolean
      includeArchived?: boolean
      cacheStrategy?: "memory" | "redis" | "none"
      transformers?: Array<(user: User) => User>
      hooks?: {
        beforeFetch?: () => void
        afterFetch?: (user: User) => void
      }
    }
  ): Promise<User> {
    // Complex implementation for features that may never be needed
  }
}
```

### 8. **KISS (Keep It Simple, Stupid)**
Simplicity beats cleverness.

```typescript
// ✅ Good: Simple and clear
function isEven(num: number): boolean {
  return num % 2 === 0
}

// ❌ Bad: Unnecessarily clever
function isEven(num: number): boolean {
  return (num & 1) === 0  // Bitwise operation, harder to read
}
```

### 9. **Composition Over Inheritance**
Prefer composition and interfaces over deep inheritance hierarchies.

```typescript
// ✅ Good: Composition
interface Logger {
  log(message: string): void
}

interface Cache {
  get(key: string): any
  set(key: string, value: any): void
}

class UserService {
  constructor(
    private repository: UserRepository,
    private logger: Logger,
    private cache: Cache
  ) {}
  
  async getUser(id: string): Promise<User> {
    const cached = this.cache.get(id)
    if (cached) {
      this.logger.log(`Cache hit for user ${id}`)
      return cached
    }
    
    const user = await this.repository.findById(id)
    this.cache.set(id, user)
    return user
  }
}

// ❌ Bad: Deep inheritance
class BaseService {
  protected logger: Logger
}

class CachedService extends BaseService {
  protected cache: Cache
}

class LoggedCachedService extends CachedService {
  // Now we're stuck with this hierarchy
}
```

### Principle Priority Summary

1. **Correctness** - Must work and be secure
2. **Readability** - Clear names, small functions
3. **Early Return** - Reduce nesting
4. **DRY** - Eliminate duplication (but don't over-abstract)
5. **SOLID** - Good architecture
6. **Law of Demeter** - Minimal coupling
7. **YAGNI** - Don't over-engineer
8. **KISS** - Keep it simple
9. **Composition** - Flexible design

**When principles conflict:**
- Readability trumps cleverness
- Simplicity trumps flexibility (until you need it)
- Security trumps performance
- Working code trumps perfect code

### Quick reference by language

| Element | JS/TS | Python | Java/C# | SQL | MongoDB |
|---------|-------|--------|---------|-----|---------|
| Variables | camelCase | snake_case | camelCase | snake_case | camelCase |
| Constants | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE | UPPER_SNAKE_CASE |
| Functions | camelCase | snake_case | camelCase | snake_case | camelCase |
| Classes | PascalCase | PascalCase | PascalCase | PascalCase | PascalCase |
| Files | kebab-case | snake_case | PascalCase | snake_case | camelCase |
| DB Tables | - | - | - | snake_case (plural) | camelCase (plural) |

### JavaScript/TypeScript
```javascript
// Variables: camelCase, descriptive
const userName = "Juan"
const userAge = 30
const isActive = true
const totalAmount = 150.50

// Booleans: is, has, can, should prefixes
const isLoading = false
const hasPermission = true
const canEdit = false
const shouldUpdate = true

// Arrays: plural
const users = []
const productCategories = []

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = "https://api.example.com"
const DEFAULT_TIMEOUT = 5000

// Functions: camelCase, verb first
function calculateTotalPrice(items) { }
function getUserById(id) { }
function validateEmailAddress(email) { }
function isValidPassword(password) { }

// Event handlers: handle/on prefix
function handleClick(event) { }
function handleSubmit(event) { }
function onSuccess(data) { }
function onError(error) { }

// Classes: PascalCase
class UserService { }
class PaymentProcessor { }
class ValidationError extends Error { }

// Files: kebab-case or PascalCase (for components)
user-service.js
email-validator.js
UserProfile.jsx  // React components
ShoppingCart.tsx

// TypeScript interfaces: PascalCase
interface User { }
interface UserRepository { }

// TypeScript types
type UserId = string
type UserRole = "admin" | "user" | "guest"
```

### Python
```python
# Variables: snake_case
user_name = "Juan"
user_age = 30
is_active = True
total_amount = 150.50

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_ATTEMPTS = 3
API_BASE_URL = "https://api.example.com"

# Functions: snake_case, verb first
def calculate_total_price(items):
    pass

def get_user_by_id(user_id):
    pass

def is_valid_password(password):
    pass

# Classes: PascalCase
class UserService:
    pass

class PaymentProcessor:
    pass

# Files: snake_case
user_service.py
email_validator.py
test_user_service.py
```

### SQL/PostgreSQL
```sql
-- Tables: snake_case, plural
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    email_address VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
    profile_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id)
);

-- Indexes: idx_table_column
CREATE INDEX idx_users_email ON users(email_address);
CREATE INDEX idx_users_active_created ON users(is_active, created_at);

-- Foreign keys: fk_table_column
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id 
    FOREIGN KEY (user_id) REFERENCES users(user_id);

-- Unique constraints: uk_table_column
ALTER TABLE users ADD CONSTRAINT uk_users_email 
    UNIQUE (email_address);

-- Booleans: is_, has_, can_ prefixes
is_active, is_verified, has_permission, can_edit

-- Dates: _at, _date suffixes
created_at, updated_at, deleted_at, birth_date
```

### API conventions
```bash
# Endpoints: kebab-case, plural for collections
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
PATCH  /api/users/{id}
DELETE /api/users/{id}

# Nested resources
GET    /api/users/{id}/orders
POST   /api/users/{id}/orders

# Actions
POST   /api/users/{id}/activate
POST   /api/orders/{id}/cancel

# Filters (query params)
GET    /api/users?status=active&role=admin&sort=created_at
GET    /api/products?category=electronics&min_price=100
```

```json
// JSON responses: camelCase
{
  "success": true,
  "data": {
    "userId": "123",
    "firstName": "Juan",
    "emailAddress": "juan@example.com",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### General rules
- **One convention per project**: Be consistent
- **Descriptive names**: Avoid abbreviations unless widely known
- **Context matters**: Names should make sense in their scope
- **Length balance**: Not too short (x, tmp), not too long (getUserByIdFromDatabaseWithCache)
- **Avoid ambiguity**: Clear purpose over brevity
- **Follow language standards**: camelCase for JS, snake_case for Python, etc.

### Environment variables
```bash
# Always UPPER_SNAKE_CASE
DATABASE_URL=postgres://localhost:5432/mydb
API_BASE_URL=https://api.example.com
JWT_SECRET=secret_key
NODE_ENV=production
PORT=3000
```

### Git branches
```bash
# Use kebab-case with type prefix
feature/user-authentication
feature/payment-integration
bugfix/fix-login-redirect
hotfix/security-vulnerability
release/v1.2.0
chore/update-dependencies
```

## Code review checklist

### For reviewers
- Check that tests cover the new code.
- Verify error handling is implemented properly.
- Ensure no hardcoded credentials or sensitive data.
- Confirm TypeScript types are properly defined.
- Check for potential performance issues.
- Verify database queries are optimized and use indexes.
- Ensure proper cleanup of resources (connections, subscriptions).
- Validate that the code follows project conventions.
- Look for security vulnerabilities (SQL injection, XSS, etc.).
- Confirm logging is appropriate and not excessive.

## Deployment checklist

### Before deploying
- Run full test suite and ensure all tests pass.
- Check for database migrations and run them in staging first.
- Verify environment variables are configured correctly.
- Review recent changes in dependencies for breaking changes.
- Check monitoring and alerting systems are working.
- Prepare rollback plan in case of issues.
- Notify team about deployment window.
- Back up databases if making schema changes.

### After deploying
- Monitor error rates and application logs.
- Check key metrics (response times, throughput, error rates).
- Verify database connections are healthy.
- Test critical user flows in production.
- Monitor queue depths in RabbitMQ.
- Check Redis hit rates and memory usage.
- Confirm all services are responding correctly.
- Document any issues and resolutions.