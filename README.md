# BookVerse

BookVerse is a modern web application designed to revolutionize your digital reading experience. It serves as your personal digital bookshelf, allowing you to discover, organize, and download books, as well as leverage AI-powered insights and recommendations for each title.

#### Live preview
<https://bookvs.pages.dev/>

## Key Features

- **Personalized Digital Bookshelf:** Track your reading list, mark books as finished, and manage your favorites.
- **Book Discovery by Genre:** Easily explore and discover books by genres and categories.
- **Instant Download Links:** Get free download links for books without searching through unreliable sources.
- **Built-in Book Assistant:** Each book page features an AI chatbot that provides summaries, insights, and tailored recommendations.
- **Seamless User Authentication:** Securely manage your book collections with user authentication.

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State/Data Management:** @tanstack/react-query, React Context API
- **APIs:** Google Books API (for books and metadata), Consumet API for download links and the new Google GEN-AI SDK for the chatbot.
- **Authentication & Storage:** Firebase
- **Other Libraries:**
  - `axios` (API requests)
  - `lucide-react` (icons)
  - `react-modal`, `react-hot-toast`, `react-spinners` (UI/UX enhancements)
  - `lodash` (utility functions)

> See the full list of dependencies in [package.json](https://github.com/Joseph-kdev/BookVerse/blob/main/package.json).

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Joseph-kdev/BookVerse.git
   cd BookVerse
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create the `.env` file and fill in your API keys (Google Books API, Firebase, backend endpoint etc.)

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open in your browser:**
   - Visit `http://localhost:5173` (or the port shown in the terminal)

## Project Structure

- `src/components/`: UI components (Home, BookPage, Book, etc.)
- `src/services/`: API and data fetching logic
- `src/`: Main application code

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---
