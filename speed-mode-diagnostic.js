/**
 * Speed Mode Diagnostic Script
 *
 * Copy and paste this into your browser console (F12) to diagnose issues
 */

console.log('🔍 Speed Mode Diagnostic Starting...\n');

// 1. Check Token
const token = localStorage.getItem('speed_mode_token');
console.log('1️⃣ Token Check:');
if (token) {
    console.log('   ✅ Token exists:', token.substring(0, 10) + '...');
} else {
    console.log('   ❌ No token found');
    console.log('   → Solution: Enable Speed Mode and set your token');
}

// 2. Check App ID
const appId = localStorage.getItem('config.app_id') || localStorage.getItem('speed_mode_app_id');
console.log('\n2️⃣ App ID Check:');
if (appId) {
    console.log('   ✅ App ID:', appId);
} else {
    console.log('   ⚠️ No app ID found, will use default: 116162');
}

// 3. Check Deriv Login
const accounts = localStorage.getItem('client.accounts');
const activeLoginId = localStorage.getItem('active_loginid');
console.log('\n3️⃣ Deriv Login Check:');
if (accounts && activeLoginId) {
    try {
        const accountsData = JSON.parse(accounts);
        const activeAccount = accountsData[activeLoginId];
        console.log('   ✅ Logged in as:', activeLoginId);
        console.log('   Account type:', activeLoginId.startsWith('VRT') ? 'Demo' : 'Real');
        if (activeAccount) {
            console.log('   Currency:', activeAccount.currency || 'Unknown');
        }
    } catch (e) {
        console.log("   ⚠️ Account data exists but couldn't parse");
    }
} else {
    console.log('   ❌ Not logged into Deriv');
    console.log('   → Solution: Login at https://app.deriv.com');
}

// 4. Check Speed Mode Element
console.log('\n4️⃣ Speed Mode UI Check:');
const speedModeToggle = document.querySelector('.speed-mode-toggle');
const speedModeOverlay = document.querySelector('.speed-mode-overlay');
if (speedModeOverlay) {
    console.log('   ✅ Speed Mode component found');
    if (speedModeToggle) {
        const isActive = speedModeToggle.classList.contains('active');
        console.log('   Status:', isActive ? '🟢 Enabled' : '⚪ Disabled');
    }
} else {
    console.log('   ❌ Speed Mode component not found');
    console.log('   → Are you on the Bot Builder tab?');
}

// 5. Check WebSocket Support
console.log('\n5️⃣ Browser Support Check:');
if (typeof WebSocket !== 'undefined') {
    console.log('   ✅ WebSocket supported');
} else {
    console.log('   ❌ WebSocket not supported');
    console.log('   → Update your browser');
}

// 6. Check Network Connection
console.log('\n6️⃣ Network Check:');
if (navigator.onLine) {
    console.log('   ✅ Online');
} else {
    console.log('   ❌ Offline');
    console.log('   → Check your internet connection');
}

// 7. Test Deriv API Connection
console.log('\n7️⃣ Testing Deriv API Connection...');
const testWs = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=' + (appId || '116162'));

testWs.onopen = () => {
    console.log('   ✅ Successfully connected to Deriv API');
    testWs.close();
};

testWs.onerror = error => {
    console.log('   ❌ Failed to connect to Deriv API');
    console.log('   Error:', error);
};

testWs.onclose = () => {
    console.log('   Connection closed');
};

// 8. Summary
setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(50));

    const issues = [];
    const warnings = [];

    if (!token) issues.push('No API token set');
    if (!accounts || !activeLoginId) issues.push('Not logged into Deriv');
    if (!speedModeOverlay) warnings.push('Speed Mode UI not visible (wrong tab?)');

    if (issues.length === 0 && warnings.length === 0) {
        console.log('✅ All checks passed! Speed Mode should work.');
        console.log('\n📝 Next Steps:');
        console.log('   1. Enable Speed Mode toggle');
        console.log('   2. Configure your settings');
        console.log('   3. Click "Start Speed Trading"');
    } else {
        if (issues.length > 0) {
            console.log('❌ Issues Found:');
            issues.forEach(issue => console.log('   • ' + issue));
        }
        if (warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            warnings.forEach(warning => console.log('   • ' + warning));
        }
        console.log('\n📝 Recommended Actions:');
        if (!token) {
            console.log('   1. Enable Speed Mode');
            console.log('   2. Get token from: https://app.deriv.com/account/api-token');
            console.log('   3. Paste token in Speed Mode setup');
        }
        if (!accounts || !activeLoginId) {
            console.log('   1. Login to Deriv: https://app.deriv.com');
            console.log('   2. Use demo account for testing');
        }
        if (!speedModeOverlay) {
            console.log('   1. Navigate to Bot Builder tab');
            console.log('   2. Look for Speed Mode toggle');
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('💡 Need more help? Check: SPEED_MODE_TESTING_GUIDE.md');
    console.log('='.repeat(50) + '\n');
}, 2000);
