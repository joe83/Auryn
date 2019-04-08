/**
 * Copyright (c) You i Labs Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const setListIndex = index => dispatch => dispatch({
  type: 'LANDER_LIST_INDEX',
  payload: index,
});
