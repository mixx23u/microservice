const API_URL = {
  users: '/auth/users',
  products: '/product/products',
  orders: '/order/orders'
};

function fetchUsers() {
  fetch(API_URL.users)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#user-table tbody');
      tbody.innerHTML = '';
      data.forEach(u => {
        //tbody.innerHTML += `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td></tr>`;
	tbody.innerHTML += `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.role}</td></tr>`;
      });
    });
}

function fetchProducts() {
  fetch(API_URL.products)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#product-table tbody');
      tbody.innerHTML = '';
      data.forEach(p => {
        tbody.innerHTML += `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.price}</td></tr>`;
      });
    });
}

function fetchOrders() {
  fetch(API_URL.orders)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#order-table tbody');
      tbody.innerHTML = '';
      data.forEach(o => {
        //tbody.innerHTML += `<tr><td>${o.id}</td><td>${o.user_id}</td><td>${o.product_id}</td><td>${o.quantity}</td></tr>`;
        tbody.innerHTML += `<tr><td>${o.id}</td><td>${o.user_id}</td><td>${o.total}</td><td>${o.status}</td></tr>`;

      });
    });
}
