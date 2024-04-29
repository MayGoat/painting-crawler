import { describe, it } from "node:test";
import request from "supertest";
import app from '../app'

describe('User API endpoints', () => {
  let userId: number;

  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword',
      
    };
    const response = await request(app).post('/api/users').send(userData);
    expect(response.status).toBe(201);
    userId = response.body.id;
  });

  it('should find a user by user ID', async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });
});

describe('Favorite API endpoints', () => {
  let favoriteId: number;
  let userId:string;

  it('should add a new favorite for a user', async () => {
    const favoriteData = {
      userId: 1, // Replace with the actual user ID
      artworkId: 1, // Replace with the actual artwork ID
    };
    const response = await request(app).post('/api/favorites').send(favoriteData);
    expect(response.status).toBe(201);
    favoriteId = response.body.id;
  });

  it('should find favorites by user ID', async () => {
    const response = await request(app).get(`/api/favorites/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
