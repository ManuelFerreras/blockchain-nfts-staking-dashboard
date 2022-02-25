import React, { useState } from 'react';
import { ethers, Contract } from 'ethers';

import SideBar from './SideBar';
import Connections from './Connections';
import DashBoard from './DashBoard';

import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';


import "./normalize.css";
import "./styles.css";




function App() {

  const [provider, setProvider] = useState(undefined);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(undefined);
  const [accountShort, setAccountShort] = useState("");
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [collections, setCollections] = useState(undefined);
  const [ERC20Tokens, setERC20Tokens] = useState(undefined);
  const [ERC721Tokens, setERC721Tokens] = useState(undefined);
  const [claimableTokens, setClaimableTokens] = useState(undefined);

  const [dashboardMenuOpened, setDashboardMenuOpened] = useState(true);
  const [inventoryMenuOpened, setInventoryMenuOpened] = useState(false);

  const closeMenus = () => {
    setDashboardMenuOpened(false);
    setInventoryMenuOpened(false);
  }

  const openDashboardMenu = async () => {
    await closeMenus();
    setDashboardMenuOpened(true);
  }

  const openInventoryMenu = async () => {
    await closeMenus();
    setInventoryMenuOpened(true);
  }


  const login = async () => {
    try {
      let newProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
      if(newProvider != undefined) {
        let newAccount = await newProvider.send("eth_requestAccounts", []);
        let newSigner = await newProvider.getSigner();
        let newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
        setProvider(newProvider);
        setAccount(newAccount);
        setSigner(newSigner);
        setContract(newContract);

        let newShortAccount = newAccount.toString().substring(0, 4) + "..." + newAccount.toString().substring(newAccount.toString().length - 4, newAccount.toString().length);
        setAccountShort(newShortAccount);

        await newContract.getCollections().then(res => {
          setCollections(res[0]);
          setERC20Tokens(res[1]);
          setERC721Tokens(res[2]);
          setClaimableTokens(res[3]);
        });

      } else {
        alert("Please Install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }

  }

  const claimCollection = async (collectionId) => {
    try {
      const tx = await contract.claimCollection(collectionId);
      const receipt = await tx.wait();
      if(receipt.status) {
        window.location.reload();
      } else {
        alert("Error in transaction!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }    
  }

  return (
    <>
      <div className='mainContainer'>
        <SideBar openDashboardMenu={openDashboardMenu} openInventoryMenu={openInventoryMenu} />

        <div className='right'>
          <Connections login={login} setConnected={setConnected} connected={connected} account={accountShort} />

          {dashboardMenuOpened ? (
            <DashBoard contract={contract} claimableTokens={claimableTokens} claimCollection={claimCollection} connected={connected} collections={collections} ERC20Tokens={ERC20Tokens} ERC721Tokens={ERC721Tokens} />
          ) : null}
          
        </div>
      </div>

    </>
  );
}

export default App;
