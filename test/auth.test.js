const { expect } = require("chai");
const auth = require("../auth");
const key = require("../auth/key");

describe("auth.testsuite", () => {
  it("auth.key.singleton", () => {
    const k1 = new key.KeySingleton();
    const k2 = new key.KeySingleton();
    expect(k1).to.be.equal(k2);
  });

  it("auth.sign.and.decode", () => {
    const token = auth.sign({ foo: "bar" });
    const decoded = auth.decode(token);
    expect(decoded.foo).to.be.equal("bar");

    const wrong = auth.decode("wrong token");
    expect(wrong).to.be.null;
  });

  it("auth.verify.middleware", () => {
    class FakeReq {
      constructor(token) {
        this.token = token;
      }
      header(key) {
        return this.token;
      }
    }
    class FakeRsp {
      constructor(expectedStatus) {
        this.expectedStatus = expectedStatus;
      }
      status(code) {
        expect(code).to.be.equal(this.expectedStatus);
      }
    }
    // no header
    auth.verifyMiddleware(new FakeReq(undefined), new FakeRsp(401));
    // wrong token
    auth.verifyMiddleware(new FakeReq("wrong token"), new FakeRsp(401));
    // right token
    const token = auth.sign({ foo: "bar" });
    calledCount = 0;
    auth.verifyMiddleware(new FakeReq(`Bearer ${token}`), null, () => {
      calledCount++;
    });
    expect(calledCount).to.be.equal(1);
  });
});
