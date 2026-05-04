# 🏬 Mall-Mind  
### Hyper-Personalized Agentic Shopping Concierge for Smart Malls

Mall-Mind is a mobile-first Progressive Web Application (PWA) designed to transform traditional mall experiences using Agentic AI.  
It brings e-commerce–level personalization, intelligence, and automation into physical retail environments.

The system uses multiple intelligent agents to understand user intent, check simulated real-time inventory, generate optimized indoor routes, and provide dynamic shopping assistance — all without requiring app installation.

---
## 📖 Overview

With the rapid growth of platforms like Amazon and Flipkart, physical malls struggle with personalization and digital intelligence. Shoppers often feel overwhelmed by numerous stores and lack real-time visibility into inventory, discounts, and navigation.
Mall-Mind bridges this gap by combining AI-driven personalization with real-world shopping experiences.

## Architecture :
```
MallMind
│
├── backend
│ ├── agents
│ │ ├── stylistAgent.js
│ │ └── inventoryAgent.js
│ │
│ ├── graphql
│ │ ├── schema.js
│ │ └── resolvers.js
│ │
│ ├── navigation
│ │ └── mallGraph.js
│ │
│ ├── models
│ │ └── User.js
│ │
│ ├── middleware
│ │ ├── auth.js
│ │ └── rateLimiter.js
│ │
│ ├── tests
│ │ └── api.test.js
│ │
│ ├── server.js
│ └── package.json
│
├── frontend
│ ├── pages
│ │ ├── index.js
│ │ └── chat.js
│ │
│ ├── components
│ │ ├── ChatBox.js
│ │ └── StoreCard.js
│ │
│ └── package.json
│
├── docs
│ ├── synopsis.pdf
│ └── architecture.png
│
├── .github
│ └── workflows
│ └── ci.yml
│
├── README.md
└── docker-compose.yml
```

## 🎯 Problem Statement

Physical malls currently:

- Lack personalized store recommendations  
- Do not provide real-time inventory visibility  
- Offer static navigation maps  
- Cannot optimize walking routes  
- Do not leverage session-level visitor data  

---

## 🚀 Objective

To design and develop a scalable Progressive Web Application (PWA) that:

- Understands shopping intent using natural language  
- Recommends relevant stores based on preferences  
- Checks simulated real-time inventory across brands  
- Generates optimized indoor walking routes  
- Enables AI-powered virtual try-on experiences  
- Supports dynamic promotional logic  

---

## 🧠 System Architecture

Mall-Mind follows a modular layered architecture:

### 🖥 Frontend Layer
- Built using **React + Next.js**
- Mobile-first PWA (no installation required)
- Interactive UI for shopping input and navigation

### ⚙ Backend Layer
- Developed using **Node.js + GraphQL**
- Handles session management and API orchestration
- Connects AI agents with store data

### 🗄 Data Layer
- **PostgreSQL** for structured session data
- **MongoDB** for flexible inventory and interaction data

### 🤖 AI Layer
- Powered by **OpenAI Assistants API**
- Coordinates autonomous agents (Stylist, Scout, Navigator, Negotiator)

### 🗺 Mapping Engine
- Integrated with **Mapbox Indoor SDK**
- Provides optimized in-mall navigation

---

## ✨ Key Features

### 🔹 QR-Based Smart Onboarding
Visitors scan a QR code at the mall entrance to instantly start a session.

### 🔹 Natural Language Shopping Input
Users describe their needs conversationally:
> "I need a blue suit under $300 and coffee."

The AI extracts product type, color, budget, and preferences.

### 🔹 Inventory Scout Agent
- Queries simulated store APIs  
- Matches availability, size, price, and color  
- Recommends relevant stores only  

### 🔹 Personal Stylist Agent
- Understands style, occasion, and budget  
- Provides tailored product recommendations  

### 🔹 Smart Indoor Navigation
- Interactive mall map  
- Optimized walking routes  
- Dynamic rerouting when required  

### 🔹 Virtual Try-On (Generative AI)
- Users upload a selfie  
- AI simulates clothing fit  
- Improves purchase confidence  

---

## 👥 Stakeholders

| Stakeholder      | Value Delivered |
|-----------------|----------------|
| Shoppers        | Faster, personalized, stress-free shopping |
| Store Managers  | Increased engagement and conversion insights |
| Mall Admin      | Visitor analytics and operational efficiency |

---

## 🔐 Security & Privacy

- JWT-based authentication  
- HTTPS encrypted communication  
- Temporary anonymized sessions  
- No permanent storage of personal images  
- Automatic session expiry  

---

## 📊 Performance Goals

- ≥30% reduction in shopping time  
- ≥40% improvement in store relevance  
- ≥20% increase in conversion via dynamic offers  
- ≥95% indoor navigation accuracy  

---

## 🛠 Installation & Setup (Development)

```bash
# Clone repository
git clone https://github.com/your-username/mall-mind.git

# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd frontend
npm install
npm run dev
