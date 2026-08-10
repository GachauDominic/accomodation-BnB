import {
  createGuestController,
  deleteGuestByIdController,
  deleteGuestController,
  getAllGuestController,
  guestByContactController,
  guestByIdController,
  guestByRoomController,
  loginGuestController,
  updateguestController,
} from "../../src/guests/guest.controller";

jest.mock("../../src/guests/guest.service", () => ({
  createGuestService: jest.fn(),
  loginGuestService: jest.fn(),
  getAllGuestService: jest.fn(),
  getGuestByIdService: jest.fn(),
  getGuestByContactService: jest.fn(),
  getGuestByRoomService: jest.fn(),
  updateGuestService: jest.fn(),
  deleteGuestService: jest.fn(),
  deleteGuestByIdService: jest.fn(),
}));

jest.mock("../../src/mailer/mailer", () => ({
  sendMail: jest.fn(),
}));

const guestService = require("../../src/guests/guest.service");
const mailer = require("../../src/mailer/mailer");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Guest controller (mocked integration tests)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.Jwt_SECRET = "test-secret";
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("createGuestController returns 201 and created guest data", async () => {
    const mockGuest = {
      guestFirstName: "Ken",
      guestLastName: "Maish",
      guestContact: "070034800",
      guestEmail: "ken@gmail.com",
      guestPassword: "ken@123",
    };

    const createdGuest = { ...mockGuest, guestId: "g1", isVerified: false, verificationCode: "123456" };
    guestService.createGuestService.mockResolvedValue(createdGuest);
    mailer.sendMail.mockResolvedValue(undefined);

    const req: any = { body: mockGuest };
    const res = mockResponse();

    await createGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Guest created",
      data: createdGuest,
    }));
    expect(guestService.createGuestService).toHaveBeenCalledWith(expect.objectContaining({
      guestEmail: mockGuest.guestEmail,
      isVerified: false,
      verificationCode: expect.any(String),
    }));
  });

  it("loginGuestController returns 200 with token and guest profile", async () => {
    const guestProfile = {
      guestId: "g1",
      guestFirstName: "Ken",
      guestLastName: "Maish",
      guestContact: "070034800",
      role: "guest",
    };
    guestService.loginGuestService.mockResolvedValue(guestProfile);

    const req: any = { body: { guestContact: "070034800" } };
    const res = mockResponse();

    await loginGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "The login was successful",
      token: expect.any(String),
      host: expect.objectContaining({ guestId: guestProfile.guestId }),
    }));
  });

  it("loginGuestController returns 400 when guest is notavailable in the db", async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    await loginGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest not found"});
  });

  it("getAllGuestController returns 200 with all guests", async () => {
    const guests = [{ guestId: "g1", guestFirstName: "Ken" }];
    guestService.getAllGuestService.mockResolvedValue(guests);

    const req: any = {};
    const res = mockResponse();

    await getAllGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: guests });
  });

  it("getAllGuestController returns 404 when there are no available guests", async () => {
    const req: any = {};
    const res = mockResponse();

    await getAllGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "No guests available"});
  });

  it("guestByIdController returns 200 with guest when found", async () => {
    const guest = [{ guestFirstName: "Ken", guestLastName: "Maish", guestContact: "070034800" }];
    guestService.getGuestByIdService.mockResolvedValue(guest);

    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await guestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: guest });
  });

  it("guestByIdController returns 400 when guestid is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await guestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith( {message: "Guest Id required"} );
  });

  it("guestByIdController returns 404 when guest is not found", async () => {
    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await guestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest not found!"});
  });

  it("guestByContactController returns 200 with guest when found", async () => {
    const guest = [{ guestId: "g1", guestFirstName: "Ken", guestLastName: "Maish" }];
    guestService.getGuestByContactService.mockResolvedValue(guest);

    const req: any = { params: { guestContact: "070034800" } };
    const res = mockResponse();

    await guestByContactController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: guest });
  });

  it("guestByContactController returns 400 when guest contact is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await guestByContactController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Guest contact required"});
  });

  it("guestByContactController returns 404 when the contact is not available in the DB", async () => {
    const req: any = { params: { guestContact: "070034800" } };
    const res = mockResponse();

    await guestByContactController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest not found!"});
  });

  it("guestByRoomController returns 200 with guest data when found", async () => {
    const guest = [{ guestId: "g1", guestFirstName: "Ken", guestLastName: "Maish" }];
    guestService.getGuestByRoomService.mockResolvedValue(guest);

    const req: any = { params: { guestRoomNum: "101" } };
    const res = mockResponse();

    await guestByRoomController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: guest });
  });

  it("guestByRoomController returns 400 with when room number is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await guestByRoomController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Room number of the guest required"});
  });

  it("guestByRoomController returns 404 when the room number provided has no guest", async () => {
    const req: any = { params: { guestRoomNum: "101" } };
    const res = mockResponse();

    await guestByRoomController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest not found!"});
  });

  it("updateguestController returns 200 when guest is updated", async () => {
    const updatedGuest = { guestId: "g1", guestFirstName: "Ken", guestLastName: "Maish" };
    guestService.getGuestByContactService.mockResolvedValue([{ guestContact: "070034800" }]);
    guestService.updateGuestService.mockResolvedValue(updatedGuest);

    const req: any = {
      params: { guestContact: "070034800" },
      body: { guestFirstName: "Ken" },
    };
    const res = mockResponse();

    await updateguestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Guest updated successfully",
      data: updatedGuest,
    }));
  });

  it("updateguestController returns 400 when guestid is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await updateguestController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Guest contact is required"}));
  });

  it("updateguestController returns 404 when guest not found", async () => {
    const req: any = { params: { guestContact: "070034800" } };
    const res = mockResponse();

    await updateguestController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Guest not found!" }));
  });

  it("deleteGuestController returns 200 when guest is deleted", async () => {
    guestService.getGuestByContactService.mockResolvedValue([{ guestContact: "070034800" }]);
    guestService.deleteGuestService.mockResolvedValue("Guest deleted");

    const req: any = { params: { guestContact: "070034800" } };
    const res = mockResponse();

    await deleteGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Guest deleted successfully" });
  });

  it("deleteGuestController returns 400 when guestContact is not provided", async () => {
    const req: any = { params: {}, body: {}};
    const res = mockResponse();

    await deleteGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Guest contact is required"});
  });

  it("deleteGuestController returns 404 when guest is not found", async () => {
    const req: any = { params: { guestContact: "070034800" } };
    const res = mockResponse();

    await deleteGuestController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest not found!"});
  });

  it("deleteGuestByIdController returns 200 when guest id is deleted", async () => {
    guestService.getGuestByIdService.mockResolvedValue([{ guestId: "g1" }]);
    guestService.deleteGuestByIdService.mockResolvedValue("Guest deleted");

    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await deleteGuestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "The guest was deleted successfuly" });
  });

  it("deleteGuestByIdController returns 400 when guest id is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await deleteGuestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Guest id is required"});
  });
  
  it("deleteGuestByIdController returns 200 when guest id is deleted", async () => {
    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await deleteGuestByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Guest Id does not exist"});
  });

});