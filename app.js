const API_URL = 'https://rifkira.psl17.my.id/api';

// =====================
// CEK AUTENTIKASI UNIVERSAL UNTUK index.html
// =====================
// (function () {
//   const token = localStorage.getItem('token');
//   const path = window.location.pathname;
//   const filename = path.split('/').pop();

//   const isAdminPage = path.includes('/admin/');
//   const isUserPage = !isAdminPage;

//   if (!token) {
//     // Belum login
//     if (isAdminPage) {
//       window.location.replace('../login.html');
//     } else {
//       window.location.replace('login.html');
//     }
//   } else {
//     // Sudah login, batasi akses
//     const email = localStorage.getItem('email');
//     if (isAdminPage && email !== 'admin@mail.com') {
//       window.location.replace('../index.html');
//     }
//     if (isUserPage && email === 'admin@mail.com') {
//       window.location.replace('admin/dashboard.html');
//     }
//   }
// })();


// =====================
// LOGOUT
// =====================
function logout() {
  localStorage.removeItem('token'); // Hapus token dari penyimpanan
  alert('Anda telah logout.');
  window.location.href = 'index.html'; // Redirect ke halaman login
}


// =====================
// REGISTER FORM
// =====================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      document.getElementById('response').innerText = result.message || result.error || 'Gagal daftar';
    } catch (err) {
      document.getElementById('response').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// LOGIN FORM
// =====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
if (res.ok && result.token) {
  localStorage.setItem('token', result.token);
  localStorage.setItem('email', data.email.toLowerCase());

  document.getElementById('loginResponse')?.innerText = 'Login berhasil!';
  setTimeout(() => {
    const email = data.email.toLowerCase();
    if (email === 'admin@mail.com') {
      window.location.href = 'admin/dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1000);
} else {
        document.getElementById('response').innerText = result.error || 'Gagal login';
      }
    } catch (err) {
      document.getElementById('response').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// LOAD PRODUK
// =====================
async function loadProduk() {
  const produkList = document.getElementById('produkList');
  if (!produkList) return;

  const coupon = document.getElementById('couponInput')?.value || '';
  const endpoint = coupon ? `${API_URL}/products?coupon=${encodeURIComponent(coupon)}` : `${API_URL}/products`;

  produkList.innerHTML = '<p class="text-center text-rose-400">Memuat produk...</p>';

  try {
    const res = await fetch(endpoint);
    const data = await res.json();

    if (!Array.isArray(data)) {
      produkList.innerHTML = '<p class="text-center text-red-500">Produk tidak tersedia atau error</p>';
      return;
    }

    if (data.length === 0) {
      produkList.innerHTML = '<p class="text-center text-gray-400">Belum ada produk tersedia</p>';
      return;
    }

    produkList.innerHTML = data.map(p => `
      <div class="bg-white/70 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition relative">
        <img src="${p.image_url ? API_URL.replace('/api', '') + p.image_url : 'https://via.placeholder.com/300'}"
             class="rounded-xl mb-4 h-48 w-full object-cover border border-rose-100" alt="${p.name}" />
        <h3 class="text-xl font-semibold text-rose-700 mb-1">${p.name}</h3>
        <p class="text-sm text-gray-500 mb-2">${p.description}</p>

        ${p.discount_percentage ? `
          <p class="line-through text-sm text-gray-400">Rp${Number(p.original_price).toLocaleString('id-ID')}</p>
          <p class="text-lg font-bold text-rose-600">Rp${Number(p.final_price).toLocaleString('id-ID')} 
            <span class="text-sm bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full ml-1">${p.discount_percentage}% OFF</span>
          </p>
        ` : `
          <p class="text-lg font-bold text-gray-700">Rp${Number(p.price).toLocaleString('id-ID')}</p>
        `}

        <div class="mt-3 text-sm text-gray-500">
          <span class="block">Ukuran: ${p.size || '-'}</span>
          <span class="block">Warna: ${p.color || '-'}</span>
          <span class="block">Kategori: ${p.category || '-'}</span>
        </div>

        <div class="mt-4 flex gap-2">
          <button onclick='isiFormEdit(${JSON.stringify(p)})'
            class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Edit</button>
          <button onclick="hapusProduk(${p.id})"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Hapus</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    produkList.innerHTML = `<p class="text-red-500">Gagal mengambil produk: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProduk);

// =====================
// TAMBAH PRODUK
// =====================
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: formData,
      });

      const result = await res.json();
      document.getElementById('addProductResponse').innerText =
        result.message || result.error || 'Gagal tambah produk';

      if (res.ok) {
        this.reset();
        closeModal('addModal');
        loadProduk();
      }
    } catch (err) {
      document.getElementById('addProductResponse').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// ISI FORM EDIT PRODUK
// =====================
function isiFormEdit(p) {
  const form = document.getElementById('editProductForm');
  form.querySelector('[name="id"]').value = p.id;
  form.querySelector('[name="name"]').value = p.name || '';
  form.querySelector('[name="description"]').value = p.description || '';
  form.querySelector('[name="price"]').value = p.price || '';
  form.querySelector('[name="size"]').value = p.size || '';
  form.querySelector('[name="color"]').value = p.color || '';
  form.querySelector('[name="category"]').value = p.category || '';
  form.querySelector('[name="image"]').value = '';
  document.getElementById('editProductResponse').innerText = '';
  openModal('editModal');
}

// =====================
// EDIT PRODUK
// =====================
const editProductForm = document.getElementById('editProductForm');
if (editProductForm) {
  editProductForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const id = formData.get('id');
    formData.delete('id');

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: formData,
      });

      const result = await res.json();
      document.getElementById('editProductResponse').innerText =
        result.message || result.error || 'Gagal update produk';

      if (res.ok) {
        closeModal('editModal');
        loadProduk();
      }
    } catch (err) {
      document.getElementById('editProductResponse').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// HAPUS PRODUK
// =====================
async function hapusProduk(id) {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    });

    const result = await res.json();
    alert(result.message || result.error || 'Gagal hapus produk');
    loadProduk();
  } catch (err) {
    alert('Server error: ' + err.message);
  }
}

// =====================
// TAMBAH KUPON
// =====================
const addCouponForm = document.getElementById('addCouponForm');
if (addCouponForm) {
  addCouponForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));

    try {
      const res = await fetch(`${API_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      document.getElementById('addCouponResponse').innerText = result.message || result.error || 'Gagal tambah kupon';
    } catch (err) {
      document.getElementById('addCouponResponse').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// EDIT KUPON
// =====================
const editCouponForm = document.getElementById('editCouponForm');
if (editCouponForm) {
  editCouponForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    const id = data.id;
    delete data.id;

    try {
      const res = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      document.getElementById('editCouponResponse').innerText = result.message || result.error || 'Gagal update kupon';
    } catch (err) {
      document.getElementById('editCouponResponse').innerText = 'Server error: ' + err.message;
    }
  });
}

// =====================
// HAPUS KUPON
// =====================
async function hapusKupon(id) {
  if (!confirm('Yakin ingin menghapus kupon ini?')) return;

  try {
    const res = await fetch(`${API_URL}/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    });

    const result = await res.json();
    alert(result.message || result.error || 'Gagal hapus kupon');
    location.reload();
  } catch (err) {
    alert('Server error: ' + err.message);
  }
}