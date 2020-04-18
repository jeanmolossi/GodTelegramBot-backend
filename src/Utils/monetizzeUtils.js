import monetizzeapi from '../services/monetizzeapi';

export const getToken = async (consumerKey) => {
  console.log('Getting Token');
  monetizzeapi.defaults.headers = {
    X_CONSUMER_KEY: consumerKey,
  };

  const tokenRequest = await monetizzeapi.get(`/token`);
  if (tokenRequest && tokenRequest.status === 200) {
    const { token } = tokenRequest.data;
    console.log('Token ready:', token);
    return token;
  }
  return false;
};

export const isProduct = async (productId, consumerKey) => {
  console.log('Finding product');
  const TOKEN = await getToken(consumerKey);
  if (TOKEN) {
    const transactions = await monetizzeapi.get(
      `/transactions?product=${productId}`,
      { headers: { TOKEN } }
    );
    if (transactions.status === 200 && transactions.data.dados.length > 0) {
      console.log('Product ready', transactions.data.dados[0].produto.nome);
      return transactions.data.dados[0].produto;
    }
  }
  return false;
};

export const searchTransaction = async (email, codigo, consumerKey) => {
  console.log('Searching transaction');
  const TOKEN = await getToken(consumerKey);
  if (TOKEN) {
    const transactions = await monetizzeapi.get(
      `/transactions?transaction=${codigo}&email=${email}`,
      { headers: { TOKEN } }
    );
    if (transactions.status === 200 && transactions.data.dados.length > 0) {
      console.log('Transaction found!');
      return transactions.data.dados[0];
    }
    return false;
  }
  return false;
};
