//everything that allow us to communicate with our contract
// like creating acct.....fecthing acct....//send msg


import React, {useEffect, useState} from "react";
import {useRouter} from "next/router"

//internal import.....import our api feature here
import{
    CheckIfWalletIsConnected,
     ConnectWallet ,
      connectingWithContract} from "../Utils/apiFeatures"

//creating our context
export const ChatAppContext = React.createContext()
//create our provider
export const  ChatAppProvider = ({children}) => {
      //define all the state varablles
    const [account, setAccount] = useState("");
    const [username, setusername] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [error, setError] = useState("");

    //chat user.....to allow me now who a chattng with
    const[currentUserName, setCurrentUserName] = useState("");
    const[currentUserAddress,setCurrentUserAddress ] = useState("");

    //router to redirect them to home page after create an account.
    const router = useRouter();

    //FETCH DATA AND THE TE OF PAGE RELOAD....FUNCTON  INTERACTON WTH CONTRACT
    const fetchData = async () => {
        try{
            //GET CONTRACT
            const contract = await connectingWithContract();
            //GET ACCT
            const connectAccount = await ConnectWallet();
            //once yo get the act, let the acct connect
            setAccount(connectAccount);
            //GET THE USERNAME
            const userName = await contract.getUsername(connectAccount);
            //set the name... once u get it
            setusername(userName);
            //GET MY FRIENDLIST
            const friendList = await contract.getMyFriendList();
            setFriendLists(friendList);
            //GET ALL APP LIST
            const userList = await contract.getAllAppUser();
            setUserLists(userList);


        }catch(error) {
            setError("Please install and connect your MetaMask Wallet")

        }
        
    };
    //call function whenever someone reload the page
    useEffect(()=>{
        fetchData()
      }, []);


      //READ MESSAGE
      const readMesssage = async(friendAddress) =>{
        try{
            const contract = await connectingWithContract();
            const read = await contract.readMesssage(friendAddress);
            setFriendMsg(read);
        } catch(error){
            setError("Currently you haave no Message")
        }
      }

      //CREATE ACCT......receve the namme and address of the user
      const createAccount = async({name, accountAddress}) =>{
        try{
            if(name ||  accountAddress) return setError("Name and Account must be present")
            //call the contract function
            const contract = await connectingWithContract();
            //get the created user details...pass the name as parameter
            const getCreatedUser =  await contract.createAccount(name)
            //setloadng because...it will tae time
            setLoading(true);
            //when is successfull...set it back to false
            await getCreatedUser.wait();
            setLoading(false);
            //reload te broswer
            window.location.reload();
        }catch(error){
            setError("Error while creating your account, please reload the broswer")
        }

      }

      //ADD YOUR FRIEND
      const addFriends = async({name,accountAddress}) => {
        try {
            //check if acct and naame exist
            if(name || accountAddress ) return setError("Please provide your information")
            const contract = await connectingWithContract();
            const addMyFriend = await contract.addFriend(name, accountAddress);
            setLoading(true);
            await addMyFriend.wait();
            setLoading(false);
            //send them to home page
            router.push('/');
            window.location.reload();
        }catch(error){
            setError("something went wrong while adding friends try again")

        }

      }

      //SEND MESSAGE FUNCTION
      const sendMessage = async(msg, address) => {
        try{
            //check if there is data or not, before u return an error msg
            if(msg || address)return setError("Please Type Your Message")
            const contract = await connectingWithContract();
            const addMessage = await contract.sendMessage(msg , address);
            setLoading(true);
            await addMessage.wait()
            setLoading(false);
            window.location.reload();


        }catch(error){
            setError("Please reload and try again")

        }

      }

      //READ USER INFO
      const readUser = async() => {
        const contract = await connectingWithContract();
        //get username
        const userName = await contract.getUsername(userAddress);
        setCurrentUserName(userName);
        setCurrentUserAddress(userAddress);
      };

    return(
      
    <ChatAppContext.Provider value = {{
        readMesssage, 
        createAccount,
         addFriends, 
         sendMessage, 
         readUser, 
         account, 
         username,
         friendLists,
         friendMsg,
         loading,
         userLists,
         error,
         currentUserName,
         currentUserAddress
         }}>  
      
       {} 
     
  </ChatAppContext.Provider>
    )

}

