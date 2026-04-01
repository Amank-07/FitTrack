const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const { User } = require("../src/models/User");

const registerAndLoginAnalyst = async () => {
  const registerPayload = {
    name: "Analyst User",
    email: "analyst@example.com",
    password: "secret123"
  };

  await request(app).post("/api/auth/register").send(registerPayload);
  await User.findOneAndUpdate({ email: registerPayload.email }, { role: "analyst" });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: registerPayload.email,
    password: registerPayload.password
  });

  return loginResponse.body.data.token;
};

describe("Health", () => {
  it("returns healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("Auth", () => {
  it("registers and logs in a user", async () => {
    const payload = {
      name: "Test User",
      email: "test@example.com",
      password: "secret123"
    };

    const registerResponse = await request(app).post("/api/auth/register").send(payload);
    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.data.user.email).toBe(payload.email);
    expect(registerResponse.body.data.token).toBeDefined();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: payload.password
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.data.user.email).toBe(payload.email);
    expect(loginResponse.body.data.token).toBeDefined();
  });

  it("returns 401 for invalid password", async () => {
    const password = await bcrypt.hash("correct123", 10);
    await User.create({
      name: "Saved User",
      email: "saved@example.com",
      password
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "saved@example.com",
      password: "wrong123"
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

describe("Financial Records and Dashboard", () => {
  it("creates records, filters, and reads dashboard summary", async () => {
    const token = await registerAndLoginAnalyst();

    const incomeResponse = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 5000,
        type: "income",
        category: "salary",
        date: "2026-04-01",
        notes: "Monthly salary"
      });

    expect(incomeResponse.statusCode).toBe(201);

    const expenseResponse = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 800,
        type: "expense",
        category: "food",
        date: "2026-04-02",
        notes: "Groceries"
      });

    expect(expenseResponse.statusCode).toBe(201);

    const listResponse = await request(app)
      .get("/api/records")
      .set("Authorization", `Bearer ${token}`);
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.data.items.length).toBe(2);

    const filterIncomeResponse = await request(app)
      .get("/api/records?type=income")
      .set("Authorization", `Bearer ${token}`);
    expect(filterIncomeResponse.statusCode).toBe(200);
    expect(filterIncomeResponse.body.data.items.length).toBe(1);
    expect(filterIncomeResponse.body.data.items[0].type).toBe("income");

    const summaryResponse = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${token}`);
    expect(summaryResponse.statusCode).toBe(200);
    expect(summaryResponse.body.data.totalIncome).toBe(5000);
    expect(summaryResponse.body.data.totalExpense).toBe(800);
    expect(summaryResponse.body.data.netBalance).toBe(4200);
  });

  it("blocks viewer from creating records", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Viewer User",
      email: "viewer@example.com",
      password: "secret123"
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "viewer@example.com",
      password: "secret123"
    });

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        type: "income",
        category: "misc",
        date: "2026-04-01"
      });

    expect(response.statusCode).toBe(403);
  });
});
