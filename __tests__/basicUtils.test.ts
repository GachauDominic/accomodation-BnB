
import { authenticateUser } from "../src/_tests_/basicUtils";

describe("basicUtils test", () => {
  it("should authenticate a user", () => {
    // Arrange
    const username = "developer";
    const password = "dev@123";

    // Act
    const sut = authenticateUser(username, password);

    // Assert
    expect(sut).toBeDefined();
    expect(sut.isAuthenticated).toBe(true);
    expect(sut.usernameToLower).toBe("developer");
    expect(sut.usernameChar).toEqual(["d", "e", "v", "e", "l", "o", "p", "e", "r"]);
  });
  it("rejects wrong credentials", () => {
    // Arrange
    const username = "wrong";
    const password = "nope";

    // Act
    const sut = authenticateUser(username, password);

    // Assert
    expect(sut).toBeDefined();
    expect(sut.isAuthenticated).toBe(false);
  });
});