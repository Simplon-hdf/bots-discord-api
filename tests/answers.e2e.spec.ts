import { test, expect } from '@playwright/test';
import { CreateAnswerQuestionDto } from '../src/answers/dto/create-answer-question.dto';

test.describe('Answers API E2E Tests', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  
  const testAnswer: CreateAnswerQuestionDto = {
    content: 'Test answer content',
    uuidQuestion: '123e4567-e89b-12d3-a456-426614174000'
  };

  let createdAnswerUuid: string;

  test.beforeAll(async ({ request }) => {
    console.log('Starting API availability check...');
    console.log(`Testing API URL: ${API_URL}`);
    
    let retries = 5;
    let apiReady = false;
    
    while (retries > 0 && !apiReady) {
      try {
        console.log(`Attempting to connect to API (${retries} retries left)...`);
        const checkResponse = await request.get(`${API_URL}/answers`);
        console.log(`Response status: ${checkResponse.status()}`);
        
        if (checkResponse.status() === 200 || checkResponse.status() === 404) {
          console.log('API endpoint found!');
          apiReady = true;
          break;
        }

        const responseText = await checkResponse.text();
        console.log(`Response body: ${responseText}`);
        
      } catch (error) {
        console.log(`Error connecting to API:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries--;
      }
    }

    if (!apiReady) {
      throw new Error('API is not ready after maximum retries');
    }
  });

  test('Cycle de vie complet d\'une réponse', async ({ request }) => {
    console.log('Starting answer lifecycle test...');
    
    // 1. Création d'une réponse
    console.log('Creating new answer...');
    const createResponse = await request.post(`${API_URL}/answers`, {
      data: testAnswer,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`Create response status: ${createResponse.status()}`);
    const createResponseText = await createResponse.text();
    console.log(`Create response body: ${createResponseText}`);
    
    expect(createResponse.ok()).toBeTruthy();
    const createData = JSON.parse(createResponseText);
    expect(createData.data).toHaveProperty('uuid');
    createdAnswerUuid = createData.data.uuid;

    // 2. Récupération de la réponse créée
    console.log(`Fetching created answer with UUID: ${createdAnswerUuid}...`);
    const getResponse = await request.get(`${API_URL}/answers/${createdAnswerUuid}`);
    console.log(`Get response status: ${getResponse.status()}`);
    const getResponseText = await getResponse.text();
    console.log(`Get response body: ${getResponseText}`);
    
    expect(getResponse.ok()).toBeTruthy();
    const getData = JSON.parse(getResponseText);
    expect(getData.data.content).toBe(testAnswer.content);

    // 3. Mise à jour de la réponse
    const updateData = { content: 'Updated content' };
    console.log('Updating answer...');
    const updateResponse = await request.put(`${API_URL}/answers/${createdAnswerUuid}`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`Update response status: ${updateResponse.status()}`);
    const updateResponseText = await updateResponse.text();
    console.log(`Update response body: ${updateResponseText}`);
    
    expect(updateResponse.ok()).toBeTruthy();
    const updatedData = JSON.parse(updateResponseText);
    expect(updatedData.data.content).toBe(updateData.content);

    // 4. Suppression de la réponse
    console.log('Deleting answer...');
    const deleteResponse = await request.delete(`${API_URL}/answers/${createdAnswerUuid}`);
    console.log(`Delete response status: ${deleteResponse.status()}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // 5. Vérification que la réponse n'existe plus
    console.log('Verifying answer deletion...');
    const getDeletedResponse = await request.get(`${API_URL}/answers/${createdAnswerUuid}`);
    console.log(`Get deleted response status: ${getDeletedResponse.status()}`);
    expect(getDeletedResponse.status()).toBe(404);
  });

  test('Validation des entrées', async ({ request }) => {
    console.log('Starting input validation tests...');
    
    // Test avec contenu vide
    console.log('Testing empty content...');
    const emptyContentResponse = await request.post(`${API_URL}/answers`, {
      data: { ...testAnswer, content: '' },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(emptyContentResponse.status()).toBe(400);
    const emptyContentData = JSON.parse(await emptyContentResponse.text());
    expect(emptyContentData.message).toEqual(
      expect.arrayContaining(['Answer content cannot be empty'])
    );

    // Test avec contenu trop long
    const longContent = 'a'.repeat(51);
    console.log('Testing too long content...');
    const longContentResponse = await request.post(`${API_URL}/answers`, {
      data: { ...testAnswer, content: longContent },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(longContentResponse.status()).toBe(400);
    const longContentData = JSON.parse(await longContentResponse.text());
    expect(longContentData.message).toEqual(
      expect.arrayContaining(['Answer content must not exceed 50 characters'])
    );

    // Test avec UUID invalide
    console.log('Testing invalid UUID...');
    const invalidUuidResponse = await request.post(`${API_URL}/answers`, {
      data: { ...testAnswer, uuidQuestion: 'invalid-uuid' },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(invalidUuidResponse.status()).toBe(400);
    const invalidUuidData = JSON.parse(await invalidUuidResponse.text());
    expect(invalidUuidData.message).toEqual(
      expect.arrayContaining(['uuidQuestion must be a UUID'])
    );

    // Test avec requête malformée
    console.log('Testing malformed request...');
    const malformedResponse = await request.post(`${API_URL}/answers`, {
      data: 'not a json object',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(malformedResponse.status()).toBe(400);

    // Test avec méthode non autorisée
    console.log('Testing method not allowed...');
    const methodNotAllowedResponse = await request.patch(`${API_URL}/answers/some-uuid`, {
      data: testAnswer,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(methodNotAllowedResponse.status()).toBe(404);
  });

  test('Gestion des erreurs', async ({ request }) => {
    // Test avec UUID inexistant
    console.log('Testing non-existent UUID...');
    const nonExistentResponse = await request.get(`${API_URL}/answers/non-existent-uuid`);
    expect([404, 500]).toContain(nonExistentResponse.status()); // Accepte soit 404 soit 500
    const nonExistentData = JSON.parse(await nonExistentResponse.text());
    expect(nonExistentData.message).toBeTruthy(); // Vérifie juste qu'il y a un message d'erreur
  });
});
