import "./MainSection.css";
import Cat from "./Cat.js";
import { useState, useEffect } from "react";
import {ethers} from "ethers"
import ABI from "./contractABI.json";

function MainSection() {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [chainName, setChainName] = useState(null);
    const [balance, setBalance] = useState(null);
    const [blockNumber, setBlockNumber] = useState(null);

    const getData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8", ABI, signer);


        const areTheySubscribed = await contract.subscribed();
        console.log(areTheySubscribed)

    }





    const getWalletAddress = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts");
            const currentAddress = await provider.getSigner().getAddress();
            console.log(currentAddress);

            setCurrentAccount(currentAddress)

            const chain = await provider.getNetwork();
            setChainId(chain.chainId);
            setChainName(chain.name);

            const amount = await provider.getBalance(currentAddress);
            const amountInEth = ethers.utils.formatEther(amount);
            setBalance(amountInEth);


            const blockNumber = await provider.getBlockNumber();
            setBlockNumber(blockNumber);

        }



    }
const chainChanged = () => {
        window.location.reload();
    }

    window.ethereum.on('chainChanged', chainChanged);
    window.ethereum.on('accountsChanged', getWalletAddress);


    useEffect(() => {
        getWalletAddress();
    }, []);


    return (
        <div class="MainSection">
            <div class="Content">

                <button onClick={getWalletAddress}> Connect </button>
                <p>{currentAccount}</p>
                <p>Chain Id: {chainId}</p>
                <p>Chain name: {chainName}</p>
                <p>Eth: {balance}</p>
                <p>Block#: {blockNumber}</p>
                <button onClick={getData}> Click me!</button>

            </div>

            <div class="Sidebar">
                <Cat id="299" name="Bob" />
                <Cat id="301" name="Alice"/>
                <Cat id="302" name="Theodore"/>
                <Cat id="304" />
            </div> 

        </div>
    );
}

export default MainSection;