import React from "react";
import { ethers } from "ethers";
import type { NextPage } from "next";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "../artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Home: NextPage = () => {
  const [greeting, setGreetingValue] = React.useState("");
  const [userAccount, setUserAccount] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getBalance() {
    if (isEthereumPresent()) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function fetchGreeting() {
    if (isEthereumPresent()) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) {
      return;
    }

    if (isEthereumPresent()) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  function handleInput(e) {
    setGreetingValue(e.target.value);
  }

  return (
    <div className=" bg-gray-100 h-screen w-full">
      <div className="container max-w-8xl mx-auto">
        <div className="flex flex-col p-10">
          <div className="space-y-4">
            <h1 className="text-gray-800 text-2xl font-semibold">
              Hello world test
            </h1>
            <div>
              <button
                onClick={fetchGreeting}
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Fetch Greeting
              </button>
            </div>
            <div>
              <button
                onClick={setGreeting}
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Set Greeting
              </button>
            </div>
            <div>
              <label
                htmlFor="greeting"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your greeting
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={greeting}
                  id="greeting"
                  name="greeting"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Hello world!"
                  onChange={handleInput}
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="text-gray-800 text-2xl font-semibold">
              Token transfering test
            </h1>
            <div className="flex space-x-4 w-full mt-4">
              <div>
                <label
                  htmlFor="greeting"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={userAccount}
                    id="accountId"
                    name="accountId"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
                    onChange={(e) => setUserAccount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="greeting"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    value={amount}
                    id="amount"
                    name="amount"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <div>
                <button
                  onClick={getBalance}
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Balance
                </button>
              </div>
              <div>
                <button
                  onClick={sendCoins}
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Coins
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

function isEthereumPresent() {
  return typeof window.ethereum !== "undefined";
}
