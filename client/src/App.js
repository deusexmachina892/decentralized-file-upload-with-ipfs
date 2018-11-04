import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import ipfs from './ipfs';

import "./App.css";

class App extends Component {
  state = { 
    hash: '',
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    buffer: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      const hash = await instance.get.call({from: accounts[0]})
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, ipfsHash: hash });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.set('4', { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();
    console.log(response);
    // Update state with the result.
  };

  onSubmit = (e) =>{
    e.preventDefault();
    const {accounts, contract,ipfsHash} = this.state;
    ipfs.files.add(this.state.buffer, async (error, result)=>{
      if(error){
          console.log(error);
          return;
      }
      if(contract){
        await contract.set(result[0].hash, {from: accounts[0]});
        const response = await contract.get();
        console.log(response);
        this.setState({
          ipfsHash : result[0].hash
        })
        console.log(this.state.ipfsHash); 
      return;
      }
     
    });
  }
  captureFile = (e) =>{
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = ()=>{
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', this.state.buffer)
    }
  }
  checkContract = async () =>{
    const {web3, contract} = this.state;
      // let index;
      let contractAddress = '0xc7E6875BC2675394e3d52B6749B9ED2878B8edBC'
      // for (index = 0; index < 3; index++){
      // console.log(`[${index}]` + 
      //   web3.eth.getStorageAt(contractAddress, index))
      // }
    // const response = await contract.get();
    // console.log(typeof(response));
    // console.log(this.state.ipfsHash)

    // const event = await contract.allEvents();
    // const result = await contract.getPastEvents('allEvents')
    console.log(this.state.ipfsHash)
    console.log(contract)
  }
render () {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
            <h1>IPFS File Upload Dapp</h1>
          <p>This image is sotred on the Ethereum Blockchain</p>
          <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="Hello" />  
          <form onSubmit={this.onSubmit.bind(this)}>
          <label htmlFor="imageUploader">Select an image</label>
          <input type="file" onChange={this.captureFile.bind(this)} />
          <input type="submit" />
          </form>
          <button onClick={this.checkContract.bind(this)}>Check Contract</button>
      </div>
    );
  }
}

export default App;
