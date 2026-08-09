import {
  createApprovalController,
  getAllApprovalsController,
  getApprovalByIdController,
  getApprovalByRoomNumController,
  getApprovalByGuestIdController,
  getPendingApprovalsController,
  getApprovedApprovalsController,
  getRejectedApprovalsController,
  updateApprovalByIdController,
  deleteApprovalByIdController,
} from "../../src/approvals/approvals.controller";

jest.mock("../../src/approvals/approvals.service", () => ({
  createApprovalService: jest.fn(),
  getAllApprovalsService: jest.fn(),
  getApprovalByIdService: jest.fn(),
  getApprovalByRoomNumService: jest.fn(),
  getApprovalByGuestIdService: jest.fn(),
  getApprovalByHostIdService: jest.fn(),
  getPendingApprovalsService: jest.fn(),
  getApprovedApprovalsService: jest.fn(),
  getRejectedApprovalsService: jest.fn(),
  updateApprovalByIdService: jest.fn(),
  deleteApprovalByIdService: jest.fn(),
}));

jest.mock("../../src/guests/guest.service", () => ({
  getGuestByIdService: jest.fn(),
}));
jest.mock("../../src/rooms/room.service", () => ({
  getRoomByNumService: jest.fn(),
}));
jest.mock("../../src/auth/auth.service", () => ({
  getHostByIdService: jest.fn(),
}));

const approvalService = require("../../src/approvals/approvals.service");
const guestService = require("../../src/guests/guest.service");
const roomService = require("../../src/rooms/room.service");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Approvals controller (integration - mocked services)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  })

  it("createApprovalController - returns 201 on success", async () => {
    const mockApproval = {
      approvalId: "a1",
      approvedRoomNum: "101",
      approvingHostId: "h1",
      approvedGuestId: "g1",
      roomAprovalStatus: "pending",
    };

    approvalService.createApprovalService.mockResolvedValue(mockApproval);

    const req: any = { body: mockApproval };
    const res = mockResponse();

    await createApprovalController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
        data: mockApproval,
      }),
    );
  });

  it("getAllApprovalsController - returns 200 with data", async () => {
    const list = [
      {
        approvalId: "a1",
        approvedRoomNum: "101",
        approvingHostId: "h1",
        approvedGuestId: "g1",
        roomAprovalStatus: "pending",
      },
      {
        approvalId: "a2",
        approvedRoomNum: "102",
        approvingHostId: "h2",
        approvedGuestId: "g2",
        roomAprovalStatus: "approved",
      },
    ];
    approvalService.getAllApprovalsService.mockResolvedValue(list);

    const req: any = {};
    const res = mockResponse();

    await getAllApprovalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: list });
  });

  it("getApprovalByIdController - returns 400 when id missing", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await getApprovalByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getApprovalByIdController - returns 200 with approval when found", async () => {
    const mockApproval = {
      approvalId: "a1",
      approvedRoomNum: "101",
      approvingHostId: "h1",
      approvedGuestId: "g1",
      roomAprovalStatus: "pending",
    };
    approvalService.getApprovalByIdService.mockResolvedValue(mockApproval);

    const req: any = { params: { approvalId: "a1" } };
    const res = mockResponse();

    await getApprovalByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockApproval });
  });

  it("getApprovalByRoomNumController - returns 400 when roomNum missing", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await getApprovalByRoomNumController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("getApprovalByRoomNumController - returns 200 when room exists and approval found", async () => {
    const mockApproval = { approvalId: "a2", approvedRoomNum: "202" };
    roomService.getRoomByNumService.mockResolvedValue({ roomNumber: "202" });
    approvalService.getApprovalByRoomNumService.mockResolvedValue(mockApproval);

    const req: any = { params: { roomNum: "202" } };
    const res = mockResponse();

    await getApprovalByRoomNumController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockApproval });
  });

  it("getApprovalByGuestIdController - returns 200 when guest exists and approval found", async () => {
    const mockApproval = { approvalId: "a3", approvedGuestId: "g1" };
    guestService.getGuestByIdService.mockResolvedValue({ guestId: "g1" });
    approvalService.getApprovalByGuestIdService.mockResolvedValue(mockApproval);

    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await getApprovalByGuestIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockApproval });
  });

  it("getPendingApprovalsController - returns 200 when pending found", async () => {
    const pending = [{ approvalId: "p1" }];
    approvalService.getPendingApprovalsService.mockResolvedValue(pending);

    const req: any = {};
    const res = mockResponse();

    await getPendingApprovalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: pending });
  });

  it("getApprovedApprovalsController - returns 200 when approved found", async () => {
    const approved = [{ approvalId: "ap1" }];
    approvalService.getApprovedApprovalsService.mockResolvedValue(approved);

    const req: any = {};
    const res = mockResponse();

    await getApprovedApprovalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: approved });
  });

  it("getRejectedApprovalsController - returns 200 when rejected found", async () => {
    const rejected = [{ approvalId: "r1" }];
    approvalService.getRejectedApprovalsService.mockResolvedValue(rejected);

    const req: any = {};
    const res = mockResponse();

    await getRejectedApprovalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: rejected });
  });

  it("updateApprovalByIdController - returns 200 when update succeeds", async () => {
    const updated = { approvalId: "u1", roomAprovalStatus: "approved" };
    approvalService.getApprovalByIdService.mockResolvedValue({
      approvalId: "u1",
    });
    approvalService.updateApprovalByIdService.mockResolvedValue(updated);

    const req: any = {
      params: { approvalId: "u1" },
      body: { roomAprovalStatus: "approved" },
    };
    const res = mockResponse();

    await updateApprovalByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: updated });
  });

  it("deleteApprovalByIdController - returns 200 when deletion succeeds", async () => {
    approvalService.getApprovalByIdService.mockResolvedValue({
      approvalId: "d1",
    });
    approvalService.deleteApprovalByIdService.mockResolvedValue(
      "Approval was successfully deleted",
    );

    const req: any = { params: { approvalId: "d1" } };
    const res = mockResponse();

    await deleteApprovalByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      message: "Approval deleted successfully",
    });
  });
});
