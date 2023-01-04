import "./MainSection.css";
import Cat from "./Cat.js";
// Enables use of useState() function
 // State is stored on server
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./contractABI.json";

function MainSection() {

    //*** THIS BLOCK SHOWS HOW TO USE useState() ***\\
    // // count: State variable stored by useState
    // // setCount: Function for setting state variable
    // // useState(5): Sets state variable's initial value to 5
    //  // Both count and setCount are user-defined
    // const [count, setCount] = useState(5);
    // function increase() {
    //     // tempCount is temporary variable assigned count's initial value
    //     setCount(tempCount => tempCount + 1);
    // }
    
    // function decrease() {
    //     setCount(tempCount => tempCount - 1);
    // }
    //***                                       ***\\

    //************** STATE VARIABLES **************\\
    const [userAddress, getWalletAddress] = useState(null);
    const [chainID, setChainID] = useState(null);
    const [chainName, setChainName] = useState(null);
    const [balance, setBalance] = useState(null);
    const [blockNumber, setBlockNumber] = useState(null);
    
    
    const connectWallet = async () => {
        console.log("connectWallet called");
        // Check if user has a Metamask wallet
        if(window.ethereum && window.ethereum.isMetaMask){
            console.log("Metamask detected");
            // Create a JS object from Metamask account
             // This is similar to a struct in Solidity, except it can have functions in it
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // Gets an array of all accounts in user's Metamask
             // This prompts user to login via Metamask
            await provider.send("eth_requestAccounts");
            
            // Save user's Metamask address
            const currentAddress = await provider.getSigner().getAddress();
            // Save user's wallet address to state variable
            getWalletAddress(currentAddress);
            // Return address to console
            console.log("Current address: " + currentAddress);
            
            // Save Chain ID
            const chainID = await provider.getNetwork();
            // Save Chain ID to state
            setChainID(chainID.chainId);
            // Return Chain ID to console
            console.log("Chain ID: " + chainID.chainId);
            
            // Save Chain Name
            const chainName = await provider.getNetwork();
            // Save Chain Name to state
            setChainName(chainName.name);
            // Return Chain Name to console
            console.log("Chain Name: " + chainName.name);
            
            // Save user's ether balance
            const rawBalance = await provider.getBalance(currentAddress);
            const balance = ethers.utils.formatEther(rawBalance);
            setBalance(balance);
            console.log("Balance: " + balance);
            
            // Save current block number
            const blockNumber = await provider.getBlockNumber();
            setBlockNumber(blockNumber);
            console.log("Block Number: " + blockNumber);
            
            return provider;
        }
        
        
    }
    
    const [input, setInput] = useState(null);
    const [userSignature, setSignature] = useState(null);

    /**
     * Calls the getSignature function and stores its value in the userSignature state variable
     * Remember: Non-string data must use the data.toString() method
     * Also: String return data can be returned as-is or with toString()
    */
   const getData = async () => {
       	const provider = new ethers.providers.Web3Provider(window.ethereum);
		 console.log(provider);
        const signer = provider.getSigner();
		 console.log(signer)
        // ABI is created by creating an ABI from the ISignature contract from Week 2 Day 5 Homework
        const contract = new ethers.Contract("0x3CdBff65DaC67cDb6E5c4F05c4DB8FE05C20e4D8", ABI, signer);
		 console.log(contract);

        // userAddress is from state variable created on Week 5 Day 5
        const userSignature = await contract.getSignature(userAddress);
		 console.log(userSignature);
        setSignature(userSignature.toString());
   }

   // Calls the SignMe function and changes User Signature
	const callSignMe = async () => {
		console.log("callSignMe called");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		await provider.send("eth_requestAccounts");
        const signer = provider.getSigner();
		const contract = new ethers.Contract("0x3CdBff65DaC67cDb6E5c4F05c4DB8FE05C20e4D8", ABI, signer);

		// Calls the signMe function with the given input as the signature
		const newSignature = await contract.signMe(userAddress, input);
		// Stores the receipt of the transaction
		const receipt = await newSignature.wait();
		// Returns details about the transaction before it was created
		console.log(newSignature);
		// Transaction receipt, has details about tx after creation
		console.log(receipt);
	}
    
    // Automatically reloads window when the chain is changed. Does NOT reconnect user's wallet. This syntax is to demonstrate how to tell the window to refresh when the chain or account is changed, which can be ported over to any other event that is accessible in the window.ethereum object. This does NOT reconnect the user's wallet, we need to run useEffect to do that instead
    const chainChanged = () => {
        window.location.reload();
    }
    window.ethereum.on('chainChanged', chainChanged);
    window.ethereum.on('accountsChanged', getWalletAddress);


	/**
	 * This will fire every time at least one state variable component is reloaded.
	 * We can provide state variables inside the empty array argument for useEffect, and the function called by useEffect will be run when any of those variables are changed. If the array is left empty, then useEffect will fire if *any* of the state variable components are changed.
	 * 
	 * Note that we cannot include getData() in here because it takes time for connectWallet() to set the user's address, and "await" only tells JS to move on while a function is completing. If we want to have the page automatically connect to the user's wallet and then grab their signature from Theodore's contract then we will need to use Promises, which are beyond the scope of this lesson.
	 */
    // useEffect(() => {
    //     connectWallet();
    // }, []);

  return (
    <div class="MainSection">

        <div class="Content">
            {/* <button onClick={ increase }>Increase</button>
            <button onClick={ decrease }>Decrease</button>
            <p>{ count }</p> */}
            <button onClick={connectWallet}>Connect Wallet</button>
            <p>Current account: {userAddress}</p>
            <p>User's Balance: {balance}</p>
            <p>Chain Name: {chainName}</p>
            <p>Chain ID: {chainID}</p>
            <p>Block Number: {blockNumber}</p>
            <button onClick={getData}>Get Signature</button><br></br><br></br>
			<input value={input} onInput={signature => setInput(signature.target.value)} />
			<p>{input}</p>
			<button onClick={callSignMe}>Send Signature</button>
            <p>User Signature: {userSignature}</p>
        </div>

        <div class="Sidebar">
            {/* <Cat id="300" name={count}/> */}
            <Cat id="300" name="Bob"/>
            <Cat id="301" name="Alice"/>
            <Cat id="302" name="Theodore"/>
            <Cat id="400" name="Phoenix"/>
        </div>

    </div>
  );
}

export default MainSection;
