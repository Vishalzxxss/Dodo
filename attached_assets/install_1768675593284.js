
const { exec } = require('child_process');
const fs = require('fs');

console.log('🔧 Installing required dependencies...');

// Install npm packages
exec('npm install', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error installing dependencies:', error);
        return;
    }
    
    console.log('✅ Dependencies installed successfully!');
    console.log('📦 Packages installed:', stdout);
    
    // Check if proxy file exists
    if (!fs.existsSync('PROXY.txt')) {
        console.log('⚠️  PROXY.txt not found, creating sample...');
        // You already have PROXY.txt, so this is just a check
    }
    
    console.log('🚀 Setup complete! Run "npm start" to start the bot.');
});
