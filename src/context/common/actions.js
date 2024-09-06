export const setPayloadAction = (payload, dispatch, action_type) => {
  dispatch({
    type: action_type,
    payload: payload,
  });
};
