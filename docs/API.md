# AR Compare API Documentation

This document describes the API endpoints available in the AR Compare application.

## Base URL

- **Production**: `https://arcompare.com/api`
- **Development**: `http://localhost:3000/api`

## Authentication

Currently, all API endpoints are public and do not require authentication.

---

## Products API

### GET /api/products

Retrieve a list of all products with optional filtering, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | - | Filter by category (e.g., "Premium", "Budget") |
| `brand` | string | - | Filter by brand (e.g., "Xreal", "Rokid") |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |
| `sortBy` | string | "name" | Sort field: "name", "price", "rating", "releaseDate" |
| `sortOrder` | string | "asc" | Sort direction: "asc" or "desc" |
| `limit` | number | - | Maximum results to return (max: 100) |
| `offset` | number | - | Number of results to skip |

**Response (200 OK):**

```json
{
  "products": [
    {
      "id": "xreal-one-pro",
      "brand": "Xreal",
      "model": "One Pro",
      "fullName": "Xreal One Pro",
      "price": 599,
      "rating": 4.5,
      "category": "Premium",
      "image": "/images/xreal-one-pro.jpg",
      "releaseDate": "2024-01-15",
      "specifications": {
        "display": { "type": "Micro-OLED", "resolution": "1920x1080", ... },
        "design": { "weight": "75g", ... },
        ...
      }
    }
  ],
  "total": 8,
  "count": 8,
  "filters": {
    "category": null,
    "brand": null,
    "minPrice": null,
    "maxPrice": null,
    "sortBy": "name",
    "sortOrder": "asc"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      { "field": "maxPrice", "message": "maxPrice must be >= minPrice" }
    ]
  }
}
```

---

### GET /api/products/[id]

Retrieve a single product by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product ID (e.g., "xreal-one-pro") |

**Response (200 OK):**

```json
{
  "id": "xreal-one-pro",
  "brand": "Xreal",
  "model": "One Pro",
  "fullName": "Xreal One Pro",
  "price": 599,
  "originalPrice": 649,
  "currency": "USD",
  "rating": 4.5,
  "description": "Premium AR glasses with...",
  "specifications": { ... },
  "pros": ["Excellent display quality", "Lightweight"],
  "cons": ["Premium price"],
  "customerInsights": {
    "topPros": [...],
    "topCons": [...],
    "overallSentiment": "Positive"
  },
  "marketContext": {
    "targetAudience": "Tech enthusiasts",
    "useCases": ["Gaming", "Productivity"],
    ...
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### POST /api/products/compare

Compare multiple products side-by-side.

**Request Body:**

```json
{
  "productIds": ["xreal-one-pro", "rokid-ar-spatial"]
}
```

**Validation:**
- Minimum 2 product IDs required
- Maximum 5 product IDs allowed

**Response (200 OK):**

```json
{
  "products": [
    { "id": "xreal-one-pro", ... },
    { "id": "rokid-ar-spatial", ... }
  ],
  "comparison": {
    "specs": {
      "display": {
        "xreal-one-pro": { "type": "Micro-OLED", ... },
        "rokid-ar-spatial": { "type": "Micro-OLED", ... }
      },
      ...
    },
    "pros": {
      "xreal-one-pro": ["..."],
      "rokid-ar-spatial": ["..."]
    },
    "cons": { ... },
    "ratings": {
      "xreal-one-pro": 4.5,
      "rokid-ar-spatial": 4.3
    },
    "prices": {
      "xreal-one-pro": { "current": 599, "original": 649, "currency": "USD" },
      ...
    }
  }
}
```

**Error Responses:**

- `400`: Validation error (too few/many products)
- `404`: One or more products not found

---

## Market Insights API

### GET /api/market/insights

Retrieve market analysis data.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Type of insight (see below) |
| `productId` | string | For some types | Product ID for product-specific analysis |
| `products` | string | For comparison | Comma-separated product IDs |
| `metric` | string | For top-performers | Metric to rank by |
| `count` | number | No | Number of results (default: 5) |

**Insight Types:**

| Type | Description | Required Params |
|------|-------------|-----------------|
| `overview` | Market overview with top performers | - |
| `competitive-matrix` | Competitive scoring matrix | - |
| `market-segments` | Market segment analysis | - |
| `trends` | Market trends | - |
| `buyer-personas` | Buyer persona profiles | - |
| `use-cases` | Use case recommendations | - |
| `product-analysis` | Single product analysis | `productId` |
| `competitive-comparison` | Compare specific products | `products` |
| `top-performers` | Top products by metric | `metric` |

**Example - Market Overview:**

```
GET /api/market/insights?type=overview
```

**Response:**

```json
{
  "success": true,
  "data": {
    "marketInsights": { ... },
    "topPerformers": {
      "displayQuality": [...],
      "valueForMoney": [...],
      "buildQuality": [...],
      "innovation": [...]
    }
  }
}
```

**Example - Product Analysis:**

```
GET /api/market/insights?type=product-analysis&productId=xreal-one-pro
```

**Response:**

```json
{
  "success": true,
  "data": {
    "productId": "xreal-one-pro",
    "marketPosition": { ... },
    "competitiveAdvantages": [...],
    "weaknesses": [...]
  }
}
```

---

### POST /api/market/insights

Get personalized product recommendations.

**Request Body:**

```json
{
  "type": "personalized-recommendation",
  "data": {
    "budget": 500,
    "useCase": "gaming",
    "priorities": ["display-quality", "comfort"]
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "productId": "xreal-one-pro",
    "name": "Xreal One Pro",
    "matchScore": 0.92,
    "reasons": [
      "Best display quality in budget range",
      "Highly rated for gaming use case"
    ]
  }
}
```

---

## Placeholder Images API

### GET /api/placeholder/[width]/[height]

Generate SVG placeholder images.

**Path Parameters:**

| Parameter | Type | Max | Description |
|-----------|------|-----|-------------|
| `width` | number | 2000 | Image width in pixels |
| `height` | number | 2000 | Image height in pixels |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | "AR Compare" | Title text |
| `subtitle` | string | "Compare AR Glasses..." | Subtitle text |
| `bg` | string | "#0f172a" | Background color (hex) |
| `color` | string | "#e2e8f0" | Text color (hex) |
| `accent` | string | "#3b82f6" | Accent color (hex) |

**Response:**

Returns an SVG image with `Content-Type: image/svg+xml`.

For OG image dimensions (1200x630, 1200x600), returns a styled placeholder with logo and branding.

**Caching:**

```
Cache-Control: public, max-age=31536000, immutable
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

Currently, no rate limiting is implemented. This is planned for a future release.

## Caching

- Product list: 60s browser, 5min CDN
- Single product: 5min browser, 1hr CDN
- Market insights: 5min browser, 30min CDN
- Placeholder images: 1 year (immutable)

---

## Examples

### cURL

```bash
# Get all products
curl https://arcompare.com/api/products

# Get premium products sorted by price
curl "https://arcompare.com/api/products?category=Premium&sortBy=price&sortOrder=desc"

# Compare two products
curl -X POST https://arcompare.com/api/products/compare \
  -H "Content-Type: application/json" \
  -d '{"productIds": ["xreal-one-pro", "rokid-ar-spatial"]}'

# Get market overview
curl "https://arcompare.com/api/market/insights?type=overview"
```

### JavaScript (fetch)

```javascript
// Get products
const response = await fetch('/api/products?category=Premium');
const data = await response.json();

// Compare products
const comparison = await fetch('/api/products/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productIds: ['xreal-one-pro', 'rokid-ar-spatial'] })
}).then(r => r.json());
```
