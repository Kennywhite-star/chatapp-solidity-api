import {ethers } from "ethers"
import {Web3Modal} from "Web3Modal"


import{ChatAppAddress, ChatAppABI} from "../Context/constants"

//create a function whether wallet is connected or not.
export const CheckIfWalletIsConnected = async() => {
    try{
        //if window ethereum  is not existing,Install Metamask
        if(!window.ethereum)return console.log("Install Metamask");
        //await the etherum widow
        const accounts= await window.ethereum.request({
            method:"eth_account",
        });
        //first acct will come in form of array
        const firstAccount = accounts[0];
        return firstAccount;

    }catch(error){
        //if there is no address...instal metaask
        console.log("Install Metamask");

    }
}

//connect with wallet on the base of the clic of it
export const ConnectWallet = async() => {
    try{
        if(!window.ethereum)return console.log("Install Metamask");
        const accounts = await window.ethereum.request({
            method:"eth_requestAccounts",
        });
        const firstAccount = accounts[0];
        return  firstAccount

    } catch(error){
        console.log("Install Metamask");

    }

}

//fetch the smart contract
const fetchContract = (signerOrProvider) => {
    new ethers.Contract(ChatAppABI, ChatAppAddress, signerOrProvider);

}

export const connectingWithContract = async() => {
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        return contract;

    }catch(error){
        console.log("Install Metamask");
    }
}

//converting our time to a readable time
export const  convertTime = (time) => {
    const newTime = new Date(time.toNumber());
    realTime =
     newTime.getHours() +
    "/" +
    newTime.getMinutes() +
    "/" +
    newTime.getSeconds() +
    "/" +
    newTime.getDate() +
    "/" +
    (newTime.getMonth()+ 1) +
    "/" +
    newTime.getFullYear() ;

    return realTime;
}