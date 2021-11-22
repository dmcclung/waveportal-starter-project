import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

//const contractABI = require('./WavePortal.json').abi;
import { abi as contractABI } from './WavePortal.json'
const contractAddress = '0xDa22c1950CAa5ec1Ca25c07846283Ba42E15622D';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState()
  const [waveMessage, setWaveMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])

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

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(waveMessage);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log('Getting all waves')
        wavePortalContract.getAllWaves().then(waves => {
          console.log('Got waves: ', waves.length)
          const cleanedAllWaves = waves.map(wave => (
            {
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            }
          ))

          setAllWaves(cleanedAllWaves)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log('NewWave', from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="wave">👋</span> Hey there!
        </div>

        <div className="bio">
        Leave a message for all to read and stay positive fren!
        </div>

        <input type="text" value={waveMessage} onChange={(e) => {
          setWaveMessage(e.currentTarget.value)
        }}></input>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
