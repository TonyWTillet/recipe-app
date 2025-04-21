# Recipe App 🍳

A modern recipe application built with Vue 3, TypeScript, and Firebase. This application allows users to discover, save, and manage their favorite recipes with a beautiful and intuitive interface.

![Recipe App Screenshot](screenshot.png)

## ✨ Features

- 🔐 User authentication (signup, login, password reset)
- 👤 User profile management
- 📱 Responsive design
- 🎨 Modern UI with Vue 3
- 🔥 Real-time data with Firebase
- 💬 AI-powered recipe chatbot
- 🌙 Dark/Light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/recipe-app.git
   cd recipe-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a new web app in your Firebase project
   - Copy your Firebase configuration

4. **Configure environment variables**

   - Create a `.env` file in the root directory
   - Add your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🛠️ Built With

- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Vue Router](https://router.vuejs.org/) - The official router for Vue.js
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using

## 📁 Project Structure

```
recipe-app/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── firebase/        # Firebase configuration
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   └── views/           # Page components
├── public/              # Public static files
└── ...config files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Firebase team for the powerful backend services
- All contributors who help improve this project
