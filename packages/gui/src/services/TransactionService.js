/**
 * Sends the transaction hash to the api.
 * @param txHash transaction hash
 * @returns {Promise<*[]|any>} api result
 */
export async function analyzeTransaction(txHash) {
    try{
        const response = await fetch('/api/analyze/' + txHash);
        return await response.json();
    }catch(error) {
        return [];
    }
}
