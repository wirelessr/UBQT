const { expect } = require("chai");
const faker = require("faker");
const { initSequelize } = require("../db");
const config = require("../config");
initSequelize(config.rdb);
const model = require("../model");

const userRepo = require("../user/repo");

describe("user.repo.testsuite", () => {
  afterEach(async () => {
    await model.Users.destroy({ truncate: true });
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
});
