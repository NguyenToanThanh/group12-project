// Test script - Copy và paste vào Console của trình duyệt (F12 → Console)
// Paste toàn bộ đoạn này và nhấn Enter

console.clear();
console.log('🧪 BẮT ĐẦU TEST LOGIN...\n');

const testLogin = async () => {
    try {
        console.log('📡 Gọi API: POST http://localhost:4000/api/login');
        
        const response = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: '123456'
            })
        });
        
        console.log('📥 HTTP Status:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('📦 Response Data:', data);
        console.log('\n🔍 CHI TIẾT:');
        console.log('  - accessToken:', data.accessToken ? '✅ CÓ' : '❌ KHÔNG CÓ');
        console.log('  - refreshToken:', data.refreshToken ? '✅ CÓ' : '❌ KHÔNG CÓ');
        
        if (data.accessToken && data.refreshToken) {
            console.log('\n💾 ĐANG LƯU VÀO LOCALSTORAGE...');
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            console.log('✅ ĐÃ LƯU THÀNH CÔNG!');
            console.log('\n🔍 KIỂM TRA LOCALSTORAGE:');
            console.log('  - accessToken:', localStorage.getItem('accessToken')?.substring(0, 50) + '...');
            console.log('  - refreshToken:', localStorage.getItem('refreshToken')?.substring(0, 50) + '...');
            
            console.log('\n✨ HOÀN TẤT! Kiểm tra Application → Local Storage');
        } else {
            console.error('❌ Backend KHÔNG trả về tokens!');
            console.log('Response nhận được:', JSON.stringify(data, null, 2));
        }
        
    } catch (error) {
        console.error('❌ LỖI:', error);
        console.error('Message:', error.message);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('\n💡 NGUYÊN NHÂN CÓ THỂ:');
            console.log('1. Backend chưa chạy (kiểm tra: http://localhost:4000/api/health)');
            console.log('2. CORS chưa được cấu hình đúng');
            console.log('3. Firewall chặn kết nối');
        }
    }
};

// Chạy test
testLogin();
