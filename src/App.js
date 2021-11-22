import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

export default function App() {
  const [currentAccount, setCurrentAccount] = useState()

  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        console.log("Make sure you have Metamask")
        return
      } else {
        console.log("We have ethereum", ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        console.log('Found authorized account:', accounts[0])
        setCurrentAccount(accounts[0])
      } else {
        console.log('No authorized account')
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    checkIfWalletConnected()
  })

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (e) {
      console.log(e)
    }
  }

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
