// =============================================
// AUTH.JS - Đăng nhập / Đăng ký (Supabase)
// ĐÃ SỬA: Tự động tạo profile khi đăng ký
// =============================================

import supabase from './supabase-config.js';

let currentUser = null;

// Kiểm tra người dùng khi tải trang
export async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;

    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        const role = profile?.role || 'student';

        authButtons.innerHTML = `
            <span style="color:#00ffff; margin-right:15px;">Chào ${user.email}</span>
            ${role === 'admin' ? 
                `<a href="admin-dashboard.html" class="btn btn-primary">👑 Quản Trị</a>` : ''}
            <a href="#" onclick="logout()" class="btn btn-secondary">Đăng Xuất</a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="#" class="btn btn-secondary" onclick="showModal('loginModal')">Đăng Nhập</a>
            <a href="#" class="btn btn-primary" onclick="showModal('registerModal')">Đăng Ký</a>
        `;
    }
}

// ====================== ĐĂNG KÝ (TỰ ĐỘNG TẠO PROFILE) ======================
window.register = async function() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const age = parseInt(document.getElementById('registerAge').value);

    if (!name || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // 1. Đăng ký auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, age } }
    });

    if (error) {
        alert("❌ Lỗi đăng ký: " + error.message);
        return;
    }

    // 2. Tự động tạo profile
    if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: data.user.id,
                name: name,
                age: age,
                role: 'student',
                status: 'active'
            });

        if (profileError) {
            console.error("Không tạo được profile:", profileError);
        }
    }

    alert("✅ Đăng ký thành công!\nBạn có thể đăng nhập ngay.");
    closeModal('registerModal');
    checkAuth();
};

// Đăng nhập
window.login = async function() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("❌ Sai email hoặc mật khẩu!");
    } else {
        alert("🚀 Đăng nhập thành công!");
        closeModal('loginModal');
        checkAuth();
    }
};

// Đăng xuất
window.logout = async function() {
    await supabase.auth.signOut();
    alert("✅ Đã đăng xuất!");
    window.location.href = "index.html";
};

// Modal
window.showModal = function(id) {
    document.getElementById(id).style.display = 'block';
};

window.closeModal = function(id) {
    document.getElementById(id).style.display = 'none';
};

// Tự động chạy
document.addEventListener('DOMContentLoaded', checkAuth);

// Export global
window.checkAuth = checkAuth;