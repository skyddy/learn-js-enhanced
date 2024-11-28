import axios from 'axios';

const MONO_API_URL = 'https://api.monobank.ua/api';

/**
 * @typedef {Object} BasketItem
 * @property {string} name - Product name
 * @property {number} qty - Quantity
 * @property {number} sum - Total sum in kopecks
 */

/**
 * @typedef {Object} CreateInvoiceParams
 * @property {number} amount - Amount in kopecks
 * @property {Object} merchantPaymInfo
 * @property {string} merchantPaymInfo.reference - Unique reference ID
 * @property {string} merchantPaymInfo.destination - Payment description
 * @property {BasketItem[]} merchantPaymInfo.basketOrder - Array of items
 * @property {string} redirectUrl - URL to redirect after payment
 * @property {string} webHookUrl - URL for payment notifications
 */

/**
 * Creates a new payment invoice
 * @param {CreateInvoiceParams} params - Invoice parameters
 * @returns {Promise<Object>} Invoice data
 */
export async function createInvoice(params) {
  try {
    const response = await axios.post(
      `${MONO_API_URL}/merchant/invoice/create`,
      params,
      {
        headers: {
          'X-Token': import.meta.env.VITE_MONO_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create invoice');
    }
    throw error;
  }
}

/**
 * Gets the status of an invoice
 * @param {string} invoiceId - ID of the invoice to check
 * @returns {Promise<Object>} Invoice status data
 */
export async function getInvoiceStatus(invoiceId) {
  try {
    const response = await axios.get(
      `${MONO_API_URL}/merchant/invoice/status?invoiceId=${invoiceId}`,
      {
        headers: {
          'X-Token': import.meta.env.VITE_MONO_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get invoice status');
    }
    throw error;
  }
}

/**
 * Cancels an existing invoice
 * @param {string} invoiceId - ID of the invoice to cancel
 * @returns {Promise<Object>} Cancellation response data
 */
export async function cancelInvoice(invoiceId) {
  try {
    const response = await axios.post(
      `${MONO_API_URL}/merchant/invoice/cancel`,
      { invoiceId },
      {
        headers: {
          'X-Token': import.meta.env.VITE_MONO_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to cancel invoice');
    }
    throw error;
  }
}