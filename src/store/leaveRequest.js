const leaveRequestStoreDefaultState = () => {
    return {
        userLeaveRequests: [],
        approverLeaveRequests: [],
    }
};

export default {
    namespaced: true,
    state: leaveRequestStoreDefaultState(),
    mutations: {
        SET_USER_LEAVE_REQUESTS(state, userLeaveRequests) {
            state.userLeaveRequests = userLeaveRequests
        },
        SET_APPROVER_LEAVE_REQUESTS(state, approverLeaveRequests) {
            state.approverLeaveRequests = approverLeaveRequests
        },
        RESET(state) {
            state = Object.assign(state, leaveRequestStoreDefaultState());
        }
    },
    actions: {}
};