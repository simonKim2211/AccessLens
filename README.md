# AccessLens 🍁 - AODA Accessibility Checker

A comprehensive web accessibility analysis tool designed for Canadian businesses to ensure AODA (Accessibility for Ontarians with Disabilities Act) compliance.

## 🎯 Features

- **Automated WCAG 2.0 AA Testing**: Comprehensive accessibility scanning
- **AI-Powered Analysis**: Detailed explanations and fix recommendations using Gemini AI
- **AODA Compliance**: Specific guidance for Ontario's accessibility requirements
- **Bilingual Support**: Analysis available in English and French
- **Business Impact Assessment**: Practical guidance for small Canadian businesses
- **Real-time Screenshots**: Visual accessibility simulations

## 🏗️ Project Structure

```
AccessLens/
├── backend/                 # Node.js API server
│   ├── server.js           # Main server file
│   ├── utils/              # Utility services
│   │   ├── accessibilityAnalyzer.js
│   │   ├── geminiService.js
│   │   └── logger.js
│   ├── logs/               # Application logs
│   └── .env                # Environment variables
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API service layer
│   └── package.json
├── shared/                 # Shared types and constants
│   ├── types/              # TypeScript type definitions
│   └── constants/          # API endpoints and constants
├── scripts/                # Development scripts
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (for AI analysis)

### Environment Setup

1. **Backend Environment** (`backend/.env`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

2. **Frontend Environment** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="AODA Accessibility Checker"
```

### Installation & Running

1. **Install Backend Dependencies**:
```bash
cd AccessLens/backend
npm install
```

2. **Install Frontend Dependencies**:
```bash
cd AccessLens/frontend
npm install
```

3. **Start Backend Server**:
```bash
cd AccessLens/backend
node server.js
```

4. **Start Frontend Development Server**:
```bash
cd AccessLens/frontend
npm run dev
```

5. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🔧 Development Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

## 📋 API Endpoints

- `GET /health` - Health check
- `POST /analyze` - Analyze website accessibility
- `GET /` - API information

## 🇨🇦 AODA Compliance Features

- **WCAG 2.0 AA Standards**: Complete compliance checking
- **Ontario Requirements**: Specific AODA guidance
- **Bilingual Support**: English/French analysis
- **Business Impact**: Risk assessment and recommendations
- **Legal Compliance**: Regulatory requirement mapping

## 🤖 AI-Powered Analysis

Each accessibility violation includes:
- Plain language explanations (English/French)
- Specific fix recommendations
- Screen reader impact assessment
- WCAG criteria mapping
- Business impact analysis

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, Axe-core
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **AI**: Google Gemini API
- **Testing**: Puppeteer for web scraping

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

🍁 **Built for Canadian businesses to meet AODA compliance requirements**
