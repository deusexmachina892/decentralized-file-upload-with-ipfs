const HDWalletProvider = require('truffle-hdwallet-provider');
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks:{
    development:{
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //Match any network id
    },
    rinkeby:{
      provider: function(){
        return new HDWalletProvider('genuine service brown awkward normal major double broken fan dentist admit swamp',
        'https://rinkeby.infura.io/v3/b174cd6f99bc4498b50c1f79d3db7a37')
      },
      network_id: 4
    }
  }
};
