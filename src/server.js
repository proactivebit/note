import fs from 'node:fs/promises'
import http from 'node:http'
import open from 'open'

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
}

const formatNotes = notes =>
    notes.map(note => 
        `<div class="note">
            <p>${note.content}</p>
            <p>${note.tags}</p>
        </div>`
    ).join('\n');

const createServer = (notes) => {
    return http.createServer(async (req, res) => {
        const HTML_PATH = new URL('./template.html', import.meta.url).pathname
        const template = await fs.readFile(HTML_PATH, 'utf-8')
        const html = interpolate(template, {notes: formatNotes(notes)})
        
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    });
}
      
export const start = (notes, port) => {
    const server = createServer(notes)
    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
    open(`http://localhost:${port}`)
}