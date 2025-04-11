import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises'; // Use promises version of fs
import matter from 'gray-matter'; // Use gray-matter on backend
import { fileURLToPath } from 'url'; // Helper to get __dirname in ES modules

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001; // Backend server port

// API endpoint to get slide content
app.get('/api/slides/:id', async (req: Request, res: Response) => {
    const slideId = parseInt(req.params.id, 10);
    if (isNaN(slideId) || slideId < 1) {
        return res.status(400).json({ error: 'Invalid slide ID' });
    }

    // Format filename (e.g., slide_01.md, slide_02.md)
    const filename = `slide_${String(slideId).padStart(2, '0')}.md`;
    // Construct the path relative to the server file's location
    const filePath = path.join(__dirname, '../slide_instructions', filename);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // Return parsed content (frontmatter data + body content)
        res.json({
            title: data.title, // Pass specific fields or the whole data object
            body: content.trim()
            // ... include other frontmatter fields from 'data' if needed
        });
    } catch (error: any) {
        console.error(`Error reading slide ${slideId}:`, error);
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: `Slide ${slideId} not found` });
        }
        return res.status(500).json({ error: 'Failed to load slide content' });
    }
});

// Serve static files from the React build output
const staticPath = path.join(__dirname, '../dist');
console.log(`Serving static files from: ${staticPath}`); // Debug log
app.use(express.static(staticPath));

app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the backend!' });
});

// Handle any requests that don't match the API or static files
// Send the main index.html for client-side routing
app.get('*', (req: Request, res: Response) => {
    const indexPath = path.join(__dirname, '../dist/index.html');
    res.sendFile(indexPath);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 