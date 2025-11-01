export async function getUser(id) {
  await delay();
  throw new Error(`Database read failed for user ID: ${id}`);
}

export async function createUser(data) {
  await delay();
  throw new Error('Database write failed — user not created.');
}

export async function deleteUser(id) {
  await delay();
  throw new Error(`Database delete failed for user ID: ${id}`);
}

export async function fetchExternalData() {
  await delay(400);
  const random = Math.random();
  if (random < 0.5) throw new Error('External API timeout — simulated failure.');
  return {
    source: 'mock-api',
    data: { temperature: 26, humidity: 78 },
    message: 'Fetched successfully (simulated)'
  };
}

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
