const { expect } = require("chai");
const faker = require("faker");
const { initSequelize } = require("../db");
const config = require("../config");
initSequelize(config.rdb);
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../");
const auth = require("../auth");

const userRepo = require("../user/repo");

chai.use(chaiHttp);

describe("user.repo.testsuite", () => {
  afterEach(async () => {
    await userRepo.flushUser();
  });

  it("user.repo.create.and.verify", async () => {
    const acct = faker.datatype.string(10);
    const pwd = faker.datatype.string(10);
    const fullname = faker.datatype.string(10);
    const ret = await userRepo.createUser(acct, pwd, fullname);
    expect(ret.pwd).to.not.be.equal(pwd);
    expect(ret.fullname).to.be.equal(fullname);

    const passed = await userRepo.verifyUser(acct, pwd);
    expect(passed).to.be.true;

    const wrongAcctRet = await userRepo.verifyUser("no such account", pwd);
    expect(wrongAcctRet).to.be.false;
    const wrongPwdRet = await userRepo.verifyUser(acct, "wrong password");
    expect(wrongPwdRet).to.be.false;
  });

  it("user.repo.list", async () => {
    const empty = await userRepo.listUser();
    expect(empty).to.deep.equal([]);

    const acct1 = faker.datatype.string(10);
    const pwd1 = faker.datatype.string(10);
    const fullname1 = faker.datatype.string(10);
    await userRepo.createUser(acct1, pwd1, fullname1);

    const acct2 = faker.datatype.string(10);
    const pwd2 = faker.datatype.string(10);
    const fullname2 = faker.datatype.string(10);
    await userRepo.createUser(acct2, pwd2, fullname2);

    const result = await userRepo.listUser();
    expect(result).to.be.length(2);
    expect([result[0].acct, result[1].acct].sort()).to.deep.equal(
      [acct1, acct2].sort()
    );
  });

  it("user.repo.search", async () => {
    const acct1 = faker.datatype.string(10);
    const pwd1 = faker.datatype.string(10);
    const fullname1 = faker.datatype.string(10);
    await userRepo.createUser(acct1, pwd1, fullname1);

    const byFullName = await userRepo.searchUser("fullname", fullname1);
    const byAcct = await userRepo.searchUser("acct", acct1);
    expect(byFullName).to.deep.equal(byAcct);
  });

  it("user.repo.delete", async () => {
    const acct1 = faker.datatype.string(10);
    const pwd1 = faker.datatype.string(10);
    const fullname1 = faker.datatype.string(10);
    await userRepo.createUser(acct1, pwd1, fullname1);

    await userRepo.deleteUser(acct1);
    const empty = await userRepo.listUser();
    expect(empty).to.be.length(0);
  });

  it("user.repo.update", async () => {
    const acct1 = faker.datatype.string(10);
    const pwd1 = faker.datatype.string(10);
    const fullname1 = faker.datatype.string(10);
    const fullname2 = faker.datatype.string(10);
    await userRepo.createUser(acct1, pwd1, fullname1);

    const r1 = await userRepo.searchUser("acct", acct1);
    expect(r1.fullname).to.be.equal(fullname1);

    await userRepo.updateUser(acct1, { fullname: fullname2 });
    const r2 = await userRepo.searchUser("acct", acct1);
    expect(r2.fullname).to.be.equal(fullname2);
  });
});

describe("user.controller.testsuite", async () => {
  afterEach(async () => {
    await userRepo.flushUser();
  });

  it("test.homepage", async () => {
    const res = await chai.request(app).get("/");
    expect(res.statusCode).to.be.equal(200);
    expect(res.body).to.deep.equal({ Hello: "World" });
  });

  it("user.controller.signup", async () => {
    // wrong params
    const res1 = await chai
      .request(app)
      .post("/user/sign_up")
      .set("content-type", "application/json")
      .send({ foo: "bar" });
    expect(res1.statusCode).to.be.equal(400);

    // correct
    const user = faker.datatype.string(10);
    const password = faker.datatype.string(10);
    const fullname = faker.datatype.string(10);
    const res2 = await chai
      .request(app)
      .post("/user/sign_up")
      .set("content-type", "application/json")
      .send({ user, password, fullname });
    expect(res2.statusCode).to.be.equal(200);
    expect(res2.body.token).to.be.string;

    const passed = await userRepo.verifyUser(user, password);
    expect(passed).to.be.true;
  });

  it("user.controller.signin", async () => {
    // wrong params
    const res1 = await chai
      .request(app)
      .post("/user/sign_in")
      .set("content-type", "application/json")
      .send({ foo: "bar" });
    expect(res1.statusCode).to.be.equal(400);

    // correct
    const user = faker.datatype.string(10);
    const password = faker.datatype.string(10);
    const fullname = faker.datatype.string(10);
    await userRepo.createUser(user, password, fullname);
    const res2 = await chai
      .request(app)
      .post("/user/sign_in")
      .set("content-type", "application/json")
      .send({ user, password });
    expect(res2.statusCode).to.be.equal(200);
    expect(res2.body.token).to.be.string;
  });

  it("user.controller.list", async () => {
    const noauth = await chai.request(app).get("/user/list");
    expect(noauth.statusCode).to.be.equal(401);

    const res = await chai
      .request(app)
      .get("/user/list")
      .set("Authorization", `Bearer ${auth.sign({})}`);
    expect(res.statusCode).to.be.equal(200);
    expect(res.body).to.deep.equal([]);
  });

  it("user.controller.search", async () => {
    const noauth = await chai.request(app).get("/user/search/none");
    expect(noauth.statusCode).to.be.equal(401);

    const user = faker.datatype.string(10);
    const password = faker.datatype.string(10);
    const fullname = faker.datatype.string(10);
    await userRepo.createUser(user, password, fullname);

    const none = await chai
      .request(app)
      .get("/user/search/none")
      .set("Authorization", `Bearer ${auth.sign({})}`);
    expect(none.statusCode).to.be.equal(200);
    expect(none.body).to.deep.equal({});

    const res = await chai
      .request(app)
      .get(`/user/search/${fullname}`)
      .set("Authorization", `Bearer ${auth.sign({})}`);
    expect(res.statusCode).to.be.equal(200);
    expect(res.body.acct).to.deep.equal(user);
  });
});
