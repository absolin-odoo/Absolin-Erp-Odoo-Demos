# 🔐 Absolin x Odoo - Secure Team Portal

**Your Partner in Digital Transformation**

A professional, branded static website with 4-digit PIN authentication for **Absolin Software Solutions**, an official **Odoo Partner**. Features glassmorphism design, smooth animations, and premium dark mode aesthetics with Absolin and Odoo brand colors.

## 🏢 About

**Absolin Software Solutions** is India's Most Affordable & Trusted Technology Company, specializing in **Odoo ERP Implementation**, custom software development, and digital transformation solutions. With 280+ satisfied clients across multiple industries, we deliver end-to-end solutions from consulting to deployment.

## ✨ Features

- **4-Digit PIN Security**: Enter a secure PIN to access protected content
- **Modern UI/UX**: Glassmorphism effects, smooth animations, and premium design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Support**: Use keyboard numbers, backspace, enter, and escape keys
- **Session Management**: Stay logged in for 1 hour after authentication
- **Security Features**:
  - Maximum 5 attempts before 30-second lockout
  - Session-based authentication
  - Clear error messages
- **Smooth Animations**: Beautiful transitions and micro-interactions

## 🚀 Quick Start

### Local Testing

1. Open `index.html` in your web browser
2. Enter the default PIN: **1234**
3. Access the protected content area

### Default PIN

```
1234
```

### Changing the PIN

**Option 1: Edit the Code**
Open `script.js` and change line 2:
```javascript
correctPIN: '1234', // Change this to your desired PIN
```

**Option 2: Browser Console**
```javascript
changePIN("5678")
```

## 📦 GitHub Pages Deployment

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Name your repository (e.g., `secure-portal`)
5. Choose **Public** (required for free GitHub Pages)
6. Click **"Create repository"**

### Step 2: Upload Files

**Option A: Using GitHub Website**
1. Click **"uploading an existing file"**
2. Drag and drop these files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md` (optional)
3. Click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
cd secure-portal
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select **"main"** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 4: Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Example:
```
https://rohithnaidualla.github.io/secure-portal/
```

## 🎨 Customization

### Change Colors

Edit `style.css` CSS variables (lines 2-15):
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... customize more colors */
}
```

### Modify Security Settings

Edit `script.js` configuration (lines 2-6):
```javascript
const CONFIG = {
    correctPIN: '1234',      // Your PIN
    maxAttempts: 5,          // Max attempts before lockout
    lockoutDuration: 30000   // Lockout time in milliseconds
};
```

### Add Your Content

Edit `index.html` inside the `content-container` section (starting around line 70):
```html
<div class="content-card">
    <h2>Your Title Here</h2>
    <p>Your content here...</p>
</div>
```

## 🔧 Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `correctPIN` | `"1234"` | The 4-digit PIN code |
| `maxAttempts` | `5` | Maximum login attempts before lockout |
| `lockoutDuration` | `30000` | Lockout duration in milliseconds (30s) |
| Session Duration | `3600000` | How long user stays logged in (1 hour) |

## 🎯 Use Cases

- Team portals and dashboards
- Project information sharing
- Internal documentation
- Secure resource sharing
- Demo presentations
- Client portals

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔒 Security Notes

⚠️ **Important**: This is a **client-side** authentication system suitable for:
- Sharing content with trusted teams
- Adding a basic access barrier
- Educational or demo purposes

❌ **Not suitable for**:
- Storing sensitive data
- Financial information
- Personal user data
- Production security systems

For production security, you need:
- Server-side authentication
- Database storage
- Encrypted connections (HTTPS)
- Proper backend security

## 📄 File Structure

```
secure-portal/
├── index.html       # Main HTML structure
├── style.css        # Styles and animations
├── script.js        # PIN logic and authentication
└── README.md        # This file
```

## 🎓 Tips

1. **Remember to change the default PIN** before sharing
2. **Use HTTPS** for GitHub Pages (automatic with GitHub)
3. **Customize the protected content** area for your needs
4. **Test on mobile** devices before sharing
5. **Share the PIN separately** from the URL (e.g., via phone/chat)

## 🆘 Troubleshooting

**Site not loading?**
- Wait 2-3 minutes after enabling GitHub Pages
- Check repository is set to Public
- Verify files are in the root directory

**PIN not working?**
- Check browser console for errors (F12)
- Verify PIN in `script.js` is correct
- Clear browser cache and try again

**Styles not showing?**
- Ensure `style.css` is in the same directory as `index.html`
- Check browser console for 404 errors
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)

## 📞 Support

For issues or questions, create an issue in the GitHub repository.

## 📝 License

Free to use and modify. No attribution required.

---

Made with ❤️ for secure team collaboration
