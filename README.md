# SweetYum Backend API Documentation

## Base URL
`/api`

---

## Users API

### 1. Register User
**Endpoint:** `POST /users/register`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "fullname": {
    "firstname": "string (min: 3)",
    "lastname": "string (optional, min: 3)"
  },
  "email": "string (valid email)",
  "password": "string (min: 8)",
  "phoneNo": "number",
  "isAdmin": "boolean (optional)"
}
```

**Response Body:**
```json
{
  "token": "string",
  "user": { "user details" }
}
```

---

### 2. Login User
**Endpoint:** `POST /users/login`

**Description:** Logs in a user.

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string (min: 8)"
}
```

**Response Body:**
```json
{
  "token": "string",
  "user": { "user details" }
}
```

---

### 3. Get User Profile
**Endpoint:** `GET /users/profile`

**Description:** Retrieves the logged-in user's profile.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "user": { "user details" }
}
```

---

### 4. Logout User
**Endpoint:** `GET /users/logout`

**Description:** Logs out the user by blacklisting the token.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Delete User
**Endpoint:** `DELETE /users/delete-user/:userId`

**Description:** Deletes a user by their ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "User deleted successfully"
}
```

---

### 6. Upload Profile Picture
**Endpoint:** `PATCH /users/upload-profile`

**Description:** Uploads a profile picture for the logged-in user.

**Headers:**
- `Authorization: Bearer <token>`

**Form Data:**
- `profilePicture: file`

**Response Body:**
```json
{
  "message": "Profile Picture Uploaded Successfully",
  "user": { "user details" }
}
```

---

## Products API

### 1. Add Product
**Endpoint:** `POST /products/addproduct`

**Description:** Adds a new product.

**Headers:**
- `Authorization: Bearer <Admin Token>`

**Request Body:**
```json
{
  "name": "string (min: 2, max: 100)",
  "description": "string (min: 2, max: 1000)",
  "price": "number",
  "category": "string (valid category)",
  "stock": "number",
  "ratings": "number"
}
```

**Form Data:**
- `productImage: file`

**Response Body:**
```json
{
  "message": "Product added successfully"
}
```

---

### 2. Get All Products
**Endpoint:** `GET /products/getproduct`

**Description:** Retrieves all products.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
[
  { "product details" },
  { "product details" }
]
```

---

### 3. Get Single Product
**Endpoint:** `GET /products/getproduct/:productId`

**Description:** Retrieves a single product by its ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "product": { "product details" }
}
```

---

### 4. Update Product
**Endpoint:** `PATCH /products/updateproduct/:productId`

**Description:** Updates product details.

**Headers:**
- `Authorization: Bearer <Admin Token>`

**Request Body:**
```json
{
  "price": "number",
  "stock": "number"
}
```

**Form Data:**
- `productImage: file`

**Response Body:**
```json
{
  "product": { "updated product details" }
}
```

---

### 5. Delete Product
**Endpoint:** `DELETE /products/deleteproduct/:productId`

**Description:** Deletes a product by its ID.

**Headers:**
- `Authorization: Bearer <Admin Token>`

**Response Body:**
```json
{
  "message": "Product Deleted Successfully"
}
```

---