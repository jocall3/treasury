import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAPI } from "../../common/utilities/requestApi";

export const bulkCreate = createAsyncThunk(
  "transaction_line_items/bulkCreate",
  async (
    { transactionId, transactionLineItems, dispatchError },
    { rejectWithValue }
  ) => {
    const body = JSON.stringify({
      transaction_line_items: transactionLineItems,
    });
    const response = await fetchAPI(
      `/transactions/${transactionId}/transaction_line_items/bulk_create`,
      "POST",
      body,
      "application/json"
    );
    if (response.ok) {
      window.location.reload();
    } else if (response.status === 422) {
      const {
        errors: { message },
      } = await response.json();
      dispatchError(message);
      return rejectWithValue(message);
    }

    return null;
  }
);

export const updateTLI = createAsyncThunk(
  "transaction_line_items/update",
  async (
    {
      transactionId,
      transactionLineItemId,
      data,
      successCallback,
      dispatchError,
    },
    { rejectWithValue }
  ) => {
    const body = JSON.stringify({
      ...data,
      transaction_line_item: transactionLineItemId,
    });
    const response = await fetchAPI(
      `/transactions/${transactionId}/transaction_line_items/${transactionLineItemId}`,
      "PATCH",
      body,
      "application/json"
    );
    if (response.ok) {
      if (successCallback) {
        successCallback();
      } else {
        window.location.reload();
      }
    } else if (response.status === 422) {
      const {
        errors: { message },
      } = await response.json();
      dispatchError(message);
      return rejectWithValue(message);
    }

    return null;
  }
);
