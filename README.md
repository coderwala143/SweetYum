# SweetYum Backend API Documentation

## Base URL
`https://sweetyum.onrender.com/api`

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

## Cart API

### 1. Add Product to Cart
**Endpoint:** `POST /carts/add/:productId`

**Description:** Adds a product to the user's cart.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "Product Added To Cart Successfully"
}
```

---

### 2. Get Cart
**Endpoint:** `GET /carts/getcart`

**Description:** Retrieves the user's cart.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "userId": "string",
  "products": [
    {
      "productId": "string",
      "quantity": "number",
      "priceAtPurchase": "number"
    }
  ],
  "totalPrice": "number",
  "totalItems": "number"
}
```

---

### 3. Remove Product from Cart
**Endpoint:** `DELETE /carts/removeproduct/:productId`

**Description:** Removes a product from the user's cart.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "removed item from cart successfully"
}
```

---

### 4. Increase Product Quantity
**Endpoint:** `PATCH /carts/increasequantity/:productId`

**Description:** Increases the quantity of a product in the user's cart.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "Product Quantity Decreased"
}
```

---

### 5. Decrease Product Quantity
**Endpoint:** `PATCH /carts/decreasequantity/:productId`

**Description:** Decreases the quantity of a product in the user's cart. If the quantity becomes zero, the product is removed from the cart.

**Headers:**
- `Authorization: Bearer <token>`

**Response Body:**
```json
{
  "message": "Product Quantity Decreased"
}
```

---

## Order API

### 1. Place Single Order
**Endpoint:** `POST /orders/place-single-order/:productId`

**Description:** Places an order for a single product.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingInfo": {
    "address": "string",
    "city": "string",
    "state": "string",
    "pincode": "number",
    "phoneNo": "string"
  },
  "paymentInfo": {
    "paymentMethods": "string (COD, UPI, Card)",
    "paymentStatus": "string (paid, pending)",
    "transactionId": "string (optional)"
  },
  "quantity": "number"
}
```

**Response Body:**
```json
{
  "message": "Order Placed Successfully",
  "orderId": "string"
}
```

---

### 2. Place Multiple Orders
**Endpoint:** `POST /orders/place-multiple-order`

**Description:** Places an order for all products in the user's cart.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingInfo": {
    "address": "string",
    "city": "string",
    "state": "string",
    "pincode": "number",
    "phoneNo": "string"
  },
  "paymentInfo": {
    "paymentMethods": "string (COD, UPI, Card)",
    "paymentStatus": "string (paid, pending)",
    "transactionId": "string (optional)"
  }
}
```

**Response Body:**
```json
{
  "message": "Order Placed Successfully",
  "orderId": "string"
}
```

---

## Rating API

### 1. Add Rating
**Endpoint:** `POST /ratings/add-rating/:productId`

**Description:** Allows a user to add a rating and review for a product they have purchased.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userRating": "number (0 to 5)",
  "userReview": "string (optional, max: 500 characters)"
}
```

**Response Body:**
```json
{
  "message": "Product rated Successfully!"
}

**Error Responses:**
- `404`: User or Product Not Found
- `400`: You Have Already Rated this Product
- `404`: You have not purchased this product
- `500`: Error while Rating

```

---
