# Project API Endpoints

## Auth
**POST** `{{base_url}}/api/auth/register`
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
}
```

**POST** `{{base_url}}/api/auth/login`
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

## User
**GET** `{{base_url}}/api/user/profile`
*(No Body)*

**PUT** `{{base_url}}/api/user/profile`
```json
{
    "name": "John Updated",
    "email": "john.updated@example.com"
}
```

**PUT** `{{base_url}}/api/user/password`
```json
{
    "currentPassword": "password123",
    "newPassword": "newPassword456"
}
```

**GET** `{{base_url}}/api/user/settings`
*(No Body)*

**PUT** `{{base_url}}/api/user/settings`
```json
{
    "theme": "dark",
    "notifications": "enabled"
}
```

## Products
**GET** `{{base_url}}/api/products?page=1&limit=10`
*(No Body)*

**POST** `{{base_url}}/api/products`
```json
{
    "name": "Gaming Laptop",
    "sku": "GL-001",
    "category": "60d0fe4f5311236168a109ca",
    "price": 1500.00,
    "stock": 25,
    "description": "High performance gaming laptop",
    "status": "active"
}
```

**GET** `{{base_url}}/api/products/:id`
*(No Body)*

**PUT** `{{base_url}}/api/products/:id`
```json
{
    "price": 1450.00,
    "stock": 30
}
```

**DELETE** `{{base_url}}/api/products/:id`
*(No Body)*

**PATCH** `{{base_url}}/api/products/:id/stock`
```json
{
    "quantity": 50
}
```

## Categories
**GET** `{{base_url}}/api/categories`
*(No Body)*

**POST** `{{base_url}}/api/categories`
```json
{
    "name": "Electronics",
    "description": "Electronic devices and accessories"
}
```

**PUT** `{{base_url}}/api/categories/:id`
```json
{
    "name": "Consumer Electronics"
}
```

**DELETE** `{{base_url}}/api/categories/:id`
*(No Body)*

## Customers
**GET** `{{base_url}}/api/customers`
*(No Body)*

**POST** `{{base_url}}/api/customers`
```json
{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "555-0123",
    "address": {
        "street": "123 Business Rd",
        "city": "Tech City",
        "state": "TC",
        "zip": "12345",
        "country": "USA"
    }
}
```

**GET** `{{base_url}}/api/customers/:id`
*(No Body)*

**PUT** `{{base_url}}/api/customers/:id`
```json
{
    "phone": "555-0999"
}
```

**DELETE** `{{base_url}}/api/customers/:id`
*(No Body)*

**POST** `{{base_url}}/api/customers/:id/notes`
```json
{
    "content": "Customer prefers email communication"
}
```

## Invoices
**GET** `{{base_url}}/api/invoices`
*(No Body)*

**POST** `{{base_url}}/api/invoices`
```json
{
    "customer": "60d0fe4f5311236168a109cb",
    "items": [
        {
            "product": "60d0fe4f5311236168a109cc",
            "quantity": 1
        }
    ],
    "dueDate": "2024-12-31"
}
```

**GET** `{{base_url}}/api/invoices/:id`
*(No Body)*

**PATCH** `{{base_url}}/api/invoices/:id/status`
```json
{
    "status": "paid"
}
```

## Subscriptions
**POST** `{{base_url}}/api/subscriptions`
```json
{
    "customer": "60d0fe4f5311236168a109cb",
    "planName": "Pro Plan",
    "amount": 99.99,
    "interval": "monthly"
}
```

**GET** `{{base_url}}/api/subscriptions`
*(No Body)*

## Payments
**POST** `{{base_url}}/api/payments/initiate`
```json
{
    "amount": 100.00,
    "orderId": "INV-1001",
    "paymentMethod": "card"
}
```

**POST** `{{base_url}}/api/payments/easypaisa/initiate`
```json
{
    "amount": 100.00,
    "orderId": "INV-1001",
    "mobileNumber": "03001234567"
}
```
