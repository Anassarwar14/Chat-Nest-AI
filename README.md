# Chat Nest AI

![Chat Nest AI](https://your-image-url.com/banner.png)

Welcome to **Chat Nest AI**, a cutting-edge platform for creating and interacting with custom AI characters. Built with Next.js, Prisma, and Clerk, this app allows you to craft unique AI personalities and engage in meaningful conversations.

https://chat-nest-ai.vercel.app/

## 🚀 Features

- **Custom AI Characters**: Create and personalize AI characters with unique backstories, welcome messages, and ice breakers.
- **Real-time Chat**: Engage in real-time conversations with your AI characters.
- **Subscription Management**: Upgrade to Pro for advanced features and manage your subscription.
- **Responsive Design**: Enjoy a sleek and modern UI that works across all devices.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js, Prisma, PostgreSQL
- **Database**: Postgres (Supabase), ORM - Prisma 
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI Integration**: Groq, LLAMA 3.3-versatile-70B, LangChain, Pinecone, Redis, Cohere

## 📸 Screenshots

![Screenshot 1](https://your-image-url.com/screenshot1.png)
![Screenshot 2](https://your-image-url.com/screenshot2.png)

## 📚 Getting Started

Follow these steps to get the project up and running on your local machine:

### Prerequisites

- Next.js
- npm or yarn
- PostgreSQL

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Anassarwar14/chat-nest-ai.git
    cd chat-nest-ai
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**:
    Create a [.env](http://_vscodecontentref_/0) file in the root directory and add your environment variables:
    ```env
    DATABASE_URL=your-database-url
    STRIPE_API_KEY=your-stripe-api-key
    STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
    NEXT_PUBLIC_APP_URL=your-app-url
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
    CLERK_SECRET_KEY=your-clerk-api-key
    PINECONE_API_KEY=your-pinecone-api-key
    PINECONE_INDEX=your-pinecone-api-index
    COHERE_API_KEY=your-cohere-api-key
    UPSTASH_REDIS_REST_URL=your-upstash-redis-resturl
    UPSTASH_REDIS_REST_URL=your-upstash-redis-token
    GROQ_API_KEY=your-groq-api-key
    ```

4. **Run database migrations**:
    ```bash
    npx prisma migrate dev --name init
    ```

5. **Start the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## 📧 Contact

Have questions or feedback? Feel free to reach out:

- **Email**: anassarwar14@gmail.com
- **Linkedin**: https://www.linkedin.com/in/anassarwar14/

---
Made with ❤️ by Anas 
