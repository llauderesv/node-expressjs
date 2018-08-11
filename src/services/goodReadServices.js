const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodReadServices');

const parser = xml2js.Parser({ explicitArray: false });

module.exports = (function goodReadService() {
  const getBookById = bookId => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://www.goodreads.com/book/show/${bookId}.xml?key=nwmm2sIwtmTSPpCfKL503Q`
        )
        .then(response => {
          parser.parseString(response.data, (error, result) => {
            if (!error) {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            } else {
              debug(error);
              reject(error);
            }
          });
        })
        .catch(error => {
          debug(`Error ocurred: ${error}`);
          reject(error);
        });

      // resolve({ details: `This is a test description ${bookId}` });
    });
  };

  const getAuthors = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(
          'https://www.goodreads.com/author/list/18541?format=xml&key=nwmm2sIwtmTSPpCfKL503Q&limit=5'
        )
        .then(response => {
          parser.parseString(response.data, (error, result) => {
            if (!error) {
              debug(result);
              resolve(result.GoodreadsResponse.author);
            } else {
              debug(error);
              reject(error);
            }
          });
        })
        .catch(error => {
          debug(`Error ocurred: ${error}`);
          reject(error);
        });
    });
  };
  return {
    getBookById,
    getAuthors,
  };
})();
