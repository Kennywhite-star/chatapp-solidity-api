

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract ChatApp{
    //user structure
    struct user{
        string name;
        friend[] friendList;
    }

    struct friend{ 
        address pubkey;
        string name;
    }

    struct message{  
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct allUserStruck{  
        string name;
        address accountAddress;
       }

       //create an array and call it get all users
       allUserStruck[]getAllUsers;

 //all the users will be store in the userlist, so will store all of them
 //access them throh Address or id

 mapping (address=>user) userList;
 //this mapping will proviide us all the comunication that is happening btw
 //the users
 mapping (bytes32=>message[]) allMessages;

 //check if users exist
 function checkUserExists(address pubkey) public view returns(bool){
    return bytes(userList[pubkey].name).length > 0;
    
 }

 //Create accoont function, which allow us to register users
 function createAccount(string calldata name ) external {
    //if user has not exist then he can create the acct
    require(checkUserExists(/*address*/msg.sender)==false, 'user already exist ');
    require(bytes(name).length > 0, 'username cannot be empty');

    //updating the new user name to the name storage
    userList[msg.sender].name = name;

    getAllUsers.push(allUserStruck(name, msg.sender));
    
 }

//Get username
 function getUsername(address pubkey) external view returns(string memory) {
   //check if the adress is exsting or not
   require(checkUserExists(pubkey), 'user not registered');
   //then get the name
   return userList[pubkey].name;
 }

 //Add a friend
 function addFriend(address friend_key, string calldata name) external {
    //if owner created an acct first
    require(checkUserExists(msg.sender), 'create an account first');
    //is the user you are trying to add registered?
    require(checkUserExists(friend_key), 'user not registered');
    //owner key/ sender key must not be equal to the friend key
    require(msg.sender != friend_key, 'users cannot add themselves as a friend');
    //check if you are already friend
    require(checkAlreadyFriends (msg.sender,friend_key)== false, 'These users are already friends');
          //this function will run internlly(_)
          _addfriends(msg.sender,friend_key, name);
          //update data for who is adding the friend  added
          _addfriends(friend_key, msg.sender, userList[msg.sender].name );      

 }

//first address, will take the address
//second address , will check the address of the friend
//it will run internally
 function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool) {
    //comparing base on addresses
    if((userList[pubkey1].friendList.length) > (userList[pubkey2].friendList.length)){
        address tmp = pubkey1;
        pubkey1 = pubkey2;
        pubkey2 = tmp;
    }

    for (uint256 i =0; 1 < userList[pubkey1].friendList.length; i++){
        if (userList[pubkey1].friendList[i].pubkey == pubkey2) return true;

    }

    return false;
 }

 // add friend
 function _addfriend(address me, address friend_key, string memory name)  internal { 
      friend memory newFriend =  friend(friend_key, name);
      userList[me].friendList.push(newFriend);


    
 }

 //get to know allmy friend list
 function getMyFriendList() external view returns(friend[] memory){
    return userList[msg.sender].friendList;

 }

//get chat code
function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32)  {
    if (pubkey1 < pubkey2) {
        return keccak256(abi.encodePacked(pubkey1, pubkey2));     
    } else {
         return keccak256(abi.encodePacked(pubkey2, pubkey1));
        
    }
}
 
 //send message function
 function sendMessage(address friend_key, string calldata _msg) external { 
    //check if yser exist or not
    require(checkUserExists(msg.sender), 'create an account first');
    //check if user is registered or not
    require(checkUserExists(friend_key), 'user is not registered');
    require(checkAlreadyFriends(msg.sender, friend_key), 'you are not yet friend with the given user');
    
    bytes32 chatCode = _getChatCode(msg.sender, friend_key);
    message memory newMsg = message(msg.sender, block.timestamp, _msg);
    allMessages[chatCode].push(newMsg);
 }

 function readMessage (address friend_key) external view returns(message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
       return allMessages[chatCode];
    
 }

//fetch all the users who got registered into our application
function getAllAppUser() external view returns(allUserStruck[]memory) {
    return getAllUsers;
    
}

}