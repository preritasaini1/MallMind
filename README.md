# 🏬 MallMind  
### Hyper-Personalized Agentic Shopping Concierge for Smart Malls

![MallMind Dashboard](./photos/Dashboard.png)

---

## 📖 Overview  
**MallMind** is a state-of-the-art mobile-first Progressive Web Application (PWA) designed to revolutionize the physical mall experience through **Agentic AI**. It bridges the gap between traditional retail and digital intelligence, providing shoppers with a real-time, AI-powered concierge that handles everything from product discovery to complex indoor navigation.

In an era dominated by e-commerce, MallMind brings personalization and digital visibility back to the mall, allowing shoppers to interact with their environment conversationally and efficiently.

---

## 📸 Application Preview  

| **AI Chat Concierge** | **Smart Navigation** |
|:---:|:---:|
| ![Chat Interface](./photos/Chat_interface.png) | ![Route Navigation](./photos/Closeststore_route.png) |
| *Conversational AI understands intent and budget* | *Real-time route optimization between stores* |

| **Live Inventory Scout** | **Virtual Try-On (GenAI)** |
|:---:|:---:|
| ![Live Inventory](./photos/Live_Inventory.png) | ![Try-On Feature](./photos/Tryon_feature.png) |
| *Simulated real-time stock and pricing checks* | *Advanced AI-powered visual try-on experience* |

---

## 🎯 The Core Problem & Our Solution  

### 🚩 The Challenge
Physical malls currently suffer from:
- **Fragmentation:** Lack of personalized store recommendations.
- **Invisibility:** No real-time inventory visibility across brands.
- **Staticity:** Outdated static maps and zero route optimization.
- **Lost Opportunities:** Inability to leverage session-level visitor data.

### 💡 The MallMind Objective
We built a scalable PWA that:
- **Deciphers Intent:** Uses Natural Language Processing to understand shopping goals.
- **Aggregates Inventory:** Recommends relevant stores based on live availability.
- **Optimizes Movement:** Generates the most efficient walking routes.
- **Visualizes Purchases:** Enables AI-powered virtual try-on experiences.

---

## 🧠 Agentic AI Architecture  

MallMind is powered by a **Multi-Agent Orchestration Layer**. Instead of a single chatbot, a team of specialized agents collaborates to serve the user:

![Six Agents Workflow](./photos/Six_Agents.png)

- **🕵️‍♂️ Inventory Scout:** Queries store APIs for specific items, sizes, and pricing.
- **👗 Personal Stylist:** Matches recommendations to the user's style and occasion.
- **🗺️ Smart Navigator:** Calculates the shortest path between store centers using a mall-wide graph.
- **🏷️ Deal Negotiator:** Identifies active promotions and offers tailored to the user.

---

## 📂 Project Structure  

```bash
MallMind/
├── frontend/             # Next.js 14 + React Application
│   ├── pages/            # App routes (Chat, Map, Onboard)
│   ├── components/       # UI Components (ChatBox, StoreCard, MapModal)
│   ├── styles/           # Global & Glassmorphism CSS
│   └── public/           # Static assets & icons
├── backend/              # Node.js + GraphQL API
│   ├── agents/           # 🤖 Multi-Agent Logic (Stylist, Scout, etc.)
│   ├── graphql/          # 🖇️ Schema & Resolvers (Apollo Server)
│   ├── models/           # 🗄️ MongoDB/Mongoose Schemas
│   ├── server.js         # 🚀 API entry point
│   └── seed.js           # 🌱 Database seeding script
└── photos/               # 🖼️ Application screenshots & assets
```

---

## 👥 Stakeholders & Impact  

| Stakeholder      | Value Delivered |
|-----------------|----------------|
| **Shoppers**        | Faster, personalized, stress-free shopping experience |
| **Store Managers**  | Increased footfall, higher engagement, and conversion insights |
| **Mall Admin**      | Granular visitor analytics and operational efficiency |

### 📊 Performance Targets
- **≥30%** reduction in total shopping time.
- **≥40%** improvement in store recommendation relevance.
- **≥95%** accuracy in indoor navigation and routing.

---

## 🔐 Security & Privacy  

- **Session Security:** JWT-based authentication for temporary sessions.
- **Data Encryption:** HTTPS encrypted communication for all API traffic.
- **Privacy First:** No permanent storage of user photos used for virtual try-on.
- **Auto-Expiry:** Sessions automatically expire after inactivity to protect user data.

---

## 🛠 Installation & Setup  

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- OpenAI API Key

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with MONGO_URI and OPENAI_API_KEY
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure NEXT_PUBLIC_API_URL in .env
npm run dev
```

---

Made with ❤️ by the MallMind Team.
