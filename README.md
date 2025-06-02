# Secret Santa App

A simple and modern Secret Santa generator built with React (Preact) and Vite.

## Features

- Add participants and group them
- Exclude certain pairings (e.g., spouses, family)
- Generate random Secret Santa assignments
- Download results as a file
- Clean, responsive UI

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd secret-santa
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Building for Production

To build the app for production:

```bash
npm run build
# or
yarn build
```

The output will be in the `dist/` folder.

## Project Structure

```
index.html
src/
  main.jsx           # App entry point
  components/        # React components
  hooks/             # Custom hooks
  styles/            # CSS modules and global styles
  utils/             # Utility functions
public/              # Static assets
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
