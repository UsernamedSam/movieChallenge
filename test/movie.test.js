beforeEach(() => {
  // Simula el contenedor principal en el DOM
  document.body.innerHTML = '<div id="root"></div>';
});

// movies.test.js
import { searchMovies } from '../src/main.js';  // Importa la función que quieres probar

// Mock de la función fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ results: [{ title: "Test Movie" }] }),
  })
);

test('fetches movies based on a search query', async () => {
  const movies = await searchMovies('Test');
  
  expect(movies).toBeDefined();
  expect(movies.length).toBeGreaterThan(0);
  expect(movies[0].title).toBe('Test Movie');
});
