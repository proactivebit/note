import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/db.js', () => ({
  insert: jest.fn(),
  getDB: jest.fn(),
  saveDB: jest.fn(),
}));

const { insert, getDB, saveDB } = await import('../src/db.js');
const { newNote, getAllNotes, removeNote } = await import('../src/notes.js');

beforeEach(() => {
  insert.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
})

test('insert new note and return it', async () => {
    const content = "test note";
    const tags = ['tag1', 'tag2'];
    const data = {
        id: 1,
        content,
        tags
    }
    insert.mockResolvedValue(data)

    const result = await newNote(content, tags);

    expect(result.content).toEqual(content);
    expect(result.tags).toEqual(tags);
})

test('get all notes', async () => {
    const notes = [{id: 1, content: 'note', tags: []}];
    getDB.mockResolvedValue({notes})

    const result = await getAllNotes();

    expect(result).toEqual(notes);
})

test('remove note and return id', async () => {
    const noteId = 1;
    const notes = [{id: noteId, content: 'note', tags: []}];
    getDB.mockResolvedValue({notes})

    const result = await removeNote(noteId);
    
    expect(result).toEqual(noteId);
});

test('remove not existing note should return undefined', async () => {
    const noteId = 2;
    const notes = [{id: 1, content: 'note', tags: []}];
    getDB.mockResolvedValue({notes})

    const result = await removeNote(noteId);
    
    expect(result).toBeUndefined();
});